const express = require('express') 
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())

const notes = []; //this is inmemory database we will shift to mongodb,postgres etc
const users = [{
    username: "ranit",
    password: "1234"
}];

app.post("/signup", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const userExits = users.find(user => user.username === username);
    if(userExits){
        return res.status(403).json({
            message: "User already exists"
        })
    }
    users.push({
        username,
        password
    })
    res.json({
        message: "you have signed up successfully"
    })
})


app.post("/signin", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const userExits = users.find(user => user.username === username && user.password === password);
    if(!userExits){
        return res.status(403).json({
            message: "Incorrect credentials"
        })
    }

    // json web tokens
    const token = jwt.sign({
        username: username
    },"ranit123")


    res.json({
        message: "you have logged in successfully",
        token : token
    })
})



// POST - Create a note -- AUTHENTICATED ENDPOINT
app.post('/notes', (req, res) => {

    const token = req.headers.token;
    if(!token){
        return res.status(403).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(token,"ranit123");
    const username = decoded.username;

    if(!username){
        res.status(403).json({
            message: "malformed Token"
        })
        return;
    }


    const note = req.body.note;
    notes.push({note, username});
    res.json({
        message: "Done"
    });
})


// GET - get all my notes -- AUTHENTICATED ENDPOINT
app.get('/notes', (req,res)=> {
    const token = req.headers.token;
    if(!token){
        return res.status(403).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(token,"ranit123");
    const username = decoded.username;

    if(!username){
        res.status(403).json({
            message: "malformed Token"
        })
        return;
    }

    const userNotes = notes.filter(note => note.username === username);
    res.json({
        notes: userNotes
    })
})

app.get("/", (req,res) => {
    res.sendFile("/Users/ranitbanik/100xdev/100xWebDev copy/Week 06/NOTES-APP-AUTH/frontend/index.html")
})

app.listen(3000)