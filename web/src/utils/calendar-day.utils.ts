import groq from "groq";
import leven from "leven";
import type { CalendarDayData } from "../types/CalendarDayData";
import type { CalendarDayPreviewData } from "../types/CalendarDayPreviewData";
import { type Guess, isSpotifyGuess } from "../types/Guess";
import type { CalendarDayDTO } from "../types/dto/CalendarDayDTO";
import type { CalendarDayPreviewDTO } from "../types/dto/CalendarDayPreviewDTO";
import { getSanityFile } from "./image-url";
import { sanityClient } from "./sanity-client";

const mapCalendarDayDTOToCalendarDay = ({
  _id,
  dayIndex,
  audioTrack,
  hints,
  songTitles,
  artists,
  spotifyIds,
  playedBy,
}: CalendarDayDTO): CalendarDayData => ({
  id: _id,
  dayIndex,
  audioTrackUrl: getSanityFile(audioTrack.asset._ref),
  hints: hints ?? null,
  songTitles,
  artists,
  spotifyIds,
  playedBy: playedBy ?? null,
});

const mapCalendarDayPreviewDTOToCalendarDayPreview = ({
  _id,
  dayIndex,
  audioTrack,
  hints,
  artists,
}: CalendarDayPreviewDTO): CalendarDayPreviewData => ({
  id: _id,
  dayIndex,
  audioTrackUrl: getSanityFile(audioTrack.asset._ref),
  hints: hints ?? null,
  hasArtists: !!(artists && artists.length > 0),
});

const calendarDaySchemaId = "calendar-day-2024";

export const getCalendarDay = async (
  dayIndex: number,
): Promise<CalendarDayData | null> => {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "${calendarDaySchemaId}" && publishedAt < now() && dayIndex == ${dayIndex}][0]`;
  const projection = groq`{
    _id,
    audioTrack,
    hints,
    dayIndex,
    songTitles,
    artists,
    spotifyIds,
    playedBy,
  }`;
  const order = "| order(dayIndex asc)";
  const query = [filter, projection, order].join(" ");

  let questionDTO: CalendarDayDTO;
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

export const getCalendarDayPreview = async (
  dayIndex: number,
): Promise<CalendarDayPreviewData | null> => {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "${calendarDaySchemaId}" && publishedAt < now() && dayIndex == ${dayIndex}][0]`;
  const projection = groq`{
    _id,
    audioTrack,
    dayIndex,
    hints,
    artists,
  }`;
  const order = "| order(dayIndex asc)";
  const query = [filter, projection, order].join(" ");

  let questionDTO: CalendarDayPreviewDTO;
  try {
    questionDTO = await sanityClient.fetch<CalendarDayPreviewDTO>(query);
  } catch (error) {
    console.error(error);
    throw new Error("Could not get question");
  }

  if (!questionDTO?._id) {
    console.error(`Found no day with index '${dayIndex}'`);
    return null;
  }

  const question = mapCalendarDayPreviewDTOToCalendarDayPreview(questionDTO);
  return question;
};

export const getTrackIdFromUrl = (url: string) => {
  const isSpotifyUri = url.startsWith("https://open.spotify.com/track");
  if (!isSpotifyUri) {
    throw new Error(`'${url}' is not a valid Spotify url`);
  }

  const trackId = url
    .replace("https://open.spotify.com/track/", "")
    .split("?")[0];
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

export async function tryGuess(
  day: CalendarDayData,
  guess: Guess,
): Promise<0 | 0.5 | 1> {
  let correctness: 0 | 0.5 | 1 = 0;

  if (isSpotifyGuess(guess)) {
    const spotifyGuess = guess.spotify ?? "";
    const normalizedSpotifyGuess = spotifyGuess.trim();
    const answerIsSpotifyUrl = normalizedSpotifyGuess.startsWith("https://");
    const answerIsSpotifyUri =
      normalizedSpotifyGuess.startsWith("spotify:track:");

    if (answerIsSpotifyUrl) {
      const trackId = getTrackIdFromUrl(normalizedSpotifyGuess);
      correctness = day.spotifyIds?.includes(trackId) ? 1 : 0;
    } else if (answerIsSpotifyUri) {
      const trackId = getTrackIdFromUri(normalizedSpotifyGuess);
      correctness = day.spotifyIds?.includes(trackId) ? 1 : 0;
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

    const noArtist = !day.artists || day.artists.length === 0;

    const isCorrectArtist = noArtist
      ? true
      : day.artists
          ?.map(artist => artist.toLowerCase())
          .some(
            artist =>
              normalizedArtistGuess.includes(artist) ||
              leven(normalizedArtistGuess, artist) < artist.length / 5,
          );
    correctness += isCorrectTitle ? 0.5 : 0;
    correctness += isCorrectArtist ? 0.5 : 0;
  }

  return correctness as 0 | 0.5 | 1;
}
