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
import UserSettings from "./pages/UserSettings";
import RemoveSettings from "./pages/RemoveSettings";
import PasswordSettings from "./pages/PasswordSettings";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext.js"; 
import "./index.css";
import Favorites from "./pages/Favorites"

const router = createBrowserRouter([
  {
    errorElement: <NotFound />
  },
  {
    path: "/",
    element: <>
      <Navbar />
      <App />
      <Footer />
    </>
  },
  {
    path: "/haku",
    element: <>
      <Navbar />
      <Haku />
      <Footer />
    </>
  },
  {
    path: "/haku/:query?",
    element: <>
      <Navbar />
      <Haku />
      <Footer />
    </>
  },
  {
    path: "/movies",
    element: <>
      <Navbar />
      <MoviePage />
      <Footer />
    </>
  },
  {
    path: "/movies/:id",
    element: <>
      <Navbar />
      <MoviePage />
      <Footer />
    </>
  },
  {
    path: "/ryhma",
    element: <>
      <Navbar />
      <RyhmaSivu />
      <Footer />
    </>
  },
  {
    path: "/ryhma/:id?",
    element: <>
      <Navbar />
      <RyhmaSivu />
      <Footer />
    </>
  },
  {
    path: "/arvostelu",
    element: <>
      <Navbar />
      <ArvosteluSivu />
      <Footer />
    </>
  },
  {
    path: "/arvostelu/:movieID?",
    element: <>
      <Navbar />
      <ArvosteluSivu />
      <Footer />
    </>
  },
  {
    path: "/about",
    element: <>
      <Navbar />
      <Tietoa />
      <Footer />
    </>
  },
{
  path: "/settings",
  element: (
    <>
      <Navbar />
      <UserSettings />
      <Footer />
    </>
  ),
},
{
  path: "/settings/remove",
  element:  
    <>
      <Navbar />
      <RemoveSettings />
      <Footer />
    </>
},
{
  path: "/settings/password",
  element: 
   <>
      <Navbar />
      <PasswordSettings />
      <Footer />
    </>
},
{
  path: "/favorites",
  element: <Favorites />
}
 
])    


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);