const mysql = require("mysql2")
const http = require("http")
const url = require("url")
const querystring = require("querystring")
const path = require("path")
const dotenv = require('dotenv').config({
    path: __dirname + '/prod.env'
})
const DATABASE = process.env.DB_NAME
const DB_PORT = process.env.DB_PORT
const SERVER_PORT = process.env.SERVER_PORT
const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const CREATE_USER = process.env.DB_CREATE_USER
const CREATE_PASSWORD = process.env.DB_CREATE_PASSWORD
const HOST = process.env.DB_HOST
const TABLE_NAME = process.env.DB_TABLE_NAME
const SERVER_PATH = process.env.SERVER_PATH

const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    port: DB_PORT,
    database: DATABASE
});

const create_table_connection = mysql.createConnection({
    host: HOST,
    user: CREATE_USER,
    password: CREATE_PASSWORD,
    port: DB_PORT,
    database: DATABASE
});

const server = http.createServer((req, res) => {
    const parsed_url = url.parse(req.url, true);
    const pathname = decodeURI(parsed_url.pathname).replace(SERVER_PATH, "");
    res.setHeader("Access-Control-Allow-Origin", "*")

    if (req.method === "GET" && pathname === "/health") {
        res.writeHead(200, {
            'Content-type': 'text/plain'
        });
        res.end('OK');
    } else if (req.method === "GET") {
        connection.query(pathname.substring(1), (err, result) => {
            if (err) {
                console.error(`Can't complete query: ${err}`)
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
                res.write(JSON.stringify(err));
                res.end();
            } else {
                console.log(`Query completed successfully: ${result}`)
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.write(JSON.stringify(result));
                res.end();
            }
        })
    } else if (req.method === "POST" && (pathname === "/" || pathname === "")) {
        let query = ""
        req.on('data', (chunk) => {
            query += chunk.toString();
        })
        req.on("end", () => {
            connection.query(query, (err, result) => {
                if (err) {
                    console.error(`Can't complete query: ${err}`)
                    res.writeHead(500, {
                        'Content-Type': 'application/json'
                    });
                    res.write(JSON.stringify(err));
                    res.end();
                } else {
                    console.log(`Query completed successfully: ${result}`)
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.write(JSON.stringify(result));
                    res.end();
                }
            })
        })
    } else if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin")
        res.writeHead(200, {
            'Content-type': 'text/plain'
        });
        res.end('OK')
    }
})


const createTable = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    patientId INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dateOfBirth DATETIME NOT NULL) ENGINE=InnoDB;`

create_table_connection.connect((err) => {
    if (err) {
        console.log("Error connecting to MySql: ", err);
        return;
    } else {
        create_table_connection.query(`USE ${DATABASE}`, (err, result) => {
            if (err) {
                console.error(`Can't connect to DB: ${err}`)
                return
            } else {
                console.log(`Connected to MySql DB: ${result}`)
            }
        })
        create_table_connection.query(createTable, (err, result) => {
            if (err) {
                console.error(`Can't create Table: ${err}`)
                return
            } else {
                console.log(`Table Created succesfully: ${result}`)
            }
        })
        create_table_connection.end((err) => {
            if (err) {
                console.error(`Can't create Table: ${err}`)
                return
            } else {
                connection.connect((err) => {
                    if (err) {
                        console.log("Error connecting to MySql: ", err);
                        return;
                    } else {
                        server.listen(SERVER_PORT, () => {
                            console.log(`Server is running on port ${SERVER_PORT}`);
                        });
                    }
                })
            }
        })
    }
})

// console.log(encodeURI('https://bcit-backend.miniaturepug.info/comp/4537/labs/5/api/v1/sql/INSERT INTO patient VALUES (1, "john", "1999-01-01")'))