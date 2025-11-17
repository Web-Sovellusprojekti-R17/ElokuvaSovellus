import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Haku from "./Haku"
import MovieCard from "./components/MovieCard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MovieCard />
    {/*<Haku /> */}
  </React.StrictMode>
);
