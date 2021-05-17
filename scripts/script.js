// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// // Make sure you register your service worker here too
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      console.log('sw registration successful: ', registration.scope);
    }, function(err) {
      console.log('sw registration failed: ', err);
    });
  });
}

let mainTag =  document.querySelector('main');
let titleTag = document.querySelector('h1');
let bodyTag = document.querySelector('body');

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(
      
      entries => {
        let counter = 1;
        console.log("counter 1: ", counter);
        
        entries.forEach(entry => {
          let newPost = document.createElement('journal-entry');
          newPost.entry = entry;
          newPost.number = counter;

          newPost.addEventListener('click', () =>{
            console.log("counter 2: ", newPost.number);
            router.setState(entry, "Entry " + newPost.number, "#entry"+(newPost.number));
            mainTag.style.display ="none";
          
            titleTag.innerText="Entry " + newPost.number;
            
            let entry_page = document.querySelector('entry-page');
            if(entry_page){
              entry_page.remove();
            }
        
            let new_entry = document.createElement('entry-page');
            new_entry.entry = entry;
            new_entry.style.display ="block";
        
            let position = document.querySelector("body");
            position.appendChild(new_entry);
          });
      
          
          console.log("counter 3: ", counter);
          counter ++;
          console.log("counter 4: ", counter);
          document.querySelector('main').appendChild(newPost);
        });
      }

      
    );



  

  // addEventListener
  let settingButton = document.querySelector('header').querySelector('img');
  settingButton.addEventListener('click', () =>{
    router.setState({index:11},"Setting ","#settings");
    mainTag.style.display ="none";
    titleTag.innerText = "Settings";
    bodyTag.classList.add("settings");
    let entry_page = document.querySelector('entry-page');
    if(entry_page){
      entry_page.remove();
    }
  });
  titleTag.addEventListener("click", () =>{
    let entry_page = document.querySelector('entry-page');
    if(entry_page){
      entry_page.remove();
    }

    router.setState({index:0},"Home Page ","/");
    mainTag.style.display ="block";
    bodyTag.classList.remove("settings");
    titleTag.innerText = "Journal Entries";
    
  });



});


window.addEventListener('popstate', (event) => {

  if(!event.state||event.state.index==0){
    mainTag.style.display ="block";
    bodyTag.classList.remove("settings");
    titleTag.innerText = "Journal Entries";

    let entry_page = document.querySelector('entry-page');
    if(entry_page){
      entry_page.remove();
    }
  }
  else if(event.state.index==11){
    mainTag.style.display ="none";
    titleTag.innerText = "Settings";
    bodyTag.classList.add("settings");
    let entry_page = document.querySelector('entry-page');
    if(entry_page){
      entry_page.remove();
    }
  }else{
    mainTag.style.display ="none";
    let entry_title = window.location.hash.substr(6);
    titleTag.innerText="Entry " + entry_title;

    bodyTag.classList.remove("settings");
    
    let entry_page = document.querySelector('entry-page');
    if(entry_page){
      entry_page.remove();
    }

    let new_entry = document.createElement('entry-page');
    new_entry.entry = event.state;
    new_entry.style.display ="block";

    let position = document.querySelector("body");
    position.appendChild(new_entry);
  }

});
