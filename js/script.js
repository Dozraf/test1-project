const API = "https://6a3e47890443193a1a0baf34.mockapi.io/movies";

const list = document.querySelector(".promo__interactive-list");
const form = document.querySelector(".add");
const input = document.querySelector(".adding__input");

function showMovies() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            list.innerHTML = "";

            data.forEach(movie => {
                list.innerHTML += `
                    <li class="promo__interactive-item">
                        ${movie.title}
                        <div class="delete" onclick="deleteMovie('${movie.id}')"></div>
                    </li>
                `;
            });
        });
}

showMovies();

form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (input.value === "") return;

    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: input.value
        })
    }).then(() => {
        input.value = "";
        showMovies();
    });
});

function deleteMovie(id) {
    fetch(API + "/" + id, {
        method: "DELETE"
    }).then(() => {
        showMovies();
    });
}