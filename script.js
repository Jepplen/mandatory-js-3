
// Skapar "några" globala element så jag kommer åt dem överallt.

let body = document.querySelector("body");
let main = document.createElement("main");
let imageContainer = document.createElement("div");
let dogBreed = document.createElement("h1");
let dogSubBreed = document.createElement("h1");
let h1 = document.createElement("h1");
let buttonContainer = document.createElement("div");
let refreshButton = document.createElement("button");
let header = document.createElement("header");
let headerImageContainer = document.createElement("div");
let headerImage = document.createElement("img");
let headerTitle = document.createElement("h1");
let selectionContainer = document.createElement("div");
let selectTwo = document.createElement("select");

headerTitle.className = "headerTitle";
headerTitle.textContent = "Dogs";
refreshButton.textContent = "I want more dogs!";
selectionContainer.className = "selectionContainer";
selectTwo.className = "selectTwo";
dogBreed.className = "dogBreed"
dogSubBreed.className = "dogSubBreed"
imageContainer.className = "imageContainer";
buttonContainer.className = "buttonContainer";
headerImageContainer.className = "headerImageContainer";
headerImage.className = "headerImage";
headerImage.src = "./resources/dog.png"

main.appendChild(dogBreed);
main.appendChild(dogSubBreed);
main.appendChild(h1);
main.appendChild(imageContainer);
body.appendChild(header);
header.appendChild(headerImageContainer);
headerImageContainer.appendChild(headerImage);
headerImageContainer.appendChild(headerTitle);
header.appendChild(selectionContainer);
selectionContainer.appendChild(selectTwo);
header.appendChild(buttonContainer)
buttonContainer.appendChild(refreshButton);

let event = false; // En bool som ser till att Eventlyssnaren på sub-breed dropdown-listan endast sätts en gång.

// getAllBreeds(), hämtar alla huvudraser från servern
function getAllBreeds() {
  axios.get('https://dog.ceo/api/breeds/list/all')
    .then(function (response) {
      renderAllBreeds(response.data.message); // renderar dropdown-listan med huvudraserna
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}


// renderAllBreed(), renderar dropdown listan på samtliga huvudraser
function renderAllBreeds(data) {
  let selectOne = document.createElement("select");
  selectOne.className = "selectOne";
  body.appendChild(main);
  selectionContainer.appendChild(selectOne);
  selectionContainer.insertBefore(selectOne, selectTwo);
  selectOneOption = document.createElement("option");
  selectOneOption.innerHTML = "-------- select a breed ---------";
  selectOneOption.setAttribute("value", "");
  selectOne.appendChild(selectOneOption);

  // För varje hundras körs den här koden
  for (let dogs in data) {
    let dogLowerCase = dogs;
    let dogCapitalized = dogLowerCase.charAt(0).toUpperCase() + dogLowerCase.substring(1);
    let optionOne = document.createElement("option");
    optionOne.setAttribute("value", dogs);
    optionOne.textContent = dogCapitalized;
    selectOne.appendChild(optionOne);
  }

  // Skapar en eventlyssnare på huvudras dropdown-listan
  selectOne.addEventListener("change", function(e) {

    const defaultValue = "";

    // Om hash-värdet är tomt aå beyder det att option titeln är vald, återgår då till förstaläget
    // Annars, rendera subras-listan och bilderna på huvudrasen
    if (this.value === defaultValue) {

      removeHash(); // tar bort hash från window.location så at sidan återgår till förstaläget

      selectionContainer.removeChild(selectOne);
      dogBreed.textContent = "";
      dogSubBreed.textContent = "";
      selectTwo.style.display = "none";
      checkPage();
      getAllBreeds();
    } else {
        window.location.hash = this.value;
        getSubBreeds();
        getBreedDogs();
    }
    imageContainer.innerHTML = "";
  });
}


// getSubBreeds(), hämtar listan med subraserna och kallar på renderSubBreed(), som renderar drop-downlistan
function getSubBreeds() {
  let currentBreed = window.location.hash.substring(1).split("-")[0];
  axios.get("https://dog.ceo/api/breed/" + currentBreed + "/list")
    .then(function (response) {
      renderSubBreeds(response.data.message);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}


// renderSubBreeds(), renderar listan för subraserna
function renderSubBreeds(data) {

  selectTwo.innerHTML = "";

  // Om data arrayns längd är större än noll, då finns det en subras och ska renderas
  // Annars ska dropdown-listan för subraserna gömmas
  if (data.length > 0) {
    let currentBreed = window.location.hash.substring(1).split("-")[0];
    selectTwo.style.display = "block";
    selectTwoOption = document.createElement("option");
    selectTwoOption.innerHTML = "------ select a sub-breed ------";
    selectTwoOption.setAttribute("value", "");
    selectTwo.appendChild(selectTwoOption);

    for (let subBreed of data) {
      let subBreedLowerCase = subBreed;
      let subBreedCapitalized = subBreedLowerCase.charAt(0).toUpperCase() + subBreedLowerCase.substring(1);
      let optionTwo = document.createElement("option");
      optionTwo.setAttribute("value", subBreed);
      optionTwo.innerHTML = subBreedCapitalized;
      selectTwo.appendChild(optionTwo);
    }

    // Ser till att det bara skapas en enda eventlyssnare under hela sidans livstid (hard refresh of page (F5))
    if (event === false) {
      // Skapar en eventlyssnare på alla subras dropdown-listan
      selectTwo.addEventListener("change", function(e) {
        const defaultSubValue = "";

        // Om värdet för subrasen är tom, betyder det att titel option-en har valts
        // och då ska istället huvudrasen renderas
        // Annars ska den valda subrasens bilder renderas
        if (this.value === defaultSubValue) {
          let windowLocation = window.location.hash.substring(1).split("-")[0];
          window.location.hash = windowLocation;
          dogBreed.textContent = "";
          dogSubBreed.textContent = "";
          imageContainer.innerHTML = "";
          getSubBreeds();
          getBreedDogs();
        } else {
          let windowLocationSub = window.location.hash.substring(1).split("-")[0] + "-" + this.value;
          window.location.hash = windowLocationSub;
          imageContainer.innerHTML = "";
          getBreedDogs();
        }
      });
      event = true;
    }
  } else {
    selectTwo.style.display = "none";
  }
}


// getRandomDogs(), hämtar tre stycken slumpmässiga hundbilder oavsett ras eller subras
function getRandomDogs() {
  getCurrentBreed = window.location.hash.substring(1);
  axios.get("https://dog.ceo/api/breeds/image/random/3")
    .then(function (response) {
      renderRandomDogs(response.data.message); // Kallar på renderRandomDogs() och skickar med svarsdatan från servern
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}


// renderRandomDogs(), renderar ut bilderna i DOM'en.
function renderRandomDogs(data) {

  for (let image of data) {
    let imageDiv = document.createElement("div");
    imageDiv.className = "imageDiv";
    let img = document.createElement("img");
    img.src = image;
    imageContainer.appendChild(imageDiv);
    imageDiv.appendChild(img);
  }
}


// getBreedDogs(), hämtar bilder på subraserna från servern baserat på hash-värdet
function getBreedDogs() {
  let currentBreed = window.location.hash.substring(1).replace("-", "/");

  axios.get("https://dog.ceo/api/breed/" + currentBreed + "/images/random/3")
    .then(function (response) {
      renderBreedDogs(response.data.message);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

}


// renderBreedDogs(), renderar tre slumpmässiga bilder från vald subras
function renderBreedDogs(data) {

  for (let image of data) {
    let imageDiv = document.createElement("div");
    imageDiv.className = "imageDiv";
    let img = document.createElement("img");
    img.src = image;
    imageContainer.appendChild(imageDiv);
    imageDiv.appendChild(img);
  }

  setCurrentBreed(); //

}


// setCurrentBreed(), sätter och renderar ut huvudras och eventuell subras till DOM'en.
function setCurrentBreed() {

  let hash = window.location.hash.substring(1).split("-");
  dogBreed.textContent = "";
  dogSubBreed.textContent = "";

  if (hash.length === 2) {
    let dogBreedLower = hash[0];
    let dogSubBreedLower = hash[1];
    let dogBreedTextUpper = dogBreedLower.charAt(0).toUpperCase() + dogBreedLower.substring(1);
    let dogSubBreedTextUpper = dogSubBreedLower.charAt(0).toUpperCase() + dogSubBreedLower.substring(1);
    dogBreed.textContent = "Breed: " + dogBreedTextUpper;
    dogSubBreed.textContent = "Sub-breed: " + dogSubBreedTextUpper;
  } else {
    let dogBreedLower = hash[0];
    let dogBreedTextUpper = dogBreedLower.charAt(0).toUpperCase() + dogBreedLower.substring(1);
    dogBreed.textContent = "Breed: " + dogBreedTextUpper;
    dogSubBreed.textContent = "";
  }
}


// Sätter en eventlyssnare på refreshknappen ("I want more dogs!")
// som kör funktioner baserat på vad hash-värdet är.
refreshButton.addEventListener("click", function(e) {
  if (window.location.hash !== "") {
    imageContainer.innerHTML = "";
    getSubBreeds();
    getBreedDogs();
  } else {
    imageContainer.innerHTML = "";
    getRandomDogs();
  }
});


// removeHash(), tar bort hashen ifrån window.location
function removeHash () {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}


// checkPage(), kollar vad hash-värdet är när man skriver eller uppdaterar genom URL fältet i browsern.
// och kör funktioner baserat på detta hash-värde.
function checkPage() {

  if (window.location.hash !== "") {
    imageContainer.innerHTML = "";
    getSubBreeds();
    getBreedDogs();

  } else {
    imageContainer.innerHTML = "";
    getRandomDogs();
  }
}


getAllBreeds(); // Första funktionen som körs när sidan först laddas.
checkPage(); // kollar vad hash-värdet vid laddning av sida (laddar resultat efter vad som står i URL'en)
