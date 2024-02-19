import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function extractUrlsAndImages() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.coursera.org/unam', { waitUntil: 'networkidle2' });

  const selector = '.css-821651, .rc-Course.css-821651'; // Combina ambos selectores
  const courses = await page.evaluate((sel) => {
    const courseElements = document.querySelectorAll(sel);
    const courses = Array.from(courseElements).map(course => {
      const anchor = course.querySelector('a'); // Busca el enlace dentro del elemento del curso
      const courseUrl = anchor.href;
      const img = anchor.querySelector('img'); // Busca la imagen dentro del enlace
      const imgUrl = img ? img.src : '';
      return { courseUrl, imgUrl };
    });
    return courses;
  }, selector);

  await browser.close();
  await fs.writeFile('urlsAndImages.json', JSON.stringify(courses, null, 2));
}

extractUrlsAndImages().catch(console.error);
