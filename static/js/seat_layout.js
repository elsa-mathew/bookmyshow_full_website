console.log("SEAT_LAYOUT.JS LOADED");

/* =====================================
   VARIABLES
===================================== */

const payBtn = document.getElementById("pay");

const seats = document.querySelectorAll(".seat");

let selectedSeats = [];

let totalAmount = 0;

const maxSeats =
    parseInt(
        localStorage.getItem("seatCount")
    ) || 1;


/* =====================================
   LOAD BOOKED SEATS
===================================== */

async function loadBookedSeats(){

    try{

        const response = await fetch(
            `/api/booking/booked-seats/${SHOW_ID}/`
        );

        const bookedSeats =
            await response.json();

        seats.forEach(seat=>{

            const seatId =
                parseInt(
                    seat.dataset.seatId
                );

            if(
                bookedSeats.includes(
                    seatId
                )
            ){

                seat.classList.add("sold");

            }

        });

        attachSeatEvents();

    }

    catch(error){

        console.error(error);

    }

}


/* =====================================
   ATTACH EVENTS
===================================== */

function attachSeatEvents(){

    document
    .querySelectorAll(".seat:not(.sold)")
    .forEach(seat=>{

        seat.onclick = function(){

            if(
                seat.classList.contains(
                    "selected"
                )
            ){

                seat.classList.remove(
                    "selected"
                );

                selectedSeats =
                    selectedSeats.filter(
                        s => s !== seat
                    );

                calculatePrice();

                return;

            }

            if(
                selectedSeats.length >=
                maxSeats
            ){

                alert(
                    `You can select only ${maxSeats} seat(s).`
                );

                return;

            }

            seat.classList.add(
                "selected"
            );

            selectedSeats.push(
                seat
            );

            calculatePrice();

        };

    });

}


/* =====================================
   PRICE
===================================== */

function calculatePrice(){

    totalAmount = 0;

    selectedSeats.forEach(seat=>{

        totalAmount +=
            parseInt(
                seat.dataset.price
            );

    });

    if(payBtn){

        payBtn.innerText =
            `Pay ₹${totalAmount}`;

    }

}


/* =====================================
   PAY BUTTON
===================================== */

if(payBtn){

    payBtn.onclick = function(){

        if(
            selectedSeats.length === 0
        ){

            alert(
                "Please select seats."
            );

            return;

        }

        const seatIds =
            selectedSeats.map(

                seat =>
                seat.dataset.seatId

            );

        const seatLabels =
            selectedSeats.map(

                seat =>
                seat.dataset.seatLabel

            );

        const sectionName =
            selectedSeats[0]
            .dataset
            .sectionName;

        localStorage.setItem(
            "showId",
            SHOW_ID
        );

        localStorage.setItem(
            "seatIds",
            JSON.stringify(
                seatIds
            )
        );

        localStorage.setItem(
            "seatLabels",
            JSON.stringify(
                seatLabels
            )
        );

        localStorage.setItem(
            "sectionName",
            sectionName
        );

        localStorage.setItem(
            "seatCount",
            selectedSeats.length
        );

        localStorage.setItem(
            "totalAmount",
            totalAmount
        );

        window.location.href =
            `/api/booking/payment/?show_id=${SHOW_ID}`;

    };

}


/* =====================================
   INITIALIZE
===================================== */

loadBookedSeats();