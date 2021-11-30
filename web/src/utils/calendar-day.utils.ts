import groq from "groq";
import leven from "leven";
import { CalendarDay } from "../types/CalendarDay";
import { Guess, isSpotifyGuess } from "../types/Guess";
import { getSanityFile } from "./image-url";
import { sanityClient } from "./sanity-client";

type CalendarDayDTO = {
  _id: string;
  publishedAt: string;
  slug?: {
    _type: "slug";
    current: string;
  };
  title: string;
  audioTrack: {
    _type: "file";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  previewTitle: string;
  hints?: Array<string>;
  dayIndex: number;
  songTitles: Array<string>;
  artists: Array<string>;
  spotifyIds: Array<string>;
};

const mapCalendarDayDTOToCalendarDay = ({
  _id,
  title,
  slug,
  audioTrack,
  publishedAt,
  hints,
  previewTitle,
  dayIndex,
  songTitles,
  artists,
  spotifyIds,
}: CalendarDayDTO): CalendarDay => ({
  id: _id,
  title,
  publishedAt,
  slug: slug?.current ?? null,
  audioTrackUrl: getSanityFile(audioTrack.asset._ref),
  hints: hints ?? null,
  previewTitle,
  dayIndex,
  songTitles,
  artists,
  spotifyIds,
});

export const getCalendarDay = async (dayIndex: number): Promise<CalendarDay | null> => {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "calendar-day" && defined(slug) && publishedAt < now() && dayIndex == ${dayIndex}][0]`;
  const projection = groq`{
    _id,
    publishedAt,
    title,
    slug,
    audioTrack,
    hints,
    previewTitle,
    dayIndex,
    songTitles,
    artists,
    spotifyIds,
  }`;
  const order = `| order(publishedAt asc)`;
  const query = [filter, projection, order].join(" ");

  let questionDTO;
  try {
    questionDTO = await sanityClient.fetch<CalendarDayDTO>(query);
  } catch (error) {
    console.error(error);
    throw new Error("Could not get question");
  }

  if (!questionDTO?._id) {
    console.error(`Found no day with index '${dayIndex}'`);
    return null;
  }

  const question = mapCalendarDayDTOToCalendarDay(questionDTO);
  return question;
};

export const getTrackIdFromUrl = (url: string) => {
  const isSpotifyUri = url.startsWith("https://open.spotify.com/track");
  if (!isSpotifyUri) {
    throw new Error(`'${url}' is not a valid Spotify url`);
  }

  const trackId = url.replace("https://open.spotify.com/track/", "").split("?")[0];
  return trackId;
};

export const getTrackIdFromUri = (uri: string) => {
  const isSpotifyUri = uri.startsWith("spotify:track");
  if (!isSpotifyUri) {
    throw new Error(`'${uri}' is not a valid Spotify uri`);
  }

  const trackId = uri.replace("spotify:track:", "");
  return trackId;
};

export async function tryGuess(dayIndex: number, guess: Guess): Promise<0 | 0.5 | 1> {
  const day = await getCalendarDay(dayIndex);

  if (!day) {
    throw new Error(`Day with index '${dayIndex}' not found`);
  }

  let correctness = 0;

  if (isSpotifyGuess(guess)) {
    const spotifyGuess = guess.spotify ?? "";
    const normalizedSpotifyGuess = spotifyGuess.trim();
    const answerIsSpotifyUrl = normalizedSpotifyGuess.startsWith("https://");
    const answerIsSpotifyUri = normalizedSpotifyGuess.startsWith("spotify:track:");

    if (answerIsSpotifyUrl) {
      const trackId = getTrackIdFromUrl(normalizedSpotifyGuess);
      correctness = day.spotifyIds.includes(trackId) ? 1 : 0;
    } else if (answerIsSpotifyUri) {
      const trackId = getTrackIdFromUri(normalizedSpotifyGuess);
      correctness = day.spotifyIds.includes(trackId) ? 1 : 0;
    } else {
      console.error(`Invalid Spotify guess '${spotifyGuess}'`);
      correctness = 0;
    }
  } else {
    const artistGuess = guess.artist ?? "";
    const songTitleGuess = guess.songTitle ?? "";

    const normalizedArtistGuess = artistGuess.toLowerCase().trim();
    const normalizedSongTitleGuess = songTitleGuess.toLowerCase().trim();

    const isCorrectTitle = day.songTitles
      .map(title => title.toLowerCase())
      .some(
        title =>
          normalizedSongTitleGuess.includes(title) ||
          leven(normalizedSongTitleGuess, title) < title.length / 5,
      );

    const isCorrectArtist = day.artists
      .map(artist => artist.toLowerCase())
      .some(
        artist =>
          normalizedArtistGuess.includes(artist) ||
          leven(normalizedArtistGuess, artist) < artist.length / 5,
      );

    correctness += isCorrectTitle ? 0.5 : 0;
    correctness += isCorrectArtist ? 0.5 : 0;
  }

  return <0 | 0.5 | 1>correctness;
}
