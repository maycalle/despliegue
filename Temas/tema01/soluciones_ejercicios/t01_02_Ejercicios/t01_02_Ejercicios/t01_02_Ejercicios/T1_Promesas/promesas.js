/*
Ejercicio para practicar con promesas
Versión alternativa del ejercicio 1.3 donde las funciones para añadir o borrar
personas devuelven una promesa con el resultado de la operación
*/

// Vector inicial de personas
let datos = [
    {nombre: "Nacho", telefono: "966112233", edad: 40},
    {nombre: "Ana", telefono: "911223344", edad: 35},
    {nombre: "Mario", telefono: "611998877", edad: 15},
    {nombre: "Laura", telefono: "633663366", edad: 17}
];

// Arrow function para añadir personas, siempre que no exista ya su teléfono
let nuevaPersona = persona => {
    return new Promise((resolve, reject) => {
        let existe = datos.filter(pers => pers.telefono === persona.telefono);
        if (existe.length == 0) {
            datos.push(persona);
            resolve(persona);
        } else {
            reject("Error: el teléfono ya existe");
        }
    
    });
}

// Arrow function para borrar una persona por su teléfono
let borrarPersona = telefono => {
    return new Promise((resolve, reject) => {
        let existePersona = datos.filter(persona => persona.telefono === telefono);
        if (existePersona.length > 0) {
            datos = datos.filter(persona => persona.telefono != telefono);
            resolve(existePersona[0]);
        } else {
            reject("Error: no se han encontrado coincidencias");
        }
    });
}

// Programa principal

// Inserciones
nuevaPersona({nombre: "Juan", telefono:"965661564", edad: 60}).then(resultado => {
    console.log("Añadida persona:", resultado);
}).catch(error => {
    console.log(error);
});
nuevaPersona({nombre: "Rodolfo", telefono:"910011001", edad: 20}).then(resultado => {
    console.log("Añadida persona:", resultado);
}).catch(error => {
    console.log(error);
});
// Inserción repetida para que dé error
nuevaPersona({nombre: "Rodolfo", telefono:"910011001", edad: 20}).then(resultado => {
    console.log("Añadida persona:", resultado);
}).catch(error => {
    console.log(error);
});

// Borrados
borrarPersona("910011001").then(resultado => {
    console.log("Borrada persona:", resultado);
}).catch(error => {
    console.log(error);
});
// Borrado con número equivocado para que dé error
borrarPersona("000000000").then(resultado => {
    console.log("Borrada persona:", resultado);
}).catch(error => {
    console.log(error);
});
console.log(datos);