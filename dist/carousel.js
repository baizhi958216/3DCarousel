"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCarousel = exports.CarouselItem = exports.Carousel = void 0;
class CarouselItem {
    element;
    fullWidth;
    constructor(element, options) {
        this.element = element;
        this.fullWidth = element.offsetWidth;
        this.element.style.display = "inline-block";
        this.element.style.position = "absolute";
        this.element.style.transformOrigin = "0 0";
    }
    moveTo(x, y, scale) {
        this.element.style.zIndex = `${(scale * 100) | 0}`;
        this.element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
}
exports.CarouselItem = CarouselItem;
class Carousel {
    element;
    options;
    items;
    xOrigin;
    yOrigin;
    xRadius;
    yRadius;
    farScale;
    rotation;
    destRotation;
    speed;
    timer;
    frontItemClass;
    onLoaded;
    onRendered;
    onAnimationFinished;
    itemOptions;
    lastTime;
    initTimer;
    constructor(element, options) {
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
    renderItem = (itemIndex, rotation) => {
        const item = this.items[itemIndex];
        const sin = Math.sin(rotation);
        const farScale = this.farScale;
        const scale = farScale + (1 - farScale) * (sin + 1) * 0.5;
        item.moveTo(this.xOrigin +
            scale * (Math.cos(rotation) * this.xRadius - item.fullWidth * 0.5), this.yOrigin + scale * sin * this.yRadius, scale);
        return item;
    };
    render = () => {
        const count = this.items.length;
        const spacing = (2 * Math.PI) / count;
        let radians = this.rotation;
        const nearest = Math.round(this.floatIndex()) % this.items.length;
        for (let i = 0; i < count; i++) {
            const item = this.renderItem(i, radians);
            if (i === nearest)
                item.element.classList.add(this.frontItemClass);
            else
                item.element.classList.remove(this.frontItemClass);
            radians += spacing;
        }
        if (typeof this.onRendered === "function")
            this.onRendered(this);
    };
    playFrame = () => {
        const rem = this.destRotation - this.rotation;
        const now = performance.now();
        const dt = (now - this.lastTime) * 0.002;
        this.lastTime = now;
        if (Math.abs(rem) < 0.003) {
            this.rotation = this.destRotation;
            this.pause();
            if (typeof this.onAnimationFinished === "function")
                this.onAnimationFinished();
        }
        else {
            this.rotation = this.destRotation - rem / (1 + this.speed * dt);
            this.scheduleNextFrame();
        }
        this.render();
    };
    scheduleNextFrame = () => {
        this.lastTime = performance.now();
        this.timer = window.requestAnimationFrame(this.playFrame);
    };
    itemsRotated = () => {
        return (this.items.length * (Math.PI / 2 - this.rotation)) / (2 * Math.PI);
    };
    floatIndex = () => {
        const count = this.items.length;
        let floatIndex = this.itemsRotated() % count;
        return floatIndex < 0 ? floatIndex + count : floatIndex;
    };
    play = () => {
        if (this.timer === 0)
            this.scheduleNextFrame();
    };
    pause = () => {
        window.cancelAnimationFrame(this.timer);
        this.timer = 0;
    };
    go = (count) => {
        this.destRotation += ((2 * Math.PI) / this.items.length) * count;
        this.play();
    };
    goTo = (index) => {
        const count = this.items.length;
        let diff = index - (this.floatIndex() % count);
        if (2 * Math.abs(diff) > count)
            diff -= diff > 0 ? count : -count;
        this.destRotation = this.rotation;
        this.go(-diff);
        return diff;
    };
    finishInit = () => {
        clearInterval(this.initTimer);
        const itemClasses = this.element.getElementsByClassName(`${this.options.itemClass}`);
        for (let i = 0; i < itemClasses.length; i++) {
            this.items.push(new CarouselItem(itemClasses[i], this.itemOptions));
            itemClasses[i].addEventListener("mousedown", () => this.goTo(i));
            this.render();
        }
    };
}
exports.Carousel = Carousel;
const initCarousel = (options = {
    farScale: 0.5,
    speed: 4,
    itemClass: "carousel-item",
    handle: document.getElementById("carousel"),
}) => {
    new Carousel(options.handle, options);
};
exports.initCarousel = initCarousel;
