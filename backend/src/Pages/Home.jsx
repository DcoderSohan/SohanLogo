import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import About from "../Components/About/About";
import Skills from "../Components/Skills/Skills";
import Stats from "../Components/Stats/Stats";
import Gitgraph from "../Components/GitGraph/Gitgraph";
import Project from "../Components/Projects/Project";
import Contact from "../Components/Contact/Contact";
import Footer from "../Components/Footer/Footer";
import Quote from "../Components/Quote/Quote";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="-mt-8">
        <Quote />
      </div>
      <About />
      <Skills />
      <Stats commits={1345} projects={27} />;
      <Gitgraph userName="DcoderSohan" />
      <Project />
      <Contact />
    </div>
  );
};

export default Home;
