console.log("PAYMENT.JS LOADED");

/* ==========================================
   ELEMENTS
========================================== */

const methods = document.querySelectorAll(".method");

const methodTitle =
    document.getElementById("methodTitle");

const paymentModal =
    document.getElementById("paymentModal");

const cardMethod =
    document.getElementById("cardMethod");

const confirmCardPayment =
    document.getElementById("confirmCardPayment");

const payNowBtn =
    document.getElementById("payNow");

const ticketCount =
    document.getElementById("ticketCount");

const seatInfo =
    document.getElementById("seatInfo");

const ticketPrice =
    document.getElementById("ticketPrice");

const orderTotal =
    document.getElementById("orderTotal");

const payable =
    document.getElementById("payable");

const donation =
    document.getElementById("donation");

const convFee =
    document.getElementById("convFee");


/* ==========================================
   LOCAL STORAGE
========================================== */

const seatLabels =
    JSON.parse(
        localStorage.getItem("seatLabels")
    ) || [];

const seatIds =
    JSON.parse(
        localStorage.getItem("seatIds")
    ) || [];

const sectionName =
    localStorage.getItem("sectionName") || "";

const seatCountValue =
    parseInt(
        localStorage.getItem("seatCount")
    ) || 0;

const showId =
    localStorage.getItem("showId");

const totalAmount =
    parseInt(
        localStorage.getItem("totalAmount")
    ) || 0;


/* ==========================================
   PRICE CALCULATION
========================================== */

const convenienceFee =
    seatCountValue * 30;

const donationAmount =
    seatCountValue * 1;

const finalAmount =
    totalAmount +
    convenienceFee +
    donationAmount;


/* ==========================================
   DISPLAY
========================================== */

if(ticketCount){

    ticketCount.innerText =
        seatCountValue;

}

if(seatInfo){

    seatInfo.innerText =
        `${sectionName} - ${seatLabels.join(", ")}`;

}

if(ticketPrice){

    ticketPrice.innerText =
        `₹${totalAmount}`;

}

if(convFee){

    convFee.innerText =
        `₹${convenienceFee}`;

}

if(donation){

    donation.innerText =
        `₹${donationAmount}`;

}

if(orderTotal){

    orderTotal.innerText =
        `₹${finalAmount}`;

}

if(payable){

    payable.innerText =
        `₹${finalAmount}`;

}


/* ==========================================
   PAYMENT METHOD
========================================== */

methods.forEach(method => {

    method.onclick = function(){

        document
            .querySelector(".method.active")
            .classList.remove("active");

        method.classList.add("active");

        methodTitle.innerText =
            method.innerText;

        if(method.id === "cardMethod"){

            paymentModal.style.display =
                "flex";

        }

        else{

            paymentModal.style.display =
                "none";

        }

    };

});


/* ==========================================
   CLOSE CARD MODAL
========================================== */

window.onclick = function(e){

    if(e.target === paymentModal){

        paymentModal.style.display =
            "none";

    }

};


/* ==========================================
   CARD VALIDATION
========================================== */

if(confirmCardPayment){

confirmCardPayment.onclick = async function(){

    const cardNumber =
        document.getElementById("cardNumber").value.trim();

    const cardHolder =
        document.getElementById("cardHolder").value.trim();

    const expiry =
        document.getElementById("expiry").value.trim();

    const cvv =
        document.getElementById("cvv").value.trim();

    if(
        cardNumber.length !== 16 ||
        cardHolder === "" ||
        expiry === "" ||
        cvv.length !== 3
    ){

        alert("Please enter valid card details.");

        return;

    }

    paymentModal.style.display = "none";

    try{

        const response = await fetch(
            "/api/booking/create-booking/",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    "X-CSRFToken":getCookie("csrftoken")

                },

                body:JSON.stringify({

                    show_id:showId,

                    seat_ids:seatIds,

                    total_amount:finalAmount

                })

            }
        );

        const data = await response.json();

        if(response.ok){

            alert("Booking Successful");

            window.location.href =
                `/api/booking/ticket/${data.booking_id}/`;

        }

        else{

            alert(data.error);

        }

    }

    catch(error){

        console.error(error);

    }

}
}


/* ==========================================
   CREATE BOOKING
========================================== */

if(payNowBtn){

    payNowBtn.onclick =
    async function(){

        if(!showId){

            alert(
                "Invalid Show."
            );

            return;

        }

        if(seatIds.length === 0){

            alert(
                "Please select seats."
            );

            return;

        }

        try{

            const response =
                await fetch(

                    "/api/booking/create-booking/",

                    {

                        method:"POST",

                        headers:{

                            "Content-Type":"application/json",

                            "X-CSRFToken":
                                getCookie(
                                    "csrftoken"
                                )

                        },

                        body:JSON.stringify({

                            show_id:
                                showId,

                            seat_ids:
                                seatIds,

                            total_amount:
                                finalAmount

                        })

                    }

                );

            const data =
                await response.json();

            if(response.ok){

                alert(
                    "Booking Successful."
                );

                localStorage.removeItem(
                    "seatIds"
                );

                localStorage.removeItem(
                    "seatLabels"
                );

                localStorage.removeItem(
                    "seatCount"
                );

                localStorage.removeItem(
                    "sectionName"
                );

                localStorage.removeItem(
                    "totalAmount"
                );

                window.location.href =
                    `/api/booking/ticket/${data.booking_id}/`;

            }

            else{

                alert(
                    data.error
                );

                window.location.href =
                    `/api/user/seat-layout/${showId}/`;

            }

        }

        catch(error){

            console.error(error);

            alert(
                "Something went wrong."
            );

        }

    };

}