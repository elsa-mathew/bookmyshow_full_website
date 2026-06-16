let selectedScreenId = null;

const screenModal =
    document.getElementById(
        "screenModal"
    );
const sectionModal =
    document.getElementById(
        "sectionModal"
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

// OPEN ADD SCREEN MODAL

document
.getElementById(
    "openScreenModal"
)
.onclick = function(){

    selectedScreenId = null;

    document
    .getElementById(
        "screenModalTitle"
    ).textContent =
        "Add Screen";

    document
    .getElementById(
        "screenName"
    ).value = "";

    document
    .getElementById(
        "totalSeats"
    ).value = "";

    document
    .getElementById(
        "screenStatus"
    ).value = "active";

    document
    .getElementById(
        "deleteScreen"
    ).style.display =
        "none";

    screenModal.style.display =
        "flex";

};

// CLOSE MODAL

document
.getElementById(
    "closeScreenModal"
)
.onclick = function(){

    screenModal.style.display =
        "none";

};

document
.getElementById(
    "closeSectionModal"
)
.onclick = function(){

    sectionModal.style.display =
        "none";

};
// SAVE / UPDATE SCREEN

document
.getElementById(
    "saveScreen"
)
.addEventListener(
    "click",
    async function(){

        const screenName =
            document.getElementById(
                "screenName"
            ).value;

        const totalSeats =
            document.getElementById(
                "totalSeats"
            ).value;

        const status =
            document.getElementById(
                "screenStatus"
            ).value;

        const csrftoken =
            getCookie(
                "csrftoken"
            );

        const url =
            selectedScreenId

            ?

            `/api/theatre/api/screens/update/${selectedScreenId}/`

            :

            "/api/theatre/api/screens/add/";

        const method =
            selectedScreenId

            ?

            "PUT"

            :

            "POST";

        try{

            const response =
                await fetch(
                    url,
                    {

                        method:method,

                        credentials:
                            "same-origin",

                        headers:{
                            "Content-Type":
                                "application/json",

                            "X-CSRFToken":
                                csrftoken
                        },

                        body:JSON.stringify({

                            screen_name:
                                screenName,

                            total_seats:
                                totalSeats,

                            status:
                                status

                        })

                    }
                );

            const data =
                await response.json();

            console.log(data);

            if(response.ok){

                alert(

                    selectedScreenId

                    ?

                    "Screen Updated"

                    :

                    "Screen Added"

                );

                loadScreens();

                screenModal.style.display =
                    "none";

            }else{

                alert(
                    data.error ||
                    data.detail ||
                    "Operation Failed"
                );

            }

        }catch(error){

            console.error(error);

            alert(
                "Something went wrong"
            );

        }

    }
);

// LOAD SCREENS

async function loadScreens(){

    const response =
        await fetch(
            "/api/theatre/api/screens/"
        );

    const screens =
        await response.json();

    const container =
        document.getElementById(
            "screenContainer"
        );

    container.innerHTML = "";

    screens.forEach(screen => {

        container.innerHTML += `

        <div
            class="screen-card"
            data-id="${screen.id}"
            data-name="${screen.screen_name}"
            data-seats="${screen.total_seats}"
            data-status="${screen.status}"
        >

            <h3>
                ${screen.screen_name}
            </h3>

            <p>
                Seats :
                ${screen.total_seats}
            </p>

            <p>
                Status :
                ${screen.status}
            </p>

            <div
                class="screen-actions"
            >

                <button
                    class="add-section-btn"
                >
                    ➕
                </button>

                <button
                    class="edit-screen-btn"
                >
                    ✏
                </button>

                <button
                    class="delete-screen-btn"
                >
                    🗑
                </button>

            </div>

        </div>

        `;

    });

    // EDIT SCREEN

    document
    .querySelectorAll(
        ".edit-screen-btn"
    )
    .forEach(btn => {

        btn.addEventListener(
            "click",
            function(e){

                e.stopPropagation();

                const card =
                    this.closest(
                        ".screen-card"
                    );

                selectedScreenId =
                    card.dataset.id;

                document
                .getElementById(
                    "screenName"
                ).value =
                    card.dataset.name;

                document
                .getElementById(
                    "totalSeats"
                ).value =
                    card.dataset.seats;

                document
                .getElementById(
                    "screenStatus"
                ).value =
                    card.dataset.status;

                document
                .getElementById(
                    "deleteScreen"
                ).style.display =
                    "block";

                document
                .getElementById(
                    "screenModalTitle"
                ).textContent =
                    "Edit Screen";

                screenModal.style.display =
                    "flex";

            }
        );

    });

    document
.querySelectorAll(
    ".delete-screen-btn"
)
.forEach(btn => {

    btn.addEventListener(
        "click",
        async function(e){

            e.stopPropagation();

            const card =
                this.closest(
                    ".screen-card"
                );

            const screenId =
                card.dataset.id;

            if(
                !confirm(
                    "Delete this screen?"
                )
            ){
                return;
            }

            const response =
                await fetch(
                    `/api/theatre/api/screens/delete/${screenId}/`,
                    {

                        method:"DELETE",

                        credentials:
                            "same-origin",

                        headers:{
                            "X-CSRFToken":
                                getCookie(
                                    "csrftoken"
                                )
                        }

                    }
                );

            const data =
                await response.json();

            if(response.ok){

                alert(
                    "Screen Deleted"
                );

                loadScreens();

            }else{

                alert(
                    data.error ||
                    "Delete Failed"
                );

            }

        }
    );

});

document
.getElementById(
    "deleteScreen"
)
.addEventListener(
    "click",
    async function(){

        if(
            !selectedScreenId
        ){
            return;
        }

        if(
            !confirm(
                "Delete this screen?"
            )
        ){
            return;
        }

        const response =
            await fetch(
                `/api/theatre/api/screens/delete/${selectedScreenId}/`,
                {

                    method:"DELETE",

                    credentials:
                        "same-origin",

                    headers:{
                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            )
                    }

                }
            );

        if(response.ok){

            alert(
                "Screen Deleted"
            );

            screenModal.style.display =
                "none";

            loadScreens();

        }

    }
);

document
.querySelectorAll(
    ".add-section-btn"
)
.forEach(btn => {

    btn.addEventListener(
        "click",
        function(e){

            e.stopPropagation();

            const card =
                this.closest(
                    ".screen-card"
                );

            selectedScreenId =
                card.dataset.id;

            document
            .getElementById(
                "sectionName"
            ).value = "";

            document
            .getElementById(
                "sectionPrice"
            ).value = "";

            document
            .getElementById(
                "startRow"
            ).value = "";

            document
            .getElementById(
                "endRow"
            ).value = "";

            document
            .getElementById(
                "columns"
            ).value = "";

            document
            .getElementById(
                "sectionStatus"
            ).value = "active";

            sectionModal.style.display =
                "flex";

        }
    );

});

document
.getElementById(
    "saveSection"
)
.addEventListener(
    "click",
    async function(){

        const sectionName =
            document.getElementById(
                "sectionName"
            ).value;

        const price =
            document.getElementById(
                "sectionPrice"
            ).value;

        const startRow =
            document.getElementById(
                "startRow"
            ).value;

        const endRow =
            document.getElementById(
                "endRow"
            ).value;

        const columns =
            document.getElementById(
                "columns"
            ).value;

        const status =
            document.getElementById(
                "sectionStatus"
            ).value;

        const response =
            await fetch(
                "/api/theatre/api/sections/add/",
                {

                    method:"POST",

                    credentials:
                        "same-origin",

                    headers:{
                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            )
                    },

                    body:JSON.stringify({

                        screen_id:
                            selectedScreenId,

                        section_name:
                            sectionName,

                        price:
                            price,

                        start_row:
                            startRow,

                        end_row:
                            endRow,

                        columns:
                            columns,

                        status:
                            status

                    })

                }
            );

        const data =
            await response.json();

        console.log(data);

        if(response.ok){

            alert(
                "Section Added"
            );

            sectionModal.style.display =
                "none";

            loadSections(
                selectedScreenId
            );

        }

    }
);
async function loadSections(screenId){

    const response =
        await fetch(
            `/api/theatre/api/sections/${screenId}/`
        );

    const sections =
        await response.json();

    const container =
        document.getElementById(
            "sectionContainer"
        );

    container.innerHTML = "";

    sections.forEach(section => {

        const totalSeats =
            (
                section.end_row.charCodeAt(0)
                -
                section.start_row.charCodeAt(0)
                +
                1
            )
            *
            section.columns;

        container.innerHTML += `

        <div
            class="section-card"
            data-id="${section.id}"
        >

            <h3>
                ${section.section_name}
            </h3>

            <p>
                Price : ₹${section.price}
            </p>

            <p>
                Rows :
                ${section.start_row}
                -
                ${section.end_row}
            </p>

            <p>
                Columns :
                ${section.columns}
            </p>

            <p>
                Seats :
                ${totalSeats}
            </p>

            <p>
                Status :
                ${section.status}
            </p>

            <div
                class="section-actions"
            >

                <button
                    class="edit-section-btn"
                >
                    ✏
                </button>

                <button
                    class="delete-section-btn"
                >
                    🗑
                </button>

            </div>

        </div>

        `;

    });

}
document
.querySelectorAll(
    ".screen-card"
)
.forEach(card => {

    card.addEventListener(
        "dblclick",
        function(){

            selectedScreenId =
                this.dataset.id;

            document
            .getElementById(
                "sectionArea"
            )
            .style.display =
                "block";

            document
            .getElementById(
                "selectedScreenTitle"
            ).textContent =

                `${this.dataset.name} - Sections`;

            loadSections(
                selectedScreenId
            );

        }
    );

});



}

loadScreens();