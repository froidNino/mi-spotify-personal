// NUESTRA BASE DE DATOS LOCAL
// Recuerda: Tú eres el encargado de editar esto con tus archivos reales.
const songList = [
  {
    name: "HUMBLE.",
    artist: "Kendrick Lamar",
    file: "rap/cancion1.mp3",
    cover: "portada.jpg",
    genre: "rap",
  },
  {
    name: "Tití Me Preguntó",
    artist: "Bad Bunny",
    file: "reggaeton/cancion1.mp3",
    cover: "portada.jpg",
    genre: "reggaeton",
  },
  {
    name: "Sandstorm",
    artist: "Darude",
    file: "rave/cancion1.mp3",
    cover: "portada.jpg",
    genre: "rave",
  },
  {
    name: "Blinding Lights",
    artist: "The Weeknd",
    file: "pop/cancion1.mp3",
    cover: "portada.jpg",
    genre: "pop",
  },
];

let songIndex = 0;
let isPlaying = false;
let currentGenreView = null; // Para saber en qué carpeta estamos

// Elementos del DOM
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const vinyl = document.getElementById("vinyl");

// Elementos de Navegación (Las nuevas pantallas)
const categoriesView = document.getElementById("categories-view");
const songsView = document.getElementById("songs-view");
const backBtn = document.getElementById("back-btn");
const playlistTitle = document.getElementById("playlist-title");
const currentPlaylist = document.getElementById("current-playlist");
const categoryBtns = document.querySelectorAll(".category-btn");

// --- SISTEMA DE NAVEGACIÓN ---

// Función para abrir una carpeta
function openCategory(genre, folderName) {
  currentGenreView = genre;
  playlistTitle.textContent = folderName; // Cambia el título de arriba

  // Ocultar botones grandes, mostrar lista
  categoriesView.classList.add("hidden");
  songsView.classList.remove("hidden");

  renderPlaylist(genre);
}

// Función para volver atrás
function goBack() {
  currentGenreView = null;
  playlistTitle.textContent = "Tus Carpetas";

  // Ocultar lista, mostrar botones grandes
  songsView.classList.add("hidden");
  categoriesView.classList.remove("hidden");
}

// Asignar los clics a los botones de categorías (Rap, Rave, etc.)
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const genre = btn.getAttribute("data-genre");
    const folderName = btn.textContent
      .replace("🎤", "")
      .replace("🪩", "")
      .replace("🔥", "")
      .replace("🎸", "")
      .trim();
    openCategory(genre, folderName);
  });
});

// Asignar el clic al botón de volver atrás
backBtn.addEventListener("click", goBack);

// --- REPRODUCTOR ---

function loadSong(song) {
  title.textContent = song.name;
  artist.textContent = song.artist;
  audio.src = `musica/${song.file}`;
  cover.src = `imagenes/${song.cover}`;

  // Si la vista actual es la lista de canciones, actualiza la luz azul
  if (currentGenreView) {
    updatePlaylistHighlight();
  }
}

// Dibuja SOLO las canciones del género seleccionado
function renderPlaylist(genre) {
  currentPlaylist.innerHTML = "";

  songList.forEach((song, index) => {
    if (song.genre === genre) {
      const li = document.createElement("li");
      li.classList.add("song-item");

      li.innerHTML = `
                <div class="song-info">
                    <h4>${song.name}</h4>
                    <p>${song.artist}</p>
                </div>
            `;

      li.addEventListener("click", () => {
        songIndex = index;
        loadSong(songList[songIndex]);
        playSong();
      });

      currentPlaylist.appendChild(li);
    }
  });

  updatePlaylistHighlight();
}

function updatePlaylistHighlight() {
  const allItems = document.querySelectorAll(".song-item");
  // Para encender la luz correcta, buscamos el título de la canción que suena
  allItems.forEach((item) => {
    const itemTitle = item.querySelector("h4").textContent;
    if (itemTitle === songList[songIndex].name) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function playSong() {
  isPlaying = true;
  playIcon.classList.remove("fa-play");
  playIcon.classList.add("fa-pause");
  audio.play();
  vinyl.style.animationPlayState = "running";
}

function pauseSong() {
  isPlaying = false;
  playIcon.classList.remove("fa-pause");
  playIcon.classList.add("fa-play");
  audio.pause();
  vinyl.style.animationPlayState = "paused";
}

playBtn.addEventListener("click", () => {
  if (isPlaying) pauseSong();
  else playSong();
});

nextBtn.addEventListener("click", () => {
  songIndex++;
  if (songIndex > songList.length - 1) songIndex = 0;
  loadSong(songList[songIndex]);
  playSong();
});

prevBtn.addEventListener("click", () => {
  songIndex--;
  if (songIndex < 0) songIndex = songList.length - 1;
  loadSong(songList[songIndex]);
  playSong();
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;

    let currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
});

audio.addEventListener("loadedmetadata", () => {
  let durationMinutes = Math.floor(audio.duration / 60);
  let durationSeconds = Math.floor(audio.duration % 60);
  if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
  durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
});

progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Arrancar cargando la primera canción (sin abrir ninguna carpeta)
loadSong(songList[songIndex]);
