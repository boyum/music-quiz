import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { SuccessResponse } from "../../types/ResponseData";

dotenv.config();

const deployUrl = process.env.DEPLOY_URL ?? "http://localhost:3000";

const GUESS_API_ENDPOINT = `${deployUrl}/api/calendar-day`;

describe("CalendarDay", () => {
  let page: puppeteer.Page;
  let browser: puppeteer.Browser;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(deployUrl);
    await page.evaluate(() => localStorage.clear());
  });

  afterEach(async () => {
    await page.close();
    await browser.close();
  });

  it("should open the calendar day and show 'correct answer' if the answer is correct", async () => {
    const DAY_INDEX = 1;

    // Open door
    await page.goto(`${deployUrl}/day/${DAY_INDEX}`);

    const correctArtist = "Edward Sharpe & The Magnetic Zeros";
    const correctSong = "Home";

    // Input answers to form
    await page.type(`input[data-test-id="artist-input"]`, correctArtist);
    await page.type(`input[data-test-id="song-input"]`, correctSong);

    // Send guess
    await page.click(`button[type="submit"]`);

    // Capture guess response
    await page.setRequestInterception(true);
    const httpResponse = await page.waitForResponse(`${GUESS_API_ENDPOINT}/${DAY_INDEX}`);

    const successResponse: SuccessResponse = await httpResponse.json();
    expect(successResponse.correctness).toBe(1);

    // Verify that correct answer message is showing
    const $correctAnswerMessage = await page.$(`[data-test-id="correct-answer-message"]`);
    expect($correctAnswerMessage).toBeTruthy();
  });

  it("should open the calendar day and show 'incorrect answer' if the answer is incorrect", async () => {
    const DAY_INDEX = 1;

    // Open door
    await page.goto(`${deployUrl}/day/${DAY_INDEX}`);

    const incorrectArtist = "incorrectArtist";
    const incorrectSong = "incorrectSong";

    // Input answers to form
    await page.type(`input[data-test-id="artist-input"]`, incorrectArtist);
    await page.type(`input[data-test-id="song-input"]`, incorrectSong);

    // Send guess
    await page.click(`button[type="submit"]`);

    // Capture guess response
    await page.setRequestInterception(true);
    const httpResponse = await page.waitForResponse(`${GUESS_API_ENDPOINT}/${DAY_INDEX}`);

    const successResponse: SuccessResponse = await httpResponse.json();
    expect(successResponse.correctness).toBe(0);

    // Verify that incorrect answer message is showing
    const $incorrectAnswerMessage = await page.$(`[data-test-id="incorrect-answer-message"]`);
    expect($incorrectAnswerMessage).toBeTruthy();
  });

  it("should get a correctness value of 0.5 if only the song title is correct", async () => {
    const DAY_INDEX = 1;

    // Open door
    await page.goto(`${deployUrl}/day/${DAY_INDEX}`);

    const artist = "incorrectArtist";
    const songTitle = "Home";

    // Input answers to form
    await page.type(`input[data-test-id="artist-input"]`, artist);
    await page.type(`input[data-test-id="song-input"]`, songTitle);

    // Send guess
    await page.click(`button[type="submit"]`);

    // Capture guess response
    await page.setRequestInterception(true);
    const httpResponse = await page.waitForResponse(`${GUESS_API_ENDPOINT}/${DAY_INDEX}`);

    const successResponse: SuccessResponse = await httpResponse.json();
    expect(successResponse.correctness).toBe(0.5);

    // Verify that incorrect answer message is showing
    const $incorrectAnswerMessage = await page.$(`[data-test-id="incorrect-answer-message"]`);
    expect($incorrectAnswerMessage).toBeTruthy();
  });

  it("should get a correctness value of 0.5 if only the artist is correct", async () => {
    const DAY_INDEX = 1;

    // Open door
    await page.goto(`${deployUrl}/day/${DAY_INDEX}`);

    const artist = "Edward Sharpe & The Magnetic Zeros";
    const songTitle = "incorrectSongTitle";

    // Input answers to form
    await page.type(`input[data-test-id="artist-input"]`, artist);
    await page.type(`input[data-test-id="song-input"]`, songTitle);

    // Send guess
    await page.click(`button[type="submit"]`);

    // Capture guess response
    await page.setRequestInterception(true);
    const httpResponse = await page.waitForResponse(`${GUESS_API_ENDPOINT}/${DAY_INDEX}`);

    const successResponse: SuccessResponse = await httpResponse.json();
    expect(successResponse.correctness).toBe(0.5);

    // Verify that incorrect answer message is showing
    const $incorrectAnswerMessage = await page.$(`[data-test-id="incorrect-answer-message"]`);
    expect($incorrectAnswerMessage).toBeTruthy();
  });

  it("should redirect to the frontpage if the user tries to open a locked door", async () => {
    const DAY_INDEX = 24;

    // Open door
    await page.goto(`${deployUrl}/day/${DAY_INDEX}`);

    expect(page.url()).toBe(`${deployUrl}/`);
  });
});
