let currentSong = new Audio();

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "";
  }

  const min = Math.floor(seconds / 60);
  const remSeconds = Math.floor(seconds % 60);

  const forMin = String(min).padStart(2, "0");
  const forsec = String(remSeconds).padStart(2, "0");

  return `${forMin} : ${forsec}`;
}
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let i = 0; i < as.length; i++) {
    const el = as[i];
    if (el.href.endsWith(".mp3")) {
      songs.push(el.href.split("/songs/")[1]); // Store the URL instead of the <a> element
    }
  }
  return songs;
}

getSongs();

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "./assets/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songDuration").innerHTML = "00 : 00 / 00 : 00";
};

async function main() {
  let songs = await getSongs();
  playMusic(songs[0], true);
  console.log(songs);

  let playbtn = document.getElementById("playbtn");

  //   playbtn.addEventListener("click", () => {
  //     var audio = new Audio(songs[0]);
  //     audio.play();
  //   });

  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

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
      console.log(e.querySelector(".info").innerHTML);
      playMusic(e.querySelector(".info").innerHTML.trim());
    });
  });

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
}

main();
