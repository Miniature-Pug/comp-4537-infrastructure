function setWordDefinition(word, definition) {
    let xhr = new XMLHttpRequest();

    let url = `https://bcit.nutorus.com/COMP4537/labs/4/api/definitions/`;

    xhr.open("Post", url, true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    let requestData = `word=${word}&definition=${definition}`;

    // Callback function to handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let responseData = xhr.responseText.toString();
            let status = document.getElementById("statusText");
            if (xhr.status == 200 || xhr.status == 400) {
                console.log('API Response:', responseData);
                status.innerHTML = responseData;
            } else {
                console.error('API Response:', xhr);
                status.innerHTML = responseData;
            }
        }
    };
    xhr.send(requestData);
}

function handleButtonClickSubmit() {
    let word = document.getElementById("word").value;
    let definition = document.getElementById("definition").value;
    if (word && definition) {
        setWordDefinition(word, definition);
    } else {
        let status = document.getElementById("statusText");
        status.innerHTML = "Word and Definition cannot be empty";
    }
}

let button = document.getElementById("submitButton");
button.addEventListener("click", handleButtonClickSubmit)
