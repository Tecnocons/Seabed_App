document.addEventListener('DOMContentLoaded', function () {
  const videoBtn = document.getElementById('video-btn');
  const uploadBtn = document.getElementById('upload-btn');
  const backToListBtn = document.getElementById('back-to-list-btn');
  const backToMainBtn = document.getElementById('back-to-main-btn');
  const mainPage = document.getElementById('main-page');
  const videoListPage = document.getElementById('video-list-page');
  const videoUploadPage = document.getElementById('video-upload-page');
  const videoForm = document.getElementById('video-upload-form');
  const videoList = document.getElementById('video-list');

  // Mostra la lista dei video
  videoBtn.addEventListener('click', function () {
    mainPage.classList.add('hidden');      // Nascondi pagina principale
    videoListPage.classList.add('active'); // Mostra lista video
  });

  // Mostra la pagina di caricamento video
  uploadBtn.addEventListener('click', function () {
    videoListPage.classList.remove('active');  // Nascondi lista video
    videoUploadPage.classList.add('active');   // Mostra pagina upload
  });

  // Torna alla lista dei video
  backToListBtn.addEventListener('click', function () {
    videoUploadPage.classList.remove('active');  // Nascondi pagina upload
    videoListPage.classList.add('active');       // Mostra lista video
  });

  // Torna alla home dalla lista video
  backToMainBtn.addEventListener('click', function () {
    videoListPage.classList.remove('active');  // Nascondi lista video
    mainPage.classList.remove('hidden');       // Mostra pagina principale
  });

  // Gestione del form di caricamento del video
  videoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const videoFile = document.getElementById('video-file').files[0];
    const videoDate = document.getElementById('video-date').value;
    const videoLocation = document.getElementById('video-location').value;

    if (videoFile && videoDate && videoLocation) {
      // Aggiungi i dati del video alla lista
      addVideoToList(videoFile.name, videoDate, videoLocation);

      // Torna alla lista video
      videoUploadPage.classList.remove('active');
      videoListPage.classList.add('active');
    }
  });

  // Funzione per aggiungere un video alla lista visivamente
  function addVideoToList(name, date, location) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge badge-name">${name}</span></td>
      <td><span class="badge badge-date">${date}</span></td>
      <td><span class="badge badge-location">${location}</span></td>
    `;
    videoList.appendChild(tr);
  }
});
