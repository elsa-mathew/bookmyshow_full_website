let selectedShowId = null;

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


const showModal =
    document.getElementById(
        "showModal"
    );
    showModal.style.display =
    "none";

document
.getElementById(
    "openShowModal"
)
.onclick = async function(){

    document.getElementById(
        "movieSelect"
    ).value = "";

    document.getElementById(
        "screenSelect"
    ).value = "";

    document.getElementById(
        "showDate"
    ).value = "";

    document.getElementById(
        "showStatus"
    ).value = "active";

    document
    .getElementById(
        "showTimeContainer"
    ).innerHTML = "";

    await loadMovies();

    await loadScreens();

    document
    .getElementById(
        "addShowTime"
    ).click();

    showModal.style.display =
        "flex";

};


document
.getElementById(
    "closeShowModal"
)
.onclick = function(){

    showModal.style.display =
        "none";

};

document
.getElementById(
    "addShowTime"
)
.addEventListener(
    "click",
    function(){

        const container =
            document.getElementById(
                "showTimeContainer"
            );

        container.innerHTML += `

        <div
            class="show-time-row"
        >

            <input
                type="time"
                class="show-time"
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

async function loadMovies(){

    const response =
        await fetch(
            "/api/theatre/api/movies/"
        );

    const movies =
        await response.json();

    const dropdown =
        document.getElementById(
            "movieSelect"
        );

    dropdown.innerHTML = `
        <option value="">
            Select Movie
        </option>
    `;

    movies.forEach(movie => {

        dropdown.innerHTML += `
            <option value="${movie.id}">
                ${movie.movie_name}
            </option>
        `;

    });

}
async function loadScreens(){

    const response =
        await fetch(
            "/api/theatre/api/screens/"
        );

    const screens =
        await response.json();

    console.log(
        "Screens:",
        screens
    );

    const dropdown =
        document.getElementById(
            "screenSelect"
        );

    dropdown.innerHTML = `

        <option value="">
            Select Screen
        </option>

    `;

    screens.forEach(screen => {

        dropdown.innerHTML += `

            <option
                value="${screen.id}"
            >
                ${screen.screen_name}
            </option>

        `;

    });

}

function getShowTimes(){

    const times = [];

    document
    .querySelectorAll(
        ".show-time"
    )
    .forEach(input => {

        if(input.value){

            times.push(
                input.value
            );

        }

    });

    return times;

}

async function loadShows(){

    const response =
        await fetch(
            "/api/theatre/api/shows/"
        );

    const shows =
        await response.json();

    const container =
        document.getElementById(
            "showContainer"
        );

    container.innerHTML = "";

    shows.forEach(show => {

        container.innerHTML += `

        <div
            class="show-card"
            data-id="${show.id}"
        >

            <h3>
                ${show.movie_name}
            </h3>

            <p>
                Screen :
                ${show.screen_name}
            </p>

            <p>
                Date :
                ${show.show_date}
            </p>

            <p>
                Time :
                ${show.start_time}
            </p>

            <p>
                Status :
                ${show.status}
            </p>

            <div
                class="show-actions"
            >

                <button
                    class="edit-show-btn"
                    data-id="${show.id}"
                >
                    Edit
                </button>

                <button
                    class="delete-show-btn"
                    data-id="${show.id}"
                >
                    Delete
                </button>

            </div>

        </div>

        `;

    });

}

document
.getElementById(
    "saveShow"
)
.addEventListener(
    "click",
    async function(){

        const movieId =
            document.getElementById(
                "movieSelect"
            ).value;

        const screenId =
            document.getElementById(
                "screenSelect"
            ).value;

        const showDate =
            document.getElementById(
                "showDate"
            ).value;

        const status =
            document.getElementById(
                "showStatus"
            ).value;

        const showTimes =
            getShowTimes();

        const response =
            await fetch(
                "/api/theatre/api/shows/add/",
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            )
                    },

                    body:JSON.stringify({

                        movie_id:
                            movieId,

                        screen_id:
                            screenId,

                        show_date:
                            showDate,

                        status:
                            status,

                        show_times:
                            showTimes

                    })

                }
            );

        const data =
            await response.json();

        if(response.ok){

    alert(
        "Shows Added Successfully"
    );

    showModal.style.display =
        "none";

    document
    .getElementById(
        "showTimeContainer"
    ).innerHTML = "";

    loadShows();

}
else{

    alert(
        data.error ||
        "Failed to save show"
    );

}
})  
loadShows()
