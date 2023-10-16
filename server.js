const express = require("express");
const app = express();
const cors = require("cors");
const Movie = require("./app/models/movie.model.js");
const path = require('path');

app.use('/', express.static(path.join(__dirname, 'public')));

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile('index.html');
})

/* Movies API: https://rapidapi.com/gox-ai-gox-ai-default/api/ott-details */

require("./app/routes/movie.routes.js")(app);

// set port, listen for requests
const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})