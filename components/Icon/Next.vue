<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :height="sizeX"
      viewBox="0 -960 960 960"
      :width="sizeY"
      :fill="color"
    >
      <path
        d="M680-240v-480h60v480h-60Zm-460 0v-480l346 240-346 240Zm60-240Zm0 125 181-125-181-125v250Z"
      />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  sizeX: {
    type: String,
    default: "48",
  },
  sizeY: {
    type: String,
    default: "48",
  },
  color: {
    type: String,
    default: "black",
  },
});
</script>
