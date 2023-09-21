import puppeteer from "puppeteer";
import fs from "fs";


async function extractCourseDetails(urls) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let courseDetails = [];

    for (let url of urls) {
        try {
        await page.goto(url, { timeout: 100000 });
    
        const details = await page.evaluate((currentURL) => {
            let title, startDate, duration, price, modalities, teachers, courseDescription;
    
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
    
            return {
                link: currentURL, 
                title,
                startDate,
                duration,
                price,
                modalities,
                teachers,
                courseDescription
            };
        },url);

        courseDetails.push(details);
    } catch (error) {
        console.error(`Error al acceder a la URL ${url}: ${error.message}`);
    }
    }

    await browser.close();
    return courseDetails;
}

// Lista de URLs de cursos
const courseUrls = [
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1571/elaboracion-de-licores-artesanales?id=999191748',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/388/marketing-para-pequenos-y-medianos-establecimientos-hoteleros?id=999190136',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1334/evaluacion-sensorial-de-los-alimentos?id=999191860',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1203/diseno-gestion-y-comunicacion-de-experiencias-turisticas?id=999192166',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/822/planificacion-y-desarrollo-de-emprendimientos-hoteleros?id=999193153',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1823/capacitacion-sensorial-en-aceites-especias-y-mieles?id=999193155',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1778/capacitacion-sensorial-en-quesos?id=999191063',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1824/capacitacion-sensorial-en-infusiones?id=999193156',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2212/curso-vinas-vinos-catas-y-maridajes?id=999190295',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/48/recepcionista-de-hotel?id=999191850',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1408/experto-universitario-en-planificacion-y-gestion-turistica-sustentable?id=999193193',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1197/conocimiento-y-cata-de-vinos?id=999191856',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1325/comercializacion-y-comunicacion-digital-para-hoteles-pequenos-y-medianos?id=999192048',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/408/calidad-y-atencion-al-cliente-en-pequenos-y-medianos-establecimientos-hoteleros?id=999190139',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2488/nuevas-formas-de-turismo-turismo-de-experiencia?id=999191417',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/410/estrategia-de-precios-e-indicadores-de-gestion-para-hoteles-pequenos-y-medianos?id=999190145',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/296/experto-universitario-en-gestion-de-hoteles-pequenos-y-medianos?id=999193787',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/409/operaciones-hoteleras-en-pequenos-y-medianos-establecimientos-recepcion-pisos-alimentos-y-bebidas?id=999193790',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2264/nuevas-formas-de-turismo-agencias-virtuales?id=999193681',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/386/experto-universitario-en-turismo-rural?id=999193883',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/3287/experto-universitario-en-modelos-de-gestion-de-destinos-turisticos-inteligentes?id=999194070',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/2847/licenciatura-en-gestion-de-empresas-turisticas-y-hoteleras?id=999192109',
'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2448/curso-basico-de-cocina-saludable?id=999190043'
];

extractCourseDetails(courseUrls).then(details => {
    // Guardar los detalles en un archivo JSON
    fs.writeFileSync('cursos_turismo_UTN.json', JSON.stringify(details, null, 2));
    
});