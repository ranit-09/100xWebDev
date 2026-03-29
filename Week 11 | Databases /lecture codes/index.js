const express = require("express");
const { authMiddleware } = require("./middleware");
const jwt = require("jsonwebtoken");
const { todoModel, userModel } = require("./models");

const app = express()
app.use(express.json());


app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
        username: username,
        password: password
    });
    if (existingUser) {
        res.status(403).json({
            message: "User with this username already exists"
        })
        return 
    }
   
    const newUser = await userModel.create({
        username: username,
        password: password
    })
    res.json({
        id: newUser._id
    })
})


app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    });
    if (!userExists) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

    const token = jwt.sign({
        userId: userExists.id
    }, "secret123123");

    res.json({
        token
    })
})

//TODO: Finish all the endpoints from here, migrate them from in memory to mongodb
app.post("/todo", authMiddleware, (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;

    TODOS.push({
        id: CURRENT_TODO_ID++,
        title: title,
        description: description,
        userId: userId
    })
    res.json({
        message: "Todo made"
    })
})

// harkirats id might send a request to delete mark zuckerbergs todo id.
app.delete("/todo/:todoId", authMiddleware, (req, res) => {
    const userId = req.userId;
    const todoId = parseInt(req.params.todoId); /// string

    const doesUserOwnTodo = TODOS.find(t => t.id === todoId && t.userId === userId);

    if (doesUserOwnTodo) {
        TODOS = TODOS.filter(t => t.id === todoId);
        res.json({
            message: "Deleted"
        })
    } else {
        res.status(411).json({
            message: "Either todo doesnt exist or this is not your todo"
        })
    }
})

app.get("/todos", authMiddleware, (req, res) => {
    const userId = req.userId;
    const userTodos = TODOS.filter(t => t.userId === userId);
    res.json({
        todos: userTodos
    })
})

app.listen(3000);