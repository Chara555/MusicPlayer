<template>
  <div
    class="background"
    :style="{ backgroundImage: currentSong.background }"
  ></div>
  <div class="player" id="player">
    <div class="cover">
      <img
        :src="currentSong.cover"
        :class="['rotating', { playing: isPlaying }]"
        alt="歌曲封面"
      />
    </div>
    <audio ref="audio" :src="currentSong.src"></audio>
    <input
      type="range"
      v-model="progress"
      @input="onSeek"
      :max="100"
      :min="0"
      step="0.1"
    />
    <!-- 音乐播放器部分 -->
    <div class="controls">
      <button><i class="iconfont icon-shangyishoushangyige"></i></button>
      <button @click="togglePlay">
        <i
          class="iconfont"
          :class="isPlaying ? 'icon-zanting' : 'icon-bofang'"
        ></i>
      </button>
      <button><i class="iconfont icon-xiayigexiayishou"></i></button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const songs = [
  {
    src: "/music/绝不会忘记.mp3",
    cover: "/imgs/绝不会忘记.jpg",
    background: "url('public/bg/bg1.jpg')",
  },
  {
    src: "/music/music2.mp3",
    cover: "/imgs/cover2.jpg",
    background: "url('/bg/bg2.jpg')",
  },
];

const currentSongIndex = ref(0);
const currentSong = reactive({ ...songs[currentSongIndex.value] });

const isPlaying = ref(false);
const progress = ref(0);
const audio = ref(null);

function loadSong(index) {
  currentSongIndex.value = index;
  Object.assign(currentSong, songs[index]);
  progress.value = 0;
  if (audio.value) {
    audio.value.src = currentSong.src;
    audio.value.load();
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
    loadSong(nextIndex);
    audio.value.play();
    isPlaying.value = true;
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