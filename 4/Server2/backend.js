let http = require('http');
let url = require("url");
let qs = require("querystring")
const PORT = 8081;


const word_to_definition = {};
let requests_count = 0;

http.createServer(function (request, response) {
    let parsed_url = url.parse(request.url, true)
    requests_count = requests_count + 1;
    if (request.method === "GET") {
        if (parsed_url.pathname === "/health") {
            response.writeHead(200, {
                'Content-type': 'text/plain'
            });
            response.end('OK');
        } else if (parsed_url.pathname.includes("/api/definitions")) {
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Access-Control-Allow-Origin', '*');
            const word = parsed_url.query['word'];
            if (word in word_to_definition) {
                const result = {
                    definition: word_to_definition[word],
                    num_requests: requests_count
                };
                response.statusCode = 200;
                response.end(JSON.stringify(result));
            } else {
                const result = {
                    message: `${word} does not have an existing definition`,
                    num_requests: requests_count
                };
                response.statusCode = 400;
                response.end(JSON.stringify(result));
            }
        }
    } else if (request.method === "POST" && parsed_url.pathname.includes("/api/definitions")) {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Access-Control-Allow-Origin', '*');
            const parsed_body = qs.parse(body);
            if (parsed_body["word"] && parsed_body["definition"]) {
                if (!(parsed_body["word"] in word_to_definition)) {
                    word_to_definition[parsed_body["word"]] = parsed_body["definition"]
                    const result = {
                        message: `New definition saved for word "${parsed_body['word']}" with the definition "${parsed_body['definition']}".`,
                        numberOfDefinitions: Object.keys(word_to_definition).length,
                        num_requests: requests_count,
                    };
                    response.statusCode = 200;
                    response.end(JSON.stringify(result));
                } else {
                    const result = {
                        message: 'Definition already exists for this word',
                        num_requests: requests_count
                    };
                    response.statusCode = 400;
                    response.end(JSON.stringify(result));
                }
            } else {
                const result = {
                    message: 'Missing "definition" or "word" parameter in POST body',
                    num_requests: requests_count
                };
                response.statusCode = 400;
                response.end(JSON.stringify(result));
            }
        });
    }
}).listen(PORT);

console.log(`Listening on port ${PORT}...`)