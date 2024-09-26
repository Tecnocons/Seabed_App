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
  const popupMessage = document.getElementById('popup-message'); // Popup per i messaggi
  const popupContainer = document.getElementById('popup-container'); // Contenitore popup
  
  let tempVideoPath = '';  // Percorso del video temporaneo salvato
  let outputVideoPath = '';  // Percorso del video analizzato salvato

  // Funzione per mostrare popup con un messaggio specifico
  function showPopup(message) {
    popupMessage.textContent = message;
    popupContainer.style.display = 'block';
  }

  // Funzione per nascondere il popup
  function hidePopup() {
    popupContainer.style.display = 'none';
  }

  // Mostra la lista dei video
  videoBtn.addEventListener('click', function () {
    mainPage.classList.add('hidden');
    videoListPage.classList.add('active');
  });

  // Mostra la pagina di caricamento video
  uploadBtn.addEventListener('click', function () {
    videoListPage.classList.remove('active');
    videoUploadPage.classList.add('active');
  });

  // Torna alla lista dei video
  backToListBtn.addEventListener('click', function () {
    videoUploadPage.classList.remove('active');
    videoListPage.classList.add('active');
  });

  // Torna alla home dalla lista video
  backToMainBtn.addEventListener('click', function () {
    videoListPage.classList.remove('active');
    mainPage.classList.remove('hidden');
  });

  // Gestione del form di caricamento del video
  videoForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const videoFile = document.getElementById('video-file').files[0];
    const videoDate = document.getElementById('video-date').value;
    const videoLocation = document.getElementById('video-location').value;

    if (videoFile && videoDate && videoLocation) {
      try {
        const arrayBuffer = await videoFile.arrayBuffer();
        tempVideoPath = await window.electronAPI.saveTempVideo({
          name: videoFile.name,
          arrayBuffer: arrayBuffer,
        });

        addVideoToList(videoFile.name, videoDate, videoLocation);

        videoUploadPage.classList.remove('active');
        videoListPage.classList.add('active');
      } catch (error) {
        console.error('Errore nel salvataggio del video:', error);
      }
    }
  });

  // Funzione per aggiungere un video alla lista visivamente
  function addVideoToList(name, date, location) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge badge-name">${name}</span></td>
      <td><span class="badge badge-date">${date}</span></td>
      <td><span class="badge badge-location">${location}</span></td>
      <td><button class="analyze-btn">Analizza</button></td>
    `;
    videoList.appendChild(tr);

    // Assegna l'evento di click per il pulsante "Analizza"
    const analyzeBtn = tr.querySelector('.analyze-btn');
    analyzeBtn.addEventListener('click', function () {
      startVideoAnalysis(tempVideoPath);  // Inizio analisi video
    });
  }

// Funzione per eseguire l'analisi del video e salvare in un percorso scelto dall'utente
function startVideoAnalysis(videoPath) {
  console.log('Inizio analisi del video:', videoPath);
  showPopup("Analizzo il video...");

  // Mostra dialogo per selezionare percorso di salvataggio
  window.electronAPI.showSaveDialog().then(result => {
    if (!result.canceled) {
      const outputVideoPath = result.filePath;

      // Passa sia il video di input che il percorso di output allo script Python
      window.electronAPI.execPython([videoPath, outputVideoPath])
        .then((output) => {
          console.log('Python script output:', output);

          if (output.includes('COMPLETED')) {
            showPopup("Il video è stato analizzato!");

            setTimeout(() => {
              hidePopup();
              videoListPage.classList.add('active');
              mainPage.classList.remove('hidden');
            }, 3000);  // Attendi 3 secondi prima di tornare alla home
          } else if (output.includes('Errore')) {
            console.error('Errore nell\'esecuzione dello script Python:', output);
            alert('Errore durante l\'analisi del video. Controlla la console per maggiori dettagli.');
            hidePopup();  // Nascondi il popup in caso di errore
          }
        })
        .catch((error) => {
          console.error('Errore durante l\'analisi del video:', error);
          alert('Errore imprevisto durante l\'analisi del video.');
          hidePopup();  // Nascondi il popup in caso di errore
        });
    }
  });
}
});
