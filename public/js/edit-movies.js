const { createApp } = Vue;

const options = {
    data() {
        return {
            allMovies: [],
            imdbidInput: "",
            titleInput: "",
            releasedInput: "",
            imdbratingInput: null,
            synopsisInput: "",
            errorMessage: "",
            editingMovie: {},
        }
    },
    created() {
        axios.get('/api/movies')
            .then(res => {
                this.allMovies = res.data;
            })
            .catch(err => {
                console.error(err);
            });
    },
    methods: {
        addMovie() {

            if(isNaN(this.imdbratingInput) && this.imdbratingInput != null) {
                this.errorMessage = "Please enter a numeric amount with the next format: 8.4";
                return
            }
            this.errorMessage = "";

            axios.post('/api/movies', {
                imdbid: this.imdbidInput,
                title: this.titleInput,
                synopsis: this.synopsisInput,
                released: this.releasedInput,
                imdbrating: this.imdbratingInput
            })
                .then(res => {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `${this.titleInput} has been added successfully!`,
                        showConfirmButton: true,
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'btn primary-btn btn-lg',
                        }
                    })
                    document.location.reload()
                })
                .catch(err => {
                    console.error(err);
                });
        },
        editMovie(movieId) {
            this.errorMessage = "";
            this.editingMovie = this.allMovies.find(movie => movie.imdbid == movieId)
        },
        confirmEditMovie() {
            if(isNaN(this.editingMovie.imdbrating) && this.editingMovie.imdbrating != null) {
                this.errorMessage = "Please enter a numeric amount with the next format: 8.4";
                return
            }
            this.errorMessage = "";

            axios.put(`/api/movies/${this.editingMovie.imdbid}`, this.editingMovie)
            .then(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `${this.editingMovie.title} has been updated successfully!`,
                    showConfirmButton: true,
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'btn primary-btn btn-lg',
                    }
                }).then(result => {
                    if (result.isConfirmed) {
                        document.location.reload()
                    }
                })
            })
            .catch(error => {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            })
        },
        deleteMovie(movieId, movieTitle) {
            Swal.fire({
                title: `Are you sure you want to delete ${movieTitle}?`,
                icon: 'info',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn primary-btn btn-lg ms-2 mb-3 mb-md-0',
                    cancelButton: 'btn secondary-btn btn-lg me-md-5 mb-3 mt-md-2 my-md-2'
                },
                showCancelButton: true,
                confirmButtonText: 'Yes, delete this movie',
                cancelButtonText: 'Cancel',
                reverseButtons: true
            }).then(result => {
                if (result.isConfirmed) {
                    axios.delete(`/api/movies/${movieId}`)
                        .then(() => {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: `${movieTitle} has been removed successfully!`,
                                showConfirmButton: true,
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: 'btn primary-btn btn-lg',
                                }
                            }).then(result => {
                                if (result.isConfirmed) {
                                    document.location.reload()
                                }
                            })
                        })
                        .catch(error => {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        })
                }
            })
        }
    },
}

const app = createApp(options);
app.mount("#app")