document.addEventListener('DOMContentLoaded', {
    fetchDog
})


const baseURL = 'https://api.thedogapi.com/v1/breeds?limit=20&api_key=live_Nc027cN2IqAiA8vvdJjn9kIaKJxf3CBnf6gVR2AQk6D2I8nH00SLF1x1DF9MIs4M'

const options = {
	method: 'GET',
	headers: {
		'Content-Type' : 'application/json'
	}
};

function fetchDog() {
    fetch(`${baseURL}`, options)
    .then(response => response.json())
    .then(renderDog)
        //.then(renderDog => console.log(renderDog))
        .catch(err => console.error(err));
}
fetchDog()

function renderDog(dog){
    const display = document.querySelector('.display')

    dog.forEach(dog => {
        const card = document.createElement('div')
        card.className = 'card'

        card.innerHTML = `  
        <p> Breed : ${dog.name} </p>
        <img src="${dog.image.url}" class="img">
        </img>
        <p> Life span : ${dog.life_span} </p>
        <p> Bred for : ${dog.bred_for} </p> 
        <button class="like">
        <span id="icon"><i class="fa fa-thumbs-up"></i></span>
        </button
        `
        const button = card.querySelector('.like')
       
    button.addEventListener('click', () => {
      button.style.color = 'red'
    })

        display.append(card) 
    });
    
}
