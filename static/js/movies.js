let selectedLanguageId = null;
let selectedGenreId = null;

const genreModal =
    document.getElementById(
        "genreModal"
    );

function getCookie(name){

    let cookieValue = null;

    if(
        document.cookie &&
        document.cookie !== ''
    ){

        const cookies =
            document.cookie.split(';');

        for(
            let i = 0;
            i < cookies.length;
            i++
        ){

            const cookie =
                cookies[i].trim();

            if(
                cookie.substring(
                    0,
                    name.length + 1
                ) === (name + '=')
            ){

                cookieValue =
                    decodeURIComponent(
                        cookie.substring(
                            name.length + 1
                        )
                    );

                break;

            }

        }

    }

    return cookieValue;

}

const languageModal =
    document.getElementById(
        "languageModal"
    );

document
.getElementById(
    "openLanguageModal"
)
.onclick = function(){

    selectedLanguageId = null;

    document
    .getElementById(
        "languageName"
    ).value = "";

    document
    .getElementById(
        "languageStatus"
    ).value = "active";

    languageModal.style.display =
        "flex";

};
document
.getElementById(
    "closeLanguageModal"
)
.onclick = function(){

    languageModal.style.display =
        "none";

};

document
.getElementById(
    "saveLanguage"
)
.addEventListener(
    "click",
    async function(){

        const name =
            document.getElementById(
                "languageName"
            ).value;

        const status =
            document.getElementById(
                "languageStatus"
            ).value;

        const url = selectedLanguageId

            ?

            `/api/theatre/api/languages/update/${selectedLanguageId}/`

            :

            "/api/theatre/api/languages/add/";

        const method = selectedLanguageId

            ?

            "PUT"

            :

            "POST";

        const response =
            await fetch(
                url,
                {

                    method:method,

                    credentials:"same-origin",

                    headers:{
                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            )
                    },

                    body:JSON.stringify({

                        name:name,

                        status:status

                    })

                }
            );

        if(response.ok){

            alert(

                selectedLanguageId

                ?

                "Language Updated"

                :

                "Language Added"

            );

            languageModal.style.display =
                "none";

            selectedLanguageId = null;

            document
            .getElementById(
                "languageName"
            ).value = "";

            loadLanguages();

        }

    }
);
async function loadLanguages(){

    const response =
        await fetch(
            "/api/theatre/api/languages/"
        );

    const languages =
        await response.json();

    const container =
        document.getElementById(
            "languageContainer"
        );

    container.innerHTML = "";

    languages.forEach(language => {

        container.innerHTML += `

<div
    class="language-card"

    data-id="${language.id}"

    data-name="${language.name}"

    data-status="${language.status}"
>

    <h4>
        ${language.name}
    </h4>

    <p>
        ${language.status}
    </p>

    <div
        class="language-actions"
    >

        <button
            class="edit-language-btn"
        >
            ✏
        </button>

        <button
            class="delete-language-btn"
        >
            🗑
        </button>

    </div>

</div>

`;

    });


document
.querySelectorAll(
    ".edit-language-btn"
)
.forEach(btn => {

    btn.addEventListener(
        "click",
        function(){

            const card =
                this.closest(
                    ".language-card"
                );

            selectedLanguageId =
                card.dataset.id;

            document
            .getElementById(
                "languageName"
            ).value =
                card.dataset.name;

            document
            .getElementById(
                "languageStatus"
            ).value =
                card.dataset.status;

            languageModal.style.display =
                "flex";

        }
    );

});
document
.querySelectorAll(
    ".delete-language-btn"
)
.forEach(btn => {

    btn.addEventListener(
        "click",
        async function(){

            const card =
                this.closest(
                    ".language-card"
                );

            const id =
                card.dataset.id;

            if(
                !confirm(
                    "Delete Language?"
                )
            ){
                return;
            }

            const response =
                await fetch(
                    `/api/theatre/api/languages/delete/${id}/`,
                    {

                        method:"DELETE",

                        headers:{
                            "X-CSRFToken":
                                getCookie(
                                    "csrftoken"
                                )
                        }

                    }
                );

            if(response.ok){

                loadLanguages();

            }

        }
    );

});

}

loadLanguages();

document
.getElementById(
    "openGenreModal"
)
.onclick = function(){

    selectedGenreId = null;

    document
    .getElementById(
        "genreName"
    ).value = "";

    genreModal.style.display =
        "flex";

};

document
.getElementById(
    "closeGenreModal"
)
.onclick = function(){

    genreModal.style.display =
        "none";

};

document
.getElementById(
    "saveGenre"
)
.addEventListener(
    "click",
    async function(){

        const name =
            document.getElementById(
                "genreName"
            ).value;

        const status =
            document.getElementById(
                "genreStatus"
            ).value;

        const url = selectedGenreId

            ?

            `/api/theatre/api/genres/update/${selectedGenreId}/`

            :

            "/api/theatre/api/genres/add/";

        const method = selectedGenreId

            ?

            "PUT"

            :

            "POST";

        const response =
            await fetch(
                url,
                {

                    method:method,
                    credentials:"same-origin",
                    headers:{
                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            )
                    },

                    body:JSON.stringify({

                        name:name,

                        status:status

                    })

                }
            );

        if(response.ok){

            genreModal.style.display =
                "none";

            loadGenres();

        }

    }
);
async function loadGenres(){

    const response =
        await fetch(
            "/api/theatre/api/genres/"
        );

    const genres =
        await response.json();

    const container =
        document.getElementById(
            "genreContainer"
        );

    container.innerHTML = "";

    genres.forEach(genre => {

        container.innerHTML += `

        <div
            class="language-card"
            data-id="${genre.id}"
            data-name="${genre.name}"
            data-status="${genre.status}"
        >

            <h4>
                ${genre.name}
            </h4>

            <p>
                ${genre.status}
            </p>

        </div>

        `;

    });

}
loadGenres();

document
.getElementById(
    "addCastRow"
)
.addEventListener(
    "click",
    function(){

        const container =
            document.getElementById(
                "castContainer"
            );

        container.innerHTML += `

        <div
            class="cast-row"
        >

            <input
                type="text"
                class="actor-name"
                placeholder="Actor Name"
            >

            <input
                type="text"
                class="character-name"
                placeholder="Character Name"
            >

            <input
                type="file"
                class="actor-image"
            >

            <button
                type="button"
                class="remove-row"
            >
                ✖
            </button>

        </div>

        `;

    }
);

document
.getElementById(
    "addCrewRow"
)
.addEventListener(
    "click",
    function(){

        const container =
            document.getElementById(
                "crewContainer"
            );

        container.innerHTML += `

        <div
            class="crew-row"
        >

            <input
                type="text"
                class="crew-name"
                placeholder="Name"
            >

            <input
                type="text"
                class="crew-role"
                placeholder="Role"
            >

            <input
                type="file"
                class="crew-image"
            >

            <button
                type="button"
                class="remove-row"
            >
                ✖
            </button>

        </div>

        `;

    }
);

document.addEventListener(
    "click",
    function(e){

        if(
            e.target.classList.contains(
                "remove-row"
            )
        ){

            e.target
            .parentElement
            .remove();

        }

    }
);

document
.getElementById(
    "openMovieModal"
)
.onclick = async function(){

    document
    .getElementById(
        "castContainer"
    ).innerHTML = "";

    document
    .getElementById(
        "crewContainer"
    ).innerHTML = "";

    await loadMovieLanguages();

    await loadMovieGenres();

    document
    .getElementById(
        "addCastRow"
    ).click();

    document
    .getElementById(
        "addCrewRow"
    ).click();

    movieModal.style.display =
        "flex";

};
async function loadMovieLanguages(){

    const response =
        await fetch(
            "/api/theatre/api/languages/"
        );

    const languages =
        await response.json();

    const container =
        document.getElementById(
            "languageCheckboxContainer"
        );

    container.innerHTML = "";

    languages.forEach(language => {

        container.innerHTML += `

        <label
            class="checkbox-item"
        >

            <input
                type="checkbox"
                class="movie-language"
                value="${language.id}"
            >

            ${language.name}

        </label>

        `;

    });

}

async function loadMovieGenres(){

    const response =
        await fetch(
            "/api/theatre/api/genres/"
        );

    const genres =
        await response.json();

    const container =
        document.getElementById(
            "genreCheckboxContainer"
        );

    container.innerHTML = "";

    genres.forEach(genre => {

        container.innerHTML += `

        <label
            class="checkbox-item"
        >

            <input
                type="checkbox"
                class="movie-genre"
                value="${genre.id}"
            >

            ${genre.name}

        </label>

        `;

    });

}

function getSelectedLanguages(){

    const selected = [];

    document
    .querySelectorAll(
        ".movie-language:checked"
    )
    .forEach(item => {

        selected.push(
            item.value
        );

    });

    return selected;

}

function getSelectedGenres(){

    const selected = [];

    document
    .querySelectorAll(
        ".movie-genre:checked"
    )
    .forEach(item => {

        selected.push(
            item.value
        );

    });

    return selected;

}

const movieModal =
    document.getElementById(
        "movieModal"
    );

document
.getElementById(
    "openMovieModal"
)
.onclick = async function(){

    await loadMovieLanguages();

    await loadMovieGenres();

    document
    .getElementById(
        "castContainer"
    ).innerHTML = "";

    document
    .getElementById(
        "crewContainer"
    ).innerHTML = "";

    document
    .getElementById(
        "addCastRow"
    ).click();

    document
    .getElementById(
        "addCrewRow"
    ).click();

    movieModal.style.display =
        "flex";

};

document
.getElementById(
    "closeMovieModal"
)
.onclick = function(){

    movieModal.style.display =
        "none";

};
document
.getElementById(
    "saveMovie"
)
.addEventListener(
    "click",
    async function(){

        const movieName =
            document.getElementById(
                "movieName"
            ).value;

        const duration =
            document.getElementById(
                "duration"
            ).value;

        const certificate =
            document.getElementById(
                "certificate"
            ).value;

        const releaseDate =
            document.getElementById(
                "releaseDate"
            ).value;

        const trailer =
            document.getElementById(
                "trailer"
            ).value;

        const description =
            document.getElementById(
                "description"
            ).value;

        const status =
            document.getElementById(
                "movieStatus"
            ).value;

        const poster =
            document.getElementById(
                "poster"
            ).files[0];

        const languages =
            getSelectedLanguages();

        const genres =
            getSelectedGenres();

        const formData =
            new FormData();

        formData.append(
            "movie_name",
            movieName
        );

        formData.append(
            "duration",
            duration
        );

        formData.append(
            "certificate",
            certificate
        );

        formData.append(
            "release_date",
            releaseDate
        );

        formData.append(
            "trailer",
            trailer
        );

        formData.append(
            "description",
            description
        );

        formData.append(
            "status",
            status
        );

        if(poster){

            formData.append(
                "poster",
                poster
            );

        }

        languages.forEach(id => {

            formData.append(
                "languages",
                id
            );

        });

        genres.forEach(id => {

            formData.append(
                "genres",
                id
            );

        });

        /* =====================
           CAST
        ===================== */

        document
        .querySelectorAll(
            ".cast-row"
        )
        .forEach((row,index) => {

            formData.append(

                `cast[${index}][actor_name]`,

                row.querySelector(
                    ".actor-name"
                ).value

            );

            formData.append(

                `cast[${index}][character_name]`,

                row.querySelector(
                    ".character-name"
                ).value

            );

            const actorImage =
                row.querySelector(
                    ".actor-image"
                ).files[0];

            if(actorImage){

                formData.append(

                    `cast[${index}][actor_image]`,

                    actorImage

                );

            }

        });

        /* =====================
           CREW
        ===================== */

        document
        .querySelectorAll(
            ".crew-row"
        )
        .forEach((row,index) => {

            formData.append(

                `crew[${index}][name]`,

                row.querySelector(
                    ".crew-name"
                ).value

            );

            formData.append(

                `crew[${index}][role]`,

                row.querySelector(
                    ".crew-role"
                ).value

            );

            const crewImage =
                row.querySelector(
                    ".crew-image"
                ).files[0];

            if(crewImage){

                formData.append(

                    `crew[${index}][image]`,

                    crewImage

                );

            }

        });

        try{

            const response =
                await fetch(
                    "/api/theatre/api/movies/add/",
                    {

                        method:"POST",

                        credentials:
                            "same-origin",

                        headers:{

                            "X-CSRFToken":
                                getCookie(
                                    "csrftoken"
                                )

                        },

                        body:formData

                    }
                );

            const data =
                await response.json();

            console.log(data);

            if(response.ok){

                alert(
                    "Movie Added Successfully"
                );

                movieModal.style.display =
                    "none";

                location.reload();

            }
            else{

                alert(

                    data.error ||

                    data.detail ||

                    "Failed to save movie"

                );

            }

        }
        catch(error){

            console.error(error);

            alert(
                "Something went wrong"
            );

        }

    }
);