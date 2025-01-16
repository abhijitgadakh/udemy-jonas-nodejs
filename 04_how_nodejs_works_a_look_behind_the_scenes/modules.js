// console.log(arguments);
// console.log(arguments);

// module.exports
const Calculator = require("./test-module-1");

const calc1 = new Calculator();
console.log(calc1.add(2, 3));

//exports
// const calc2 = require("./test-module-2");
const { add, subtract, multiply, divide } = require("./test-module-2");
console.log(add(2, 4));
console.log(subtract(2, 4));
console.log(multiply(2, 4));
console.log(divide(2, 4));

//exports
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
