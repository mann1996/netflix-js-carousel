const defaultOptions = {
  itemsPerSlide: 5,
  scrollSpeed: 500,
  canLoop: true,
};
export class Carousel {
  /**
   *
   * @param {string} htmlElement
   * @param {type of defaultOptions} options?
   */
  constructor(htmlElement, options = defaultOptions) {
    this.htmlElement = document.querySelector(htmlElement);
    this.htmlElement.style.setProperty(
      "--scroll-speed",
      options.scrollSpeed + "ms"
    );
    this.slides = Array.from(this.htmlElement.children);
    this.controls = {
      left: document.querySelector(".carousel> .left"),
      right: document.querySelector(".carousel> .right"),
    };

    this.htmlElement.style.setProperty(
      "--items-per-slide",
      options.itemsPerSlide
    );
    this.scrollSpeed = options.scrollSpeed;
    this.itemsPerSlide = options.itemsPerSlide;
    this.totalSlides = Math.ceil(this.slides.length / options.itemsPerSlide);
    this.translateX = 0;
    this.currentSlide = 1;
    this.canLoop =
      options.canLoop && this.slides.length >= this.itemsPerSlide * 3;
    this.canLoopForward = false;
    this.#initializeEvents();
  }

  #initializeEvents() {
    this.controls.left.addEventListener("click", () => this.#moveRight());
    this.controls.right.addEventListener("click", () => this.#moveLeft());
  }

  #moveLeft() {
    if (this.currentSlide < this.totalSlides) {
      this.currentSlide += 1;
      if (!this.canLoop) this.translateX -= 100;
      if (this.currentSlide > 2 || this.totalSlides === 2)
        this.canLoopForward = true;
    } else {
      this.currentSlide = 1;
      if (!this.canLoop) this.translateX = 0;
    }
    if (this.canLoop) this.translateX -= 100;
    this.htmlElement.style.setProperty(
      "--scroll-speed",
      this.scrollSpeed + "ms"
    );
    this.htmlElement.style.setProperty("--translate", this.translateX + "%");
    this.controls.left.style.visibility = "visible";

    if (this.canLoopForward && this.canLoop)
      this.htmlElement.addEventListener(
        "transitionend",
        () => {
          let firstIndex = 0;
          let lastIndex = this.itemsPerSlide;
          this.slides
            .slice(firstIndex, lastIndex)
            .forEach((slide) => this.htmlElement.appendChild(slide));
          this.#generateSlides(1);
        },
        { once: true }
      );
  }

  #moveRight() {
    if (this.canLoop)
      this.htmlElement.addEventListener(
        "transitionend",
        () => {
          let firstIndex = this.slides.length - this.itemsPerSlide;
          this.slides
            .slice(firstIndex)
            .reverse()
            .forEach((slide) =>
              this.htmlElement.insertBefore(slide, this.htmlElement.firstChild)
            );
          this.#generateSlides(-1);
        },
        { once: true }
      );
    if (this.currentSlide > 1) {
      this.currentSlide -= 1;
      if (!this.canLoop) this.translateX += 100;
    } else {
      this.currentSlide = this.totalSlides;
      if (!this.canLoop) this.translateX = -100 * (this.totalSlides - 1);
    }
    if (this.canLoop) this.translateX += 100;
    this.htmlElement.style.setProperty(
      "--scroll-speed",
      this.scrollSpeed + "ms"
    );
    this.htmlElement.style.setProperty("--translate", this.translateX + "%");
  }

  #generateSlides(direction = 1) {
    this.htmlElement.style.setProperty("--scroll-speed", "0ms");
    this.translateX += 100 * direction;
    this.htmlElement.style.setProperty("--translate", this.translateX + "%");
    this.slides = Array.from(this.htmlElement.children);
  }
}
