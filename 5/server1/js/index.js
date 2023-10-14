const URL = "https://bcit-backend.miniaturepug.info/comp/4537/labs/5/api/v1/sql"

function insert_pre_determined_data() {
    const insert_pre_determined_data = document.getElementById("insert_pre_determined_data")
    const insert = insert_pre_determined_data.querySelector(".insert")
    const textarea = insert_pre_determined_data.querySelector(".response")
    const query = `INSERT INTO patient (name, dateOfBirth) VALUES ("Sara Brown", "1901-01-01"), ("John Smith", "1941-01-01"), ("Jack Ma", "1961-01-30"), ("Elon Musk", "1999-01-01");`
    insert.addEventListener("click", async () => {
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                },
                body: query
            })
            const data = await response.json()
            console.log(data)
            if (!response.ok) {
                throw new Error(data.sqlMessage)
            } else {
                textarea.innerText = JSON.stringify(data)
            }
        } catch (error) {
            textarea.innerText = error
            return
        }
    })
}

function insert_query() {
    const insert_query = document.getElementById("insert_query")
    const submit = insert_query.querySelector(".submit")
    const textarea = insert_query.querySelector(".response")
    submit.addEventListener("click", async () => {
        let query = insert_query.querySelector(".query").value
        let queryType = query.trim().split(" ")[0]
        try {
            let response;
            if (queryType.toUpperCase() === "SELECT") {
                response = await fetch(encodeURI(`${URL}` + "/" + `${query}`), {
                    method: "GET",
                    headers: {
                        "Content-Type": "text/plain",
                        "Access-Control-Allow-Origin": "*"
                    }
                })
            } else if (queryType.toUpperCase() === "INSERT") {
                response = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: query
                })
            } else {
                // Just to showcase that DROP and UPDATE and other things can't be done on this DB by this User
                response = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: query
                })
            }
            const data = await response.json()
            console.log(data)
            if (!response.ok) {
                throw new Error(data.sqlMessage)
            } else {
                textarea.innerText = JSON.stringify(data)
            }
        } catch (error) {
            textarea.innerText = error
            return
        }
    })
}

insert_pre_determined_data()
insert_query()