import puppeteer from "puppeteer";
import fs from "fs";

async function getCursosURLs() {
    const browser = await puppeteer.launch({
        headless: false,
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

    let allCourseURLs = [];
    const totalPages = 25;

    for (let pageIndex = 0; pageIndex <= totalPages; pageIndex++) {
        const url = `https://sceu.frba.utn.edu.ar/e-learning/listado/Categorias[turismo-hoteleria-y-gastronomia]${pageIndex ? `?from=${pageIndex}` : ''}`;
        await page.goto(url);

        const courseURLsOnPage = await page.evaluate(() => {
            const urls = [];
            const courseLinkElements = document.querySelectorAll('a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.css-1cv6iia');
            
            courseLinkElements.forEach(linkElement => {
                urls.push(linkElement.href);
            });
        
            return urls;
        });

        allCourseURLs = allCourseURLs.concat(courseURLsOnPage);
    }

    await browser.close();

    // Guardar las URLs en un archivo .txt separadas por comas
    fs.writeFileSync('courseURLs_turismo_UTN.txt', allCourseURLs.map(url => `'${url}'`).join(',\n'));
    console.log('URLs guardadas en courseURLs.txt');
}

getCursosURLs();