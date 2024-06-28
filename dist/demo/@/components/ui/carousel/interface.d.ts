import { HTMLAttributes, UnwrapRef } from 'vue';
import { default as useEmblaCarousel, EmblaCarouselVueType } from 'embla-carousel-vue';

type CarouselApi = EmblaCarouselVueType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
export type UnwrapRefCarouselApi = UnwrapRef<CarouselApi>;
export interface CarouselProps {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: 'horizontal' | 'vertical';
}
export interface CarouselEmits {
    (e: 'init-api', payload: UnwrapRefCarouselApi): void;
}
export interface WithClassAsProps {
    class?: HTMLAttributes['class'];
}
export {};
