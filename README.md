# 3D 旋转木马 轮播图

![example](https://raw.githubusercontent.com/baizhi958216/3DCarousel/main/example.png)

![example](https://raw.githubusercontent.com/baizhi958216/3DCarousel/main/example.gif)

## 用法:

Vanilla:

```html
<body>
  <div id="carousel">
    <div class="carousel-item"></div>
    <div class="carousel-item"></div>
    <div class="carousel-item"></div>
  </div>
</body>

<script type="module">
  import { initCarousel } from "./carousel.js";
  initCarousel({
    xRadius: 350,
    yRadius: 35,
    farScale: 0.7,
    speed: 4,
    itemClass: "carousel-item",
    handle: document.getElementById("carousel"),
  });
</script>
```

VueJS:

```vue
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
```

## 编译:

```cmd
npm build
```

如果你正在编译`Vanilla`, 请在`tsconfig.json`中将`"module": "CommonJS"`注释掉。