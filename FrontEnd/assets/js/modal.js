
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

	// Ajouter un événement pour supprimer la galerie
	editModal.querySelector('#delete-gallery').addEventListener('click', deleteAll);

	// Ajouter un événement pour l'aperçu de l'image
	editModal.querySelector('#image').addEventListener('change', updatePicturePreview);

	// Ajout des événements pour activer la soumission de formulaire
	editModal.querySelector('#image').addEventListener('change', enableUpload);
	editModal.querySelector('#title').addEventListener('input', enableUpload);
	editModal.querySelector('#category').addEventListener('change', enableUpload);

	// Ajout un événement pour la soumission du formulaire
	editModal.querySelector('form').addEventListener('submit', uploadWork);

	// Désactivation de la focalisation sur les éléments hors modal
	for (let element of focusElements) {
		element.setAttribute('tabindex', -1);
	}

	// Ajout une galerie
	createEditGallery(works);

    //Ajout des catégories au formulaire
	fetchCategories();
}

function closeModal() {
	// Masquer modal (avec délai pour l'animation) et modifier les attributs pour l'accessibilité
	const editModal = document.querySelector('#edit-modal');
	window.setTimeout(() => (editModal.style.display = null), 300);
	editModal.setAttribute('aria-hidden', true);
	editModal.removeAttribute('aria-modal');

	// Supprimer les événements pour fermer le modal
	editModal.removeEventListener('click', closeModal);
	editModal.querySelectorAll('.close-modal').forEach((button) => button.removeEventListener('click', closeModal));
	editModal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation);

	// Supprimer les événements pour changer de page
	editModal.querySelector('#add-picture').removeEventListener('click', openUploadModalPage);
	editModal.querySelector('.previous-modal').removeEventListener('click', closeUploadModalPage);

	// Supprimer l'événement pour supprimer la galerie
	editModal.querySelector('#delete-gallery').removeEventListener('click', deleteAll);

	// Supprimer l'événement pour l'aperçu de l'image
	editModal.querySelector('#image').removeEventListener('change', updatePicturePreview);

	// Supprimer l'événement pour la soumission du formulaire
	editModal.querySelector('form').removeEventListener('submit', uploadWork);

	// Activation de la focalisation sur des éléments hors modal
	for (let element of focusElements) {
		element.removeAttribute('tabindex');
	}

	// Supprimer la galerie
	const gallery = editModal.querySelector('.edit-gallery');
	gallery.innerHTML = '';

	// Supprimer les catégories du formulaire
	const selectCategory = editModal.querySelector('#category');
	selectCategory.innerHTML = '';
}


//Fonction utilisée pour s'assurer que cliquer sur le wrapper modal ne fermera pas la modal
function stopPropagation(event) {
	event.stopPropagation();
}


//Page d'ouverture pour le téléchargement
function openUploadModalPage() {
	const galleryPage = document.querySelector('#gallery-modal-container');
	const uploadPage = document.querySelector('#add-picture-modal-container');

	galleryPage.style.display = 'none';
	galleryPage.setAttribute('aria-hidden', true);

	uploadPage.style.display = 'block';
	uploadPage.removeAttribute('aria-hidden');
}

// Fermeture de la page pour le téléchargement
function closeUploadModalPage() {
	const galleryPage = document.querySelector('#gallery-modal-container');
	const uploadPage = document.querySelector('#add-picture-modal-container');

	galleryPage.style.display = null;
	galleryPage.removeAttribute('aria-hidden');

	uploadPage.style.display = null;
	uploadPage.setAttribute('aria-hidden', true);
}

// Ajouter un événement au bouton d'édition pour l'ouverture modale
const editWorksButton = document.querySelector('#edit-works');
editWorksButton.addEventListener('click', openModal);


//Ajouter un événement à la touche d'échappement pour fermer la modal
window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' || event.key === 'Esc') {
		closeModal(event);
	}
});

// Récupérer toutes les works de l'API
let works;
fetchWorks();
async function fetchWorks() {
	const responseWorks = await fetch('http://localhost:5678/api/works');
	works = await responseWorks.json();
}

// Fonction qui crée une galerie en utilisant un tableau
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


// Fonction qui crée une galerie en utilisant un tableau 
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
// Fonction pour supprimer un projet
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

// Fonction pour supprimer tous les projets
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

// Ajout d'un aperçu pour le téléchargement de fichiers
function updatePicturePreview() {
	const pictureInput = document.querySelector('#image');
	const picturePreview = document.querySelector('#picture-preview');

	picturePreview.innerHTML = '';
	picturePreview.style.opacity = 0;

	if (pictureInput.files.length > 0) {
		// Alerte si le type ou la taille du fichier n'est pas valide
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

// Vérification du type de fichier
function isValidFileType(file) {
	const validFileTypes = ['image/jpeg', 'image/png'];

	for (let type of validFileTypes) {
		if (file.type === type) {
			return true;
		}
	}

	return false;
}

// Activer le formulaire de téléchargement si toutes les informations sont renseignées
function enableUpload() {
	const form = document.querySelector('#add-picture-modal-container').querySelector('form');
	const fileInput = form.querySelector('#image');
	const titleInput = form.querySelector('#title');
	const categoryInput = form.querySelector('#category');

	form.querySelector('input[type="submit"]').disabled = !(fileInput.files.length > 0 && titleInput.value.length > 0 && categoryInput.value > 0);
}

// Télécharger un nouveau work
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
		// Entrées de formulaire vides
		const form = event.target;
		form.image.value = null;
		form.title.value = null;
		form.category.value = null;
		updatePicturePreview();

		closeModal();

		// Actualiser la galerie
		document.querySelector('.gallery').innerHTML = '';
		fetchWorks().then(() => {
			createGallery(works);
		});
	}
}