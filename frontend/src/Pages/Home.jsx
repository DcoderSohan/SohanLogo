import React, { useEffect, useState } from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import About from "../Components/About/About";
import Skills from "../Components/Skills/Skills";
import Stats from "../Components/Stats/Stats";
import Gitgraph from "../Components/GitGraph/Gitgraph";
import Project from "../Components/Projects/Project";
import Contact from "../Components/Contact/Contact";
import Footer from "../Components/Footer/Footer";
import Quote from "../Components/Quote/Quote";
import { homeAPI, projectsAPI } from "../utils/api";

// Helper function to check if URL is a blob URL
const isBlobUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('blob:');
};

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await homeAPI.getHome();
        const data = response?.data || response;
        console.log("Home data loaded:", data); // Debug log
        setHomeData(data);
      } catch (error) {
        console.error("Failed to load home content:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getProjects();
        if (response.success && response.data) {
          // Get first 4 projects and clean blob URLs, sort featured first
          const allProjects = (response.data.projects || []).map(project => {
            if (project.image && isBlobUrl(project.image)) {
              return { ...project, image: '' };
            }
            return project;
          }).filter(project => project && project.title)
          .sort((a, b) => {
            // Sort featured project first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          });
          
          // Get first 4 projects
          setProjects(allProjects.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };

    fetchHome();
    fetchProjects();
    
    // Refresh data every 30 seconds to catch updates
    const interval = setInterval(() => {
      fetchHome();
      fetchProjects();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = homeData?.stats || [];
  const gitUserName = homeData?.gitgraph?.userName ?? "DcoderSohan";
  const heroData = homeData?.hero;
  const quotes = homeData?.quotes || [];
  const skillsData = homeData?.skills;

  return (
    <div>
      <HeroSection heroData={heroData} />
      <div className="-mt-8">
        <Quote quotes={quotes} />
      </div>
      <About />
      <Skills skillsData={skillsData} />
      <Stats stats={stats} />
      <Gitgraph userName={gitUserName} />
      <Project projects={projects} />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
