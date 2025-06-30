    let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    const player = videojs('main-player', { controls: true, fluid: true });

    function handleUrl() {
      const url = document.getElementById('videoUrl').value.trim();
      if (!url) return;
      player.src({ type: url.includes('youtube') ? 'video/youtube' : 'video/mp4', src: url });
      player.play();
    }

    function addToPlaylist() {
      const url = document.getElementById('videoUrl').value.trim();
      const label = prompt("Enter label for this video:");
      if (url && label) {
        playlist.push({ url, label });
        updatePlaylistUI();
      }
    }

    function insertIntoPlaylist() {
      const url = document.getElementById('videoUrl').value.trim();
      const label = prompt("Enter label for this video:");
      const position = parseInt(prompt("Enter position (1-based):"), 10);
      if (url && label && position && position > 0 && position <= playlist.length + 1) {
        playlist.splice(position - 1, 0, { url, label });
        updatePlaylistUI();
      }
    }

    function updatePlaylistUI() {
      document.getElementById('playlist').innerHTML = playlist.map((item, index) => `
        <div class="playlist-item fadeIn">
          <span class="label">${item.label}</span>
          <button onclick="playFromPlaylist(${index})">Play</button>
          <button onclick="deleteFromPlaylist(${index})">Delete</button>
        </div>
      `).join('');
      localStorage.setItem('playlist', JSON.stringify(playlist));
    }

    function playFromPlaylist(index) {
      document.getElementById('videoUrl').value = playlist[index].url;
      handleUrl();
    }

    function deleteFromPlaylist(index) {
      if (confirm("Delete this item?")) {
        playlist.splice(index, 1);
        updatePlaylistUI();
      }
    }

    function downloadVideo() {
      const url = document.getElementById('videoUrl').value;
      if (!url) return;
      if (url.includes("youtube")) { alert("YouTube downloads require a separate tool!"); return; }
      const link = document.createElement('a');
      link.href = url;
      link.download = `video.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") { player.currentTime(player.currentTime() + 10); }
      if (event.key === "ArrowLeft") { player.currentTime(player.currentTime() - 10); }
    });

    updatePlaylistUI();
