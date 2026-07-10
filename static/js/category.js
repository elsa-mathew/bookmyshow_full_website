console.log("CATEGORY JS LOADED");

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

let selectedCategoryId = null;

const categoryModal =
    document.getElementById(
        "categoryModal"
    );

const openCategoryBtn =
    document.getElementById(
        "openCategoryModal"
    );

const closeCategoryBtn =
    document.getElementById(
        "closeCategoryModal"
    );

let selectedSubcategoryId =
    null;

const subcategoryModal =
    document.getElementById(
        "subcategoryModal"
    );

const openSubcategoryBtn =
    document.getElementById(
        "openSubcategoryModal"
    );

const closeSubcategoryBtn =
    document.getElementById(
        "closeSubcategoryModal"
    );

openCategoryBtn.addEventListener(
    "click",
    function(){

        selectedCategoryId = null;

        document
        .getElementById(
            "categoryName"
        ).value = "";

        document
        .getElementById(
            "categoryStatus"
        ).value = "active";

        document
        .getElementById(
            "modalTitle"
        ).innerText =
            "Add Category";

        document
        .getElementById(
            "deleteCategory"
        ).style.display =
            "none";

        categoryModal.style.display =
            "flex";

    }
);

closeCategoryBtn.addEventListener(
    "click",
    function(){

        categoryModal.style.display =
            "none";

    }
);

window.addEventListener(
    "click",
    function(event){

        if(
            event.target ===
            categoryModal
        ){

            categoryModal.style.display =
                "none";

        }

    }
);

const saveCategoryBtn =
    document.getElementById(
        "saveCategory"
    );

saveCategoryBtn.addEventListener(
    "click",
    async function(){

        const name =
            document
            .getElementById(
                "categoryName"
            )
            .value
            .trim();

        const status =
            document
            .getElementById(
                "categoryStatus"
            )
            .value;

        if(!name){

    showAlert(

        "Validation",

        "Please enter category name.",

        "warning"

    );

    return;

}

        let url =
            "/api/adminapp/api/categories/add/";

        let method =
            "POST";

        if(selectedCategoryId){

            url =
                `/api/adminapp/api/categories/update/${selectedCategoryId}/`;

            method =
                "PUT";

        }

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
                            getCookie(
                                "csrftoken"
                            )

                    },

                    body:JSON.stringify({

                        name:name,

                        status:status

                    })

                }
            );

        const data =
            await response.json();

        console.log(data);

       if(response.ok){

    showAlert(

        "Success",

        selectedCategoryId

        ?

        "Category updated successfully."

        :

        "Category added successfully.",

        "success",

        function(){

            location.reload();

        }

    );

}
        else{

    showAlert(

        "Error",

        data.error || data.message || "Something went wrong.",

        "error"

    );

}

    }
);

document
.querySelectorAll(
    ".category-item"
)
.forEach(item => {

    item.addEventListener(
        "dblclick",
        function(){

            selectedCategoryId =
                this.dataset.id;

            document
            .getElementById(
                "categoryName"
            ).value =
                this.dataset.name;

            document
            .getElementById(
                "modalTitle"
            ).innerText =
                "Edit Category";

            document
            .getElementById(
                "deleteCategory"
            ).style.display =
                "inline-block";

            categoryModal.style.display =
                "flex";

        }
    );

});

const deleteCategoryBtn =
    document.getElementById(
        "deleteCategory"
    );

deleteCategoryBtn.addEventListener(
    "click",
    async function(){

        if(
            !selectedCategoryId
        ){

            return;

        }

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this category?"
            );

        if(
            !confirmDelete
        ){

            return;

        }

        const response =
            await fetch(
                `/api/adminapp/api/categories/delete/${selectedCategoryId}/`,
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

        console.log(data);

        if(response.ok){

    showAlert(

        "Category Deleted",

        data.message,

        "success",

        () => location.reload()

    );

}
else{

    showAlert(

        "Deletion Failed",

        data.error || "Unable to delete the category.",

        "error"

    );

}
        

    }
);


openSubcategoryBtn.addEventListener(
    "click",
    function(){

        selectedSubcategoryId =
            null;

        document
        .getElementById(
            "subcategoryName"
        ).value = "";

        document
        .getElementById(
            "subcategoryStatus"
        ).value = "active";

        document
        .getElementById(
            "subcategoryModalTitle"
        ).innerText =
            "Add Subcategory";

        document
        .getElementById(
            "deleteSubcategory"
        ).style.display =
            "none";

        if(
            selectedCategoryId
        ){

            document
            .getElementById(
                "subcategoryCategory"
            ).value =
                selectedCategoryId;

        }

        subcategoryModal.style.display =
            "flex";

    }
);

closeSubcategoryBtn.addEventListener(
    "click",
    function(){

        subcategoryModal.style.display =
            "none";

    }
);

window.addEventListener(
    "click",
    function(event){

        if(
            event.target ===
            subcategoryModal
        ){

            subcategoryModal.style.display =
                "none";

        }

    }
);

document
.querySelectorAll(
    ".category-item"
)
.forEach(item => {

    item.addEventListener(
        "click",
        async function(){

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

            container.innerHTML =
                "";

            data.forEach(
                subcategory => {

                    container.innerHTML +=
                    `
                    <div
                        class="item subcategory-item"
                        data-id="${subcategory.id}"
                        data-name="${subcategory.name}"
                        data-status="${subcategory.status}"
                        data-category="${subcategory.category}"
                    >

                        ${subcategory.name}

                    </div>
                    `;

                }
            );

            attachSubcategoryEvents();

        }
    );

});

function attachSubcategoryEvents(){

    document
    .querySelectorAll(
        ".subcategory-item"
    )
    .forEach(item => {

        item.addEventListener(
            "dblclick",
            function(){

                selectedSubcategoryId =
                    this.dataset.id;

                document
                .getElementById(
                    "subcategoryName"
                ).value =
                    this.dataset.name;

                document
                .getElementById(
                    "subcategoryStatus"
                ).value =
                    this.dataset.status;

                document
                .getElementById(
                    "subcategoryCategory"
                ).value =
                    this.dataset.category;

                document
                .getElementById(
                    "subcategoryModalTitle"
                ).innerText =
                    "Edit Subcategory";

                document
                .getElementById(
                    "deleteSubcategory"
                ).style.display =
                    "block";

                subcategoryModal.style.display =
                    "flex";

            }
        );

    });

}

const saveSubcategoryBtn =
    document.getElementById(
        "saveSubcategory"
    );

saveSubcategoryBtn.addEventListener(
    "click",
    async function(){

        const category =
            document
            .getElementById(
                "subcategoryCategory"
            )
            .value;

        const name =
            document
            .getElementById(
                "subcategoryName"
            )
            .value
            .trim();

        const status =
            document
            .getElementById(
                "subcategoryStatus"
            )
            .value;

        if(!name){

            alert(
                "Please enter subcategory name"
            );

            return;

        }

        let url =
            "/api/adminapp/api/subcategories/add/";

        let method =
            "POST";

        if(selectedSubcategoryId){

            url =
                `/api/adminapp/api/subcategories/update/${selectedSubcategoryId}/`;

            method =
                "PUT";

        }

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
                            getCookie(
                                "csrftoken"
                            )

                    },

                    body:JSON.stringify({

                        category:category,

                        name:name,

                        status:status

                    })

                }
            );

        const data =
            await response.json();

        console.log(data);

        if(response.ok){

            alert(

                selectedSubcategoryId

                ?

                "Subcategory Updated Successfully"

                :

                "Subcategory Added Successfully"

            );

            location.reload();

        }
        else{

            alert(
                JSON.stringify(data)
            );

        }

    }
);

const deleteSubcategoryBtn =
    document.getElementById(
        "deleteSubcategory"
    );

deleteSubcategoryBtn.addEventListener(
    "click",
    async function(){

        if(
            !selectedSubcategoryId
        ){

            return;

        }

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this subcategory?"
            );

        if(
            !confirmDelete
        ){

            return;

        }

        const response =
            await fetch(
                `/api/adminapp/api/subcategories/delete/${selectedSubcategoryId}/`,
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

        console.log(data);

        if(response.ok){

            alert(
                data.message
            );

            location.reload();

        }
        else{

            alert(
                data.error ||
                "Unable to delete subcategory"
            );

        }

    }
);