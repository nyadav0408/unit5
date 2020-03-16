const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');
let employees;

/**
* makes the modal container
*/ 
const modalContainer = document.createElement('div');
modalContainer.className = 'modal-container';

/**
 * fethes the data from random user 
 */

fetch('https://randomuser.me/api/?results=12&nat=us,au,ca,gb,nz')
    .then(checkStatus)
    .then(data => showEmployees(data.results))

/**
 * checks status of response
 * @param response
 * @return json or error
 */

function checkStatus(response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(`There was an error`);
    }
}
/**
 * puts employees on the page
 *@param data from api
 */
function showEmployees(data) {
    employees = data;
    data.forEach(employee => {
        const card = document.createElement('div');
        card.className = 'card';
        let info = `
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        `;
        card.innerHTML = info;
        gallery.appendChild(card);
    });
}

/**
 *shows the modal window on the screen for the employee that the user clicked on
 *@param card-> from page that user clicked
 */
function showModal(card) {

    // uses the email on the card to find the correct employee that the user clicked on
    let email = card.lastElementChild.firstElementChild.nextElementSibling.textContent;
    let employee = employees.find(employee => employee.email === email);

    // creates the information inside the modal window
    let info = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${employee.phone}</p>
                <p class="modal-text">${employee.location.street}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                <p class="modal-text">Birthday: ${(employee.dob.date)}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `;
    modalContainer.innerHTML = info;
    body.appendChild(modalContainer);
}

/**
 * removes the modal window from the screen
 */ 
function closeModal() {
    body.removeChild(modalContainer);
}

/**
 * toggle between the employees on the screen for the modal window
 * @param event
 */ 
function toggleEmployee(event) {
    let employeeList = Array.from(document.getElementsByClassName('card'));
    let modal = event.target.parentElement.previousElementSibling;
    let name = modal.lastElementChild.firstElementChild.nextElementSibling.textContent;
    modal.style.display = 'none';

    let currentEmployee = employeeList.filter(card => card.lastElementChild.firstElementChild.textContent === name);
    let adjEmployee;
    let index;
    if (event.target.id === 'modal-prev') {
        adjEmployee = currentEmployee[0].previousElementSibling;
        index = employeeList.length - 1;
    } else if (event.target.id === 'modal-next') {
        adjEmployee = currentEmployee[0].nextElementSibling;
        index = 0;
    }

    //show the modal for the correct adjacent employee and handles the end of the array
    if (adjEmployee) {
        showModal(adjEmployee);
    } else {
        showModal(employeeList[index]);
    }
}


/**
 *  adds a search element
 */
function addSearch() {
    let info = `<form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#xf002;" id="search-submit" class="search-submit">
        </form>`;
    searchContainer.innerHTML = info;
}

/**
 * creates search button functionality
 * @param event
 */
function search(event) {
    let searchValue = event.target.firstElementChild.value.toLowerCase();
    let employeeList = Array.from(document.querySelectorAll('.card'));
    let matched = employeeList.filter(card => card.lastElementChild.firstElementChild.textContent.toLowerCase().includes(searchValue));
    employeeList.forEach(card => gallery.removeChild(card));
    
    // shows the matched cards from the search
    if (matched.length > 0) {
        matched.forEach(card => gallery.appendChild(card));

    } else {
        // shows message that no employees were found
        let msg = document.createElement('h3');
        msg.textContent = 'Sorry no employees were found.';
        gallery.appendChild(msg);
    }
}
addSearch();  

/**
 *registering when the user clicks on an employee card
 */ 
gallery.addEventListener('click', function(event) {
    if (event.target.className !== 'gallery') {
        showModal(event.target.closest('.card'));
    }
});

/**
 * closes the modal window when the user clicks the x button
 */
body.addEventListener('click', function(event) {
    if (event.target.textContent === 'X' || event.target.className === 'modal-close-btn') {
        closeModal();
    }
});

/**
 * calls action for the toggleEmployee function based on clicks
 */
body.addEventListener('click', function(event) {
    if (event.target.id === 'modal-prev' || event.target.id === 'modal-next') {
        toggleEmployee(event);
    }
});

/**
 * starts the search function when the search form is submitted
 */
searchContainer.addEventListener('submit', function(event) {
    search(event);
});
