import { Carousel } from "./carousel";

const carousel = new Carousel(".carousel-items", {
  itemsPerSlide: 5,
  scrollSpeed: 500,
  canLoop: true,
});
