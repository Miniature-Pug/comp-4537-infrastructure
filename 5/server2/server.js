// --------- Lib Imports ---------
const mysql = require("mysql2")
const http = require("http")
const url = require("url")
const path = require("path")
const dotenv = require('dotenv').config({
    path: __dirname + '/prod.env'
})
// -------------------------------


// --------- Global Variables ---------
const DATABASE = process.env.DB_NAME
const DB_PORT = process.env.DB_PORT
const SERVER_PORT = process.env.SERVER_PORT
const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const INIT_USER = process.env.DB_INIT_USER
const INIT_PASSWORD = process.env.DB_INIT_PASSWORD
const HOST = process.env.DB_HOST
const TABLE_NAME = process.env.DB_TABLE_NAME
const SERVER_PATH = process.env.SERVER_PATH
// -------------------------------


// --------- Types of connections ---------
const init = mysql.createConnection({
    host: HOST,
    user: INIT_USER,
    password: INIT_PASSWORD,
    port: DB_PORT,
    database: DATABASE
})

const user_connect = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    port: DB_PORT,
    database: DATABASE
})
// -------------------------------


// --------- Global Strings ---------
// common queries
const createTable = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    patientId INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dateOfBirth DATETIME NOT NULL) ENGINE=InnoDB;`

// success strings
const querySuccess = "Query completed successfully:"
const dbSuccess = "Successfull DB Connection:"
const tableSuccess = "Table Created succesfully:"
const serverCreationSuccess = "Server is running on port:"

// failure strings
const queryFailure = "Can't complete query:"
const mySQLFailure = "Error connecting to MySql: "
const dbFailure = "Can't connect to DB:"
const tableFailure = "Can't ccreate Table:"
const connectionEndFailure = "Can't end db instance connection:"
// -------------------------------


// init db connection before Server start
// end init db connection
// start user db connection
// start server
init.connect((err) => {
    if (err) {
        console.log(`${mySQLFailure} ${err}`)
        return
    } else {
        init.query(`USE ${DATABASE}`, (err, result) => {
            if (err) {
                console.error(`${dbFailure} ${err}`)
                return
            } else {
                console.log(`${dbSuccess} ${result}`)
            }
        })
        init.query(createTable, (err, result) => {
            if (err) {
                console.error(`${tableFailure} ${err}`)
                return
            } else {
                console.log(`${tableSuccess} ${result}`)
            }
        })
        init.end((err) => {
            if (err) {
                console.error(`${connectionEndFailure} ${err}`)
                return
            } else {
                user_connect.connect((err) => {
                    if (err) {
                        console.log(`${mySQLFailure} ${err}`)
                        return
                    } else {
                        server.listen(SERVER_PORT, () => {
                            console.log(`${serverCreationSuccess} ${SERVER_PORT}`)
                        })
                    }
                })
            }
        })
    }
})


// server handles user requests
const server = http.createServer((req, res) => {
    const parsed_url = url.parse(req.url, true)
    const pathname = decodeURI(parsed_url.pathname).replace(SERVER_PATH, "")
    res.setHeader("Access-Control-Allow-Origin", "*")

    if (req.method === "GET" && pathname === "/health") {
        res.writeHead(200, {
            'Content-type': 'text/plain'
        })
        res.end('OK')
    } else if (req.method === "GET") {
        user_connect.query(pathname.substring(1), (err, result) => {
            if (err) {
                console.error(`${queryFailure} ${err}`)
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                })
                res.write(JSON.stringify(err))
                res.end()
            } else {
                console.log(`${querySuccess} ${result}`)
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.write(JSON.stringify(result))
                res.end()
            }
        })
    } else if (req.method === "POST" && (pathname === "/" || pathname === "")) {
        let query = ""
        req.on('data', (chunk) => {
            query += chunk.toString()
        })
        req.on("end", () => {
            user_connect.query(query, (err, result) => {
                if (err) {
                    console.error(`${queryFailure} ${err}`)
                    res.writeHead(500, {
                        'Content-Type': 'application/json'
                    })
                    res.write(JSON.stringify(err))
                    res.end()
                } else {
                    console.log(`${querySuccess} ${result}`)
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    })
                    const response = {"result": `${querySuccess} id: ${result["insertId"]}`}
                    res.write(JSON.stringify(response))
                    res.end()
                }
            })
        })
    } else if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin")
        res.writeHead(200, {
            'Content-type': 'text/plain'
        })
        res.end('OK')
    }
})
