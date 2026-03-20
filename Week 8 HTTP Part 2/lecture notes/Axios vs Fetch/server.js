const axios = require("axios");

//POST
//change request method
//send body 
//send headers
async function main() {
    const response = await axios.post(
        "https://httpdump.app/dumps/8a084988-fa82-4f83-8198-be0c5aa22797", {
        username: "ranit",
        password: "12345"
    },
    {
        headers: {
            Authorization: "Bearer 123"
        },
    },
    )
    console.log(response.data)
}


//GET
//send header
//in get request we cant sent body

async function mainn() {
    //request config
    const response = await axios.get(
        "https://httpdump.app/dumps/8a084988-fa82-4f83-8198-be0c5aa22797?a=b", 
    {
        headers: {
            Authorization: "Bearer 123"
        },
    },
    )
    console.log(response.data)
}

//METHOD2 FOR POST REQUEST
async function main() {
    const response = await axios(
    {   
        url: "https://httpdump.app/dumps/8a084988-fa82-4f83-8198-be0c5aa22797",
        method: "POST",
        headers: {
            Authorization: "Bearer 123"
        },
        data: {
            username: "ranit",
            password: "12345"
        },
    },
    )
    console.log(response.data)
}
mainn()