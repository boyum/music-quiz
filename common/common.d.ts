declare module "lib/firebase" {
    import admin from "firebase-admin";
    export const firebase: admin.firestore.Firestore;
}
declare module "types/Guess" {
    export type SpotifyGuess = {
        spotify: string;
    };
    export type SongTitleGuess = {
        songTitle: string;
        artist: string;
    };
    export type Guess = SpotifyGuess | SongTitleGuess;
    export const isSpotifyGuess: (guess: Guess) => guess is SpotifyGuess;
}
declare module "types/CalendarDayStats" {
    import { Guess } from "types/Guess";
    export type CalendarDayStats = {
        dayIndex: number;
        guesses: Array<Guess>;
        numberOfAttempts: number;
        successfulAttempts: number;
    };
}
declare module "types/ErrorResponse" {
    import { CalendarDayStats } from "types/CalendarDayStats";
    export type ErrorResponse = {
        error: string;
    };
    export const isError: (value: CalendarDayStats | ErrorResponse) => value is ErrorResponse;
}
declare module "utils/firebase/firebase.utils" {
    import { CalendarDayStats } from "types/CalendarDayStats";
    import { ErrorResponse } from "types/ErrorResponse";
    import { Guess } from "types/Guess";
    export function getDayStats(dayIndex: number): Promise<CalendarDayStats | ErrorResponse>;
    export function postDayStats(dayIndex: number, isCorrect: boolean, day: CalendarDayStats, guess: Guess): Promise<void>;
}
