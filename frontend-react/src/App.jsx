import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import People from "./pages/People";
import About from "./pages/Abouts";
import CourseMaterial from "./pages/Course";
import Upcomings from "./pages/Upcomings";
import Blogs from "./pages/Blogs";
import MaintenancePage from "./pages/Maintenece";
import NotFound from "./pages/NotFound";
import { pageOn } from "./config/featureFlags";

// Shows the maintenance notice in place of any page switched off in
// src/config/features.yml.
function FeatureGate() {
  const { pathname } = useLocation();
  return pageOn(pathname) ? <Outlet /> : <MaintenancePage />;
}

function App() {
  return (
    <Routes>
      <Route element={<FeatureGate />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/upcomings" element={<Upcomings />} />
        <Route path="/people" element={<People />} />
        <Route path="/abouts" element={<About />} />
        <Route path="/resources/course-materials" element={<CourseMaterial />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/resources/books" element={<MaintenancePage />} />
        <Route path="/resources/research-papers" element={<MaintenancePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
