const Movie = require("../models/movie.model.js");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Tutorial
    const movie = new Movie({
        imdbid: req.body.imdbid,
        title: req.body.title,
        synopsis: req.body.synopsis,
        released: req.body.released,
        imdbrating: req.body.imdbrating,
    });

    // Save Tutorial in the database
    Movie.create(movie, (err, data) => {
        console.log(movie)
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Movie."
            });
        else res.send(data);
    });
};


// Retrieve all Movies from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;

    Movie.getAll(title, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

// Find a single Movie with a id
exports.findOne = (req, res) => {
    Movie.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Movie with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Movie with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Update a Movie identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    console.log(req.body);

    Movie.updateById(
        req.params.id,
        new Movie(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Movie with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Movie with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Movie with the specified id in the request
exports.delete = (req, res) => {
    Movie.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Movie with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Movie with id " + req.params.id
                });
            }
        } else res.send({ message: `Movie was deleted successfully!` });
    });
};