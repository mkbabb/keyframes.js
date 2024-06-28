import { CarouselEmits, CarouselProps } from './interface';

declare const useProvideCarousel: (args_0: CarouselProps, emits: CarouselEmits) => {
    carouselRef: import('vue').Ref<HTMLElement>;
    carouselApi: import('vue').Ref<import('embla-carousel').EmblaCarouselType>;
    canScrollPrev: import('vue').Ref<boolean>;
    canScrollNext: import('vue').Ref<boolean>;
    scrollPrev: () => void;
    scrollNext: () => void;
    orientation: "vertical" | "horizontal";
};
declare function useCarousel(): {
    carouselRef: import('vue').Ref<HTMLElement>;
    carouselApi: import('vue').Ref<import('embla-carousel').EmblaCarouselType>;
    canScrollPrev: import('vue').Ref<boolean>;
    canScrollNext: import('vue').Ref<boolean>;
    scrollPrev: () => void;
    scrollNext: () => void;
    orientation: "vertical" | "horizontal";
};
export { useCarousel, useProvideCarousel };
