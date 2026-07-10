console.log("HOME.JS LOADED");

/* ======================================
   LOCATION MODAL
====================================== */

const locationBtn =
    document.getElementById("locationBtn");

const locationModal =
    document.getElementById("locationModal");

if(locationBtn && locationModal){

    locationBtn.onclick = function(){

        locationModal.style.display =
            "flex";

    };

    window.addEventListener(
        "click",
        function(e){

            if(e.target === locationModal){

                locationModal.style.display =
                    "none";

            }

        }
    );

}


/* ======================================
   BANNER SLIDER
====================================== */

const slides =
    document.querySelectorAll(".slide");

if(slides.length > 0){

    let currentSlide = 0;

    function showSlide(index){

        slides.forEach(slide => {

            slide.classList.remove("active");

        });

        slides[index].classList.add("active");

    }

    function nextSlide(){

        currentSlide++;

        if(currentSlide >= slides.length){

            currentSlide = 0;

        }

        showSlide(currentSlide);

    }

    function prevSlide(){

        currentSlide--;

        if(currentSlide < 0){

            currentSlide =
                slides.length - 1;

        }

        showSlide(currentSlide);

    }

    window.nextSlide = nextSlide;

    window.prevSlide = prevSlide;

    setInterval(nextSlide,4000);

}


/* ======================================
   STICKY HEADER
====================================== */

const sticky =
    document.querySelector(".sticky");

if(sticky){

    window.addEventListener(
        "scroll",
        function(){

            if(window.scrollY > 300){

                sticky.style.display =
                    "flex";

            }

            else{

                sticky.style.display =
                    "none";

            }

        }
    );

}


/* ======================================
   TRAILER BUTTON
====================================== */

const play =
    document.querySelector(".play");

if(play){

    play.onclick = function(){

        alert("Trailer Playing...");

    };

}


/* ======================================
   DATE BAR
====================================== */

const datesContainer =
    document.getElementById("datesContainer");

const theatreList =
    document.getElementById("theatreList");

if(datesContainer && theatreList){

    const today =
        new Date();

    const theatres = `

    <div class="theatre">

        <div class="theatre-info">

            <h3>
                Cinepolis :
                Centre Square,
                Kochi
            </h3>

            <p>
                13.7 km |
                Non-cancellable
            </p>

        </div>

        <div class="showtimes">

            <button class="time">
                03:30 PM
            </button>

            <button class="time">
                06:45 PM
            </button>

            <button class="time">
                10:15 PM
            </button>

        </div>

    </div>

    <div class="theatre">

        <div class="theatre-info">

            <h3>
                PVR Lulu Mall
            </h3>

            <p>
                10.2 km |
                Non-cancellable
            </p>

        </div>

        <div class="showtimes">

            <button class="time">
                02:30 PM
            </button>

            <button class="time">
                05:45 PM
            </button>

            <button class="time">
                09:00 PM
            </button>

        </div>

    </div>

    `;

    for(let i = -2 ; i <= 3 ; i++){

        const date =
            new Date();

        date.setDate(
            today.getDate() + i
        );

        const day =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday:"short"
                }
            );

        const num =
            date.getDate();

        const month =
            date.toLocaleDateString(
                "en-US",
                {
                    month:"short"
                }
            );

        const div =
            document.createElement("div");

        div.classList.add("date");

        if(i === 0){

            div.classList.add("active");

        }

        if(i >= 2){

            div.classList.add("disabled");

            div.style.pointerEvents =
                "none";

        }

        div.innerHTML = `

            <p>${day.toUpperCase()}</p>

            <h3>${num}</h3>

            <span>${month.toUpperCase()}</span>

        `;

        div.onclick = function(){

            if(div.classList.contains("disabled")){

                return;

            }

            const activeDate =
                document.querySelector(
                    ".date.active"
                );

            if(activeDate){

                activeDate.classList.remove(
                    "active"
                );

            }

            div.classList.add("active");

            theatreList.innerHTML =
                theatres;

            if(typeof attachTimeEvents === "function"){

                attachTimeEvents();

            }

        };

        datesContainer.appendChild(div);

    }

    theatreList.innerHTML =
        theatres;

    if(typeof attachTimeEvents === "function"){

        attachTimeEvents();

    }

}


/* ======================================
   SEAT COUNT POPUP
====================================== */

const nums =
    document.querySelectorAll(".num");

if(nums.length > 0){

    nums.forEach(num => {

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

            num.classList.add("active");

        };

    });

}