import fs from 'fs/promises';

async function combineJsonFiles() {
  try {
    // Cambia las rutas de los archivos según sea necesario
    const pathToCoursesDetails = './coursera_unam.json';
    const pathToUrlsAndImages = './urlsAndImages.json';
    const outputPath = './combinedCourses.json';

    // Lee y parsea el contenido de ambos archivos JSON
    const coursesDetailsRaw = await fs.readFile(pathToCoursesDetails, { encoding: 'utf-8' });
    const urlsAndImagesRaw = await fs.readFile(pathToUrlsAndImages, { encoding: 'utf-8' });

    const coursesDetails = JSON.parse(coursesDetailsRaw);
    const urlsAndImages = JSON.parse(urlsAndImagesRaw);

    // Asume que ambos arrays están en el mismo orden y tienen la misma longitud
    const combinedCourses = coursesDetails.map((course, index) => {
      // Combina la información relevante de `urlsAndImages` con `coursesDetails`
      return {
        ...course,
        courseUrl: urlsAndImages[index].courseUrl,
        imgUrl: urlsAndImages[index].imgUrl
      };
    });

    // Escribe el resultado combinado en un nuevo archivo JSON
    await fs.writeFile(outputPath, JSON.stringify(combinedCourses, null, 2));

    console.log('La combinación de archivos JSON ha sido completada exitosamente.');
  } catch (error) {
    console.error('Error combinando los archivos JSON:', error);
  }
}

combineJsonFiles();
