import Phaser from "phaser";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { events, LOGIN_PLAYER } from "../App";

// Phaser event emitter
var emitter = new Phaser.Events.EventEmitter();

// initial vars for game (optional)
const initState = { player: {}, score: 0, gameOver: false };

// reducer
function reducer(state = initState, action) {
  switch (action.type) {
    case AUTH:
      emitter.emit("AUTH", action);
      return { ...state };
    default:
      return state;
  }
}

// event types
export const AUTH = "AUTH";

// redux
export const authEvents = createStore(
  reducer,
  applyMiddleware(thunkMiddleware, createLogger())
);

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
    // set-up an event handler for authenticated login
    emitter.on("AUTH", (event) => {
      console.log("EVENT:", event);
      // check user has signed-in; id exists
      if (!event.player?.id) {
        this.scene.start("Preloader");
      } else {
        this.scene.start("MainMenu");
      }
    });
  }

  preload() {
    this.load.setPath("assets/gamerue/");

    this.load.image("start_btn");
    this.load.image("title");
    this.load.image("logo");
    this.load.image("background");
    this.load.image("bulletHole", "bullet-hole.png");
    this.load.atlas("assets", "bank-panic.png", "bank-panic.json");
  }

  create() {
    //  create our global animations
    this.bg = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, "background")
      .setOrigin(0);

    this.anims.create({
      key: "doorOpen",
      frames: this.anims.generateFrameNames("assets", {
        prefix: "door",
        start: 1,
        end: 5,
      }),
      frameRate: 20,
    });

    this.anims.create({
      key: "doorClose",
      frames: this.anims.generateFrameNames("assets", {
        prefix: "door",
        start: 5,
        end: 1,
      }),
      frameRate: 20,
    });

    var startBoxStroke = this.add.graphics();
    startBoxStroke.fillStyle(0x334735, 1);
    startBoxStroke
      .fillRoundedRect(
        this.scale.width / 2 - 560 / 2,
        this.scale.height / 2 - 170 / 2,
        560,
        170,
        34
      )
      .setZ(0);

    var startBox = this.add.graphics();
    startBox.fillStyle(0xffffff, 1);
    startBox
      .fillRoundedRect(
        this.scale.width / 2 - 550 / 2,
        this.scale.height / 2 - 160 / 2,
        550,
        160,
        32
      )
      .setZ(1);

    this.startText = this.add
      .text(
        this.scale.width / 2 - 240,
        this.scale.height / 2 - 50,
        "Start Game",
        {
          font: "74px Arial Black",
          fill: "#334735",
        }
      )
      .setZ(3)
      .setStroke("#7CA57F", 16)
      .setShadow(2, 2, "#333333", 2, true, false);

    this.scale.on("resize", resize, this);

    this.startText.setInteractive();

    this.startText.once("pointerdown", () => {
      // communicate with ReactJS app
      events.dispatch({ type: LOGIN_PLAYER, score: 0 });
    });
  }
}

function resize(gameSize, baseSize, displaySize, resolution) {
  var width = gameSize.width;
  var height = gameSize.height;

  this.cameras.resize(width, height);

  this.bg.setSize(width, height);
  this.logo.setPosition(width / 2, height / 2);
}
