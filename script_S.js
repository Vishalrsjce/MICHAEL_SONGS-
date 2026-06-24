document.addEventListener('DOMContentLoaded', () => {
    // --- DATA & ELEMENTS ---
    const genres = {
        "Michael Jackson": [
            { path: "Bad(MP3_160K).mp3", title: "Michael Jackson - Bad" },
            { path: "Beat It(MP3_160K).mp3", title: "Michael Jackson - Beat It" },
            { path: "Billie Jean(MP3_160K).mp3", title: "Michael Jackson - Billie Jean" },
            { path: "Jam(MP3_160K).mp3", title: "Michael Jackson - Jam" },
            { path: "Michael Jackson - Dangerous (Audio)(MP3_160K).mp3", title: "Michael Jackson - Dangerous" },
            { path: "Michael Jackson - Earth Song (Official Video)(MP3_160K).mp3", title: "Michael Jackson - Earth Song" },
            { path: "Michael Jackson - They Don_t Care About Us(MP3_160K).mp3", title: "Michael Jackson - They Don't Care About Us" },
            { path: "Smooth Criminal (2012 Remaster)(MP3_160K).mp3", title: "Michael Jackson - Smooth Criminal (2012 Remaster)" },
            { path: "Thriller(MP3_160K).mp3", title: "Michael Jackson - Thriller" }
        ],
    };

    const albumArt = document.getElementById('album-art'), 
          cd = document.querySelector('.cd'), 
          titleEl = document.getElementById('title'), 
          audio = document.getElementById('audio-source'), 
          playBtn = document.getElementById('play-btn'), 
          prevBtn = document.getElementById('prev-btn'), 
          nextBtn = document.getElementById('next-btn'), 
          genreSelect = document.getElementById('genre-select'), 
          playlistEl = document.getElementById('song-playlist'), 
          searchBar = document.getElementById('search-bar'), 
          volumeSlider = document.getElementById('volume-slider'), 
          volumeIcon = document.getElementById('volume-icon'), 
          spotlightLeft = document.getElementById('spotlight-left'), 
          spotlightRight = document.getElementById('spotlight-right');

    // --- STATE ---
    let currentGenre = Object.keys(genres)[0], 
        currentSongIndex = 0, 
        isPlaying = false, 
        lastVolume = 0.75, 
        spotlightLeftState = true;

    // --- FUNCTIONS ---
    function loadGenres() { 
        Object.keys(genres).forEach(genre => { 
            const option = document.createElement('option'); 
            option.value = genre; 
            option.textContent = genre; 
            genreSelect.appendChild(option); 
        }); 
    }

    function loadPlaylist(genre) { 
        playlistEl.innerHTML = ''; 
        genres[genre].forEach((song, index) => { 
            const li = document.createElement('li'); 
            li.textContent = song.title; 
            li.dataset.index = index; 
            if (index === currentSongIndex) li.classList.add('active'); 
            playlistEl.appendChild(li); 
        }); 
    }

    function loadSong(song) { 
        titleEl.textContent = song.title; 
        titleEl.nextElementSibling.textContent = 'Michael Jackson'; 
        audio.src = song.path; 
        albumArt.src = 'Songs/Songs.png'; 
    }

    function playSong() { 
        isPlaying = true; 
        cd.classList.add('playing'); 
        playBtn.innerHTML = '<i class="fas fa-pause"></i>'; 
        audio.play(); 
    }

    function pauseSong() { 
        isPlaying = false; 
        cd.classList.remove('playing'); 
        playBtn.innerHTML = '<i class="fas fa-play"></i>'; 
        audio.pause(); 
    }

    function updateActivePlaylistItem() { 
        document.querySelectorAll('#song-playlist li').forEach(li => { 
            li.classList.remove('active'); 
            if (parseInt(li.dataset.index) === currentSongIndex) { 
                li.classList.add('active'); 
            } 
        }); 
    }

    function changeSong(direction) { 
        const songsInGenre = genres[currentGenre]; 
        currentSongIndex = (currentSongIndex + direction + songsInGenre.length) % songsInGenre.length; 
        loadSong(songsInGenre[currentSongIndex]); 
        updateActivePlaylistItem(); 
        if (isPlaying) playSong(); 
    }

    function setVolume(value) { 
        audio.volume = value; 
        if (value === 0) { 
            volumeIcon.className = 'fas fa-volume-mute'; 
        } else if (value < 0.5) { 
            volumeIcon.className = 'fas fa-volume-down'; 
        } else { 
            volumeIcon.className = 'fas fa-volume-up'; 
        } 
    }

    function toggleMute() { 
        if (audio.volume > 0) { 
            lastVolume = audio.volume; 
            volumeSlider.value = 0; 
            setVolume(0); 
        } else { 
            volumeSlider.value = lastVolume * 100; 
            setVolume(lastVolume); 
        } 
    }

    function animateSpotlights() {
        const r1 = Math.random() * 255, g1 = Math.random() * 255, b1 = Math.random() * 255;
        const r2 = Math.random() * 255, g2 = Math.random() * 255, b2 = Math.random() * 255;
        const gradient1 = `radial-gradient(circle, rgba(${r1},${g1},${b1},0.7) 0%, rgba(${r1},${g1},${b1},0) 70%)`;
        const gradient2 = `radial-gradient(circle, rgba(${r2},${g2},${b2},0.7) 0%, rgba(${r2},${g2},${b2},0) 70%)`;

        spotlightLeft.style.background = gradient1;
        spotlightRight.style.background = gradient2;
        
        const randomY1 = Math.random() * 100 - 50; 
        const randomY2 = Math.random() * 100 - 50;

        if (spotlightLeftState) {
            spotlightLeft.style.transform = `translate(20%, ${randomY1}%)`;
            spotlightRight.style.transform = `translate(-120%, ${randomY2}%)`;
        } else {
            spotlightLeft.style.transform = `translate(-120%, ${randomY1}%)`;
            spotlightRight.style.transform = `translate(20%, ${randomY2}%)`;
        }
        spotlightLeftState = !spotlightLeftState;
    }

    // --- EVENT LISTENERS ---
    playBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
    prevBtn.addEventListener('click', () => changeSong(-1));
    nextBtn.addEventListener('click', () => changeSong(1));
    audio.addEventListener('ended', () => changeSong(1));

    genreSelect.addEventListener('change', (e) => { 
        currentGenre = e.target.value; 
        currentSongIndex = 0; 
        loadPlaylist(currentGenre); 
        loadSong(genres[currentGenre][currentSongIndex]); 
        pauseSong(); 
    });

    playlistEl.addEventListener('click', (e) => { 
        if (e.target.tagName === 'LI') { 
            currentSongIndex = parseInt(e.target.dataset.index); 
            loadSong(genres[currentGenre][currentSongIndex]); 
            updateActivePlaylistItem(); 
            playSong(); 
        } 
    });

    searchBar.addEventListener('keyup', (e) => { 
        const term = e.target.value.toLowerCase(); 
        const songs = genres[currentGenre]; 
        playlistEl.innerHTML = ''; 
        songs.forEach((song, originalIndex) => { 
            if (song.title.toLowerCase().includes(term)) { 
                const li = document.createElement('li'); 
                li.textContent = song.title; 
                li.dataset.index = originalIndex; 
                if (originalIndex === currentSongIndex) li.classList.add('active'); 
                playlistEl.appendChild(li); 
            } 
        }); 
    });

    volumeSlider.addEventListener('input', (e) => setVolume(e.target.value / 100));
    volumeIcon.addEventListener('click', toggleMute);
    
    // --- INITIALIZATION ---
    loadGenres();
    loadPlaylist(currentGenre);
    loadSong(genres[currentGenre][currentSongIndex]);
    setVolume(volumeSlider.value / 100);

    setTimeout(() => {
        animateSpotlights();
        setInterval(animateSpotlights, 3000);
    }, 100);
});
