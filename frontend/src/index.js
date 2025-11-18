import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, RouterProvider ,createBrowserRouter } from "react-router-dom";
import App from "./App";
import Haku from "./Haku"
//import MovieCard from "./components/MovieCard";
import NotFound from "./pages/NotFound";
import RyhmaSivu from "./pages/RyhmaSivu";
import ArvosteluSivu from "./pages/ArvosteluSivu";
import MoviePage from "./pages/MoviePage";
import Tietoa from "./pages/Tietoa";


const router = createBrowserRouter([
  {
    errorElement: <NotFound />
  },
  {
    path: "/",
    element: <App />
  },
  {
    path: "/haku",
    element: <Haku />
  },
  {
    path: "/haku/:query?",
    element: <Haku />
  },
  {
    path: "/movies",
    element: <MoviePage />
  },
  {
    path: "/ryhma",
    element: <RyhmaSivu />
  },
  {
    path: "/arvostelu",
    element: <ArvosteluSivu />
  },
  {
    path: "/about",
    element: <Tietoa />
  }
])    

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
