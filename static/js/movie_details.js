console.log("MOVIE_DETAILS.JS LOADED");

/* ======================================
   SEAT COUNT MODAL
====================================== */

const seatModal =
    document.getElementById("seatModal");

let selectedShowId = null;

if(seatModal){

    seatModal.onclick = function(e){

        if(e.target === seatModal){

            seatModal.style.display = "none";

        }

    };

}


/* ======================================
   SHOW TIME CLICK
====================================== */

function attachTimeEvents(){

    const times =
        document.querySelectorAll(".time");

    times.forEach(btn=>{

        btn.onclick = function(){

            selectedShowId =
                btn.dataset.showId;

            seatModal.style.display =
                "flex";

        };

    });

}


/* ======================================
   TICKET COUNT
====================================== */

const nums =
    document.querySelectorAll(".num");

if(nums.length){

    nums.forEach(num=>{

        num.onclick = function(){

            const active =
                document.querySelector(
                    ".num.active"
                );

            if(active){

                active.classList.remove(
                    "active"
                );

            }

            num.classList.add(
                "active"
            );

        };

    });

}


/* ======================================
   CONTINUE BUTTON
====================================== */

const selectBtn =
    document.querySelector(
        ".select-btn"
    );

if(selectBtn){

    selectBtn.onclick = function(){

        const activeSeat =
            document.querySelector(
                ".num.active"
            );

        if(!activeSeat){

            alert(
                "Select number of tickets."
            );

            return;

        }

        const seatCount =
            activeSeat.innerText;

        localStorage.setItem(
            "seatCount",
            seatCount
        );

        localStorage.setItem(
            "showId",
            selectedShowId
        );

        window.location.href =
            `/api/user/seat-layout/${selectedShowId}/`;

    };

}


/* ======================================
   INITIALIZE
====================================== */

attachTimeEvents();