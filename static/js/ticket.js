console.log("TICKET.JS LOADED");

/* =====================================
   ELEMENTS
===================================== */

const downloadBtn =
    document.getElementById("downloadTicket");

const printBtn =
    document.getElementById("printTicket");

const shareBtn =
    document.getElementById("shareTicket");

const homeBtn =
    document.getElementById("goHome");


/* =====================================
   PRINT TICKET
===================================== */

if(printBtn){

    printBtn.onclick = function(){

        window.print();

    };

}


/* =====================================
   DOWNLOAD TICKET
===================================== */

if(downloadBtn){

    downloadBtn.onclick = function(){

        window.print();

    };

}


/* =====================================
   SHARE TICKET
===================================== */

if(shareBtn){

    shareBtn.onclick = async function(){

        if(navigator.share){

            try{

                await navigator.share({

                    title:
                        "Movie Ticket",

                    text:
                        "My movie ticket",

                    url:
                        window.location.href

                });

            }

            catch(error){

                console.log(error);

            }

        }

        else{

            alert(
                "Sharing is not supported on this browser."
            );

        }

    };

}


/* =====================================
   GO TO HOME
===================================== */

if(homeBtn){

    homeBtn.onclick = function(){

        window.location.href =
            "/api/user/";

    };

}


/* =====================================
   AUTO CLEAR LOCAL STORAGE
===================================== */

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

localStorage.removeItem(
    "showId");