const URL = "https://bcit-backend.miniaturepug.info/comp/4537/labs/6/api/v1"


document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch(`${URL}/languages`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            }
        })
        const data = await response.json()
        console.log(data)
        if (!response.ok) {
            throw new Error(data.message)
        } else {
            const languages = JSON.parse(data.message)
            // Get the select element
            const wordDropdown = document.getElementById("wordDropdown");
            const definitionDropdown = document.getElementById("definitionDropdown");

            // Populate the dropdown with options
            languages.forEach((option) => {
                console.log(option)
                const optionElement = document.createElement("option");
                optionElement.value = option.id;
                optionElement.text = option.language_name;
                wordDropdown.appendChild(optionElement);
                const option2Element = document.createElement("option");
                option2Element.value = option.id;
                option2Element.text = option.language_name;
                definitionDropdown.appendChild(option2Element);
            });
        }
    } catch (error) {
        console.log(error)
    }
});


const form = document.querySelector('form');

form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting as a regular HTML form

    // Get the selected values from the dropdowns
    const selectedWordLanguage = document.getElementById("wordDropdown").value;
    const selectedDefinitionLanguage = document.getElementById("definitionDropdown").value;

    // Get the values from the input fields
    const word = document.getElementById("word").value;
    const definition = document.getElementById("definition").value;
    const serverResponseDiv = document.getElementById('serverResponse');

    // Log the selected values and input values
    console.log("Selected Word Language:", selectedWordLanguage);
    console.log("Selected Definition Language:", selectedDefinitionLanguage);
    console.log("Word:", word);
    console.log("Definition:", definition);
    const reqBody = {
        "word": word,
        "definition": definition,
        "definitionLanguageId": selectedDefinitionLanguage,
        "wordLanguageId": selectedWordLanguage
    }
    let data = ""

    try {
        const response = await fetch(`${URL}/definition`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(reqBody)
        })
        data = await response.json()
        if (!response.ok) {
            throw new Error(JSON.stringify({
                message: data.message,
                status: response.status
            }))
        } else {
            serverResponseDiv.style.backgroundColor = "#4CAF50"
        }
    } catch (error) {
        serverResponseDiv.style.backgroundColor = "#FF5733"
        console.log(error.message);
        try {
            const errorObject = JSON.parse(error.message);
            if (errorObject.status === 409) {
                console.log("Error status is 409");
                const customModal = document.getElementById("customModal");
                const yesButton = document.getElementById("yesButton");
                const noButton = document.getElementById("noButton");
                customModal.style.display = "flex";

                // Handle "Yes" button click
                yesButton.addEventListener("click", async () => {
                    try {
                        data = await updateDefinition(word, definition, selectedWordLanguage, selectedDefinitionLanguage);
                        console.log("here")
                        console.log(data);
                        customModal.style.display = "none";
                        serverResponseDiv.style.backgroundColor = "#4CAF50";
                    } catch (updateError) {
                        serverResponseDiv.style.backgroundColor = "#FF5733";
                        console.error(updateError);
                    } finally {
                        serverResponseDiv.textContent = `Response: ${data.message}`;
                        serverResponseDiv.appendChild(document.createElement("br"));
                        serverResponseDiv.appendChild(document.createTextNode(`Count: ${data.count}`));
                        serverResponseDiv.style.display = "block"
                    }
                });

                // Handle "No" button click
                noButton.addEventListener("click", () => {
                    customModal.style.display = "none";
                });
            }
        } catch (error) {
            serverResponseDiv.style.backgroundColor = "#FF5733"
            console.log(error);
        }

    } finally {
        serverResponseDiv.textContent = `Response: ${data.message}`;
        serverResponseDiv.appendChild(document.createElement("br"));
        serverResponseDiv.appendChild(document.createTextNode(`Count: ${data.count}`));
        serverResponseDiv.style.display = "block"
    }

})


async function updateDefinition(word, definition, wordLanguageId, definitionLanguageId) {
    let data = ""
    const reqBody = {
        "definition": definition,
        "definitionLanguageId": definitionLanguageId,
        "wordLanguageId": wordLanguageId
    }

    try {
        const response = await fetch(`${URL}/definition/${word}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(reqBody)
        })
        data = await response.json()
        if (!response.ok) {
            throw new Error(data.message)
        } else {
            serverResponseDiv.style.backgroundColor = "#4CAF50"
        }
    } finally {
        console.log(data)
        return data
    }
}