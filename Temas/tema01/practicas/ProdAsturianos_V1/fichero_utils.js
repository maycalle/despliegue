/** Funciones de utilidad para cargar y guardar datos en formato JSON desde/en ficheros de texto
 * 
 * cargarProductos: recibe como parámetro un nombre de fichero y devuelve el array de objetos
 * (productos) Javascript que se lea de él en formato JSON. Devolverá un array vacío si el
 * fichero no existe o no pudo leerse.
 * 
 * guardarProductos: recibe como parámetros un nombre de fichero y un array de objetos 
 * (productos) para guardar, y guarda en formato JSON los objetos del array en el fichero.
 * Si el array es nulo, no se hará nada con el fichero.
*/

// Carga del módulo FS para poder leer/escribir archivos de texto
const fs = require ('fs');

let cargarProductos = fichero => {
    let resultado = JSON.parse(fs.readFileSync(fichero, 'utf-8'));
    if (resultado) 
        return resultado;
    else
        return [];
}

let guardarProductos = (fichero, productos) => {
    if (productos)
        fs.writeFileSync(fichero, JSON.stringify(productos));
}

module.exports = {
    cargarProductos: cargarProductos,
    guardarProductos: guardarProductos
};
