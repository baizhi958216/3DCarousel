class CarouselItem {
  element: HTMLElement;
  fullWidth: number;

  constructor(element: HTMLElement, options: any) {
    this.element = element;
    this.fullWidth = element.offsetWidth;
    this.element.style.display = "inline-block";
    this.element.style.position = "absolute";
    this.element.style.transformOrigin = "0 0";
  }

  moveTo(x: number, y: number, scale: number): void {
    this.element.style.zIndex = `${(scale * 100) | 0}`;
    this.element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }
}

class Carousel {
  private element: HTMLElement;
  private options: any;
  private items: CarouselItem[];
  private xOrigin: number;
  private yOrigin: number;
  private xRadius: number;
  private yRadius: number;
  private farScale: number;
  private rotation: number;
  private destRotation: number;
  private speed: number;
  private timer: number;
  private frontItemClass: string;
  private onLoaded: Function;
  private onRendered: Function;
  private onAnimationFinished: Function;
  private itemOptions: any;
  private lastTime: number;
  private initTimer;

  constructor(element: HTMLElement, options: any) {
    this.element = element;
    this.options = options;
    this.items = [];
    this.xOrigin = options.xOrigin ?? element.clientWidth * 0.5;
    this.yOrigin = options.yOrigin ?? element.clientHeight * 0.1;
    this.xRadius = options.xRadius ?? element.clientWidth / 2.3;
    this.yRadius = options.yRadius ?? element.clientHeight / 6;
    this.farScale = options.farScale;
    this.rotation = this.destRotation = Math.PI / 2;
    this.speed = options.speed;
    this.timer = 0;
    this.frontItemClass = options.frontItemClass;
    this.onLoaded = options.onLoaded;
    this.onRendered = options.onRendered;
    this.onAnimationFinished = options.onAnimationFinished;

    this.itemOptions = {};

    this.element.style.position = "relative";
    this.element.style.overflow = "hidden";

    this.lastTime = performance.now();

    this.initTimer = setInterval(() => {
      this.finishInit();
    }, 50);
  }

  renderItem = (itemIndex: number, rotation: number): CarouselItem => {
    const item = this.items[itemIndex];
    const sin = Math.sin(rotation);
    const farScale = this.farScale;
    const scale = farScale + (1 - farScale) * (sin + 1) * 0.5;

    item.moveTo(
      this.xOrigin +
        scale * (Math.cos(rotation) * this.xRadius - item.fullWidth * 0.5),
      this.yOrigin + scale * sin * this.yRadius,
      scale
    );

    return item;
  };

  render = (): void => {
    const count = this.items.length;
    const spacing = (2 * Math.PI) / count;
    let radians = this.rotation;
    const nearest = Math.round(this.floatIndex()) % this.items.length;

    for (let i = 0; i < count; i++) {
      const item = this.renderItem(i, radians);

      if (i === nearest) item.element.classList.add(this.frontItemClass);
      else item.element.classList.remove(this.frontItemClass);

      radians += spacing;
    }

    if (typeof this.onRendered === "function") this.onRendered(this);
  };

  playFrame = (): void => {
    const rem = this.destRotation - this.rotation;
    const now = performance.now();
    const dt = (now - this.lastTime) * 0.002;
    this.lastTime = now;

    if (Math.abs(rem) < 0.003) {
      this.rotation = this.destRotation;
      this.pause();

      if (typeof this.onAnimationFinished === "function")
        this.onAnimationFinished();
    } else {
      this.rotation = this.destRotation - rem / (1 + this.speed * dt);
      this.scheduleNextFrame();
    }

    this.render();
  };

  scheduleNextFrame = (): void => {
    this.lastTime = performance.now();
    this.timer = window.requestAnimationFrame(this.playFrame);
  };

  itemsRotated = (): number => {
    return (this.items.length * (Math.PI / 2 - this.rotation)) / (2 * Math.PI);
  };

  floatIndex = (): number => {
    const count = this.items.length;
    let floatIndex = this.itemsRotated() % count;

    return floatIndex < 0 ? floatIndex + count : floatIndex;
  };

  play = (): void => {
    if (this.timer === 0) this.scheduleNextFrame();
  };

  pause = (): void => {
    window.cancelAnimationFrame(this.timer);
    this.timer = 0;
  };

  go = (count: number): void => {
    this.destRotation += ((2 * Math.PI) / this.items.length) * count;
    this.play();
  };

  goTo = (index: number): number => {
    const count = this.items.length;

    let diff = index - (this.floatIndex() % count);

    if (2 * Math.abs(diff) > count) diff -= diff > 0 ? count : -count;

    this.destRotation = this.rotation;

    this.go(-diff);

    return diff;
  };

  finishInit = (): void => {
    clearInterval(this.initTimer);
    const itemClasses = this.element.querySelectorAll(
      `.${this.options.itemClass}`
    );

    for (let i = 0; i < itemClasses.length; i++) {
      this.items.push(
        new CarouselItem(itemClasses[i] as HTMLElement, this.itemOptions)
      );

      itemClasses[i].addEventListener("mousedown", () => this.goTo(i));

      this.render();
    }
  };
}
const initCarousel = (options: any): void => {
  options = Object.assign(
    {
      xOrigin: null,
      yOrigin: null,
      xRadius: null,
      yRadius: null,
      farScale: 0.5,
      speed: 4,
      itemClass: "carousel-item",
      frontItemClass: null,
      handle: "carousel",
    },
    options
  );

  new Carousel(document.querySelector(options.handle), options);
};