//METHOD1
function main() {
    fetch("https://randomuser.me/api/") //fetch returns a promise
        .then(async response => {
            const json = await response.json(); //returms json
            console.log(json);
        })
}

//METHOD2
function main() {
    fetch("https://randomuser.me/api/")
        .then(response => response.json())
        .then(json => {
            console.log(json);
        })
        .catch(err => {
            console.error(err);
        });
}

//METHOD 3
function main(){
    fetch("https://randomuser.me/api/")
        .then(res => res.json())
        .then(console.log)
        .catch(console.error);
}

//METHOD 4
async function main() {
    try {
        const response = await fetch("https://randomuser.me/api/")
        const json = await response.json()
        console.log(json.results[0].gender);
    } catch (err) {
        console.error(err);
    }
}
main()