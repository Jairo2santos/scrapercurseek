import fs from 'fs/promises';
import path from 'path';

// Lista de archivos JSON y la universidad correspondiente a cada uno
const files = [
  { filePath: 'UAB/Cursos_UAB.json', university: 'UAB' },
  { filePath: 'Uchile/Cursos_UChile.json', university: 'UChile' },
  { filePath: 'UDeLosAndesCo/Cursos_UDeLosAndesCo.json', university: 'UDeLosAndesCo' }, // Asegúrate de tener la extensión .json aquí
  { filePath: 'Unam/Cursos_Unam.json', university: 'UNAM' },
  { filePath: 'UpChile/Cursos_UpChile.json', university: 'UpChile' },
  // Añade más archivos según sea necesario
];

const combineCourses = async () => {
  let combinedCourses = [];

  for (let file of files) {
    try {
      // Leer el contenido del archivo JSON de manera asincrónica
      const content = await fs.readFile(file.filePath, 'utf8');
      
      // Parsear el contenido a un objeto JavaScript
      const courses = JSON.parse(content);

      // Agregar el campo universidad a cada curso dentro del archivo
      const modifiedCourses = courses.map(course => ({
        ...course,
        university: file.university
      }));

      // Añadir los cursos modificados al arreglo combinado
      combinedCourses = [...combinedCourses, ...modifiedCourses];
    } catch (error) {
      console.error(`Error processing file ${file.filePath}:`, error);
    }
  }

  // Convertir el arreglo combinado a una cadena JSON
  const combinedJSON = JSON.stringify(combinedCourses, null, 2);

  // Escribir el JSON combinado a un nuevo archivo
  const combinedFilePath = path.join('Cursos_Coursera_Uni.json');
  await fs.writeFile(combinedFilePath, combinedJSON, 'utf8');

  console.log(`Archivo combinado creado en: ${combinedFilePath}`);
};

combineCourses().catch(console.error);
