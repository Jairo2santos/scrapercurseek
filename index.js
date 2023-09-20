import puppeteer from "puppeteer";

async function openWebPage() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
  });
  const page = await browser.newPage();
  await page.goto("https://www.example.com");
  await browser.close();
}