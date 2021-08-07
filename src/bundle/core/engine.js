import * as PIXI from "pixi.js";
import * as Tone from "tone";
import Typewriter from "./typewriter.js";

export const engineMode = {
  DEVELOPMENT: 0,
  PRODUCTION: 1,
};

export class PulsarEngine {

  constructor(mode) {
    if (mode == undefined || mode == null)
      this.mode = engineMode.PRODUCTION;
    else
      this.mode = mode;
  }

  initialize(callback) {

    let notif = document.createElement("h1");
    notif.setAttribute("id", "notification-card");
    let text = "Press any key to begin";
    document.body.appendChild(notif);
    let writer = new Typewriter(notif, text);

    const initHandler = () => {
      window.removeEventListener("keydown", initHandler);
      notif.remove();
      this.initAudio();
      this.initCanvas();
      callback();
    };

    window.addEventListener("keydown", initHandler);
    if (this.mode == engineMode.PRODUCTION)
      window.onbeforeunload = () => { return "Are you sure you want to leave site? Game progress will be lost" };
  }

  async initAudio() {
    await Tone.start();
    console.log("Tone loaded");
  }

  initCanvas() {
    let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
      type = "canvas";
    }

    PIXI.utils.sayHello(type);

    this.app = new PIXI.Application({
      width: 1024,
      height: 512
    });
    this.app.renderer.autoResize = true;
    this.app.renderer.backgroundColor = 0xffffff;
    this.windowWidth = 1024;
    this.windowHeight = 512;

    document.body.appendChild(this.app.view);
    window.addEventListener("resize", () => {
      let nWindowWidth = window.innerWidth;
      let nWindowHeight = window.innerHeight;
      let scale = Math.min(nWindowWidth / this.windowWidth, nWindowHeight / this.windowHeight);
      this.app.stage.scale.set(scale);
      this.app.renderer.resize(1024 * scale, 512 * scale);
    });
    window.dispatchEvent(new Event("resize", { bubbles: true}));
  }
}
