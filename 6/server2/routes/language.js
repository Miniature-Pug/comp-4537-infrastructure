// --------- Lib Imports ---------
const express = require("express")
const db = require("../database")
const {
    DB_QUERIES,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    URLS
} = require("../constants")
const dotenv = require('dotenv').config({
    path: __dirname + '/../env/prod.env'
})
// -------------------------------



// --------- Global Variables ---------
const router = express.Router()
// -------------------------------


// --------- Routes ---------
router.get("/", async (req, res) => {
    const word = req.params.word
    const response = {
        message: ""
    }

    db.query(DB_QUERIES.listAllLanguages, (err, result) => {
        if (err) {
            response.message = `${ERROR_MESSAGES.queryFailure} ${err}`
            console.error(JSON.stringify(response))
            res.status(500).send(JSON.stringify(response))
        } else {
            response.message = `${JSON.stringify(result)}`
            res.status(200).send(JSON.stringify(response))
            console.log(JSON.stringify(response))
        }
    })
})
// -------------------------------


module.exports = router