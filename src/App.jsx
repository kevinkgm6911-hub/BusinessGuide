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
import StartHere from "./pages/StartHere";
import Community from "./pages/Community";

import ScrollToTop from "./components/ScrollToTop";
import TestHero from "./components/TestHero";

// ⭐ New: AI Coach test widget
import CoachTestWidget from "./components/CoachTestWidget";

function App() {
  return (
    <Router>
      <Header />
      <ScrollToTop />

      {/* Global AI coach test widget (bottom-right) */}
      <CoachTestWidget />

      <Routes>
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

        {/* Resource Detail */}
        <Route path="/resources/:slug" element={<ResourceDetail />} />

        {/* Start Here (Starter Path overview) */}
        <Route
          path="/start"
          element={
            <>
              <StartHere />
              <Footer />
            </>
          }
        />

        {/* Community */}
        <Route
          path="/community"
          element={
            <>
              <Community />
              <Footer />
            </>
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <>
              <About />
              <Footer />
            </>
          }
        />

        {/* Temporary 3D Test */}
        <Route path="/test3d" element={<TestHero />} />
      </Routes>
    </Router>
  );
}

export default App;
