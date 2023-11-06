const URL = "https://bcit-backend.miniaturepug.info/comp/4537/labs/6/api/v1"

document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector("form");
    var deleteButton = document.getElementById("deleteButton");
    const searchWordInput = document.getElementById("searchWord");
    const serverResponseDiv = document.getElementById('serverResponse');

    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        let data = ""
        const searchWord = searchWordInput.value;
        console.log("Search Word:", searchWord);

        try {
            const response = await fetch(`${URL}/definition/${searchWord}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                }
            })
            data = await response.json()
            if (!response.ok) {
                throw new Error(data.message)
            } else {
                serverResponseDiv.style.backgroundColor = "#4CAF50"
                console.log(data)
                serverResponseDiv.innerHTML = data;
            }
        } catch (error) {
            console.log(error)
            serverResponseDiv.style.backgroundColor = "#FF5733"
            serverResponseDiv.textContent = `Response: ${data.message}`;
            return
        } finally {
            serverResponseDiv.style.display = "block"
        }
    })

    deleteButton.addEventListener("click", async function () {
        // Get the value from the "searchWord" input field
        var searchWord = searchWordInput.value;
        console.log("Search Word:", searchWord);
        let data = ""
        try {
            const response = await fetch(`${URL}/definition/${searchWord}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                }
            })
            data = await response.json()
            if (!response.ok) {
                throw new Error(data.message)
            } else {
                serverResponseDiv.style.backgroundColor = "#4CAF50"
                console.log(data)
            }
        } catch (error) {
            console.log(error)
            serverResponseDiv.style.backgroundColor = "#FF5733"
            return
        } finally {
            serverResponseDiv.textContent = `Response: ${data.message}`;
            serverResponseDiv.appendChild(document.createElement("br"));
            serverResponseDiv.appendChild(document.createTextNode(`Count: ${data.count}`));
            serverResponseDiv.style.display = "block"
        }
    });
});