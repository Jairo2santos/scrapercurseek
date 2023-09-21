import puppeteer from "puppeteer";
import fs from "fs";

async function GetCursos() {
    const browser = await puppeteer.launch({
        headless: false
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

    let allCourses = [];
  
   
    const totalPages = 37;

    for (let pageIndex = 0; pageIndex <= totalPages; pageIndex++) {
        const url = `https://sceu.frba.utn.edu.ar/e-learning/listado/Categorias[administracion-de-empresas]${pageIndex ? `?from=${pageIndex}` : ''}`;
        await page.goto(url);

        const coursesOnPage = await page.evaluate(() => {
            const courses = [];
            const courseContainers = document.querySelectorAll('.MuiGrid-root.MuiGrid-container.css-sfdl7');
        
            courseContainers.forEach(container => {
                const cards = container.querySelectorAll('.MuiCard-root.card-offer.card-desktop.card.card-body.css-s18byi');
                
                cards.forEach(card => {
                    const courseLinkElement = card.querySelector('a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.css-1cv6iia');
                    const courseImageElement = card.querySelector('.MuiCardMedia-root.css-pqdqbj img');
                    const courseTitleElement = card.querySelector('.MuiTypography-root.MuiTypography-body1.card-title.css-1eluky1');
                    const courseStartDateElement = card.querySelector('.card-content .MuiBox-root.css-70qvj9 svg + span');
                    const courseDurationElement = card.querySelector('.card-content .MuiBox-root.css-70qvj9:last-child svg + span');
        
                    courses.push({
                        title: courseTitleElement ? courseTitleElement.innerText : null,
                        link: courseLinkElement ? courseLinkElement.href : null,
                        image: courseImageElement ? courseImageElement.src : null,
                        startDate: courseStartDateElement ? courseStartDateElement.innerText : null,
                        duration: courseDurationElement ? courseDurationElement.innerText : null
                    });
                });
            });
        
            return courses;
        });

        allCourses = allCourses.concat(coursesOnPage);
    }

    await browser.close();

    // Convertir allCourses en un archivo JSON
    fs.writeFileSync('courses.json', JSON.stringify(allCourses, null, 2));
}


GetCursos();
