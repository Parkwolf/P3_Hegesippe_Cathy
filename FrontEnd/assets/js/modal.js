
const focusElementSelector = 'button, input, a, textarea';
let focusElements = [];
let modalFocusElements = [];

// Filtre des éléments focussable qui sont pas dans la modale
focusElements = Array.from(document.querySelectorAll(focusElementSelector));
modalFocusElements = Array.from(document.querySelector('#edit-modal').querySelectorAll(focusElementSelector));
focusElements = focusElements.filter((element) => !modalFocusElements.includes(element));

function fetchCategories() {
	fetch("http://localhost:5678/api/categories", {
		method: "GET"
	})
		.then((response) => response.json())
		.then((categories) => {
			categories.forEach((category) => {
				const selectCategory = document.querySelector('#category');
				const option = document.createElement('option');
				option.value = category.id;
				option.innerText = category.name;

				selectCategory.appendChild(option);
			})
		});
}

function openModal() {
	// Montre la modale et change les attributs pour l'accessibilité
	const editModal = document.querySelector('#edit-modal');
	editModal.style.display = 'flex';
	editModal.removeAttribute('aria-hidden');
	editModal.setAttribute('aria-modal', true);

	// Ajoute les évènement pour fermer la modale
	editModal.addEventListener('click', closeModal);
	editModal.querySelectorAll('.close-modal').forEach((button) => button.addEventListener('click', closeModal));
	editModal.querySelector('.modal-wrapper').addEventListener('click', stopPropagation);

	// Ajout de l'évènement pour changer de page 
	editModal.querySelector('#add-picture').addEventListener('click', openUploadModalPage);
	editModal.querySelector('.previous-modal').addEventListener('click', closeUploadModalPage);

	// Add event to delete gallery
	editModal.querySelector('#delete-gallery').addEventListener('click', deleteAll);

	// Add event for picture preview
	editModal.querySelector('#image').addEventListener('change', updatePicturePreview);

	// Add events for enabling form submit
	editModal.querySelector('#image').addEventListener('change', enableUpload);
	editModal.querySelector('#title').addEventListener('input', enableUpload);
	editModal.querySelector('#category').addEventListener('change', enableUpload);

	// Add event for form submit
	editModal.querySelector('form').addEventListener('submit', uploadWork);

	// Disabling focusability on elements outside modal
	for (let element of focusElements) {
		element.setAttribute('tabindex', -1);
	}

	// Add gallery
	createEditGallery(works);

    //Add categories to form
	fetchCategories();
}

function closeModal() {
	// Hide modal (with delay for animation) and change attributes for accessibility
	const editModal = document.querySelector('#edit-modal');
	window.setTimeout(() => (editModal.style.display = null), 300);
	editModal.setAttribute('aria-hidden', true);
	editModal.removeAttribute('aria-modal');

	// Remove events to close modal
	editModal.removeEventListener('click', closeModal);
	editModal.querySelectorAll('.close-modal').forEach((button) => button.removeEventListener('click', closeModal));
	editModal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation);

	// Remove events to change page
	editModal.querySelector('#add-picture').removeEventListener('click', openUploadModalPage);
	editModal.querySelector('.previous-modal').removeEventListener('click', closeUploadModalPage);

	// Remove event to delete gallery
	editModal.querySelector('#delete-gallery').removeEventListener('click', deleteAll);

	// Remove event for picture preview
	editModal.querySelector('#image').removeEventListener('change', updatePicturePreview);

	// Remove event for form submit
	editModal.querySelector('form').removeEventListener('submit', uploadWork);

	// Enabling focusability on elements outside modal
	for (let element of focusElements) {
		element.removeAttribute('tabindex');
	}

	// Remove gallery
	const gallery = editModal.querySelector('.edit-gallery');
	gallery.innerHTML = '';

	// Remove categories from form
	const selectCategory = editModal.querySelector('#category');
	selectCategory.innerHTML = '';
}


// Function used to make sure click on modal wrapper wont close modal
function stopPropagation(event) {
	event.stopPropagation();
}


// Opening page for upload
function openUploadModalPage() {
	const galleryPage = document.querySelector('#gallery-modal-container');
	const uploadPage = document.querySelector('#add-picture-modal-container');

	galleryPage.style.display = 'none';
	galleryPage.setAttribute('aria-hidden', true);

	uploadPage.style.display = 'block';
	uploadPage.removeAttribute('aria-hidden');
}

// Closing page for upload
function closeUploadModalPage() {
	const galleryPage = document.querySelector('#gallery-modal-container');
	const uploadPage = document.querySelector('#add-picture-modal-container');

	galleryPage.style.display = null;
	galleryPage.removeAttribute('aria-hidden');

	uploadPage.style.display = null;
	uploadPage.setAttribute('aria-hidden', true);
}

// Add event to edit button for openning modal
const editWorksButton = document.querySelector('#edit-works');
editWorksButton.addEventListener('click', openModal);


// Add event to escape key for closing modal
window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' || event.key === 'Esc') {
		closeModal(event);
	}
});

// Fetching all works from API
let works;
fetchWorks();
async function fetchWorks() {
	const responseWorks = await fetch('http://localhost:5678/api/works');
	works = await responseWorks.json();
}

// Function that creates gallery using an array of works
function createEditGallery(works) {
	const gallery = document.querySelector('.edit-gallery');

	for (let work of works) {
		const figure = document.createElement('figure');
		gallery.appendChild(figure);

		 const deleteButton = document.createElement('button');
		deleteButton.addEventListener('click', () => {
		 	deleteWork(work.id);
		});

		const trashIcon = document.createElement('i');
		trashIcon.className = 'fa-solid fa-trash-can';
		deleteButton.appendChild(trashIcon);

		const moveButton = document.createElement('button');
		moveButton.className = 'move-button';
		const moveIcon = document.createElement('i');
		moveIcon.className = 'fa-solid fa-arrows-up-down-left-right';
		moveButton.appendChild(moveIcon);

		const img = document.createElement('img');
		img.src = work.imageUrl;
		img.alt = work.title;

		const figcaption = document.createElement('figcaption');
		figcaption.innerText = 'éditer';

		figure.appendChild(deleteButton);
		figure.appendChild(moveButton);
		figure.appendChild(img);
		figure.appendChild(figcaption);
	}
}


// Function that creates gallery using an array of works
function createGallery(works) {
	const gallery = document.querySelector('.gallery');

	for (let work of works) {
		const figure = document.createElement('figure');
		gallery.appendChild(figure);

		const img = document.createElement('img');
		img.src = work.imageUrl;
		img.alt = work.title;

		const figcaption = document.createElement('figcaption');
		figcaption.innerText = work.title;

		figure.appendChild(img);
		figure.appendChild(figcaption);
	}
}
// Function to delete a project
async function deleteWork(id) {
	const token = sessionStorage.getItem('token');

	const response = await fetch(`http://localhost:5678/api/works/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` },
	});

	document.querySelector('.edit-gallery').innerHTML = '';
	document.querySelector('.gallery').innerHTML = '';
	fetchWorks().then(() => {
		createEditGallery(works);
		createGallery(works);
	});
}

// Function to delete all projects
async function deleteAll(event) {
	event.preventDefault();

	const token = sessionStorage.getItem('token');

	for (let work of works) {
		const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` },
		});
	}

	document.querySelector('.edit-gallery').innerHTML = '';
	document.querySelector('.gallery').innerHTML = '';
	fetchWorks().then(() => {
		createEditGallery(works);
		createGallery(works);
	});
}

// Adding preview for file upload
function updatePicturePreview() {
	const pictureInput = document.querySelector('#image');
	const picturePreview = document.querySelector('#picture-preview');

	picturePreview.innerHTML = '';
	picturePreview.style.opacity = 0;

	if (pictureInput.files.length > 0) {
		// Alert if file is not valid type or size
		if (!isValidFileType(pictureInput.files[0]) || pictureInput.files[0].size > 4194304) {
			displayAlertBox('error', "Le fichier sélectionné n'est pas conforme", 3000);
			pictureInput.value = null;
			return;
		}

		const preview = document.createElement('img');
		preview.src = window.URL.createObjectURL(pictureInput.files[0]);
		preview.alt = 'Image preview';

		picturePreview.appendChild(preview);
		picturePreview.style.opacity = 1;
	}
}

// Checking type of file
function isValidFileType(file) {
	const validFileTypes = ['image/jpeg', 'image/png'];

	for (let type of validFileTypes) {
		if (file.type === type) {
			return true;
		}
	}

	return false;
}

// Enable upload form if all informations are filled
function enableUpload() {
	const form = document.querySelector('#add-picture-modal-container').querySelector('form');
	const fileInput = form.querySelector('#image');
	const titleInput = form.querySelector('#title');
	const categoryInput = form.querySelector('#category');

	form.querySelector('input[type="submit"]').disabled = !(fileInput.files.length > 0 && titleInput.value.length > 0 && categoryInput.value > 0);
}

// Upload new work
async function uploadWork(event) {
	event.preventDefault();

	const token = sessionStorage.getItem('token');
	const workData = new FormData(event.target);

	const responseUpload = await fetch('http://localhost:5678/api/works', {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: workData,
	});

	if (responseUpload.status === 201) {
		// Empty form inputs
		const form = event.target;
		form.image.value = null;
		form.title.value = null;
		form.category.value = null;
		updatePicturePreview();

		closeModal();

		// Refresh gallery
		document.querySelector('.gallery').innerHTML = '';
		fetchWorks().then(() => {
			createGallery(works);
		});
	}
}