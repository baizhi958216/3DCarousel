<script setup lang="ts">
import { onMounted } from "vue";
import { initCarousel } from "carouselable";
onMounted(() => {
  const carousel = document.getElementById("carousel");
  if (carousel) {
    initCarousel({
      itemClass: "carousel-item",
      handle: carousel,
      xRadius: 350,
      yRadius: 55,
      farScale: 0.7,
      speed: 4,
    });
  }
});
</script>

<template>
  <div class="container">
    <div id="carousel">
      <div class="carousel-item" style="background-color: rgba(127, 255, 212, 0.3)">
        <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 100px;">👻</div>
      </div>
      <div class="carousel-item" style="background-color: rgb(127, 150, 255, 0.3)">
        <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 100px;">🥰</div>
      </div>
      <div class="carousel-item" style="background-color: rgba(255, 127, 249, 0.3)">
        <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 100px;">😎</div>
      </div>
      <div class="carousel-item" style="background-color: rgba(127, 129, 255, 0.3)">
        <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 100px;">😘</div>
      </div>
      <div class="carousel-item" style="background-color: rgba(242, 255, 127, 0.3)">
        <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 100px;">🤷‍♂️</div>
      </div>
      <div class="carousel-item" style="background-color: rgba(255, 168, 127, 0.3)">
        <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 100px;">😡</div>
      </div>
    </div>
  </div>
</template>
