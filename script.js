let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "";
  }

  const min = Math.floor(seconds / 60);
  const remSeconds = Math.floor(seconds % 60);

  const forMin = String(min).padStart(2, "0");
  const forsec = String(remSeconds).padStart(2, "0");

  return `${forMin}:${forsec}`;
}
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let i = 0; i < as.length; i++) {
    const el = as[i];
    if (el.href.endsWith(".mp3")) {
      songs.push(el.href.split(`/${folder}/`)[1]); // Store the URL instead of the <a> element
    }
  }
  //show all songs in the  playlist
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songUl.innerHTML = "";

  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `
      <li>
      <img src="./assets/music.svg" alt="" />
      <p class="info"> ${song.replaceAll("%20", " ")}</p>

      <div class="music">
        <img src="./assets/play-btn.svg" alt="" />
      </div>
    </li>`;
  }

  // For playing music
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "./assets/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songDuration").innerHTML = "00:00 / 00:00";
};

async function disPlayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
      // console.log(e.href);
      let folder = e.href.split("/").slice(-2)[1];
      console.log(folder);
      //getting the heading and description
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `
      <div data-folder="${folder}" class="card">
      <div class="play">
        <img src="./assets/play.svg" alt="" />
      </div>

      <img class="cardImage"
        src="/songs/${folder}/cover.jpg"
        alt="image"
      />
      <h2>${response.title}</h2>
      <p>${response.description}</p>
    </div>

      `;
    }
  }

  //load the playlists when card is clicked
  Array.from(document.querySelectorAll(".card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  // get all the songs
  await getSongs("songs/punjabi");
  playMusic(songs[0], true);

  await disPlayAlbums();

  // Event listeners for play and pause
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./assets/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./assets/play-btn.svg";
    }
  });

  // listener fot timeupdate
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songDuration").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )} / ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add a event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //add a event listener to the hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //add a event listener to the close Button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  //add a event listener to the prev button
  prev.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= length) {
      playMusic(songs[index - 1]);
    }
  });

  // add a listener to the next button
  next.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // add a listener to the volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // add a listener to the mute button
  document.querySelector(".volume").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
