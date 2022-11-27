const {readFileSync} = require('fs');
const express = require('express')
const app = express()
const port = 3000
const {reserved,words,numbers, aOperatores,rOperatores} = require('./utils/utils');

let found = {
    "PR" : {
        "count" : 0,
        "data" : []
    },
    "I"  : {
        "count" : 0,
        "data" : []
    },
    "OR" : {
        "count" : 0,
        "data" : []
    },
    "OL" : {
        "count" : 0,
        "data" : []
    },
    "OA" : {
        "count" : 0,
        "data" : []
    },
    "A"  : {
        "count" : 0,
        "data" : []
    },
    "NE" : {
        "count" : 0,
        "data" : []
    },
    "ND" : {
        "count" : 0,
        "data" : []
    },
    "C"  : {
        "count" : 0,
        "data" : []
    },
    "P"  : {
        "count" : 0,
        "data" : []
    },
    "L"  : {
        "count" : 0,
        "data" : []
    },
    "E"  : {
        "count" : 0,
        "data" : []
    },
};

const objAutomat = {
    "0" : {
        "status" : false,
        "key" : "E",
        "name": "Error",
        "evaluate" : (array,i) => {
            const e = array[i];
            i = i + 1;
            if(words.includes(e)){//Identificador
                return objAutomat["1"]["evaluate"](array,i);
            }else if(aOperatores.includes(e)){ //Operadores aritmeticos
                return objAutomat["2"]["evaluate"](array,i);
            }else if(numbers.includes(e)){ //Numeros Enteros y Decimales
                return objAutomat["3"]["evaluate"](array,i); 
            }else if(rOperatores.includes(e)){//Operadores relacionales
                return objAutomat["6"]["evaluate"](array,i);
            }else if(["{","}"].includes(e)){//Llaves
                return objAutomat["8"]["evaluate"](array,i);
            }else if(["(",")"].includes(e)){//Parentesis
                return objAutomat["9"]["evaluate"](array,i);
            }else if(e === "&"){//Operador logico
                return objAutomat["10"]["evaluate"](array,i);
            }else if(e === "|"){//Operador logico
                return objAutomat["12"]["evaluate"](array,i);
            }else if(e === "/"){//Division y numeros negativos
                return objAutomat["14"]["evaluate"](array,i);
            }else if(e === "-"){//Resta y numeros negativos
                return objAutomat["18"]["evaluate"](array,i);
            }else{
                objAutomat["1"]["status"];
            }
        }
    },
    "1" : {
        "status" : true,
        "key" : "I",
        "name" : "Identificador",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["1"];
            i = i + 1;
            if(words.includes(e) || numbers.includes(e) || e === "_"){
                return objAutomat["1"]["evaluate"](array,i);
            }
            return objAutomat["19"]["evaluate"](array,i);
        },
    },
    "2" : {
        "status" : true,
        "key" : "OA",
        "name" : "Operador Aritmetico",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["2"];
            return objAutomat["19"]["evaluate"](array,i + 1);
        },
    },
    "3" : {
        "status" : true,
        "key" : "NE",
        "name" : "Numero Entero",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["3"];
            i = i + 1;
            if(numbers.includes(e)) return objAutomat["3"]["evaluate"](array,i);
            else if(e === ".")      return objAutomat["4"]["evaluate"](array,i);
            return objAutomat["19"]["evaluate"](array);
        },
    },
    "4" : {
        "status" : false,
        "key" : "E",
        "name" : "Error",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["4"];
            i = i + 1;
            if(numbers.includes(e))
                return objAutomat["5"]["evaluate"](array,i);
            return objAutomat["19"]["evaluate"](array,i);
        },
    },
    "5" : {
        "status" : true,
        "key" : "ND",
        "name" : "Numero Decimal",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["5"];
            i = i + 1;
            if(numbers.includes(e))
                return objAutomat["5"]["evaluate"](array,i);
            return objAutomat["19"]["evaluate"](array,i);
        },
    },
    "6" : {
        "status" : true,
        "key" : "OR",
        "name" : "Operador Relacional",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["6"];
            i = i + 1;
            if(e === "=")
                return objAutomat["7"]["evaluate"](array,i + 1);
            return objAutomat["19"]["evaluate"](array,i + 1);
        },
    },
    "7" : {
        "status" : true,
        "key" : "OR",
        "name" : "Operador Relacional",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["7"];
            return objAutomat["19"]["evaluate"](array,i + 1);
        },
    },
    "8" : {
        "status" : true,
        "key" : "L",
        "name" : "Llave",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["8"];
            return objAutomat["19"]["evaluate"](array,i + 1);
        },
    },
    "9" : {
        "status" : true,
        "key" : "P",
        "name" : "Parentesis",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["9"];
            return objAutomat["19"]["evaluate"](array,i + 1);
        },
    },
    "10" : {
        "status" : false,
        "key" : "E",
        "name" : "Error",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["10"];
            i = i + 1;
            if(e === "&") return objAutomat["11"]["evaluate"](array,i);
            return objAutomat["19"]["evaluate"](array,i);
        },
    },
    "11" : {
        "status" : true,
        "key" : "OL",
        "name" : "Operador Logico",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["11"];
            return objAutomat["19"]["evaluate"](array,i + 1);
        },
    },
    "12" : {
        "status" : false,
        "key" : "E",
        "name" : "Error",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["12"];
            i = i + 1;
            if(e === "|") return objAutomat["13"]["evaluate"](array,i);
            return objAutomat["19"]["evaluate"](array,i);
        },
    },
    "13" : {
        "status" : true,
        "key" : "OL",
        "name" : "Operador Logico",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["13"];
            return objAutomat["19"]["evaluate"](array,i + 1);
        },
    },
    "14" : {
        "status" : true,
        "key" : "C",
        "name" : "Comentario",
        "evaluate" : (array,i) => {
            const e = array[i];
            if (!e) return objAutomat["14"];
            i = i + 1;
            if(e === "*")
                return objAutomat["15"]["evaluate"](array,i);
            return objAutomat["19"]["evaluate"](array,i);
        },
    },
    "15" : {
        "status" : false,
        "key" : "E",
        "name" : "Error",
        "evaluate" : (array,i) => {
            const e = array[i];
            if (!e) return objAutomat["15"];
            i = i + 1;
            if(e === "*") return objAutomat["16"]["evaluate"](array,i);
            return objAutomat["15"]["evaluate"](array,i);
        },
    },
    "16" : {
        "status" : false,
        "key" : "E",
        "name" : "Error",
        "evaluate" : (array,i) => {
            const e = array[i];
            if (!e) return objAutomat["16"];
            i = i + 1;
            if(e === "*") return objAutomat["16"]["evaluate"](array,i);
            if(e === "/") return objAutomat["17"]["evaluate"](array,i);
            return objAutomat["19"]["evaluate"](array,i);
        },
    },
    "17" : {
        "status" : true,
        "key" : "C",
        "name" : "Comentario",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["17"];
            return objAutomat["19"]["evaluate"](array,i + 1);
        },
    },
    "18" : {
        "status" : true,
        "key" : "OA",
        "name" : "Operador Aritmetico",
        "evaluate" : (array,i) => {
            const e = array[i];
            i = i + 1;
            if(!e) return objAutomat["18"];
            if(numbers.includes(e)) return objAutomat["3"]["evaluate"](array,i);
            return objAutomat["19"]["evaluate"](array,i); 
        },
    },
    "19" : {
        "status" : false,
        "key" : "E",
        "name" : "Error",
        "evaluate" : (array,i) => {
            const e = array[i];
            if(!e) return objAutomat["19"];
            return objAutomat["19"]["evaluate"](array,i + 1);
            
        },
    },
}


const syncReadFile = (filename) => readFileSync(filename, 'utf-8');


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/getData', (req, res) => {const text = syncReadFile('./example.txt');
    const arr = text.split(/\r?\n/);
    arr.forEach((s) => {
        const w = s.split("\t").filter(element => element);
        w.forEach((l) => {
            const lt = l.split(" ").filter(element => element);
            lt.forEach((c) => {
                if(reserved.includes(c)){
                    found["PR"].count++;
                    found["PR"].data.push(c);
                }else{
                    const result = objAutomat["0"]["evaluate"](c.split(""),0);
                    if(result.status){
                        if (result.key === "OR" && c === "="){
                            found["A"].count++;
                            found["A"].data.push(c);
                        }else if(result.key === "OR" && c === "!"){
                            found["OL"].count++;
                            found["OL"].data.push(c);
                        }else{
                            found[result.key].count++;
                            found[result.key].data.push(c);
                        }
                    }else{
                        found["E"].count++;
                        found["E"].data.push(c);
                    }
                }
            });
        });
    });
    
    res.write(JSON.stringify({
        text,
        data : found 
    }));
    res.end();

    found = {
        "PR" : {
            "count" : 0,
            "data" : []
        },
        "I"  : {
            "count" : 0,
            "data" : []
        },
        "OR" : {
            "count" : 0,
            "data" : []
        },
        "OL" : {
            "count" : 0,
            "data" : []
        },
        "OA" : {
            "count" : 0,
            "data" : []
        },
        "A"  : {
            "count" : 0,
            "data" : []
        },
        "NE" : {
            "count" : 0,
            "data" : []
        },
        "ND" : {
            "count" : 0,
            "data" : []
        },
        "C"  : {
            "count" : 0,
            "data" : []
        },
        "P"  : {
            "count" : 0,
            "data" : []
        },
        "L"  : {
            "count" : 0,
            "data" : []
        },
        "E"  : {
            "count" : 0,
            "data" : []
        },
    };
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})