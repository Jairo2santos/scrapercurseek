import puppeteer from "puppeteer";
import fs from "fs";


async function extractCourseDetails(courseData) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let courseDetails = [];

    for (let { courseUrl, imgUrl, category } of courseData) {
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
                    startDate = document.querySelector('#box-duration-top-side-container > div > div > div').innerText;
                } catch (error) {
                    console.error("Error al obtener la fecha de inicio del curso.");
                }

                try {
                    duration = document.querySelector('#box-duration-top-side-container > div > div > div:nth-child(2) > astro-island:nth-child(2) > span > astro-slot').innerText;
                } catch (error) {
                    console.error("Error al obtener la duración del curso.");
                }

                try {
                    price = document.querySelector('#price-container > div > div.label.w-100.text-price').innerText;
                } catch (error) {
                    console.error("Error al obtener el precio del curso.");
                }

                try {
                    modalities = Array.from(document.querySelectorAll('.modalities-features-label')).map(el => el.innerText);
                } catch (error) {
                    console.error("Error al obtener las modalidades del curso.");
                }

                teachers = Array.from(document.querySelectorAll('div.col-xs-11.col-md-10.py-2.px-0.pl-md-3.mx-auto > h3')).map(el => el.innerText).join(', ');
                // Si no se encontraron profesores, asignar "Sin descripción de instructores"
                if (!teachers || teachers.trim().length === 0) {
                teachers = "Sin descripción de instructores";
                }

                try {
                    summary  = document.querySelector('div.lp-container.container.width-container > div.first-container > div > div').innerText;
                } catch (error) {
                    console.error("Error al obtener la descripción del curso.");
                }

                

                return {
                    title,
                    startDate,
                    duration,
                    price,
                    modalities,
                    teachers,
                    summary
                };
            });

            // Agregar la URL del curso y la URL de la imagen al objeto de detalles
            details.link = courseUrl;
            details.imgUrl = imgUrl;
            details.category = category;

            courseDetails.push(details);
        } catch (error) {
            console.error(`Error al acceder a la URL ${courseUrl}: ${error.message}`);
        }
    }

    await browser.close();
    return courseDetails;
}

// Leer el archivo JSON con las URLs de los cursos e imágenes
const courseData = JSON.parse(fs.readFileSync('courseData_UTN.json', 'utf-8'));

extractCourseDetails(courseData).then(details => {
    // Guardar los detalles en un archivo JSON
    fs.writeFileSync('cursos_UTN.json', JSON.stringify(details, null, 2));
});
