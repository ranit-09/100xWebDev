const axios = require("axios");

//GET : fetch
async function main() {
    const response = await fetch("https://randomuser.me/api/")
    const json = await response.json()
    console.log(json.results[0].gender)
}
//GET: axios
async function main() {
    const response = await axios("https://randomuser.me/api/")
    console.log(response.data)

}

//POST : fetch
async function main() {
    const response = await fetch("https://www.postb.in/1774030638721-3418914624489",
        {
            method: "POST",
            body: {
                username: "ranit",
                password: "12345"
            },
            headers: {
                "Authorization": "Bearer 123"
            }
        },
    );
    const textualData = await response.text(); //returns text
    console.log(textualData);
}


//POST : axios 
async function mainnn() {
    const response = await axios.post("https://www.postb.in/1774030638721-3418914624489", {
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






mainnn()