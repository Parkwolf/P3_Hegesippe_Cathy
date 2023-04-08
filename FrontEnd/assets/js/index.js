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

      figcaptionItem.textContent = work.title;
      imgItem.src = `${work.imageUrl}`;

      workList.appendChild(figureItem);
      figureItem.appendChild(imgItem);
      figureItem.appendChild(figcaptionItem);
    });
  })
  .catch((error) => console.error(error));


//On récupère la liste de toutes les catégories

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
