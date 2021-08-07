
export default class Typewriter {
  constructor(element, string) {
    this.index = 0;
    this.element = element;
    this.string = string;
    this.speed = 100;
    this.increment();
  }

  increment() {
    if (this.index < this.string.length) {
      this.element.innerHTML += this.string.charAt(this.index);
      this.index++;
      setTimeout(this.increment.bind(this), this.speed);
    }
  }
}
