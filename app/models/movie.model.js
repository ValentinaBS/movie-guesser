const sql = require("./db.js");

// constructor
const Movie = function (movie) {
    this.imdbid = movie.imdbid;
    this.title = movie.title;
    this.synopsis = movie.synopsis;
    this.released = movie.released;
    this.imdbrating = movie.imdbrating
};

Movie.create = (newMovie, result) => {
    sql.query("INSERT INTO movies SET ?", newMovie, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created movie: ", { imdbid: res.insertId, ...newMovie });
        result(null, { imdbid: res.insertId, ...newMovie });
    });
};

Movie.findById = (imdbid, result) => {
    sql.query(`SELECT * FROM movies WHERE imdbid = ${imdbid}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found Movie: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Movie with the id
        result({ kind: "not_found" }, null);
    });
};

Movie.getAll = (title, result) => {
    let query = "SELECT * FROM movies";

    if (title) {
        query += ` WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("movies: ", res);
        result(null, res);
    });
};

Movie.updateById = (imdbid, movie, result) => {
    sql.query(
        "UPDATE movies SET title = ?, synopsis = ?, released = ?, imdbrating = ? WHERE imdbid = ?",
        [movie.title, movie.synopsis, movie.released, movie.imdbrating, imdbid],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Movie with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated Movie: ", { id: imdbid, ...movie });
            result(null, { id: imdbid, ...movie });
        }
    );
};

Movie.remove = (imdbid, result) => {
    sql.query("DELETE FROM movies WHERE imdbid = ?", imdbid, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // Not found Movie with the id
            return result({ kind: "not_found" }, null);
        }

        console.log("Deleted Movie with id: ", imdbid);
        return result(null, res);
    });
};

module.exports = Movie;