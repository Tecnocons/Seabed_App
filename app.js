document.addEventListener('DOMContentLoaded', function () {
  const videoBtn = document.getElementById('video-btn');
  const backBtn = document.getElementById('back-btn');
  const mainPage = document.getElementById('main-page');
  const videoPage = document.getElementById('video-page');
  const videoForm = document.getElementById('video-upload-form');

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

  // Gestione del form di caricamento del video
  videoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const videoFile = document.getElementById('video-file').files[0];
    const videoDate = document.getElementById('video-date').value;
    const videoLocation = document.getElementById('video-location').value;

    if (videoFile && videoDate && videoLocation) {
      // Per ora, non fare nulla con i dati del video, in futuro gestiremo il video
      alert('Video caricato con successo! (per ora non viene memorizzato)');
    }
  });
});
