/**An event listener DomContentLoaded is put so as to load the js. */
document.addEventListener("DOMContentLoaded", () => {
  fetchDog();
  addImage();
  getDog();
  selectBreed();
});

const baseURL =
  "https://api.thedogapi.com/v1/breeds?limit=20&api_key=live_Nc027cN2IqAiA8vvdJjn9kIaKJxf3CBnf6gVR2AQk6D2I8nH00SLF1x1DF9MIs4M";
/**Options is defined to a get as it will be oftenly used */
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

async function fetchDog() {
  fetch(`${baseURL}`, options)
    .then((response) => response.json())
    .then(renderDog)
    .catch((err) => console.error(err));
}

function renderDog(dog) {
  const display = document.querySelector(".display");

  dog.forEach((dog) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `  
        <p> Breed : ${dog.name} </p>
        <img src="${dog.image.url}" class="img"></img>
        <div>
        <p>Life span : ${dog.life_span}</p>
        <p>Bred for : ${dog.bred_for} </p>
        <p>Temperament:${dog.temperament}</p>
        </div> 
        <button class="like">
          <span id="icon"><i class="fa fa-thumbs-up"></i></span>
        </button>
        <button class="comment">
        <i class="fa-regular fa-comment"></i>
        </button>
      <div class="comments"></div>
        `;
    /**An event litener is added to the like button and it then stored to the local storage.
     * this ensures that the like is persisted and will not be cleared on refresh.
     */
    const button = card.querySelector(".like");
    const key = `liked_${dog.id}`;
    let isLiked = localStorage.getItem(key) === "true";
    updateButtonColor();

    button.addEventListener("click", () => {
      isLiked = !isLiked; //toggle state is described
      localStorage.setItem(key, isLiked.toString());
      updateButtonColor();
    });

    function updateButtonColor() {
      if (isLiked) {
        button.style.color = "blue"; // set to color after clicking
      } else {
        button.style.color = "";
      }
    }

    /**The comment is added. An event listener is added to a button that will display an input.
     * The is statement simply means that if the text length is greater that zero then the comment would be added.
     */
    const commentButton = card.querySelector(".comment");
    const commentsDiv = card.querySelector(".comments");

    commentButton.addEventListener("click", () => {
      const commentInput = document.createElement("input");
      commentInput.placeholder = "Comment";

      const commentSubmit = document.createElement("button");
      commentSubmit.textContent = "Comment";
      commentSubmit.addEventListener("click", () => {
        const commentText = commentInput.value;
        if (commentText.length > 0) {
          const comment = document.createElement("p");
          comment.textContent = commentText;
          commentsDiv.append(comment);
        }
      });
      /**This if statement simply means if the commentDiv has been clicked(has a child)
       * then when it is clicked again it will hide.
       */
      if (commentsDiv.hasChildNodes()) {
        if (commentsDiv.classList.contains("hide")) {
          commentsDiv.classList.remove("hide");
        } else {
          commentsDiv.classList.add("hide");
        }
      } else {
        commentsDiv.append(commentInput, commentSubmit);
      }
    });

    display.append(card);
  });
}

function addImage() {
  const add = document.querySelector("#add-img");
  add.addEventListener("submit", handleAdd);
}

function handleAdd(e) {
  e.preventDefault();
  /**An object is declared so that is can be converted into json */
  let dogObj = {
    name: e.target.breed.value,
    imageUrl: e.target.image_url.value,
    life_span: e.target.life_span.value,
    bred_for: e.target.bred_for.value,
    temperament: e.target.temperament.value,
  };
  postDog(dogObj);
}

async function getDog() {
  fetch("http://localhost:3000/dogs", options)
    .then((response) => response.json())
    .then(showDog)
    .catch((err) => console.error(err));
}

/**It is quite the same as the render Dog it is just that this one has
 * no dog.image.url hence I cannot reuse the function
 */
function showDog(dog) {
  const display = document.querySelector(".show");

  dog.forEach((dog) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `  
      <p> Breed : ${dog.name} </p>
      <img src="${dog.imageUrl}" class="img"></img>
      <div>
      <p>Life span : ${dog.life_span}</p>
      <p>Bred for : ${dog.bred_for} </p>
      <p>Temperament:${dog.temperament}</p>
      </div> 
      <button class="like">
        <span id="icon"><i class="fa fa-thumbs-up"></i></span>
      </button>
      <button class="comment">
      <i class="fa-regular fa-comment"></i>
      </button>
      <button class="delete">Delete</button>
      <div class="comments"></div>
    `;

    let remove = card.querySelector(".delete");

    remove.addEventListener("click", (e) => {
      e.target.parentNode.remove();
      handleDelete(dog);
    });

    const button = card.querySelector(".like");
    const key = `liked_${dog.id}`;
    let isLiked = localStorage.getItem(key) === "true";
    updateButtonColor();

    button.addEventListener("click", () => {
      isLiked = !isLiked; // Toggle state
      localStorage.setItem(key, isLiked.toString());
      updateButtonColor();
    });

    function updateButtonColor() {
      if (isLiked) {
        button.style.color = "blue"; //Color after being clicked
      } else {
        button.style.color = "";
      }
    }

    const commentButton = card.querySelector(".comment");
    const commentsDiv = card.querySelector(".comments");

    commentButton.addEventListener("click", () => {
      const commentInput = document.createElement("input");
      commentInput.placeholder = "Comment";

      const commentSubmit = document.createElement("button");
      commentSubmit.textContent = "Comment";
      commentSubmit.addEventListener("click", () => {
        const commentText = commentInput.value;
        if (commentText.length > 0) {
          const comment = document.createElement("p");
          comment.textContent = commentText;
          commentsDiv.append(comment);
        }
      });
      if (commentsDiv.hasChildNodes()) {
        if (commentsDiv.classList.contains("hide")) {
          commentsDiv.classList.remove("hide");
        } else {
          commentsDiv.classList.add("hide");
        }
      } else {
        commentsDiv.append(commentInput, commentSubmit);
      }
    });

    display.append(card);
  });
}

/**This one persists the delete button */
function handleDelete(dog) {
  fetch(`http://localhost:3000/dogs/${dog.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((resp) => resp.json());
}

/**This posts our dog to the localhost and persists it */
function postDog(dogObj) {
  fetch("http://localhost:3000/dogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dogObj),
  })
    .then((resp) => resp.json())
    .then(getDog)
    .catch((error) => console.log(error));
}

async function selectBreed() {
  fetch("https://api.thedogapi.com/v1/breeds/", options)
    .then((resp) => resp.json())
    .then(displayBreed)
    .catch((error) => {
      console.log(error);
    });
}

/**THis function creates a dropdown menu that when clicked shows the dog breed names
 * which when clicked will display their images.
 */

function displayBreed(breed) {
  const select = document.querySelector("#select");

  breed.forEach((breed) => {
    const dropDown = document.createElement("option");
    dropDown.value = breed.id;
    dropDown.innerHTML = `${breed.name}`;
    select.append(dropDown);
  });

  select.addEventListener("change", () => {
    const breedId = select.value;
    fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`)
      .then((resp) => resp.json())
      .then((data) => {
        const display = document.querySelector(".display");
        display.innerHTML = "";
        data.forEach((image) => {
          const div = document.createElement("div");
          div.className = "Image";
          div.innerHTML = `
       <img src="${image.url}" ></img>
       <button class="like">
        <span id="icon"><i class="fa fa-thumbs-up"></i></span>
      </button>
       `;
          const button = div.querySelector(".like");
          const key = `liked_${image.id}`;
          let isLiked = localStorage.getItem(key) === "true";
          updateButtonColor();

          button.addEventListener("click", () => {
            isLiked = !isLiked;
            localStorage.setItem(key, isLiked.toString());
            updateButtonColor();
          });

          function updateButtonColor() {
            if (isLiked) {
              button.style.color = "blue";
            } else {
              button.style.color = "";
            }
          }

          display.append(div);
        });
      });
  });
}

/**I tried using https://njalalefred.github.io/json/db.json as my fetch in order to post but it shows a CORS
 * policy error. I have tries many methods to solve it but it refuses. 
 * In orderto post you must run the localhost. 
 */
