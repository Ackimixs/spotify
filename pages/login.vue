<template>
  <div class="flex flex-col gap-1">
    <NuxtLink to="/">Hello World !</NuxtLink>
    <button @click="signInWithGithub" class="p-1 border rounded-2xl w-64">
      Connect with Github
    </button>
    <button @click="signInWithTwitch" class="p-1 border rounded-2xl w-64">
      Connect with Twitch
    </button>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const { signIn } = useAuth();

const signInWithGithub = async () => {
  await signIn("github");
};

const signInWithTwitch = async () => {
  await signIn("twitch");
};
</script>
