export type SpotifyGuess = {
  spotify: string;
};

export type SongTitleGuess = {
  songTitle: string;
  artist: string;
};

export type Guess = SpotifyGuess | SongTitleGuess;

export const isSpotifyGuess = (guess: Guess): guess is SpotifyGuess => {
  return "spotify" in guess;
};
