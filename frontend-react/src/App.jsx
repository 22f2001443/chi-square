// src/App.jsx
import React from "react";
import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import People from "./pages/People";
import SocietyMessage from "./pages/Abouts";
import CourseMaterial from "./pages/Course";
import CardsPage from "./pages/Upcomings" ;
import Blogs from "./pages/Blogs" ;
import MaintenancePage from "./pages/Maintenece";
import { Link } from "react-router-dom";


function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route exact path="/events" element={<Events />} />
    <Route path="/people" element={<People />} />
    <Route path="/abouts" element={<SocietyMessage/>} />
    <Route path="/resources/course-materials" element={<CourseMaterial/>} />
    <Route path="/events/upcomings" element={<CardsPage/>} />
    <Route path="/blogs" element={<Blogs/>} />
    <Route path="/resources/books" element={<MaintenancePage/>} />
    <Route path="/resources/research-papers" element={<MaintenancePage/>} />

    </Routes>
    
  );
}

export default App;