<template>
  <div class="h-full w-auto">
    <div
      id="presentationAlbum"
      class="h-3/6 w-full p-10 flex flex-row items-center rounded-2xl"
      :style="{
        backgroundImage: `linear-gradient(175deg, ${color} 20%, #2A2929 100%)`,
      }"
    >
      <img
        class="rounded-2xl m-5"
        :src="album.body.thumbnail"
        alt="album image"
        width="200"
        height="200"
      />
      <div class="ml-10">
        <p class="mb-3">Album</p>
        <div class="flex flex-row gap-3 items-center justify-center">
          <IconPlay
            :color="color"
            class="bg-neutral-400 rounded-full"
            @click="handleAlbumClick"
          />
          <h1 class="text-5xl font-semibold">{{ album.body.name }}</h1>
        </div>
        <div class="flex flex-row mt-10">
          <div v-for="artist in album.body.artists" :key="artist.id">
            <p>{{ artist.name }} -</p>
          </div>
          <p>{{ album.body.musics.length }} songs</p>
        </div>
      </div>
    </div>

    <!-- BUG the heigth is hard coded please update that before pushing in production -->
    <div id="musicList" class="overflow-y-scroll h-96 p-3">
      <div
        v-for="(music, index) in album.body.musics"
        :key="music.id"
        class="p-2 m-2 grid grid-cols-12 items-center"
        :class="index === 0 ? '' : 'border-t border-neutral-600'"
      >
        <p>{{ index + 1 }}</p>
        <IconPlay
          color="white"
          class="cursor-pointer"
          @click="handleMusicClick(music)"
        />
        <p class="col-span-4">
          {{ music.name }}
        </p>
        <IconHeartFull
          v-if="songLiked[index]"
          color="white"
          class="cursor-pointer"
          @click="dislikeMusic(music.id, index)"
        />
        <IconHeart
          v-else
          color="white"
          class="cursor-pointer"
          @click="likeMusic(music.id, index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const { $musicEvent } = useNuxtApp();

const songLiked = ref([]);

const handleMusicClick = (song) => {
  $musicEvent.$emit("playMusic", { id: song.id });
};

const handleAlbumClick = () => {
  $musicEvent.$emit("playAlbum", { id: album.value.body.id });
};

const route = useRoute();

const color = ref("#000");

const id = route.params.id;

const { data: album } = await useFetch("/api/data/album/" + id, {
  method: "GET",
});

const { data: c } = await useFetch("/api/image/averageColor", {
  method: "GET",
  query: {
    imageUrl: album.value.body.thumbnail,
  },
});

color.value = c.value.body.color;

await album.value.body.musics.forEach(async (music) => {
  const { data: isLiked } = await useFetch("/api/music/isLiked", {
    method: "GET",
    query: {
      id: music.id,
    },
  });

  songLiked.value.push(isLiked.value.body.liked ?? false);
});

const likeMusic = async (songId, index) => {
  await useFetch("/api/music/like", {
    method: "POST",
    body: {
      songId,
    },
  });

  songLiked.value[index] = true;

  $musicEvent.$emit("updateLike", { id: songId, liked: true });
};

const dislikeMusic = async (songId, index) => {
  await useFetch("/api/music/dislike", {
    method: "POST",
    body: {
      songId,
    },
  });

  songLiked.value[index] = false;

  $musicEvent.$emit("updateLike", { id: songId, liked: false });
};

$musicEvent.$on("updateLikeFromPlayer", ({ id, liked }) => {
  const index = album.value.body.musics.findIndex((music) => music.id === id);
  songLiked.value[index] = liked;
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
#musicList::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#musicList {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
