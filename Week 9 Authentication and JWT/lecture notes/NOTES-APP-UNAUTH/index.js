const express = require ("express")
const path = require("path")
const app = express()

app.use(express.json())

const notes = [] // This is bad -- eventually we'll learn about databases (mongodb, postgres, mysql)

// POST - Create a note
app.post("/notes" , function(req,res){
    const note = req.body.notes
    notes.push(note)

    res.json({
        message: "Done!"
    })
})

// GET - get all my notes 
app.get('/notes' , function(req,res){
    res.send({
        notes
    })
})

app.get("/" , function(req,res){
    res.sendFile(path.join(__dirname, "frontend/index.html"))
})

app.listen(3000)