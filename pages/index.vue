<template>
  <div>
    <div>
      <h1>History</h1>
    </div>
    <div>
      <h1>Recommanded for you</h1>
    </div>
    <div>
      <h1>Playlist</h1>
    </div>
    <div>
      <h1>Album</h1>
      <div
        class="flex flex-row hideScollbar overflow-scroll h-[32rem] w-[70rem]"
      >
        <div
          v-for="(album, index) in albums.body.album"
          class="m-2 inline-block w-52 h-52"
        >
          <!-- TODO make a custom card component for that -->
          <NuxtLink :to="`/album/${album.id}`">
            <img
              :src="album.thumbnail"
              alt="album thumbnail"
              class="w-52 h-52"
            />
          </NuxtLink>
          <!--<p>{{ album.name }}</p>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: albums } = await useFetch("/api/data/album", {
  method: "GET",
  query: {
    limit: 20,
  },
});

onMounted(() => {
  const hideScrollbarElements = document.querySelectorAll(".hideScollbar");
  hideScrollbarElements.forEach((scrollVerticaly) => {
    scrollVerticaly.addEventListener("mousewheel", (e) => {
      const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      scrollVerticaly.scrollLeft -= delta * 40;
    });
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("mousewheel", (e) => {
    const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    scrollVerticaly.scrollLeft -= delta * 40;
  });
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.hideScollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hideScrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
