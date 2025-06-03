// src/App.jsx
import React from "react";
import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import People from "./pages/People";
import { Link } from "react-router-dom";


function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route exact path="/events" element={<Events />} />
    <Route path="/people" element={<People />} />
    </Routes>
    
  );
}

export default App;