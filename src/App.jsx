// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Funnel from "./components/Funnel";
import ResourceHighlight from "./components/ResourceHighlight";
import CommunityBlock from "./components/CommunityBlock";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import About from "./pages/About";
import ResourceHub from "./pages/ResourceHub";
import ResourceDetail from "./pages/ResourceDetail";
import StartHere from "./pages/StartHere";
import Community from "./pages/Community";
import Profile from "./pages/Profile";

import TestHero from "./components/TestHero";
import CoachWidget from "./components/CoachWidget";
import StarterHeaderBar from "./components/StarterHeaderBar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <ScrollToTop />
        <Header />

        {/* 
          Push content below the fixed header.
          Adjust these values if you tweak the header height later.
        */}
        <div className="pt-16 md:pt-20">
          {/* Starter path header bar sits under the main header */}
          <StarterHeaderBar />

          <main className="pb-10">
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

              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <>
                    <Profile />
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
          </main>
        </div>

        {/* Global coach widget (can become a mobile bottom sheet later) */}
        <CoachWidget />
      </div>
    </Router>
  );
}

export default App;
