import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function extractUrlsAndImages() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.coursera.org/uab', { waitUntil: 'networkidle2' });

  const selector = '.css-821651, .rc-Course.css-821651'; 
  const courses = await page.evaluate((sel) => {
    const courseElements = document.querySelectorAll(sel);
    const courses = Array.from(courseElements).map(course => {
      const anchor = course.querySelector('a'); 
      const courseUrl = anchor.href;
      const img = anchor.querySelector('img'); 
      const imgUrl = img ? img.src : '';
      return { courseUrl, imgUrl };
    });
    return courses;
  }, selector);

  await browser.close();
  await fs.writeFile('urlsAndImages.json', JSON.stringify(courses, null, 2));
}

extractUrlsAndImages().catch(console.error);
