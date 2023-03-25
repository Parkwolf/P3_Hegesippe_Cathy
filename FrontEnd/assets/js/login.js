const loginPath = "http://localhost:5678/api/users/login";
//élément du formulaire contenant les informations de connexion
const form = document.getElementsByClassName("form-primary")[0].elements;
//pour la requête fecth
const headers = {
    "Content-type": "application/json",
  };
  // variables pour le message d'erreur
  let errorMsgElement; 


  function getUserLog() {
    const { email, password } = form;
    return { email: email.value, password: password.value };
  }


  function showErrorMsg(display) {
    if (!errorMsgElement) {
      errorMsgElement = document.createElement("p");
      errorMsgElement.classList.add("error-msg");
      errorMsgElement.innerHTML = "Erreur dans l'identifiant ou le mot de passe";
      document.getElementById("error-msg-log").appendChild(errorMsgElement);
    }
    errorMsgElement.style.display = display ? "block" : "none";
  }

  function handleResponse(res) {
    if (res.ok) { // vérifie la réponse
      return res.json();
    } else {
      return res.text().then(text => {
        throw new Error(text);
      });
    }
  }
  //On ajoute un evenemement pour la soumission du formulaire de connexion
  form["submit-login"].addEventListener("click", async function (event) {
    event.preventDefault(); // change le comprtement par défaut du formulaire
    const user = getUserLog(); // récupération de l'email et mdp du formulaire
    try {
      // requête POST au loginPath avec l'objet utilisateur comme corps de la requête
      const { token } = await fetch(loginPath, {
        method: "POST",
        headers,
        body: JSON.stringify(user),
      }).then(handleResponse);
      sessionStorage.setItem("token", token); // 
      location.href = "index.html"; //rediriger vers la page d'index
    } catch (err) {
      console.error(err); // mentionner l'erreur en cas d'erreur réseau ou d'identifiants de connexion invalides
      showErrorMsg(true); // message d'erreur 
    }
  });
  
  