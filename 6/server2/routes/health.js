// --------- Lib Imports ---------
const express = require("express")
// -------------------------------



// --------- Global Variables ---------
const router = express.Router()
// -------------------------------


// --------- Routes ---------
router.get("/", (req, res) => {
    res.set({
        "Content-type": "text/plain"
    })
    res.status(200).send("OK")
})
// -------------------------------


module.exports = router