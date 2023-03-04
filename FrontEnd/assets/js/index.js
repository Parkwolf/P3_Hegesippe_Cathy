//On récupère la liste de tout les works
fetch("http://localhost:5678/api/works", {
  method: "GET"
})
  .then((response) => response.json())
  .then((data) => {
    data.forEach((work) => {
      const workList = document.getElementById("works");
      const figureItem = document.createElement("figure");
      // On ajoute une classe a la balise figure
      figureItem.classList.add('work-item');
      // On crée un attribut dans lequel on donne un id
      figureItem.setAttribute('attribut-categorie',work.categoryId);
      const imgItem = document.createElement("img");
      const figcaptionItem = document.createElement("figcaption");

      //On cree les attribut pour la balise img
     // imgItem.setAttribute("cross origin","anonymous");

      figcaptionItem.textContent = work.title;
      imgItem.src = `${work.imageUrl}`;

      workList.appendChild(figureItem);
      figureItem.appendChild(imgItem);
      figureItem.appendChild(figcaptionItem);
    });
  })
  .catch((error) => console.error(error));

/* 
Ce code effectue une requête GET pour récupérer des données JSON à partir de l'URL http://localhost:5678/api/works. Les données sont ensuite utilisées pour ajouter des éléments HTML à la page. Les options method et headers sont utilisées pour spécifier que nous voulons récupérer des données JSON avec la méthode GET et que le type de contenu des données est application/json. Une fois la réponse reçue, la méthode .json() est utilisée pour extraire les données JSON. Ensuite, chaque objet dans les données est parcouru avec une boucle forEach(), et pour chaque objet, un élément HTML de type figure est créé avec une image et une légende, qui sont ajoutés à la page. Si une erreur se produit, un message d'erreur est affiché dans la console du navigateur.
*/

//On récupère la liste de toutes les catégories//On récupère la liste de tout les works

fetch("http://localhost:5678/api/categories",{
  method: "GET"
})
.then((response) => response.json()) 
.then((categories)=> {categories.unshift({
  id: 0,
  name: "Tous",
});

const categoriesContainer = document.getElementById('categories');

categories.forEach((category)=>{
  let button = document.createElement('button');
  button.innerHTML = category.name;
  button.setAttribute('attribut-categorie',category.id);

categoriesContainer.appendChild(button);

/* On ajoute levent click pour le trie button*/
button.addEventListener("click",function(){
  let currentCategory = button.getAttribute("attribut-categorie");
  let works = document.querySelectorAll('.work-item');
  works.forEach((item)=>{
    item.classList.remove('hide-work');
    if(
      item.getAttribute('attribut-categorie') !== currentCategory && currentCategory !== '0'
    ){
      item.classList.add("hide-work");
    }
  })
})
});
});
