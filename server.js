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
app.get("/loadDatabase", (req, res) => {
    const url = 'https://ott-details.p.rapidapi.com/advancedsearch?start_year=2000&end_year=2019&type=movie';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3598a21010msh1a0b59ecd6cfeddp1cf67cjsn47dacbf102d4',
            'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
        }
    };
    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            console.log(data.results);

            //createMoviesInDatabase(data.results);
        })

    res.send({ message: "Welcome to movies application." });
});

function createMoviesInDatabase(movies) {
    movies.forEach(movie => {
        const newMovie = new Movie({
            imdbid: movie.imdbid,
            title: movie.title,
            synopsis: movie.synopsis,
            released: movie.released,
            imdbrating: movie.imdbrating,
        });

        Movie.create(newMovie, (err, data) => {
            if (err) {
                console.log("Error creating movie:", err);
            } else {
                console.log("Movie created:", data);
            }
        });
    });
}

require("./app/routes/movie.routes.js")(app);

// set port, listen for requests
const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})