// Importa los módulos necesarios
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtiene la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define la ruta del archivo JSON
const filePath = path.join(__dirname, './Jsons/JsonMain/cursos_turismo_UTN.json');

// Define la categoría que deseas agregar
const category = 'Turismo';

// Función asincrónica para leer, modificar y escribir el archivo JSON
async function addCategoryToFile() {
  try {
    // Lee el contenido del archivo JSON
    const data = await fs.readFile(filePath, 'utf8');
    
    // Parsea el contenido del archivo JSON
    const jsonContent = JSON.parse(data);

    // Añade la categoría a cada curso en el archivo JSON
    const updatedContent = jsonContent.map(curso => {
      return { ...curso, category };
    });

    // Convierte el contenido actualizado a una cadena JSON
    const updatedData = JSON.stringify(updatedContent, null, 2);

    // Escribe el contenido actualizado de nuevo al archivo
    await fs.writeFile(filePath, updatedData, 'utf8');
    console.log(`Categoría ${category} añadida a todos los cursos en ${filePath}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Ejecuta la función
addCategoryToFile();
