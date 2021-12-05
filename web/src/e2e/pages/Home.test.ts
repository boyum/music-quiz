import dotenv from "dotenv";
import puppeteer from "puppeteer";

dotenv.config();

const deployUrl = process.env.DEPLOY_URL ?? "http://localhost:3000";

describe("Home", () => {
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

  it("should show 24 calendar doors", async () => {
    const doors = await page.$$(`[data-test-id="calendar-door"]`);
    expect(doors.length).toBe(24);
  });

  it("should open door number 1 because it's unlocked", async () => {
    // Open calendar door
    await page.click(`[tabindex="1"]`);

    // Check that the url was changed and that the page was actually opened
    expect(page.url()).toBe(`${deployUrl}/day/1`);
  });

  it("should not open door number 24 because it's locked", async () => {
    // Open calendar door
    await page.click(`[tabindex="24"]`);

    // Check that the url was not changed and that the front page is still shown
    expect(page.url()).toBe(`${deployUrl}/`);

    // Check that the "be patient" dialog is shown
    const dialog = await page.$(`[role="dialog"]`);
    expect(dialog).toBeTruthy();
  });
});
