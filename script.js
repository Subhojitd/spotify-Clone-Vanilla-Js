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

async function main() {
  let songs = await getSongs();
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
      <p> ${song.replaceAll("%20", " ")}</p>

      <div class="music">
        <img src="./assets/play-btn.svg" alt="" />
      </div>
    </li>`;
  }
}

main();
