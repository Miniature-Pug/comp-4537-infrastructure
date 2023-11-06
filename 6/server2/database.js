// --------- Lib Imports ---------
const mysql   = require("mysql2")
const dotenv  = require('dotenv').config({
    path: __dirname + '/env/prod.env'
})

// constants
const { DB_QUERIES, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('./constants.js');
// -------------------------------


// --------- Global Variables ---------
const DATABASE      = process.env.DB_NAME
const DB_PORT       = process.env.DB_PORT
const USER          = process.env.DB_USER
const PASSWORD      = process.env.DB_PASSWORD
const INIT_USER     = process.env.DB_INIT_USER
const INIT_PASSWORD = process.env.DB_INIT_PASSWORD
const HOST          = process.env.DB_HOST
const LANGUAGES     = process.env.LANGUAGES.split(',')
const ENTRIES_TABLE_NAME   = process.env.DB_ENTRIES_TABLE_NAME
const LANGUAGES_TABLE_NAME = process.env.DB_LANGUAGES_TABLE_NAME
// -------------------------------


// --------- Types of connections ---------
const init = mysql.createConnection({
    host: HOST,
    user: INIT_USER,
    password: INIT_PASSWORD,
    port: DB_PORT,
    database: DATABASE
})

const user = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    port: DB_PORT,
    database: DATABASE
})
// -------------------------------


init.connect((err) => {
    if (err) {
        console.log(`${ERROR_MESSAGES.mySQLFailure} ${err}`)
        return
    } else {
        init.query(`USE ${DATABASE}`, (err, result) => {
            if (err) {
                console.error(`${ERROR_MESSAGES.dbFailure} ${err}`)
                return
            } else {
                console.log(`${SUCCESS_MESSAGES.dbSuccess} ${result}`)
            }
        })
        init.query(DB_QUERIES.createLanguagesTable, (err, result) => {
            if (err) {
                console.error(`${ERROR_MESSAGES.tableFailure} ${err}`)
                return
            } else {
                console.log(`${SUCCESS_MESSAGES.tableSuccess} ${result}`)
            }
        })
        init.query(DB_QUERIES.createEntriesTable, (err, result) => {
            if (err) {
                console.error(`${ERROR_MESSAGES.tableFailure} ${err}`)
                return
            } else {
                console.log(`${SUCCESS_MESSAGES.tableSuccess} ${result}`)
            }
        })
        for (const language of LANGUAGES) {
            init.query(DB_QUERIES.insertLanguages, [String(language).trim()], (err, result) => {
                if (err) {
                    console.error(`${ERROR_MESSAGES.queryFailure} ${err}`)
                    return
                } else {
                    console.log(`${SUCCESS_MESSAGES.querySuccess} ${result}`)
                }
            })
        }
        init.end((err) => {
                if (err) {
                    console.error(`${ERROR_MESSAGES.connectionEndFailure} ${err}`)
                    return
                } else {
                    user.connect((err) => {
                        if (err) {
                            console.log(`${ERROR_MESSAGES.mySQLFailure} ${err}`)
                            return
                        }
                    })
                }
            })
    }
})

module.exports = user
