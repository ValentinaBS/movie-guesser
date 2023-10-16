const { createApp } = Vue;

const options = {
    data() {
        return {
            allMovies: [],
            displayMovie: {},
            submittedAnswer: "",
            isClueYearShowing: false,
            isClueRatingShowing: false
        }
    },
    created() {
        axios.get('/api/movies')
            .then(res => {
                this.allMovies = res.data;
                this.displayMovie = this.allMovies[0];
            })
            .catch(err => {
                console.error(err);
            });
    },
    methods: {
        checkAnswer() {
            if (this.submittedAnswer.toLowerCase() == this.displayMovie.title.toLowerCase()) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 1800,
                    timerProgressBar: true
                })
                Toast.fire({
                    icon: 'success',
                    text: `Congrats! The movie was ${this.displayMovie.title}.`
                })
                this.nextMovie()
            } else {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 1600,
                    timerProgressBar: true
                })
                Toast.fire({
                    icon: 'error',
                    text: "Incorrect answer. Try again."
                })
            }
        },
        revealClue(clueType) {
            if(clueType == 'year') {
                this.isClueYearShowing = true;
            } 
            if(clueType == 'rating') {
                this.isClueRatingShowing = true;
            }
        },
        nextMovie() {
            // Find the current index of the displayed movie
            const currentIndex = this.allMovies.findIndex(movie => movie.title === this.displayMovie.title);

            if (currentIndex !== -1 && currentIndex < this.allMovies.length - 1) {
                // If the current index is valid and not the last movie in the array
                // Update displayMovie to the next movie
                this.displayMovie = this.allMovies[currentIndex + 1];
                this.submittedAnswer = ""
                this.isClueYearShowing = false;
                this.isClueRatingShowing = false;
            } else {
                this.submitMessage = "You've reached the end of the movie list.";
            }
        },
        previousMovie() {
            const currentIndex = this.allMovies.findIndex(movie => movie.title === this.displayMovie.title);
            if (currentIndex !== -1 && currentIndex != 0) {
                this.displayMovie = this.allMovies[currentIndex - 1];
                this.submittedAnswer = ""
                this.isClueYearShowing = false;
                this.isClueRatingShowing = false;
            } else {
                this.submitMessage = "You've reached the beginning of the movie list.";
            }
        }
    },
}

const app = createApp(options);
app.mount("#app")