// import { Guess, SongTitleGuess } from "../types/Guess";
// import { tryGuess } from "./calendar-day.utils";

// describe(tryGuess.name, () => {
//   it("should return correctness === 1 if both the title and song are correct", async () => {
//     const DAY_INDEX = 1;

//     const artist = "Edward Sharpe & The Magnetic Zeros";
//     const songTitle = "Home";

//     const guess: Guess = {
//       artist,
//       songTitle,
//     };

//     const expectedCorrectness = 1;
//     const actualCorrectness = await tryGuess(DAY_INDEX, guess);

//     expect(actualCorrectness).toBe(expectedCorrectness);
//   });

//   it("should return correctness === 0.5 if only the artist is correct", async () => {
//     const DAY_INDEX = 1;

//     const artist = "Edward Sharpe & The Magnetic Zeros";
//     const songTitle = "insongTitle";

//     const guess: Guess = {
//       artist,
//       songTitle,
//     };

//     const expectedCorrectness = 0.5;
//     const actualCorrectness = await tryGuess(DAY_INDEX, guess);

//     expect(actualCorrectness).toBe(expectedCorrectness);
//   });

//   it("should return correctness === 0.5 if only the song title is correct", async () => {
//     const DAY_INDEX = 1;

//     const artist = "incorrectArtist";
//     const songTitle = "Home";

//     const guess: Guess = {
//       artist,
//       songTitle,
//     };

//     const expectedCorrectness = 0.5;
//     const actualCorrectness = await tryGuess(DAY_INDEX, guess);

//     expect(actualCorrectness).toBe(expectedCorrectness);
//   });

//   it("should return correctness === 0 if both artist and song title are incorrect", async () => {
//     const DAY_INDEX = 1;

//     const artist = "incorrectArtist";
//     const song = "incorrectSongTitle";

//     const guess: Guess = {
//       artist,
//       songTitle: song,
//     };

//     const expectedCorrectness = 0;
//     const actualCorrectness = await tryGuess(DAY_INDEX, guess);

//     expect(actualCorrectness).toBe(expectedCorrectness);
//   });
// });
