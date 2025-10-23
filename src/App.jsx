// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Funnel from "./components/Funnel";
import ResourceHighlight from "./components/ResourceHighlight";
import CommunityBlock from "./components/CommunityBlock";
import Footer from "./components/Footer";
import About from "./pages/About";
import ResourceHub from "./pages/ResourceHub";
import ResourceDetail from "./pages/ResourceDetail";
import TestHero from "./components/TestHero";

// ⬇️ NEW: import Community page
import Community from "./pages/Community";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Existing detailed resource route */}
        <Route path="/resources/:slug" element={<ResourceDetail />} />

        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Funnel />
              <ResourceHighlight />
              <CommunityBlock />
              <Footer />
            </>
          }
        />

        {/* About Page */}
        <Route
          path="/about"
          element={
            <>
              <About />
              <Footer />
            </>
          }
        />

        {/* Resource Hub */}
        <Route
          path="/resources"
          element={
            <>
              <ResourceHub />
              <Footer />
            </>
          }
        />

        {/* ✅ NEW: Community Page */}
        <Route
          path="/community"
          element={
            <>
              <Community />
              <Footer />
            </>
          }
        />

        {/* 🎨 TEMPORARY 3D TEST ROUTE */}
        <Route path="/test3d" element={<TestHero />} />
      </Routes>
    </Router>
  );
}

export default App;
