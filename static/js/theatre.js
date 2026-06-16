let selectedTheatreId = null;

const theatreModal =
    document.getElementById("theatreModal");


document
.getElementById("openTheatreModal")
.onclick = function(){

    selectedTheatreId = null;

    document.getElementById(
        "theatreModalTitle"
    ).textContent = "Add Theatre";

    document.getElementById(
        "deleteTheatre"
    ).style.display = "none";

    document.getElementById(
        "theatreName"
    ).value = "";

    document.getElementById(
        "theatreLocation"
    ).value = "";

    document.getElementById(
        "phone"
    ).value = "";

    document.getElementById(
        "username"
    ).value = "";

    document.getElementById(
        "email"
    ).value = "";

    document.getElementById(
        "password"
    ).value = "";

    document.getElementById(
        "theatreStatus"
    ).value = "active";

    theatreModal.style.display = "flex";

};


document
.getElementById("closeTheatreModal")
.onclick = function(){

    theatreModal.style.display = "none";

};


document
.getElementById("saveTheatre")
.addEventListener("click", async function(){

    const theatreName =
        document.getElementById(
            "theatreName"
        ).value;

    const theatreLocation =
        document.getElementById(
            "theatreLocation"
        ).value;

    const phone =
        document.getElementById(
            "phone"
        ).value;

    const username =
        document.getElementById(
            "username"
        ).value;

    const email =
        document.getElementById(
            "email"
        ).value;

    const password =
        document.getElementById(
            "password"
        ).value;

    const status =
        document.getElementById(
            "theatreStatus"
        ).value;


    let response;

    if(selectedTheatreId){

        response = await fetch(
            `/api/theatre/api/theatres/update/${selectedTheatreId}/`,
            {
                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    theatre_name: theatreName,
                    location: theatreLocation,
                    phone: phone,
                    status: status
                })
            }
        );

    }else{

        response = await fetch(
            "/api/theatre/api/theatres/add/",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    theatre_name: theatreName,
                    location: theatreLocation,
                    phone: phone,
                    username: username,
                    email: email,
                    password: password,
                    status: status
                })
            }
        );

    }

    const data = await response.json();

    console.log(data);

    if(response.ok){

        alert(
            selectedTheatreId
            ? "Theatre Updated Successfully"
            : "Theatre Added Successfully"
        );

        window.location.reload();

    }else{

        alert("Something went wrong");

    }

});

document
.getElementById("deleteTheatre")
.addEventListener("click", async function(){

    if(!selectedTheatreId){

        alert("Select a theatre");

        return;
    }

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this theatre?"
        );

    if(!confirmDelete){

        return;
    }

    const response =
        await fetch(
            `/api/theatre/api/theatres/delete/${selectedTheatreId}/`,
            {
                method:"DELETE"
            }
        );

    const data =
        await response.json();

    console.log(data);

    if(response.ok){

        alert(
            "Theatre Deleted Successfully"
        );

        window.location.reload();

    }

});
async function loadTheatres(){

    const response = await fetch(
        "/api/theatre/api/theatres/"
    );

    const theatres =
        await response.json();

    const container =
        document.getElementById(
            "theatreContainer"
        );

    container.innerHTML = "";

    theatres.forEach(theatre => {

        container.innerHTML += `
            <div
                class="theatre-item"
                data-id="${theatre.id}"
                data-name="${theatre.theatre_name}"
                data-location="${theatre.location}"
                data-phone="${theatre.phone}"
                data-status="${theatre.status}"
            >

                <h4>
                    ${theatre.theatre_name}
                </h4>

                <p>
                    ${theatre.location}
                </p>

                <p>
                    ${theatre.phone}
                </p>

            </div>
        `;

    });


    document
    .querySelectorAll(".theatre-item")
    .forEach(item => {

        item.addEventListener(
            "dblclick",
            function(){

                selectedTheatreId =
                    this.dataset.id;

                document.getElementById(
                    "theatreModalTitle"
                ).textContent =
                    "Edit Theatre";

                document.getElementById(
                    "theatreName"
                ).value =
                    this.dataset.name;

                document.getElementById(
                    "theatreLocation"
                ).value =
                    this.dataset.location;

                document.getElementById(
                    "phone"
                ).value =
                    this.dataset.phone;

                document.getElementById(
                    "theatreStatus"
                ).value =
                    this.dataset.status;

                document.getElementById(
                    "deleteTheatre"
                ).style.display =
                    "block";

                theatreModal.style.display =
                    "flex";

            }
        );

    });

}

loadTheatres();