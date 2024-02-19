import puppeteer from "puppeteer";
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

// Reemplaza la definición de readLinksFromFile con esta:
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function readLinksFromFile(filePath) {
    try {
      const content = await fs.readFile(filePath, { encoding: 'utf-8' });
      return content.split('\n').filter(line => line.trim());
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }
  // Ajusta la función scrapeCourseraUNAM como lo tenías planeado, asegurándote de que el path a linksUnam.txt sea correcto.
  
async function scrapeCourseraUNAM() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  //optiomizacion
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    // Si la solicitud es de tipo imagen, aborta la solicitud
    if (req.resourceType() === 'image') {
      req.abort();
    } else {
      req.continue();
    }
  });

  // Lee los enlaces desde el archivo
  const linksFilePath = path.join(__dirname, 'linksUAB.txt'); // Asegúrate de que la ruta sea correcta
  const courseLinks = await readLinksFromFile(linksFilePath);

  let courseDetails = [];


  for (let i = 0; i < courseLinks.length; i++) {
        const courseUrl = courseLinks[i];
    await page.goto(courseUrl, { waitUntil: 'networkidle2' });

    // Extrae los detalles aquí como lo haces normalmente
    const details = await page.evaluate(() => {
      // Intenta obtener el rating primero para determinar qué camino tomar
      let ratingText = document.querySelector("div > div.cds-119.cds-Typography-base.css-h1jogs.cds-121")?.innerText || "";
      
      // Verifica si el rating es numérico y está en el rango de 0 a 4.9
      const ratingRegex = /\d+(\.\d+)?/; // Coincide con números enteros y decimales
      const ratingMatch = ratingText.match(ratingRegex);
      let rating = ratingMatch ? parseFloat(ratingMatch[0]) : null;
      
      // Determina si el rating fue encontrado, es numérico y está dentro del rango deseado
      const hasRating = rating !== null && rating >= 0 && rating <= 4.9;
    
      let level, estimatedTime, schedule, scheduleExplanation;
    
      if (hasRating) {
        // Si hay rating numérico dentro del rango, usa estos selectores
        level = document.querySelector("div:nth-child(2) > div > div.cds-119.cds-Typography-base.css-h1jogs.cds-121")?.innerText || "Nivel principiante";
        estimatedTime = document.querySelector("div:nth-child(3) > div.cds-119.cds-Typography-base.css-h1jogs.cds-121")?.innerText || "No estimated time found";
        schedule = document.querySelector("section > div.css-lt1dx1 > div:nth-child(4) > div.cds-119.cds-Typography-base.css-h1jogs.cds-121")?.innerText || "Cronograma Flexible";
        scheduleExplanation = document.querySelector("section > div.css-lt1dx1 > div:nth-child(5) > div.cds-119.css-1mru19s.cds-121")?.innerText || "Aprende a tu propio ritmo:";
      } else {
        // Si no hay rating numérico dentro del rango, considera estos otros selectores
        level = document.querySelector("section > div.css-lt1dx1 > div:nth-child(1) > div.cds-119.cds-Typography-base.css-h1jogs.cds-121")?.innerText || "Nivel principiante";
        estimatedTime = document.querySelector("section > div.css-lt1dx1 > div:nth-child(2) > div.cds-119.cds-Typography-base.css-h1jogs.cds-121")?.innerText || "No estimated time found";
        schedule = "Cronograma Flexible";
        scheduleExplanation = "Aprende a tu propio ritmo";
      }
    
      // Vuelve a convertir rating a texto si es válido o asigna "No rating found" si no lo es
      rating = hasRating ? rating.toString() : "No rating found";
    
      return {
        rating,
        level,
        estimatedTime,
        schedule,
        scheduleExplanation
      };
    });
    
  
  

    const instructorsMoreButtonSelector = ".css-17ktugw"; // Ajusta el selector según sea necesario
    if ((await page.$(instructorsMoreButtonSelector)) !== null) {
      await page.click(instructorsMoreButtonSelector);
      // Espera a que el modal o la sección de instructores se cargue completamente
      await page.waitForSelector(".css-1oiads2", { timeout: 5000 }); // Ajusta el timeout según la carga esperada
    }
    const instructorsDetails = await page.evaluate(() => {
      const instructorsMap = {}; // Objeto para mantener instructores únicos

      document.querySelectorAll(".css-1oiads2").forEach((instructorElement) => {
        const imageElement = instructorElement.querySelector("img");
        const nameElement = instructorElement.querySelector("a");
        const imageUrl = imageElement ? imageElement.src : "";
        const name = nameElement ? nameElement.innerText.trim() : "";

        // Usar tanto el nombre como la URL de la imagen como clave para asegurar unicidad
        const instructorKey = `${name}|${imageUrl}`;

        // Solo agregar si este instructor no ha sido procesado antes
        if (!(instructorKey in instructorsMap) && name && imageUrl) {
          instructorsMap[instructorKey] = { name, imageUrl };
        }
      });

      // Convertir el objeto de instructores a un array de instructores
      return Object.values(instructorsMap);

    });

    const additionalDetails = await page.evaluate(() => {
      const getTitle = () => {
          const titleElement = document.querySelector("h1") || document.querySelector("section > div > div > h1");
          return titleElement ? titleElement.innerText : "No title found";
      };
  
      const getShortDescription = () => {
          const shortDescriptionElement = document.querySelector("section > div:nth-child(3) > p");
          return shortDescriptionElement ? shortDescriptionElement.innerText : "No short description found";
      };
  
      const getMainCategory = () => {
          const mainCategoryElement = document.querySelector("nav > ol > li:nth-child(3) > a");
          return mainCategoryElement ? mainCategoryElement.innerText : "No main category found";
      };
  
      const getSecondaryCategory = () => {
          const secondaryCategoryElement = document.querySelector("nav > ol > li:nth-child(4) > a");
          return secondaryCategoryElement ? secondaryCategoryElement.innerText : "No secondary category found";
      };
  
      const getLongDescription = () => {
          const longDescriptionElement = document.querySelector("#courses > div > div > div > div:nth-child(1) > div > div > div > div.content > div > div > div > div") || document.querySelector("#modules > div > div > div > div:nth-child(1) > div > div > div > div.content");
          return longDescriptionElement ? longDescriptionElement.innerText : "No long description found";
      };
  
      const getCourseDetailsText = () => {
          const courseDetailsElement = document.querySelector("#courses > div > div > div > div:nth-child(2) > div > div") || document.querySelector("#modules > div > div > div > div:nth-child(2) > div > div > div");
          return courseDetailsElement ? courseDetailsElement.innerText : "No course details found";
      };
  
      return {
          title: getTitle(),
          shortDescription: getShortDescription(),
          mainCategory: getMainCategory(),
          secondaryCategory: getSecondaryCategory(),
          longDescription: getLongDescription(),
          courseDetailsText: getCourseDetailsText(),
      };
  });

    courseDetails.push({
      ...details,...additionalDetails,
      instructors: instructorsDetails,
    
    });
    
  }
  

  await browser.close();
  await fs.writeFile('Cursos_UAB.json', JSON.stringify(courseDetails, null, 2));

}


scrapeCourseraUNAM().catch(console.error);
