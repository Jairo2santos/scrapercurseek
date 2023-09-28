import puppeteer from "puppeteer";
import fs from "fs";


async function extractCourseDetails(courseData) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let courseDetails = [];

    for (let { courseUrl, imgUrl } of courseData) {
        try {
            await page.goto(courseUrl, { timeout: 100000 });

            const details = await page.evaluate(() => {
                let title, startDate, duration, price, modalities, teachers, courseDescription, summary;

                try {
                    title = document.querySelector('h1').innerText;
                } catch (error) {
                    console.error("Error al obtener el título del curso.");
                }

                try {
                    startDate = document.querySelector('p.MuiTypography-root.MuiTypography-body1.css-x52e50').innerText;
                } catch (error) {
                    console.error("Error al obtener la fecha de inicio del curso.");
                }

                try {
                    duration = document.querySelector('p.MuiTypography-root.MuiTypography-body1.css-1ly5z01 > span').innerText;
                } catch (error) {
                    console.error("Error al obtener la duración del curso.");
                }

                try {
                    price = document.querySelector('label.text-price.m-0 > span').innerText;
                } catch (error) {
                    console.error("Error al obtener el precio del curso.");
                }

                try {
                    modalities = Array.from(document.querySelectorAll('.modalities-features-label')).map(el => el.innerText);
                } catch (error) {
                    console.error("Error al obtener las modalidades del curso.");
                }

                try {
                    teachers = Array.from(document.querySelectorAll('div.pt-4.pb-4.px-0.pl-md-3.mx-auto.col-11.col-md-10 > h3')).map(el => el.innerText).join(', ');
                } catch (error) {
                    console.error("Error al obtener los profesores del curso.");
                }

                try {
                    courseDescription = document.querySelector('div.MuiBox-root.css-1u6733f > section > h6').innerText;
                } catch (error) {
                    console.error("Error al obtener la descripción del curso.");
                }

                try {
                    summary = document.querySelector('#__next > main > div > div.MuiContainer-root.MuiContainer-maxWidthLg.css-1qsxih2 > div > div:nth-child(1) > div:nth-child(1) > div > div > div > section').innerText;
                } catch (error) {
                    console.error("Error al obtener el resumen del curso.");
                }

                return {
                    title,
                    startDate,
                    duration,
                    price,
                    modalities,
                    teachers,
                    courseDescription,
                    summary
                };
            });

            // Agregar la URL del curso y la URL de la imagen al objeto de detalles
            details.link = courseUrl;
            details.imgUrl = imgUrl;

            courseDetails.push(details);
        } catch (error) {
            console.error(`Error al acceder a la URL ${courseUrl}: ${error.message}`);
        }
    }

    await browser.close();
    return courseDetails;
}

// Leer el archivo JSON con las URLs de los cursos e imágenes
const courseData = JSON.parse(fs.readFileSync('courseData_salud_UTN.json', 'utf-8'));

extractCourseDetails(courseData).then(details => {
    // Guardar los detalles en un archivo JSON
    fs.writeFileSync('cursos_salud_UTN.json', JSON.stringify(details, null, 2));
});
