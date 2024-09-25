document.addEventListener('DOMContentLoaded', function () {
    const videoBtn = document.getElementById('video-btn');
    const backBtn = document.getElementById('back-btn');
    const mainPage = document.getElementById('main-page');
    const videoPage = document.getElementById('video-page');
  
    // Mostra la pagina video con animazione
    videoBtn.addEventListener('click', function () {
      mainPage.classList.add('hidden');  // Nascondi pagina principale
      videoPage.classList.add('active');  // Mostra pagina video
    });
  
    // Torna indietro alla pagina principale
    backBtn.addEventListener('click', function () {
      videoPage.classList.remove('active');  // Nascondi pagina video
      mainPage.classList.remove('hidden');   // Mostra pagina principale
    });
  });
  