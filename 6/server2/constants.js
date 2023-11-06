// --------- Lib Imports ---------
const dotenv  = require('dotenv').config({
    path: __dirname + '/env/prod.env'
})
// -------------------------------


// --------- Global Variables ---------
const ENTRIES_TABLE_NAME   = process.env.DB_ENTRIES_TABLE_NAME
const LANGUAGES_TABLE_NAME = process.env.DB_LANGUAGES_TABLE_NAME
const SERVER_PORT          = process.env.SERVER_PORT
const SERVER_PATH          = process.env.SERVER_PATH
// -------------------------------


// --------- Global Strings ---------
// common queries
const DB_QUERIES = {
    createLanguagesTable: `CREATE TABLE IF NOT EXISTS ${LANGUAGES_TABLE_NAME} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        language_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        UNIQUE (language_name)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;`,
    createEntriesTable: `CREATE TABLE IF NOT EXISTS ${ENTRIES_TABLE_NAME} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        word VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        definition TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        definition_language_id INT,
        word_language_id INT,
        CONSTRAINT fk_definition_language_id
            FOREIGN KEY (definition_language_id)
            REFERENCES languages(id),
        CONSTRAINT fk_word_language_id
            FOREIGN KEY (word_language_id)
            REFERENCES languages(id),
        UNIQUE (word)
        ) ENGINE=InnoDB;`,
    insertLanguages: `INSERT INTO ${LANGUAGES_TABLE_NAME} (language_name) VALUES (?);`,
    findWord: `SELECT * FROM ${ENTRIES_TABLE_NAME} WHERE word = ?;`,
    deleteWord: `DELETE FROM ${ENTRIES_TABLE_NAME} WHERE word = ?;`,
    countQuery: `SELECT COUNT(*) AS total_entries FROM ${ENTRIES_TABLE_NAME};`,
    partialUpdateWord: `UPDATE ${ENTRIES_TABLE_NAME} SET definition = ?, word_language_id = ?, definition_language_id = ? WHERE word = ?;`,
    insertDefinition: `INSERT INTO ${ENTRIES_TABLE_NAME} (word, definition, word_language_id, definition_language_id) VALUES (?, ?, ?, ?);`,
    listAllLanguages: `SELECT id, language_name FROM ${LANGUAGES_TABLE_NAME};`
}

// success strings
const SUCCESS_MESSAGES = {
    querySuccess: "Query completed successfully:",
    dbSuccess: "Successfull DB Connection:",
    tableSuccess: "Table Created succesfully:",
    serverCreationSuccess: "Server is running on port:",
    wordDeleted: "Word deleted successfully- ",
    wordUpdated: "Word updated successfully- ",
    definitionCreated: "Definition created successfully- "
}

// failure strings
const ERROR_MESSAGES = {
    queryFailure: "Can't complete query:",
    mySQLFailure: "Error connecting to MySql:",
    dbFailure: "Can't connect to DB:",
    tableFailure: "Can't create Table:",
    connectionEndFailure: "Can't end db instance connection:",
    missingWordQueryParam: "The 'word' query parameter is missing.",
    missingDefinition: "The 'definition' parameter is missing.",
    incompleteBody: "Your POST request should have the following JSON keys: word, definition, wordLanguageId, definitionLanguageId. Please check your request.",
    wordNotFound: "Word not found in the database.",
    wordAlreadyExists: "Word already exists in the DB-",
    incompletePatchBody: "Your PATCH request should have the following JSON keys: definition, wordLanguageId, definitionLanguageId. Please check your request."
}

// urls
const URLS = {
    internalCountRequestURL: `http://localhost:${SERVER_PORT}${SERVER_PATH}/api/v1/definitions/count`,
    getWordRequestURL: `http://localhost:${SERVER_PORT}${SERVER_PATH}/api/v1/definition`
}
// -------------------------------


module.exports = {
    DB_QUERIES,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    URLS
};
