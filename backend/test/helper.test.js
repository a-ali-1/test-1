const num = require("../helper.js");
// const adminDao2 = require("../dao/adminDao.js");

const numbTrue = 2;
const numbFalse = "A";
const boolTrue = true;
const boolFalse = false;
const arrayTrue = ["Banane", "Orange", "Apfel", "Mango"]; 
const arrayFalse = 0;
const arrayEmpty = [];
const arrayNotEmpty = ["Banane", "Orange", "Apfel", "Mango"]; 


test("Ist Nummer", ()=> {
    expect(num.isNumeric(numbTrue)).toEqual(boolTrue);
});

test("Ist keine Nummer", ()=> {
    expect(num.isNumeric(numbFalse)).toEqual(boolFalse);
});

test("Ist Array", ()=> {
    expect(num.isArray(arrayTrue)).toEqual(boolTrue);
});

test("Ist keine Array", ()=> {
    expect(num.isArray(arrayFalse)).toEqual(boolFalse);
});

test("Array leer", ()=> {
    expect(num.isArrayEmpty(arrayEmpty)).toEqual(boolTrue);
});

test("Array nicht leer", ()=> {
    expect(num.isArrayEmpty(arrayNotEmpty)).toEqual(boolFalse);
});

test('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
});
