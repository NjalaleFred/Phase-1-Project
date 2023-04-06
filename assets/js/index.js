document.addEventListener('DOMContentLoaded',() => {
   fetchDog()
   addImage()
   getDog()
   selectBreed()
   
}) 


const baseURL = 'https://api.thedogapi.com/v1/breeds?limit=20&api_key=live_Nc027cN2IqAiA8vvdJjn9kIaKJxf3CBnf6gVR2AQk6D2I8nH00SLF1x1DF9MIs4M'

const options = {
	method: 'GET',
	headers: {
		'Content-Type' : 'application/json'
	}
};

async function fetchDog() {
    fetch(`${baseURL}`, options)
    .then(response => response.json())
    .then(renderDog)
        .catch(err => console.error(err));
}


function renderDog(dog) {
    const display = document.querySelector('.display')
  
    dog.forEach(dog => {
      const card = document.createElement('div')
      card.className = 'card'
  
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
        ` 

      const button = card.querySelector('.like')
      const key = `liked_${dog.id}`
      let isLiked = localStorage.getItem(key)==='true'
      updateButtonColor()

      button.addEventListener('click', ()=>{
        isLiked = !isLiked
        localStorage.setItem(key,isLiked.toString())
        updateButtonColor()
      })

      function updateButtonColor(){
        if (isLiked) {
              button.style.color = 'blue' // reset to original color
            } else {
              button.style.color = ''
            }
      }
      

      const commentButton = card.querySelector('.comment')
      const commentsDiv = card.querySelector('.comments')
  
      commentButton.addEventListener('click', () => {
        const commentInput = document.createElement('input')
        commentInput.placeholder = 'Comment'
  
        const commentSubmit = document.createElement('button')
        commentSubmit.textContent = 'Comment'
        commentSubmit.addEventListener('click', () => {
          const commentText = commentInput.value
          if (commentText.length > 0) {
            const comment = document.createElement('p')
            comment.textContent = commentText
            commentsDiv.append(comment)
          }
        })
        
        if (commentsDiv.hasChildNodes()) {
         
          if (commentsDiv.classList.contains('hide')) {
            commentsDiv.classList.remove('hide')
          } else {
            commentsDiv.classList.add('hide')
          }
          
        } else  {
          commentsDiv.append(commentInput, commentSubmit)
        }
        
      })
  
      display.append(card) 
    });
  }
  
  
 function addImage(){
  const add = document.querySelector('#add-img')
  add.addEventListener('submit', handleAdd)
 }


function handleAdd(e){
    e.preventDefault()

    let dogObj = {
     name :  e.target.breed.value,
     imageUrl: e.target.image_url.value,
     life_span :e.target.life_span.value,
      bred_for:e.target.bred_for.value,
      temperament:e.target.temperament.value
    }
    postDog(dogObj)
}



async function getDog() {
  fetch('http://localhost:3000/dogs', options)
  .then(response => response.json())
  .then(showDog)
      .catch(err => console.error(err));
}

function showDog(dog) {
  const display = document.querySelector('.show')

  dog.forEach(dog => {
    const card = document.createElement('div')
    card.className = 'card'

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
    `

 

    let remove = card.querySelector('.delete')

    remove.addEventListener('click', (e)=> {
      e.target.parentNode.remove()
      handleDelete(dog)
    } )

    const button = card.querySelector('.like')
      const key = `liked_${dog.id}`
      let isLiked = localStorage.getItem(key)==='true'
      updateButtonColor()

      button.addEventListener('click', ()=>{
        isLiked = !isLiked
        localStorage.setItem(key,isLiked.toString())
        updateButtonColor()
      })

      function updateButtonColor(){
        if (isLiked) {
              button.style.color = 'blue' // reset to original color
            } else {
              button.style.color = ''
            }
      }
      

    const commentButton = card.querySelector('.comment')
    const commentsDiv = card.querySelector('.comments')

    commentButton.addEventListener('click', () => {

      const commentInput = document.createElement('input')
      commentInput.placeholder = 'Comment'

      const commentSubmit = document.createElement('button')
      commentSubmit.textContent = 'Comment'
      commentSubmit.addEventListener('click', () => {
        const commentText = commentInput.value
        if (commentText.length > 0) {
          const comment = document.createElement('p')
          comment.textContent = commentText
          commentsDiv.append(comment)
        }
      })
      if (commentsDiv.hasChildNodes()) {
         
        if (commentsDiv.classList.contains('hide')) {
          commentsDiv.classList.remove('hide')
        } else {
          commentsDiv.classList.add('hide')
        }
        
      } else  {
        commentsDiv.append(commentInput, commentSubmit)
      }
      
    })

    display.append(card) 
  });
}


function handleDelete(dog){
  fetch(`http://localhost:3000/dogs/${dog.id}`, {
    method:'DELETE',
    headers : {
      'Content-Type': 'application/json'
    },
  })
  .then(resp => resp.json())
}

function postDog(dogObj){
  fetch('http://localhost:3000/dogs', {
    method:'POST',
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(dogObj)
  })
  .then(resp => resp.json())
  .then(getDog)
  .catch(error => console.log(error))
}

async function selectBreed(){
  fetch('https://api.thedogapi.com/v1/breeds/',options)
  .then(resp => resp.json())
  .then(displayBreed)
  .catch(error => {
    console.log(error);
  })
}

function displayBreed(breed){
const select = document.querySelector('#select')

breed.forEach(breed => {
  const dropDown= document.createElement('option')
  dropDown.value = breed.id
  dropDown.innerHTML = `${breed.name}`
  select.append(dropDown)
})

select.addEventListener('change', ()=> {
  const breedId = select.value;
  fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`)
  .then(resp => resp.json())
  .then(data =>{


      const display = document.querySelector('.display')
     display.innerHTML = '';
     data.forEach(image => {
      const div = document.createElement('div');
      div.className = 'Image'
      div.innerHTML=`
       <img src="${image.url}" ></img>
       <button class="like">
        <span id="icon"><i class="fa fa-thumbs-up"></i></span>
      </button>
       `
       const button = div.querySelector('.like')
       const key = `liked_${image.id}`
       let isLiked = localStorage.getItem(key)==='true'
       updateButtonColor()
 
       button.addEventListener('click', ()=>{
         isLiked = !isLiked
         localStorage.setItem(key,isLiked.toString())
         updateButtonColor()
       })
 
       function updateButtonColor(){
         if (isLiked) {
               button.style.color = 'blue' // reset to original color
             } else {
               button.style.color = ''
             }
       }
       
      // img.src = image.url
       display.append(div)
    })
     })
  })
}

