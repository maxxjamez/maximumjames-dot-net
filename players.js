const youtubeHosts = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
];

function getYouTubeId(url) {
  const [, page, id] = url.pathname.split("/");
  if (url.hostname === "youtu.be") return page;
  if (!youtubeHosts.includes(url.hostname)) return null;
  if (page === "watch") return url.searchParams.get("v");
  if (["embed", "shorts", "live"].includes(page)) return id;
  return null;
}

function createPlayer({ title, url, poster }) {
  let source;
  try {
    source = new URL(url, document.baseURI);
  } catch {
    return null;
  }

  const youtubeId = getYouTubeId(source);
  if (youtubeId && /^[A-Za-z0-9_-]{11}$/.test(youtubeId)) {
    // Keep the initial play action on the site so it gets the shared click sound.
    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "video-launcher";
    launcher.setAttribute("aria-label", `Play ${title}`);

    const thumbnail = document.createElement("img");
    thumbnail.src = poster || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";

    const playIcon = document.createElement("span");
    playIcon.className = "video-play-icon";
    playIcon.setAttribute("aria-hidden", "true");
    launcher.append(thumbnail, playIcon);

    launcher.addEventListener("click", () => {
      const player = document.createElement("iframe");
      player.className = "video-player";
      player.title = title;
      player.referrerPolicy = "strict-origin-when-cross-origin";
      player.allow = "autoplay; encrypted-media; picture-in-picture";
      player.allowFullscreen = true;
      player.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1`;
      launcher.replaceWith(player);
      player.focus({ preventScroll: true });
    }, { once: true });

    return launcher;
  }

  if (["https:", "http:", "file:"].includes(source.protocol) && /\.mp4$/i.test(source.pathname)) {
    const player = document.createElement("video");
    player.setAttribute("aria-label", title);
    player.controls = true;
    player.playsInline = true;
    player.preload = "metadata";
    if (poster) player.poster = poster;
    player.src = source.href;
    return player;
  }

  return null;
}

const videoGrid = document.querySelector("[data-video-grid]");
const entries = portfolioVideos[videoGrid.dataset.videoGrid];

for (const entry of entries) {
  const player = createPlayer(entry);
  if (!player) {
    console.warn(`Use a YouTube video link or a direct MP4 URL in videos.js for ${entry.title}.`);
    continue;
  }

  const card = document.createElement("li");
  const title = document.createElement("h2");
  card.className = "video-card";
  player.classList.add("video-player");
  title.textContent = entry.title;
  card.append(player, title);
  videoGrid.append(card);
}

videoGrid.hidden = videoGrid.childElementCount === 0;
document.querySelector(".video-empty").hidden = !videoGrid.hidden;
