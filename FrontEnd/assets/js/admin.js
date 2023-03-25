//charge tous les modules et panneaux d'administration, au cas où nous nous connecterions
const token = sessionStorage.getItem("token");

/*modification du texte lorsque connecté*/
function changeInnerHtml(element, newInnerHtml) {
    element.innerHTML = newInnerHtml;
}

function logOut(element) {
    element.setAttribute('href', 'index.html');
    element.addEventListener('click', function() {
        sessionStorage.clear();
    })   
}

/*modification du header lorsque connecté*/
function addHeaderEditionMode(element) {
    let button = document.createElement('button');
    let icon = document.createElement('i');
    let span = document.createElement('span');

    element?.classList.add('header-edition');

    element?.appendChild(span)
    addIconWord(span, icon, 'Mode édition');

    element.appendChild(button).innerHTML = "publier les changements";
}

//ajout "modifier" avec le bouton icône à toutes les classes 'js-edit'it'
function addEditButtons() {
    let elements = document?.querySelectorAll('.modifier');

    elements.forEach(a => {
        let icon = document?.createElement('i');
        addIconWord(a, icon, 'modifier');
    });
}

//ajouter le même mode "modificateur" avec l'icône d'édition
function addIconWord(element, icon, string) {
    element.appendChild(icon)
    .classList.add('fa-solid', 'fa-pen-to-square');
    icon.style.margin = "8px 8px 8px 0";
    icon.insertAdjacentHTML('afterend', string);
}

if (token != null) {
    let login = document.querySelector("nav div a[href='login.html']");
    let headerEditionElt = document.getElementById('header-edition-mode');

    changeInnerHtml(login, "logout");
    logOut(login);
    addHeaderEditionMode(headerEditionElt);
    addEditButtons();
};
