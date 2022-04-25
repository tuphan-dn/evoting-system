import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { WalletKitProvider } from "@gokiprotocol/walletkit";
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WalletKitProvider
        defaultNetwork="localnet"
        app={{
          name: "My App"
        }}
      >
        <App />
      </WalletKitProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
