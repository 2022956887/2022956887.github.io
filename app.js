"use strict";

const photos = [
  {src:"https://yu-hao-0323.github.io/yuhao-mechanical-portfolio/assets/robot-platform.jpg",title:"01 / 整机试验平台",alt:"蓝色机器人试验平台，内部安装并联机械臂和末端执行器"},
  {src:"https://yu-hao-0323.github.io/yuhao-mechanical-portfolio/assets/parallel-arm.jpg",title:"02 / 并联机械臂结构",alt:"并联机械臂的电机安装、连杆及关节连接结构"},
  {src:"https://yu-hao-0323.github.io/yuhao-mechanical-portfolio/assets/end-effector-front.jpg",title:"03 / 末端执行器与双目相机",alt:"采摘末端执行器、双目相机与黑色安装支架"},
  {src:"https://yu-hao-0323.github.io/yuhao-mechanical-portfolio/assets/end-effector-side.jpg",title:"04 / 末端执行器装配视角",alt:"另一视角的末端执行器、相机支架和连接结构"},
  {src:"https://yu-hao-0323.github.io/yuhao-mechanical-portfolio/assets/drive-wiring.jpg",title:"05 / 驱动模块与整机布线",alt:"机器人试验平台侧面的驱动模块与线缆布置"}
];
const viewer = document.getElementById("photo-viewer");
const viewerImage = document.getElementById("viewer-image");
const viewerTitle = document.getElementById("viewer-title");
const viewerCount = document.getElementById("viewer-count");
let currentPhoto = 0;
let photoTrigger = null;

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  viewerImage.src = photo.src;
  viewerImage.alt = photo.alt;
  viewerTitle.textContent = photo.title;
  viewerCount.textContent = `${currentPhoto + 1} / ${photos.length}`;
}

document.querySelectorAll("[data-photo]").forEach(button => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.photo);
    if (typeof viewer.showModal !== "function") {
      window.open(photos[index].src, "_blank", "noopener");
      return;
    }
    photoTrigger = button;
    showPhoto(index);
    viewer.showModal();
    document.body.classList.add("is-viewing");
  });
});
document.getElementById("viewer-close").addEventListener("click", () => viewer.close());
document.getElementById("photo-prev").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.getElementById("photo-next").addEventListener("click", () => showPhoto(currentPhoto + 1));
viewer.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") {event.preventDefault();showPhoto(currentPhoto - 1);}
  if (event.key === "ArrowRight") {event.preventDefault();showPhoto(currentPhoto + 1);}
});
viewer.addEventListener("click", event => {if (event.target === viewer) viewer.close();});
viewer.addEventListener("close", () => {
  document.body.classList.remove("is-viewing");
  if (photoTrigger) photoTrigger.focus({preventScroll:true});
});

document.querySelectorAll("[data-video-card]").forEach(card => {
  const video = card.querySelector("video");
  const playToggle = card.querySelector("[data-play-toggle]");
  const videoError = card.querySelector("[data-video-error]");
  function updateVideoControl() {
    const paused = video.paused || video.ended;
    playToggle.innerHTML = paused ? '播放视频 <span aria-hidden="true">▶</span>' : '暂停视频 <span aria-hidden="true">Ⅱ</span>';
    playToggle.setAttribute("aria-label", `${paused ? "播放" : "暂停"}${card.dataset.videoName}`);
  }
  playToggle.addEventListener("click", async () => {
    if (video.paused || video.ended) {
      videoError.hidden = true;
      if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.load();
      try {await video.play();} catch {videoError.hidden = false;}
    } else {
      video.pause();
    }
  });
  video.addEventListener("play", () => {
    document.querySelectorAll("video").forEach(other => {if (other !== video) other.pause();});
    updateVideoControl();
  });
  video.addEventListener("pause", updateVideoControl);
  video.addEventListener("ended", updateVideoControl);
  video.addEventListener("error", () => {videoError.hidden = false;});
  video.querySelector("source").addEventListener("error", () => {videoError.hidden = false;});
});
