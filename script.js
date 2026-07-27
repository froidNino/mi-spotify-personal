// NUESTRA BASE DE DATOS LOCAL
// Aquí agregas todas las canciones que vayas descargando a tu carpeta 'musica'
const songList = [
    {
        name: "HUMBLE.",
        artist: "Kendrick Lamar",
        file: "cancion1.mp3",
        cover: "portada.jpg"
    },
    {
        name: "DNA.",
        artist: "Kendrick Lamar",
        file: "cancion2.mp3", // Tendrás que descargar otra y llamarla así
        cover: "portada.jpg" // Puedes usar la misma portada u otra
    },
    {
        name: "Swimming Pools",
        artist: "Kendrick Lamar",
        file: "cancion3.mp3",
        cover: "portada.jpg"
    }
];

let songIndex = 0; // Para saber qué canción está sonando (0 es la primera)
let isPlaying = false;

// Atrapamos los elementos de HTML
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playlistList = document.getElementById('playlist-list');

// FUNCIÓN 1: Cargar la canción en el reproductor izquierdo
function loadSong(song) {
    title.textContent = song.name;
    artist.textContent = song.artist;
    audio.src = `musica/${song.file}`;
    cover.src = `imagenes/${song.cover}`;
    updatePlaylistHighlight(); // Resalta la canción en la lista derecha
}

// FUNCIÓN 2: Dibujar la lista de canciones en el panel derecho
function renderPlaylist() {
    playlistList.innerHTML = ''; // Limpiamos primero
    
    songList.forEach((song, index) => {
        // Creamos un cajoncito para cada canción
        const li = document.createElement('li');
        li.classList.add('song-item');
        
        // Lo que va dentro del cajoncito
        li.innerHTML = `
            <div class="song-info">
                <h4>${song.name}</h4>
                <p>${song.artist}</p>
            </div>
        `;
        
        // Qué pasa si el usuario le da clic a una canción de la lista
        li.addEventListener('click', () => {
            songIndex = index; // Actualizamos el índice
            loadSong(songList[songIndex]); // Cargamos la canción
            playSong(); // La reproducimos automáticamente
        });
        
        playlistList.appendChild(li); // La agregamos al HTML
    });
}

// FUNCIÓN 3: Resaltar en cian la canción que está sonando
function updatePlaylistHighlight() {
    const allItems = document.querySelectorAll('.song-item');
    allItems.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// FUNCIONES DE REPRODUCCIÓN
function playSong() {
    isPlaying = true;
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    audio.pause();
}

playBtn.addEventListener('click', () => {
    if (isPlaying) pauseSong();
    else playSong();
});

// Botones de Siguiente y Anterior
nextBtn.addEventListener('click', () => {
    songIndex++;
    if (songIndex > songList.length - 1) songIndex = 0; // Vuelve al inicio
    loadSong(songList[songIndex]);
    playSong();
});

prevBtn.addEventListener('click', () => {
    songIndex--;
    if (songIndex < 0) songIndex = songList.length - 1; // Va al final
    loadSong(songList[songIndex]);
    playSong();
});

// Cuando la canción termina, pasa a la siguiente sola
audio.addEventListener('ended', () => {
    nextBtn.click();
});

// BARRA DE TIEMPO
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;

        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }
});

audio.addEventListener('loadedmetadata', () => {
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
});

progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

// INICIO DEL PROGRAMA
// Cuando abra la página, dibuja la lista y carga la primera canción
renderPlaylist();
loadSong(songList[songIndex]);