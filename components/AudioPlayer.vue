<template>
  <div class="grid md:grid-cols-3 gap-4 h-full">
    <div class="hidden col-span-1 md:flex flex-row items-center w-full h-full">
      <NuxtLink :to="`/album/${albumId}`" class="m-[0_0.5rem_0_1rem]">
        <img
          :src="songImageUrl"
          class="rounded-lg hover:shadow-2xl w-16 h-16"
          alt="logo"
          height="64"
          width="64"
        />
      </NuxtLink>
      <div class="px-2">
        <NuxtLink
          :to="`/album/${albumId}`"
          class="flex flex-row hover:underline"
        >
          <p>
            {{
              songName.length > 30 ? songName.slice(0, 27) + "..." : songName
            }}
          </p>
          <p>,&nbsp;</p>
          <p>
            {{
              albumName.length > 15 ? albumName.slice(0, 12) + "..." : albumName
            }}
          </p>
        </NuxtLink>
        <div
          id="artistList"
          class="flex flex-row font-light text-sm overflow-x-scroll overflow-y-hidden h-8 w-64 text-clip whitespace-nowrap"
        >
          <div v-for="(artist, index) in artistData" :key="artist.id">
            <NuxtLink :to="`/artist/${artist.id}`">
              <p class="hover:underline mr-1 h-6">
                {{ artist.name }}
                {{ index !== artistData.length - 1 ? ", " : "" }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </div>
      <IconHeartFull
        v-if="isLiked"
        sizeX="30"
        sizeY="30"
        color="white"
        class="mx-6 cursor-pointer"
        @click="handleLike"
      />
      <IconHeart
        v-else
        sizeX="30"
        sizeY="30"
        color="white"
        class="mx-6 cursor-pointer"
        @click="handleLike"
      />
    </div>
    <div class="col-span-1 flex flex-col w-full h-full px-4 justify-center">
      <div class="flex flex-row items-center w-full">
        <p class="mr-2">{{ timestampSong }}</p>
        <input
          class="custom-range"
          ref="progresBar"
          type="range"
          :min="minRange"
          :max="maxRange"
          step="0.01"
          :value="valueRange"
          @input="updateMusiqueTime"
        />
        <p class="ml-2">{{ durationSong }}</p>
      </div>
      <div class="flex justify-evenly w-full">
        <IconPrevious
          @click="previous"
          sizeX="40"
          sizeY="40"
          color="white"
          class="cursor-pointer"
        />
        <IconPlay
          @click="play"
          sizeX="40"
          sizeY="40"
          :hidden="playHidden"
          color="white"
          class="cursor-pointer"
        />
        <IconPause
          @click="pause"
          sizeX="40"
          sizeY="40"
          :hidden="pauseHidden"
          color="white"
          class="cursor-pointer"
        />
        <IconNext
          @click="next"
          sizeX="40"
          sizeY="40"
          color="white"
          class="cursor-pointer"
        />
      </div>
    </div>
    <!-- TODO remake the volume design -->
    <div
      class="col-span-1 hidden md:flex flex-row h-full justify-end items-center mr-10"
    >
      <IconVolumeOff
        v-if="muted"
        @click="handleMute"
        sizeX="30"
        sizeY="30"
        color="white"
      />
      <IconVolumeUp
        v-else-if="volumeUp50"
        @click="handleMute"
        sizeX="30"
        sizeY="30"
        color="white"
      />
      <IconVolumeDown
        v-else
        @click="handleMute"
        sizeX="30"
        sizeY="30"
        color="white"
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        class="w-auto"
        :value="volumeValue"
        id="volumeBar"
        @input="updateVolume"
      />
    </div>
  </div>
  <audio
    ref="audioPlayer"
    hidden
    @timeupdate="timeUpdate"
    @loadedmetadata="metadataChanged"
    @pause="pause"
    @play="play"
  ></audio>
</template>

<script setup>
const { $musicEvent } = useNuxtApp();

let isPlaying = false;

$musicEvent.$on("playMusic", async (data) => {
  await useFetch("/api/music/queue/clear", {
    method: "POST",
  });

  if (data.id === songId.value) return;

  isPlaying = true;

  await loadSongWithId(data.id);
});

$musicEvent.$on("playAlbum", async (data) => {
  const { data: album } = await useFetch("/api/data/album/" + data.id, {
    method: "GET",
  });

  if (album.value.body.musics[0].id === songId.value) return;

  isPlaying = true;

  await loadSongWithId(album.value.body.musics[0].id);

  await useFetch("/api/music/queue/clear", {
    method: "POST",
  });

  for (let i = album.value.body.musics.length - 1; i > 0; i--) {
    await useFetch("/api/music/queue", {
      method: "POST",
      body: {
        songId: album.value.body.musics[i].id,
      },
    });
  }
});

$musicEvent.$on("updateLike", ({ id, liked }) => {
  if (id === songId.value) {
    isLiked.value = liked;
  }
});

const audioPlayer = ref(null);

const minRange = ref(0);

const maxRange = ref(0);

const valueRange = ref(0);

const volumeValue = ref(0);

const songName = ref("");

const albumName = ref("");

const songId = ref("1");

const albumId = ref("1");

const artistData = ref([{ name: "test", id: "1" }]);

const timestampSong = ref("00:00");

const durationSong = ref("00:00");

const songImageUrl = ref("/FPV-Combo.jpg");

const playHidden = ref(false);

const pauseHidden = ref(true);

const muted = ref(false);

const volumeUp50 = ref(true);

const isLiked = ref(false);

const getRandomMusic = async () => {
  const { data: randSong } = await useFetch("/api/music/random", {
    method: "GET",
  });

  return randSong.value.body.music;
};

const play = () => {
  audioPlayer.value.play();
  isPlaying = true;
  playHidden.value = true;
  pauseHidden.value = false;
};

const pause = () => {
  if (!audioPlayer.value.paused) {
    audioPlayer.value.pause();
  }
  isPlaying = false;
  playHidden.value = false;
  pauseHidden.value = true;
};

const handleMute = () => {
  muted.value = !muted.value;
  audioPlayer.value.muted = muted.value;
};

const previous = async () => {
  const headers = useRequestHeaders(["cookie"]);
  const { data } = await useFetch("/api/music/history", {
    method: "GET",
    headers,
    query: {
      offset: 2,
      erase: true,
    },
  });

  // console.log(data.value.body.history.music);

  if (data.value.body.history === null) {
    await loadSong(await getRandomMusic());
  } else {
    await loadSong(data.value.body.history.music);
  }
};

const next = async () => {
  const headers = useRequestHeaders(["cookie"]);
  const { data: nextSong } = await useFetch("/api/music/queue", {
    method: "GET",
    headers,
    query: {
      offset: 1,
      erase: true,
    },
  });

  if (nextSong.value.body.queue === null) {
    await loadSong(await getRandomMusic());
  } else {
    await loadSong(nextSong.value.body.queue.music);
  }
};

const musiqueEnded = () => {
  next();
};

const handleVolume = (delta) => {
  if (audioPlayer.value.volume + delta > 1) {
    audioPlayer.value.volume = 1;
  } else if (audioPlayer.value.volume + delta < 0) {
    audioPlayer.value.volume = 0;
  } else {
    audioPlayer.value.volume += delta;
  }
  if (audioPlayer.value.muted) {
    audioPlayer.value.muted = false;
  }
  volumeValue.value = audioPlayer.value.volume;

  if (audioPlayer.value.volume > 0.5) {
    volumeUp50.value = true;
  } else {
    volumeUp50.value = false;
  }

  localStorage.setItem("volume", audioPlayer.value.volume);
};

const handleLike = async () => {
  const headers = useRequestHeaders(["cookie"]);
  const { data } = await useFetch("/api/music/isLiked", {
    method: "GET",
    query: {
      id: songId.value,
    },
    headers,
  });

  if (data?.value?.body?.liked) {
    await useFetch("/api/music/dislike", {
      method: "POST",
      body: JSON.stringify({
        songId: songId.value,
      }),
      headers,
    });
  } else {
    await useFetch("/api/music/like", {
      method: "POST",
      body: JSON.stringify({
        songId: songId.value,
      }),
      headers,
    });
  }

  isLiked.value = !isLiked.value;

  $musicEvent.$emit("updateLikeFromPlayer", {
    id: songId.value,
    liked: isLiked.value,
  });
};

const updateMusiqueTime = (e) => {
  audioPlayer.value.currentTime = e.target.value;
  audioPlayer.value.play();
};

const updateVolume = (e) => {
  handleVolume(e.target.value - audioPlayer.value.volume);
};

const metadataChanged = () => {
  console.log("meta loaded");
  maxRange.value = audioPlayer.value.duration;
  durationSong.value = formatTime(audioPlayer.value.duration);
};

const timeUpdate = () => {
  valueRange.value = audioPlayer.value.currentTime;
  timestampSong.value = formatTime(audioPlayer.value.currentTime);

  if (audioPlayer.value.currentTime === audioPlayer.value.duration) {
    musiqueEnded();
  }
};

onMounted(async () => {
  window.addEventListener("keydown", async (e) => {
    if (e.code === "Space") {
      if (audioPlayer.value.paused) {
        play();
      } else {
        pause();
      }
    } else if (e.code === "ArrowRight") {
      if (e.ctrlKey) {
        await next();
      } else {
        audioPlayer.value.currentTime += 5;
      }
    } else if (e.code === "ArrowLeft") {
      if (e.ctrlKey) {
        await previous();
      } else {
        audioPlayer.value.currentTime -= 5;
      }
    } else if (e.code === "ArrowUp") {
      handleVolume(0.1);
    } else if (e.code === "ArrowDown") {
      handleVolume(-0.1);
    } else if (e.code === "Semicolon") {
      audioPlayer.value.muted = !audioPlayer.value.muted;
    }

    console.log(e.code);
  });

  volumeValue.value = audioPlayer.value.volume;

  // await loadLastSong()

  const volumeFromStorage = localStorage.getItem("volume");

  if (volumeFromStorage) {
    updateVolume({
      target: {
        value: volumeFromStorage,
      },
    });
  }

  // Set the scrollbar vertically for the artistList
  const artistList = document.querySelector("#artistList");
  artistList.addEventListener("mousewheel", (e) => {
    const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    artistList.scrollLeft -= delta * 40;
  });

  setTimeout(async () => {
    await loadLastSong();
  }, 0);
});

const loadSong = async (song) => {
  if (song.id === songId.value) {
    return;
  }

  artistData.value = song.artists;

  audioPlayer.value.src = song.previewUrl || "/musicGame.mp3";
  audioPlayer.value.load();
  songName.value = song.name;
  albumName.value = song.album.name;
  songImageUrl.value = song.thumbnail;

  songId.value = song.id;
  albumId.value = song.albumId;
  if (isPlaying) {
    play();
  }

  const headers = useRequestHeaders(["cookie"]);
  const isLikedData = await useFetch("/api/music/isLiked", {
    method: "GET",
    query: {
      id: song.id,
    },
    headers,
  });

  isLiked.value = isLikedData.data?.value?.body?.liked;

  await useFetch("/api/music/history", {
    method: "POST",
    body: JSON.stringify({
      songId: song.id,
    }),
    headers,
  });
};

const loadSongWithId = async (id) => {
  const { data: music } = await useFetch("/api/data/music/" + id, {
    method: "GET",
  });

  await loadSong(music.value.body);
};

const loadLastSong = async () => {
  const headers = useRequestHeaders(["cookie"]);
  const { data } = await useFetch("/api/music/history", {
    method: "GET",
    headers,
    query: {
      offset: 1,
      erase: true,
    },
  });

  if (data?.value?.body?.history?.music) {
    await loadSong(data.value.body.history.music);
  } else {
    await loadSong(await getRandomMusic());
  }
};

const scrollArtistList = (e) => {
  console.log("scroll");
  const scroll = e.deltaY;
  e.target.scrollLeft += scroll;
};
</script>

<style scoped>
input[type="range"].custom-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: #fff;
  border-radius: 2px;
  outline: none;
}

input[type="range"].custom-range::-webkit-slider-runnable-track {
  height: 4px;
  background: #fff;
  border-radius: 2px;
  transition: background-color 0.2s ease-in-out;
}

input[type="range"].custom-range:hover::-webkit-slider-runnable-track {
  background: #1db954;
}

input[type="range"].custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #1db954;
  width: 14px;
  height: 14px;
  background: #1db954;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -5px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
#artistList::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#artistList {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
