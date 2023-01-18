const express = require("express");

const app = express();

const port = 3000;

const bodyParser = reqire("body-parser");

app.use(bodyParser.json()); //this looks for incoming data

app.get("/", (req, res) => {
    res.send("hello bruh, this is your own pocket dimension!");
});

app.post('/login', (req, res) =>{
    const loginuser = req.body.userName;
    console.log('Login username:'+loginuser);
    res.send('Hello'+loginuser);
})

app.listen(port, () => {
    console.log("listening");
});

app.post('login username')