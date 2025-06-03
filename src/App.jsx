// src/App.jsx
import React from "react";
import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import People from "./pages/People";

function App() {
  return (
    <Routes>
    <Route path="/chi-square" element={<Home />} />
    <Route path="/chi-square/events" element={<Events />} />
    <Route path="/chi-square/people" element={<People />} />
    </Routes>
    
  );
}

export default App;