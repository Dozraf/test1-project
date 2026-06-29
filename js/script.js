const API = "https://6a3e47890443193a1a0baf34.mockapi.io/movies";

const list = document.querySelector(".promo__interactive-list");
const form = document.querySelector(".add");
const input = document.querySelector(".adding__input");
const search = document.querySelector(".search");
const genres = document.querySelector("#genres");

let movies = [];
let currentGenre = "all";
let currentSearch = "";

loadMovies();

function loadMovies() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            movies = data;
            createGenres();
            showMovies();
        });
}

function showMovies() {

    list.innerHTML = "";

    let arr = movies.filter(movie => {

        const genre =
            currentGenre === "all" ||
            (movie.genre && movie.genre === currentGenre);

        const searchText =
            movie.title.toLowerCase().includes(currentSearch.toLowerCase());

        return genre && searchText;
    });

    arr.forEach(movie => {

        list.innerHTML += `
            <li class="promo__interactive-item">
                ${movie.title}
                <div class="delete" data-id="${movie.id}"></div>
            </li>
        `;
    });

    document.querySelectorAll(".delete").forEach(btn => {

        btn.onclick = function () {
            deleteMovie(this.dataset.id);
        };

    });

}

function createGenres() {

    genres.innerHTML =
        `<li><a href="#" class="promo__menu-item promo__menu-item_active" data-genre="all">Все</a></li>`;

    const uniqueGenres = [];

    movies.forEach(movie => {

        if (movie.genre && !uniqueGenres.includes(movie.genre)) {
            uniqueGenres.push(movie.genre);
        }

    });

    uniqueGenres.forEach(genre => {

        genres.innerHTML += `
            <li>
                <a href="#" class="promo__menu-item" data-genre="${genre}">
                    ${genre}
                </a>
            </li>
        `;

    });

    document.querySelectorAll(".promo__menu-item").forEach(item => {

        item.onclick = function(e) {

            e.preventDefault();

            document.querySelectorAll(".promo__menu-item").forEach(el =>
                el.classList.remove("promo__menu-item_active")
            );

            this.classList.add("promo__menu-item_active");

            currentGenre = this.dataset.genre;

            showMovies();

        };

    });

}

search.addEventListener("input", function () {

    currentSearch = this.value;

    showMovies();

});

form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (input.value.trim() === "") return;

    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: input.value,
            genre: "Без жанра"
        })
    })
        .then(() => {
            input.value = "";
            loadMovies();
        });

});

function deleteMovie(id) {

    fetch(API + "/" + id, {
        method: "DELETE"
    })
        .then(() => loadMovies());

}