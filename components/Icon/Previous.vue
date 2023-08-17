<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" :height="sizeX" viewBox="0 -960 960 960" :width="sizeY" :fill="color">
      <path d="M220-240v-480h60v480h-60Zm520 0L394-480l346-240v480Zm-60-240Zm0 125v-250L499-480l181 125Z"/>
    </svg>
  </div>
</template>

<script setup>
  defineProps({
   sizeX: {
    type: String,
    default: '48'
   },
    sizeY: {
      type: String,
      default: '48'
    },
    color: {
      type: String,
      default: 'black'
    }
  });
</script>