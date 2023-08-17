<template>
  <div>
    <h1>Add From Spotify</h1>
    <div class="flex flex-col m-5">
      <input type="text" name="data" id="" class="bg-gray-600" v-model="data" />
      <button type="button" @click="addToDb">Add that Playlist</button>
    </div>
  </div>
</template>

<script setup>
const data = ref("");

const addToDb = async () => {
  const url = new URL(data.value);

  console.log(url);

  if (url.hostname === "open.spotify.com") {
    const playlistId = url.pathname.split("/")[2];
    const { data } = await useLazyFetch(
      "http://localhost:4000/api/spotify/playlist",
      {
        method: "GET",
        query: {
          playlistId,
        },
      }
    );
    console.log(data.value);
  } else {
    console.log("not a spotify url");
  }
};
</script>
