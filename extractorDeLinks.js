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

    let allCourseData = [];
    const totalPages = 25;

    for (let pageIndex = 0; pageIndex <= totalPages; pageIndex++) {
        const url = `https://sceu.frba.utn.edu.ar/e-learning/listado/Categorias[salud-y-medicina]${pageIndex ? `?from=${pageIndex}` : ''}`;
        await page.goto(url);

        const courseDataOnPage = await page.evaluate(() => {
            const data = [];
            const courseLinkElements = document.querySelectorAll('a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.css-1cv6iia');
            const imgElements = document.querySelectorAll('picture.MuiBox-root img');

            courseLinkElements.forEach((linkElement, index) => {
                const courseUrl = linkElement.href;
                const imgUrl = imgElements[index]?.src || '';
                data.push({ courseUrl, imgUrl });
            });
        
            return data;
        });

        allCourseData = allCourseData.concat(courseDataOnPage);
    }

    await browser.close();

    // Guardar las URLs de los cursos e imágenes en un archivo JSON
    fs.writeFileSync('courseData_salud_UTN.json', JSON.stringify(allCourseData, null, 2));
    console.log('Datos de los cursos guardados en courseData_turismo_UTN.json');
}

getCursosURLs();