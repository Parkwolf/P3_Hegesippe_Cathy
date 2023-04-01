//charge tous les modules et panneaux d'administration, au cas où nous nous connecterions
const token = sessionStorage.getItem("token");
const editButtons = document.querySelectorAll('.edit');
const editBanner = document.querySelector('#edit-banner');
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

if (token != null) {
    let login = document.querySelector("nav div a[href='login.html']")

    changeInnerHtml(login, "logout");
    logOut(login);
    // Display edit buttons
	for (let button of editButtons) {
		button.style.display='flex';
		button.removeAttribute('aria-hidden');
	}

    // Display edit banner
	editBanner.style.display = 'flex';
	editBanner.removeAttribute('aria-hidden');


}
