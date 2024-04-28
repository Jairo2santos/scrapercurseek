import puppeteer from "puppeteer";
import fs from "fs";

async function getCursosURLs() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', req => {
        if (req.resourceType() === 'image') req.abort();
        else req.continue();
    });

    let allCourseData = [];

    const categories = [
        { name: "Administración de Empresas", slug: "administracion-de-empresas" },
        { name: "Ciencias Sociales y Derecho", slug: "ciencias-sociales-y-derecho" },
        { name: "Deportes y Gestión Deportiva", slug: "deportes-y-gestion-deportiva" },
        { name: "Desarrollo Personal", slug: "desarrollo-personal" },
        { name: "Diseño, Imagen y Sonido", slug: "diseno-imagen-y-sonido" },
        { name: "Educación y Capacitación", slug: "educacion-y-capacitacion" },
        { name: "Idiomas", slug: "idiomas" },
        { name: "Industria, Energía y Construcción", slug: "industria-energia-y-construccion" },
        { name: "Informática, Programación y Sistemas", slug: "informatica-programacion-y-sistemas" },
        { name: "Marketing y Comunicación", slug: "marketing-y-comunicacion" },
        { name: "Salud y Medicina", slug: "salud-y-medicina" },
        { name: "Turismo, Hotelería y Gastronomía", slug: "turismo-hoteleria-y-gastronomia" }
    ];

    for (const category of categories) {
        let pageIndex = 0;
        let courseDataOnPage = [];

        do {
            const url = pageIndex === 0
                ? `https://sceu.frba.utn.edu.ar/e-learning/listado/Categorias[${category.slug}]`
                : `https://sceu.frba.utn.edu.ar/e-learning/listado/Categorias[${category.slug}]?from=${pageIndex}`;
            await page.goto(url);

            try {
                await page.waitForSelector('body > main > div > div > div:nth-child(2) > div.list-container', { timeout: 10000 });
            } catch (error) {
                console.log(`No se encontró el contenedor de cursos en la página ${pageIndex} para la categoría ${category.name}, probablemente haya llegado al final.`);
                break; // Salir del bucle si no se encuentra el contenedor
            }

            // Ajuste para capturar todos los cursos e imágenes de la página
            courseDataOnPage = await page.evaluate(() => {
                const data = [];
                // Selecciona todos los contenedores de cursos
                const courseContainers = document.querySelectorAll('body > main > div > div > div:nth-child(2) > div.list-container > div');
                
                courseContainers.forEach(container => {
                    const courseUrl = container.querySelector('a')?.href || '';
                    const imgUrl = container.querySelector('a > div.card-header > img')?.src || '';
                    data.push({ courseUrl, imgUrl });
                });

                return data;
            });

            if (courseDataOnPage.length > 0) {
                allCourseData = allCourseData.concat(courseDataOnPage.map(course => ({ ...course, category: category.name })));
            }

            pageIndex++;
        } while (courseDataOnPage.length > 0);
    }

    await browser.close();

    fs.writeFileSync('courseData_UTN.json', JSON.stringify(allCourseData, null, 2));
    console.log('Datos de los cursos guardados en courseData_UTN.json');
}

getCursosURLs();
