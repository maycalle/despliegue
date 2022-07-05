/*
Ejercicio para practicar con "arrow functions"
Definimos una función para añadir personas a un vector, y otra para borrarlas
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
    let existe = datos.filter(pers => pers.telefono === persona.telefono);
    if (existe.length == 0)
        datos.push(persona);
}

// Arrow function para borrar una persona por su teléfono
let borrarPersona = telefono => {
    datos = datos.filter(persona => persona.telefono != telefono);
}

// Programa principal
nuevaPersona({nombre: "Juan", telefono:"965661564", edad: 60});
nuevaPersona({nombre: "Rodolfo", telefono:"910011001", edad: 20});
borrarPersona("910011001");
console.log(datos);