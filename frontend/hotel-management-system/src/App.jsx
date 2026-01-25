import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import BookingScreen from "./screens/Bookingscreen";
import HomeScreen from "./screens/Homescreen";
import RegisterScreen from "./screens/Registerscreen";
import LoginScreen from "./screens/Loginscreen";
import Profilescreen from "./screens/Profilescreen";
import Adminscreen from "./screens/Adminscreen";
import Landingscreen from "./screens/Landingscreen";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landingscreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route
          path="/book/:roomid/:fromdate/:todate"
          element={<BookingScreen />}
        />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/profile" element={<Profilescreen />} />
        <Route path="/admin" element={<Adminscreen />} />
      </Routes>
    </>
  );
}

export default App;
