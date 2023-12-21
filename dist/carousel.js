"use strict";
var CarouselItem = /** @class */ (function () {
    function CarouselItem(element, options) {
        this.element = element;
        this.fullWidth = element.offsetWidth;
        this.element.style.display = "inline-block";
        this.element.style.position = "absolute";
        this.element.style.transformOrigin = "0 0";
    }
    CarouselItem.prototype.moveTo = function (x, y, scale) {
        this.element.style.zIndex = "".concat((scale * 100) | 0);
        this.element.style.transform = "translate(".concat(x, "px, ").concat(y, "px) scale(").concat(scale, ")");
    };
    return CarouselItem;
}());
var Carousel = /** @class */ (function () {
    function Carousel(element, options) {
        var _this = this;
        var _a, _b, _c, _d;
        this.renderItem = function (itemIndex, rotation) {
            var item = _this.items[itemIndex];
            var sin = Math.sin(rotation);
            var farScale = _this.farScale;
            var scale = farScale + (1 - farScale) * (sin + 1) * 0.5;
            item.moveTo(_this.xOrigin +
                scale * (Math.cos(rotation) * _this.xRadius - item.fullWidth * 0.5), _this.yOrigin + scale * sin * _this.yRadius, scale);
            return item;
        };
        this.render = function () {
            var count = _this.items.length;
            var spacing = (2 * Math.PI) / count;
            var radians = _this.rotation;
            var nearest = Math.round(_this.floatIndex()) % _this.items.length;
            for (var i = 0; i < count; i++) {
                var item = _this.renderItem(i, radians);
                if (i === nearest)
                    item.element.classList.add(_this.frontItemClass);
                else
                    item.element.classList.remove(_this.frontItemClass);
                radians += spacing;
            }
            if (typeof _this.onRendered === "function")
                _this.onRendered(_this);
        };
        this.playFrame = function () {
            var rem = _this.destRotation - _this.rotation;
            var now = performance.now();
            var dt = (now - _this.lastTime) * 0.002;
            _this.lastTime = now;
            if (Math.abs(rem) < 0.003) {
                _this.rotation = _this.destRotation;
                _this.pause();
                if (typeof _this.onAnimationFinished === "function")
                    _this.onAnimationFinished();
            }
            else {
                _this.rotation = _this.destRotation - rem / (1 + _this.speed * dt);
                _this.scheduleNextFrame();
            }
            _this.render();
        };
        this.scheduleNextFrame = function () {
            _this.lastTime = performance.now();
            _this.timer = window.requestAnimationFrame(_this.playFrame);
        };
        this.itemsRotated = function () {
            return (_this.items.length * (Math.PI / 2 - _this.rotation)) / (2 * Math.PI);
        };
        this.floatIndex = function () {
            var count = _this.items.length;
            var floatIndex = _this.itemsRotated() % count;
            return floatIndex < 0 ? floatIndex + count : floatIndex;
        };
        this.play = function () {
            if (_this.timer === 0)
                _this.scheduleNextFrame();
        };
        this.pause = function () {
            window.cancelAnimationFrame(_this.timer);
            _this.timer = 0;
        };
        this.go = function (count) {
            _this.destRotation += ((2 * Math.PI) / _this.items.length) * count;
            _this.play();
        };
        this.goTo = function (index) {
            var count = _this.items.length;
            var diff = index - (_this.floatIndex() % count);
            if (2 * Math.abs(diff) > count)
                diff -= diff > 0 ? count : -count;
            _this.destRotation = _this.rotation;
            _this.go(-diff);
            return diff;
        };
        this.finishInit = function () {
            clearInterval(_this.initTimer);
            var itemClasses = _this.element.querySelectorAll(".".concat(_this.options.itemClass));
            var _loop_1 = function (i) {
                _this.items.push(new CarouselItem(itemClasses[i], _this.itemOptions));
                itemClasses[i].addEventListener("mousedown", function () { return _this.goTo(i); });
                _this.render();
            };
            for (var i = 0; i < itemClasses.length; i++) {
                _loop_1(i);
            }
        };
        this.element = element;
        this.options = options;
        this.items = [];
        this.xOrigin = (_a = options.xOrigin) !== null && _a !== void 0 ? _a : element.clientWidth * 0.5;
        this.yOrigin = (_b = options.yOrigin) !== null && _b !== void 0 ? _b : element.clientHeight * 0.1;
        this.xRadius = (_c = options.xRadius) !== null && _c !== void 0 ? _c : element.clientWidth / 2.3;
        this.yRadius = (_d = options.yRadius) !== null && _d !== void 0 ? _d : element.clientHeight / 6;
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
        this.initTimer = setInterval(function () {
            _this.finishInit();
        }, 50);
    }
    return Carousel;
}());
var initCarousel = function (options) {
    options = Object.assign({
        xOrigin: null,
        yOrigin: null,
        xRadius: null,
        yRadius: null,
        farScale: 0.5,
        speed: 4,
        itemClass: "carousel-item",
        frontItemClass: null,
        handle: "carousel",
    }, options);
    new Carousel(document.querySelector(options.handle), options);
};
