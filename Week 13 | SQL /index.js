const express = require ("express");
const { Pool } = require("pg");
const pool = new Pool({
    connectionString:"***"
})

const app = express();
app.use(express.json());

app.post("/signup", async (req,res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    /* //A VERY BAD WAY TO DO SQL USING PG --- THIS IS VULNERABLE TO SQL INJECTION
    console.log("INSERT INTO users (username, email, password) VALUES ('"+ username +"','"+ password +"','" + email + "')"); */

    /* const response = await pool.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', ${password}) RETURNING id ;`); */

    const response = await pool.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`, [username, email, password]);

    res.json({
        message: "success",
        id: response.rows[0].id
    })
})

app.post("/signin", async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const response = await pool.query (`SELECT * FROM users WHERE email='${email}' AND password='${password}'`);
    console.log(response);
    const userExist = response.rows[0];
    if (!userExist){
        res.status(403).json({
            message : "incorrect creds"
        })
    }else{
        res.json({
            token: "bhdgwuyg"  
        })
    }
})

// app.listen(3000);
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});