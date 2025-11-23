import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Haku from "./Haku"
import MovieCard from "./components/MovieCard";
import Footer from "./components/Footer";
import Navbar from "./components/NavBar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    <Footer />
    </BrowserRouter>
  </React.StrictMode>
  
);
