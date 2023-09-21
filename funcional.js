import puppeteer from "puppeteer";
import fs from "fs";

async function GetCursos() {
    const browser = await puppeteer.launch({
        headless: 'new'
        
    });

    const page = await browser.newPage();

    // Desactivar la carga de imágenes para acelerar la navegación
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.goto("https://sceu.frba.utn.edu.ar/e-learning/listado/Categorias[administracion-de-empresas]");

    const coursesOnPage = await page.evaluate(() => {
        const courses = [];
        const courseContainers = document.querySelectorAll('.MuiGrid-root.MuiGrid-container.css-sfdl7');

        courseContainers.forEach(container => {
            const cards = container.querySelectorAll('.MuiCard-root.card-offer.card-desktop.card.card-body.css-s18byi');
            
            cards.forEach(card => {
                const courseLink = card.querySelector('a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.css-1cv6iia').href;
                const courseImage = card.querySelector('.MuiCardMedia-root.css-pqdqbj img').src;
                const courseTitle = card.querySelector('.MuiTypography-root.MuiTypography-body1.card-title.css-1eluky1').innerText;
                const courseStartDate = card.querySelector('.card-content .MuiBox-root.css-70qvj9 svg + span').innerText;
                const courseDuration = card.querySelector('.card-content .MuiBox-root.css-70qvj9:last-child svg + span').innerText;

                courses.push({
                    title: courseTitle,
                    link: courseLink,
                    image: courseImage,
                    startDate: courseStartDate,
                    duration: courseDuration
                });
            });
        });

        return courses;
    });

    await browser.close();

    // Convertir coursesOnPage en un archivo JSON
    fs.writeFileSync('courses.json', JSON.stringify(coursesOnPage, null, 2));

    
}

GetCursos();