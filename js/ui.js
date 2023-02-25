const menu = document.querySelector('#menu');

//render menu data from firestore

const renderMenu = (data, id) => {
    const html = `
    <section class="card col-sm-4 border-0 mt-3" data-id="${id}">
        <img class="card-img-top img-fluid" src="${data.img}" alt="${data.title}">
        <h6 class="card-header text-center">${data.title}</h6>
        <div class="card-body">
            <p>${data.ingredients}<br><br>
                ${data.description}
            </p>
            <h6>$${data.price.toFixed(2)}</h6>
        </div>
        <div class="card-footer">
            <a href="notes.html" class="btn btn-warning">Add Notes</a>
        </div>
    </section>
    `;
    menu.innerHTML += html;
};

// remove recipe
const removeMenu = (id) => {
    const removeMenu = document.querySelector(`#menu[data-id=${id}]`);
    removeMenu.remove();
};