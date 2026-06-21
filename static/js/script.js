
console.log("SCRIPT LOADED");

const locationBtn = document.getElementById("locationBtn");
const locationModal = document.getElementById("locationModal");

if(locationBtn && locationModal){

locationBtn.onclick = () => {
locationModal.style.display = "flex";
};

window.onclick = (e) => {
if(e.target === locationModal){
locationModal.style.display = "none";
}
};

}

function openMovie(){
window.location.href = "movie.html";
}

const slides = document.querySelectorAll(".slide");

if(slides.length > 0){

let currentSlide = 0;

function showSlide(index){

slides.forEach(slide=>{
slide.classList.remove("active");
});

slides[index].classList.add("active");

}

window.nextSlide = function(){

currentSlide++;

if(currentSlide >= slides.length){
currentSlide = 0;
}

showSlide(currentSlide);

};

window.prevSlide = function(){

currentSlide--;

if(currentSlide < 0){
currentSlide = slides.length - 1;
}

showSlide(currentSlide);

};

setInterval(()=>{
nextSlide();
},4000);

}

const sticky = document.querySelector(".sticky");

if(sticky){

window.addEventListener("scroll",()=>{

if(window.scrollY > 300){
sticky.style.display = "flex";
}else{
sticky.style.display = "none";
}

});

}

const play = document.querySelector(".play");

if(play){

play.onclick = ()=>{
alert("Trailer playing...");
};

}

const datesContainer = document.getElementById("datesContainer");
const theatreList = document.getElementById("theatreList");

if(datesContainer){

const today = new Date();

const theatres = `

<div class="theatre">

<div class="theatre-info">

<h3>Cinepolis: Centre Square, Kochi</h3>

<p>13.7 km | Non-cancellable</p>

</div>

<div class="showtimes">

<button class="time">03:30 PM</button>
<button class="time">06:45 PM</button>
<button class="time">10:15 PM</button>

</div>

</div>

<div class="theatre">

<div class="theatre-info">

<h3>PVR Lulu Mall</h3>

<p>10.2 km | Non-cancellable</p>

</div>

<div class="showtimes">

<button class="time">02:30 PM</button>
<button class="time">05:45 PM</button>
<button class="time">09:00 PM</button>

</div>

</div>

`;

for(let i=-2;i<=3;i++){

const date = new Date();

date.setDate(today.getDate() + i);

const day = date.toLocaleDateString('en-US',{
weekday:'short'
});

const num = date.getDate();

const month = date.toLocaleDateString('en-US',{
month:'short'
});

const div = document.createElement("div");

div.classList.add("date");

if(i===0){
div.classList.add("active");
}

if(i>=2){
div.classList.add("disabled");
div.style.pointerEvents = "none";
}

div.innerHTML = `
<p>${day.toUpperCase()}</p>
<h3>${num}</h3>
<span>${month.toUpperCase()}</span>
`;

div.onclick = ()=>{

if(div.classList.contains("disabled")){
return;
}

document
.querySelector(".date.active")
.classList
.remove("active");

div.classList.add("active");

theatreList.innerHTML = theatres;

attachTimeEvents();

};

datesContainer.appendChild(div);

}

theatreList.innerHTML = theatres;

attachTimeEvents();

}

console.log("SCRIPT LOADED");

const nums = document.querySelectorAll(".num");

if(nums.length > 0){

nums.forEach(n=>{

n.onclick = ()=>{

document
.querySelector(".num.active")
.classList
.remove("active");

n.classList.add("active");

};

});

}

const seatModal = document.getElementById("seatModal");

if(seatModal){

seatModal.onclick = (e)=>{

if(e.target === seatModal){
seatModal.style.display = "none";
}

};

}
let selectedShowId = null;

function attachTimeEvents(){

    const times = document.querySelectorAll(".time");

    times.forEach(btn => {

        btn.onclick = () => {

            selectedShowId = btn.dataset.showId;

            console.log(
                "Selected Show ID:",
                selectedShowId
            );

            document.getElementById(
                "seatModal"
            ).style.display = "flex";

        };

    });

}


const selectBtn = document.querySelector(".select-btn");

if(selectBtn){

    selectBtn.onclick = ()=>{

        const activeSeat =
            document.querySelector(".num.active");

        if(activeSeat){

            const selectedSeats =
                activeSeat.innerText;

            localStorage.setItem(
                "seatCount",
                selectedSeats
            );

        }

        window.location.href =
            `/api/user/seat-layout/${selectedShowId}/`;

    };

}

attachTimeEvents();

const ticketInfoBtn =
    document.getElementById(
        "ticketInfoBtn"
    );

if(ticketInfoBtn){

    const seatCount =
        localStorage.getItem(
            "seatCount"
        ) || 1;

    ticketInfoBtn.innerHTML =
        `🎟 ${seatCount} Ticket${
            seatCount > 1 ? 's' : ''
        }`;

}

const seats =
    document.querySelectorAll(
        ".seat:not(.sold)"
    );

const payBtn =
    document.getElementById("pay");

const maxSeats =
    parseInt(
        localStorage.getItem(
            "seatCount"
        )
    ) || 1;

let selectedSeats = [];
let totalAmount = 0;

seats.forEach(seat => {

    seat.addEventListener(
        "click",
        function(){

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
                    `You can select only ${maxSeats} seat(s)`
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

        }
    );

});



function calculatePrice() {

    totalAmount = 0;

    const selectedSeats =
        document.querySelectorAll(
            ".seat.selected"
        );

    selectedSeats.forEach(seat => {

        totalAmount += parseInt(
            seat.dataset.price
        );

    });

    document.getElementById("pay")
        .innerText =
        `Pay ₹${totalAmount}`;
}
if(payBtn){

    payBtn.onclick = () => {

    const seatIds =
        selectedSeats.map(
            seat => seat.dataset.seatId
        );

    const seatLabels =
        selectedSeats.map(
            seat => seat.dataset.seatLabel
        );

    localStorage.setItem(
        "showId",
        SHOW_ID
    );

    localStorage.setItem(
        "seatIds",
        JSON.stringify(seatIds)
    );

    localStorage.setItem(
        "seatLabels",
        JSON.stringify(seatLabels)
    );

    localStorage.setItem(
    "seatCount",
    selectedSeats.length
);

    localStorage.setItem(
        "totalAmount",
        totalAmount
    );

    const sectionName =
    selectedSeats[0]
        .dataset
        .sectionName;

localStorage.setItem(
    "sectionName",
    sectionName
);


       window.location.href =
    `/api/booking/payment/?show_id=${SHOW_ID}`;
};
} 

const ticketCountElement =
    document.getElementById(
        "ticketCount"
    );

console.log(
    "Ticket Element:",
    ticketCountElement
);

if(ticketCountElement){

    const seatCount =
        parseInt(
            localStorage.getItem(
                "seatCount"
            )
        ) || 1;

    console.log(
        "Seat Count:",
        seatCount
    );

    ticketCountElement.innerText =
        seatCount;
}

const seatLabels =
    JSON.parse(
        localStorage.getItem(
            "seatLabels"
        )
    ) || [];

const sectionName =
    localStorage.getItem(
        "sectionName"
    ) || "";

document.getElementById(
    "seatInfo"
).innerText =
    `${sectionName} - ${seatLabels.join(", ")}`;


const methods = document.querySelectorAll(".method");

const methodTitle = document.getElementById("methodTitle");

methods.forEach(method=>{

method.onclick = ()=>{

document.querySelector(".method.active").classList.remove("active");

method.classList.add("active");

methodTitle.innerText = method.innerText;

};

});

const ticketPrice =
    document.getElementById(
        "ticketPrice"
    );

if(ticketPrice){

    const totalAmount =
        parseFloat(
            localStorage.getItem(
                "totalAmount"
            ) || 0
        );

    ticketPrice.innerText =
        `₹${totalAmount.toFixed(2)}`;

}

const convFeeElement =
    document.getElementById(
        "convFee"
    );

if(convFeeElement){

    const seatCount =
        parseInt(
            localStorage.getItem(
                "seatCount"
            )
        ) || 1;

    const convenienceFee =
        25 + (seatCount * 5);

    convFeeElement.innerText =
        `₹${convenienceFee.toFixed(2)}`;

}

const orderTotalElement =
    document.getElementById(
        "orderTotal"
    );

if(orderTotalElement){

    const ticketAmount =
        parseFloat(
            localStorage.getItem(
                "totalAmount"
            ) || 0
        );

    const seatCount =
        parseInt(
            localStorage.getItem(
                "seatCount"
            ) || 1
        );

    const convenienceFee =
        25 + (
            seatCount * 5 + 2
        );

    const orderTotal =
        ticketAmount +
        convenienceFee;

    orderTotalElement.innerText =
        `₹${orderTotal.toFixed(2)}`;

}

const payableElement =
    document.getElementById(
        "payable"
    );

if(payableElement){

    const ticketAmount =
        parseFloat(
            localStorage.getItem(
                "totalAmount"
            ) || 0
        );

    const seatCount =
        parseInt(
            localStorage.getItem(
                "seatCount"
            ) || 1
        );

    const convenienceFee =
        25 + (
            seatCount * 5 +2
        );

    const finalAmount =
        ticketAmount +
        convenienceFee;

    payableElement.innerText =
        `₹${finalAmount.toFixed(2)}`;

}


const cardMethod =
    document.getElementById(
        "cardMethod"
    );

const paymentContent =
    document.getElementById(
        "paymentContent"
    );

if(
    cardMethod &&
    paymentContent
){

    cardMethod.onclick = () => {

        paymentContent.innerHTML = `

            <h3>
                Debit / Credit Card
            </h3>

            <input
                type="text"
                id="cardNumber"
                placeholder="Card Number"
            >

            <input
                type="text"
                id="cardHolder"
                placeholder="Card Holder Name"
            >

            <div class="card-row">

                <input
                    type="text"
                    id="expiry"
                    placeholder="MM/YY"
                >

                <input
                    type="password"
                    id="cvv"
                    placeholder="CVV"
                >

            </div>

            <button id="confirmCardPayment">
                Proceed
            </button>

        `;

    };

}


document.addEventListener(
    "click",
    async function(e){

        if(
            e.target.id ===
            "confirmCardPayment"
        ){

            const cardNumber =
                document.getElementById(
                    "cardNumber"
                ).value;

            const cardHolder =
                document.getElementById(
                    "cardHolder"
                ).value;

            const expiry =
                document.getElementById(
                    "expiry"
                ).value;

            const cvv =
                document.getElementById(
                    "cvv"
                ).value;

            if(
                !cardNumber ||
                !cardHolder ||
                !expiry ||
                !cvv
            ){

                alert(
                    "Please fill all details"
                );

                return;
            }

            const response =
                await fetch(
                    "/api/booking/create-booking/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                            "X-CSRFToken":
                                csrftoken
                        },

                        body: JSON.stringify({

                            show_id:
                                localStorage.getItem(
                                    "showId"
                                ),

                            seat_ids:
                                JSON.parse(
                                    localStorage.getItem(
                                        "seatIds"
                                    )
                                ),

                            total_amount:
                                localStorage.getItem(
                                    "totalAmount"
                                )

                        })
                    }
                );

            const data =
                await response.json();
console.log( `/api/booking/ticket/${data.booking_id}/`);

console.log("Response Data:", data);
console.log("Booking ID:", data.booking_id);

setTimeout(() => {

    alert(
        " Booking Successful!"
    );

            window.location.href =
    `/api/booking/ticket/${data.booking_id}/`;
        }, 300);

    }
}
);
