// import for reading metadata json file
import Phaser from "phaser";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { useHistory } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import Boot from "./scenes/Boot.js";
import MainGame from "./scenes/Game.js";
import MainMenu from "./scenes/MainMenu.js";
import Preloader, { AUTH, authEvents } from "./scenes/Preloader.js";

let game: Phaser.Game | null = null;

const initState = { player: {}, score: 0, nft: "", gameOver: false };

//event types
export const GET_PLAYER = "GET_PLAYER";
export const LOGIN_PLAYER = "LOGIN_PLAYER";
export const UPDATE_SCORE = "UPDATE_SCORE";
export const GAME_OVER = "GAME_OVER";

// reducer
function reducer(
  state = initState,
  action: { type: any; player: any; score: any }
) {
  switch (action.type) {
    case GET_PLAYER:
      return { ...state, player: action.player };
    case LOGIN_PLAYER:
      game?.events.emit("LOGIN_PLAYER", "Login player");
      return { ...state, score: action.score };
    case UPDATE_SCORE:
      return { ...state, score: action.score };
    case GAME_OVER:
      // emit Phaser game event to trigger on-chain
      /* 
      game.events.emit(
        "BLOCK_CHECK",
        "Test Chain Connectivity: Check Some Block Data"
      );
       */
      return { ...state, score: action.score, gameOver: true };
    default:
      return state;
  }
}

// redux
export const events = createStore(
  reducer,
  applyMiddleware(thunkMiddleware, createLogger())
);

function App() {
  const [loaded, setLoaded] = useState(false);
  let history = useHistory();
  const { Moralis, authenticate, isAuthenticated, logout } = useMoralis();

  // function startGame(_user: any, _demoNFTimage: string) {
  //   console.log("USER:", _user);
  //   // communicate to Phaser game that player is authenticated
  //   authEvents.dispatch({ type: AUTH, player: _user });
  // }

  const login = async () => {
    console.log("here :>> ");
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (_user) {
          console.log("logged in user:", _user);
          console.log(_user?.get("ethAddress"));
          if (!_user) {
            authEvents.dispatch({ type: AUTH, player: null });
            logout();
            console.log("logged out");
          } else {
            // begin check: permission only if holds NFT from collection 0x…
            checkNFTBalance(_user);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const checkNFTBalance = async (user: any) => {
    let valid = false;

    const polygonNFTs = await Moralis.Web3API.account.getNFTs({
      chain: "mumbai",
      address: user.get("ethAddress"),
    });

    console.log("polygonNFTs :>> ", polygonNFTs);
    // if (!polygonNFTs || polygonNFTs?.result?.length === 0) {
    //   console.log("Nope");
    //   authEvents.dispatch({ type: AUTH, player: null });
    //   logout();
    //   console.log("User logged-out");
    // } else {
    // }
    console.log("ACCESS GRANTED", valid);
    compileNFT(user);
  };

  const compileNFT = async (user: any) => {
    history.push("/choose-character");
    // nftEvents.dispatch({
    //   type: LOAD_NFT,
    //   nft: "https://ipfs.infura.io/ipfs/QmfXfLziHiL2993iujRMebNSNKDdsN1XjjKFmeXZG9LsKa",
    // });
    // authEvents.dispatch({ type: AUTH, player: user });
  };

  if (!loaded) {
    setLoaded(true);
    const config = {
      type: Phaser.AUTO,
      gameTitle: "GameRue",
      parent: "game-container",
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      autoFocus: true,
      fps: {
        target: 60,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
          debug: false,
        },
      },
      backgroundColor: "#282c34",
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: "phaser-example",
        width: "100%",
        height: "100%",
      },
      scene: [Boot, Preloader, MainMenu, MainGame],
    };
    if (game === null) {
      game = new Phaser.Game(config);
      if (game.canvas) {
        game.canvas.getContext("2d")!.imageSmoothingQuality = "high";
      }
      // listen to in-game events before starting we sign in with wallet
      game.events.on("LOGIN_PLAYER", (event: any) => {
        console.log("⛓⛓⛓ Login via Web3 Wallet ⛓⛓⛓");
        login();
      });
    }
  }

  return <></>;
}

export default App;
