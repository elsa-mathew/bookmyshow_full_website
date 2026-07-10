console.log("COMMON.JS LOADED");

/* ==========================
   CSRF TOKEN
========================== */

function getCookie(name){

    let cookieValue = null;

    if(document.cookie && document.cookie !== ""){

        const cookies = document.cookie.split(";");

        for(let cookie of cookies){

            cookie = cookie.trim();

            if(cookie.startsWith(name + "=")){

                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );

                break;

            }

        }

    }

    return cookieValue;

}


/* ==========================
   FETCH JSON
========================== */

async function fetchJSON(url){

    const response = await fetch(url);

    return await response.json();

}


/* ==========================
   POST JSON
========================== */

async function postJSON(url,data){

    const response = await fetch(url,{

        method:"POST",

        headers:{

            "Content-Type":"application/json",

            "X-CSRFToken":getCookie("csrftoken")

        },

        body:JSON.stringify(data)

    });

    return await response.json();

}


/* ==========================
   PUT JSON
========================== */

async function putJSON(url,data){

    const response = await fetch(url,{

        method:"PUT",

        headers:{

            "Content-Type":"application/json",

            "X-CSRFToken":getCookie("csrftoken")

        },

        body:JSON.stringify(data)

    });

    return await response.json();

}


/* ==========================
   DELETE REQUEST
========================== */

async function deleteData(url){

    const response = await fetch(url,{

        method:"DELETE",

        headers:{

            "X-CSRFToken":getCookie("csrftoken")

        }

    });

    return await response.json();

}


/* ==========================
   ALERT
========================== */

function showAlert(message){

    alert(message);

}


/* ==========================
   CONFIRM
========================== */

function confirmAction(message){

    return confirm(message);

}


/* ==========================
   LOCAL STORAGE
========================== */

function saveLocal(key,value){

    localStorage.setItem(

        key,

        JSON.stringify(value)

    );

}

function getLocal(key){

    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : null;

}

function removeLocal(key){

    localStorage.removeItem(key);

}


/* ==========================
   FORMAT DATE
========================== */

function formatDate(dateString){

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN",{

        day:"2-digit",

        month:"short",

        year:"numeric"

    });

}


/* ==========================
   FORMAT TIME
========================== */

function formatTime(time){

    const date = new Date("1970-01-01T"+time);

    return date.toLocaleTimeString("en-IN",{

        hour:"2-digit",

        minute:"2-digit",

        hour12:true

    });

}


/* ==========================
   LOADER
========================== */

function showLoader(){

    const loader = document.getElementById("loader");

    if(loader){

        loader.style.display = "flex";

    }

}

function hideLoader(){

    const loader = document.getElementById("loader");

    if(loader){

        loader.style.display = "none";

    }

}

function showAlert(
    title,
    message,
    type="success",
    callback=null
){

    const overlay =
        document.getElementById(
            "customAlert"
        );

    const icon =
        document.getElementById(
            "alertIcon"
        );

    const heading =
        document.getElementById(
            "alertTitle"
        );

    const text =
        document.getElementById(
            "alertMessage"
        );

    const ok =
        document.getElementById(
            "alertOk"
        );

    heading.innerText = title;

    text.innerText = message;

    if(type==="success"){

        icon.innerHTML="✔";

        icon.style.background="#2ecc71";

    }

    else if(type==="error"){

        icon.innerHTML="✖";

        icon.style.background="#e74c3c";

    }

    else{

        icon.innerHTML="!";

        icon.style.background="#f39c12";

    }

    overlay.style.display="flex";

    ok.onclick=function(){

        overlay.style.display="none";

        if(callback){

            callback();

        }

    };

}