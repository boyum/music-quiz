import groq from "groq";
import { CalendarDay } from "../types/CalendarDay";
import { getSanityFile } from "../utils/image-url";
import { sanityClient } from "../utils/sanity-client";

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
