// --------- Lib Imports ---------
const express = require("express")
const mysql = require("mysql2")
const http = require("http")
const url = require("url")
const dotenv = require('dotenv').config({
    path: __dirname + '/env/prod.env'
})

// constants
const {
    DB_QUERIES,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES
} = require('./constants.js');
// -------------------------------


// --------- Global Variables ---------
const SERVER_PORT = process.env.SERVER_PORT
const SERVER_PATH = process.env.SERVER_PATH
const db = require("./database")
const app = express()
const healthRouter = require("./routes/health")
const wordRouter = require("./routes/word")
const countRouter = require("./routes/count")
const languageRouter = require("./routes/language")
// -------------------------------


// --------- Server ---------
try {
    app.listen(SERVER_PORT, () => {
        console.log(`${SUCCESS_MESSAGES.serverCreationSuccess} ${SERVER_PORT}`);
    });
} catch (error) {
    console.error(`Error starting the server: ${error}`);
}
// -------------------------------


// --------- Routes ---------
app.use(express.json());
app.set("view engine", "ejs")
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ["*"]);
    res.append('Access-Control-Allow-Methods', "OPTIONS, GET, POST, PATCH, DELETE");
    res.append('Access-Control-Allow-Headers', "Content-Type, Access-Control-Allow-Origin");
    next();
});
app.use("/health", healthRouter)
app.use(`${SERVER_PATH}/health`, healthRouter)
app.use(`${SERVER_PATH}/api/v1/definition`, wordRouter)
app.use(`${SERVER_PATH}/api/v1/definitions/count`, countRouter)
app.use(`${SERVER_PATH}/api/v1/languages`, languageRouter)
// -------------------------------