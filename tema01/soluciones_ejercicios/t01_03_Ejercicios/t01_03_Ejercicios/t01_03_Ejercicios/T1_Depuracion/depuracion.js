/*
Ejercicio de prueba para usar el depurador de código y averiguar cuánto vale la variable
n al final del bucle
*/

var m = 1, n = 2;

for(i = 1; i <= 5; i++) {
    m = m * i;
    n = n + m * n;
}
debugger;
console.log(n);
