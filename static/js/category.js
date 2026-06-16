let selectedCategoryId = null;
let selectedSubcategoryId = null;
const modal = document.getElementById("categoryModal");

document.getElementById("openCategoryModal").onclick = function(){

    selectedCategoryId = null;

    document.getElementById("categoryName").value = "";

    modal.style.display = "flex";
};

document.getElementById("closeCategoryModal").onclick = function(){

    modal.style.display = "none";
};

document.getElementById("saveCategory")
.addEventListener("click", async function(){

    const name =
        document.getElementById("categoryName").value;

    const status =
        document.getElementById("categoryStatus").value;

    let url;
    let method;

    if(selectedCategoryId){

        url = `/api/adminapp/api/categories/update/${selectedCategoryId}/`;
        method = "PUT";

    }else{

        url = "/api/adminapp/api/categories/add/";
        method = "POST";
    }

    const response = await fetch(url, {

        method: method,

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            name: name,
            status: status
        })

    });

    const data = await response.json();

    console.log(data);

    location.reload();

});

document.querySelectorAll(".item").forEach(item => {

    item.addEventListener("dblclick", function(){

        selectedCategoryId = this.dataset.id;

        document.getElementById("categoryName").value =
            this.dataset.name;

        document.getElementById("deleteCategory").style.display = "block";

        modal.style.display = "flex";

    });

});

document.getElementById("openCategoryModal").onclick = function(){

    selectedCategoryId = null;

    document.getElementById("categoryName").value = "";

    document.getElementById("deleteCategory").style.display = "none";

    modal.style.display = "flex";
};

document.getElementById("deleteCategory")
.addEventListener("click", async function(){

    if(!selectedCategoryId){
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this category?"
    );

    if(!confirmDelete){
        return;
    }

    const response = await fetch(
    `/api/adminapp/api/categories/delete/${selectedCategoryId}/`,
    {
        method:"DELETE"
    }
);

const data = await response.json();

if(response.ok){

    alert(data.message);

    location.reload();

}else{

    alert(data.error);

}

});

const subcategoryModal =
    document.getElementById("subcategoryModal");


document
.querySelectorAll(".category-item")
.forEach(item => {

    item.addEventListener("click", async function(){

        selectedCategoryId =
            this.dataset.id;

        const response =
            await fetch(
                `/api/adminapp/api/subcategories/${selectedCategoryId}/`
            );

        const data =
            await response.json();

        const container =
            document.getElementById(
                "subcategoryContainer"
            );

        container.innerHTML = "";

        data.forEach(subcategory => {

            container.innerHTML += `
                <div
                    class="item subcategory-item"
                    data-id="${subcategory.id}"
                    data-name="${subcategory.name}"
                >
                    ${subcategory.name}
                </div>
            `;

        });

     
        document
        .querySelectorAll(".subcategory-item")
        .forEach(item => {

            item.addEventListener("dblclick", function(){

                selectedSubcategoryId =
                    this.dataset.id;

                document.getElementById(
                    "subcategoryName"
                ).value =
                    this.dataset.name;

                document.getElementById(
                    "deleteSubcategory"
                ).style.display = "block";

                subcategoryModal.style.display =
                    "flex";

            });

        });

    });

});

document
.getElementById("openSubcategoryModal")
.onclick = function(){

    selectedSubcategoryId = null;

    document.getElementById(
        "subcategoryName"
    ).value = "";

    document.getElementById(
        "deleteSubcategory"
    ).style.display = "none";

    if(selectedCategoryId){

        document.getElementById(
            "subcategoryCategory"
        ).value = selectedCategoryId;

    }

    subcategoryModal.style.display =
        "flex";
};

document
.getElementById("closeSubcategoryModal")
.onclick = function(){

    subcategoryModal.style.display =
        "none";
};


document
.getElementById("saveSubcategory")
.addEventListener("click", async function(){

    const category =
        document.getElementById(
            "subcategoryCategory"
        ).value;

    const name =
        document.getElementById(
            "subcategoryName"
        ).value;

    const status =
        document.getElementById(
            "subcategoryStatus"
        ).value;

    let response;

    if(selectedSubcategoryId){

        response =
            await fetch(
                `/api/adminapp/api/subcategories/update/${selectedSubcategoryId}/`,
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({
                        category:category,
                        name:name,
                        status:status
                    })
                }
            );

    }else{

        response =
            await fetch(
                "/api/adminapp/api/subcategories/add/",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({
                        category:category,
                        name:name,
                        status:status
                    })
                }
            );

    }

    const data =
        await response.json();

    if(response.ok){

        alert(
            selectedSubcategoryId
            ? "Subcategory Updated Successfully"
            : "Subcategory Added Successfully"
        );

        setTimeout(() => {

            location.reload();

        }, 500);

    }else{

        alert(
            Object.values(data)[0][0]
        );

    }

});