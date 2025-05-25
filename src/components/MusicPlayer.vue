<template>
  <div class="app">
    <div
      class="background"
      :style="{ backgroundImage: `url(${currentSong.background})` }"
    ></div>

    <div class="player" id="player">
      <div class="cover">
        <img
          :src="currentSong.cover"
          :class="['rotating', { playing: isPlaying }]"
          alt="歌曲封面"
        />
      </div>

      <audio ref="audio" />

      <input
        type="range"
        v-model="progress"
        @input="onSeek"
        :max="100"
        :min="0"
        step="0.1"
      />

      <div class="controls">
        <button @click="prevSong">
          <i class="iconfont icon-shangyishoushangyige"></i>
        </button>
        <button @click="togglePlay">
          <i
            class="iconfont"
            :class="isPlaying ? 'icon-zanting' : 'icon-bofang'"
          ></i>
        </button>
        <button @click="nextSong">
          <i class="iconfont icon-xiayigexiayishou"></i>
        </button>
      </div>
    </div>
  </div>
  <CurrentTime />
</template>

<script setup>
import { ref, onMounted } from "vue";
//导入时间模块
import CurrentTime from "./CurrentTime.vue";
const songs = [
  {
    src: "/music/绝不会忘记.mp3",
    cover: "/imgs/绝不会忘记.jpg",
    background: "/bg/bg1.jpg",
  },
  {
    src: "/music/吉他与孤独与蓝色星球.mp3",
    cover: "/imgs/吉他与孤独与蓝色星球.jpg",
    background: "/bg/bg2.jpg",
  },
];

const currentSongIndex = ref(0);
const currentSong = ref(songs[currentSongIndex.value]);
const isPlaying = ref(false);
const progress = ref(0);
const audio = ref(null);

function loadSong(index) {
  currentSongIndex.value = index;
  currentSong.value = songs[index];
  progress.value = 0;
  console.log("切换歌曲:", currentSong.value);
  console.log("backgroundImage:", `url(${currentSong.value.background})`);
  if (audio.value) {
    audio.value.pause(); // 先停止播放
    audio.value.src = currentSong.value.src;
    audio.value.load(); // 触发 canplay

    const handleCanPlay = () => {
      if (isPlaying.value) {
        audio.value.play().catch((err) => {
          console.error("播放失败:", err);
        });
      }
      audio.value.removeEventListener("canplay", handleCanPlay);
    };

    audio.value.addEventListener("canplay", handleCanPlay);
  }
}

function togglePlay() {
  if (!audio.value) return;

  if (audio.value.paused) {
    audio.value.play();
    isPlaying.value = true;
  } else {
    audio.value.pause();
    isPlaying.value = false;
  }
}
function nextSong() {
  const nextIndex = (currentSongIndex.value + 1) % songs.length;
  isPlaying.value = true;
  loadSong(nextIndex);
}

function prevSong() {
  const prevIndex = (currentSongIndex.value - 1 + songs.length) % songs.length;
  isPlaying.value = true;
  loadSong(prevIndex);
}

function onSeek() {
  if (!audio.value) return;
  audio.value.currentTime = (progress.value / 100) * audio.value.duration;
}

onMounted(() => {
  loadSong(currentSongIndex.value);

  audio.value.addEventListener("timeupdate", () => {
    if (audio.value.duration) {
      progress.value = (audio.value.currentTime / audio.value.duration) * 100;
    }
  });

  audio.value.addEventListener("ended", () => {
    const nextIndex = (currentSongIndex.value + 1) % songs.length;
    isPlaying.value = true;
    loadSong(nextIndex);
  });
});
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(12px) brightness(0.7);
  z-index: -1;
}

.player {
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  max-width: 300px;
  margin: auto;
}

.cover img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 10px solid white;
  animation: spin 5s linear infinite;
  animation-play-state: paused;
  z-index: 11;
  position: relative;
}

.rotating.playing {
  animation-play-state: running;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

input[type="range"] {
  width: 100%;
  margin: 10px 0;
}

.controls {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.iconfont {
  font-size: 3em;
  color: white;
}
</style>
