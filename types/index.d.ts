type CarouselOptions = {
    xOrigin?: number;
    yOrigin?: number;
    xRadius?: number;
    yRadius?: number;
    farScale?: number;
    speed?: number;
    itemClass: string;
    frontItemClass?: string;
    handle: HTMLElement;
};
export declare function initCarousel(options: CarouselOptions): void;