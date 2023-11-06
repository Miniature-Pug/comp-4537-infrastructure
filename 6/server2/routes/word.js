// --------- Lib Imports ---------
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
const router      = express.Router()
// -------------------------------


// --------- Routes ---------
router.get("/:word", async (req, res) => {
    const word = req.params.word
    const response = {
        message: ""
    }
    if (!word) {
        response.message = `${ERROR_MESSAGES.missingWordQueryParam}`
        console.error(JSON.stringify(response))
        res.status(400).send(JSON.stringify(response))
        return;
    }
    db.query(DB_QUERIES.findWord, [word], (err, result) => {
        if (err) {
            response.message = `${ERROR_MESSAGES.queryFailure} ${err}`
            console.error(JSON.stringify(response))
            res.status(500).send(JSON.stringify(response))
        } else {
            if (Object.keys(result).length === 0) {
                response.message = `${ERROR_MESSAGES.wordNotFound}`
                res.status(404).send(JSON.stringify(response))
            } else {
                response.message = `${JSON.stringify(result)}`
                res.setHeader('Content-Type', 'text/html');
                res.status(200).send(JSON.stringify(result[0].definition))
            }
            console.log(JSON.stringify(response))
        }
    })
})

router.delete("/:word", async (req, res) => {
    const word = req.params.word;
    const response = {
        message: "",
        count: await (await fetch(URLS.internalCountRequestURL)).text()
    };

    if (!word) {
        response.message = `${ERROR_MESSAGES.missingWordQueryParam}`;
        console.error(JSON.stringify(response));
        res.status(400).send(JSON.stringify(response));
        return;
    }

    db.query(DB_QUERIES.deleteWord, [word], async(err, result) => {
        if (err) {
            response.message = `${ERROR_MESSAGES.queryFailure} ${err}`
            console.error(JSON.stringify(response))
            res.status(500).send(JSON.stringify(response))
        } else if (result.affectedRows === 0) {
            response.message = `${ERROR_MESSAGES.wordNotFound}`
            res.status(404).send(JSON.stringify(response))
        } else {
            response.message = `${SUCCESS_MESSAGES.wordDeleted} ${word}`
            response.count = await (await fetch(URLS.internalCountRequestURL)).text()
            res.status(200).send(JSON.stringify(response))
        }

        console.log(JSON.stringify(response));
    });
});

router.patch("/:word", async (req, res) => {
    const word = req.params.word
    const requestBody = req.body
    const response = {
        message: "",
        count: await (await fetch(URLS.internalCountRequestURL)).text()
    }

    if (!word) {
        response.message = `${ERROR_MESSAGES.missingWordQueryParam}`
        console.error(JSON.stringify(response))
        res.status(400).send(JSON.stringify(response))
        return
    }

    if (!requestBody.definition || !requestBody.definitionLanguageId || !requestBody.wordLanguageId) {
        response.message = `${ERROR_MESSAGES.incompletePatchBody}`
        console.error(JSON.stringify(response))
        res.status(400).send(JSON.stringify(response))
        return
    }

    db.query(DB_QUERIES.partialUpdateWord, [requestBody.definition, requestBody.definitionLanguageId, requestBody.wordLanguageId, word], (err, result) => {
        if (err) {
            response.message = `${ERROR_MESSAGES.queryFailure} ${err}`;
            console.error(JSON.stringify(response));
            res.status(500).send(JSON.stringify(response));
        } else if (result.affectedRows === 0) {
            response.message = `${ERROR_MESSAGES.wordNotFound}`;
            res.status(404).send(JSON.stringify(response));
        } else {
            response.message = `${SUCCESS_MESSAGES.wordUpdated} "${word}: ${requestBody.definition}"`
            res.status(200).send(JSON.stringify(response))
        }

        console.log(JSON.stringify(response))
    });
});

router.post("/", async (req, res) => {
    const requestBody = req.body
    console.log(requestBody)
    const response = {
        message: "",
        count: await (await fetch(URLS.internalCountRequestURL)).text()
    }

    if (!requestBody.word || !requestBody.definition || !requestBody.definitionLanguageId || !requestBody.wordLanguageId) {
        response.message = `${ERROR_MESSAGES.incompleteBody}`
        console.error(JSON.stringify(response))
        res.status(400).send(JSON.stringify(response))
        return
    }

    const word = requestBody.word
    const definition = requestBody.definition
    const wordLanguageId = requestBody.wordLanguageId
    const definitionLanguageId = requestBody.definitionLanguageId

    const wordExists = ((await fetch(`${URLS.getWordRequestURL}/${word}`)).status === 200)
    if (!wordExists) {
        db.query(DB_QUERIES.insertDefinition, [word, definition, wordLanguageId, definitionLanguageId], async(err, result) => {
            if (err) {
                response.message = `${ERROR_MESSAGES.queryFailure} ${err}`
                console.error(JSON.stringify(response))
                res.status(500).send(JSON.stringify(response))
            } else {
                response.message = `${SUCCESS_MESSAGES.definitionCreated} "${word}: ${definition}"`
                response.count = await (await fetch(URLS.internalCountRequestURL)).text()
                res.status(201).send(JSON.stringify(response))
            }
            console.log(JSON.stringify(response))
        })
    } else {
        response.message = `${ERROR_MESSAGES.wordAlreadyExists} ${word}`
        res.status(409).send(JSON.stringify(response))
    }
});
// -------------------------------


module.exports = router