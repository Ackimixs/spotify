<template>
  <div class="flex flex-col h-screen bg-neutral-900 text-white">
    <div class="h-[calc(100%_-_8rem)] flex">
      <aside
        class="w-48 h-auto hidden md:inline bg-neutral-800 m-2 p-2 rounded-md"
      >
        <NuxtLink to="/">
          <h1>Home</h1>
        </NuxtLink>
        <NuxtLink to="/admin/spotify">
          <h1>Add from spotify</h1>
        </NuxtLink>
      </aside>
      <!-- BUG THAT FUCKING HERE I DON'T FUCKING UNDERSTAND HOW CSS AND TAILWINDCSS WORK PLEASE HELP -->
      <main class="w-[calc(100%_-_12rem)] h-full">
        <div class="flex flex-col h-full">
          <div
            class="flex flex-row justify-between bg-neutral-800 m-2 p-2 rounded-md"
          >
            <p>Search</p>
            <NuxtLink to="/login" v-if="!loggedIn">Sign in</NuxtLink>
            <button v-else @click="handleSignOut">Sign Out</button>
          </div>
          <div class="bg-neutral-800 m-2 p-2 rounded-md h-full">
            <slot />
          </div>
        </div>
      </main>
    </div>
    <footer class="h-32 bg-neutral-800 m-2 rounded-md">
      <AudioPlayer />
    </footer>
  </div>
</template>

<script lang="ts" setup>
const { status, signIn, signOut } = useAuth();

const loggedIn = computed(() => status.value === "authenticated");

async function handleSignOut() {
  await signOut();
}
</script>
