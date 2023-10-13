function getWordDefinition(word) {
    let xhr = new XMLHttpRequest();

    let url = `https://bcit.nutorus.com/COMP4537/labs/4/api/definitions/?word=${word}`;

    xhr.open("Get", url, true);
    console.log("Sending Request")

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
    xhr.send();
}

function handleButtonClickSearch() {
    let text = document.getElementById("searchInput").value;
    if (text) {
        getWordDefinition(text);
    } else {
        let status = document.getElementById("statusText");
        status.innerHTML = "Word to seach for cannot be empty";
    }
}

let button = document.getElementById("searchButton");
button.addEventListener("click", handleButtonClickSearch)
