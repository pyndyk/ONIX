'use strict'
const express = require('express')
const app = express()
const WebSocket = require('ws');
const fetch = require("cross-fetch")
const port = 3000
    // GET method 
app.get("/rates", async function(request, response) {
    let currency = request.query.currency
    let y = 0
    await fetch('https://api.coincap.io/v2/assets')
        .then((result) => {
            return result.text()
        })
        .then(function(res) {
            return JSON.parse(res).data
        })
        .then(function(data) {
            for (var key in data) {
                if (data[key].id == currency) {
                    y = 1
                    break
                }
            }
            if (y == 1) {
                const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=' + `${currency}`)
                pricesWs.onmessage = function(msg) {
                    let line = '{"usd":' + msg.data.split(':')[1]
                    response.end(line);
                }
            } else {
                response.status(404).end("Error?,there is no such cryptocurrency")
            }
        })
})

//port listening
async function startApp() {
    try {
        app.listen(port, function() {
            return console.log("Server listens http://");
        });
    } catch (e) {}
}
startApp()