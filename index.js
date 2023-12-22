'use strict';

const carousel = require('./dist/carousel.js');
module.exports = carousel
module.exports.default = carousel;
module.exports.carousel = carousel;

// ESM
module.exports.initCarousel = carousel.initCarousel