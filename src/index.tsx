import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import CheckCharacter from "./components/CheckCharacter";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;

  //Validate
  if (!APP_ID || !SERVER_URL)
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file."
    );
  if (isServerInfo)
    return (
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <ChakraProvider>
          <Router>
            <Switch>
              <Route path="/choose-character">
                <CheckCharacter />
              </Route>
              <Route path="/">
                <div id="game-container">
                  <App />
                </div>
              </Route>
            </Switch>
          </Router>
        </ChakraProvider>
      </MoralisProvider>
    );
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>NOT CONNECTED</div>
      </div>
    );
  }
};

ReactDOM.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
