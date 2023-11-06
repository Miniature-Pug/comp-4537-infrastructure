// --------- Lib Imports ---------
const express = require("express")
const db = require("../database")
const {
    DB_QUERIES,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES
} = require("../constants")
// -------------------------------



// --------- Global Variables ---------
const router = express.Router()
// -------------------------------


// --------- Routes ---------
router.get("/", (req, res) => {
    res.set({
        "Content-type": "text/plain"
    })
    let response = ""
    db.query(DB_QUERIES.countQuery, (err, result) => {
        if (err) {
            response = err
            console.error(response)
            res.status(500).send(response)
        } else {
            response = result[0].total_entries
            console.log(response)
            res.status(200).send(String(response))
        }
    })
})
// -------------------------------


module.exports = router