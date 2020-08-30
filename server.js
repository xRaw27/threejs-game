const express = require("express")
const bodyParser = require("body-parser")
const path = require('path')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('static'))

let data = []
let levelData

app.post("/save", (req, res) => {
    data.push({
        size: parseInt(req.body.size),
        level: JSON.parse(req.body.level)
    })
    console.log(data)
})

app.post("/get", (req, res) => {
    res.json(data)
    res.end()
})

app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/game.html"))
})

app.post("/saveLevelData", (req, res) => {
    levelData = data[data.length - 1]
    res.end()
})

app.post("/getLevelData", (req, res) => {
    res.json(levelData)
    res.end()
})

app.listen(3000, function () {
    console.log("OK")
})