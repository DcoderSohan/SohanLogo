import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Code, Award, MapPin, Calendar } from "lucide-react";
import { aboutAPI } from "../utils/api";

const Aboutsection = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutAPI.getAbout();
        if (response.success && response.data) {
          setAboutData(response.data);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAboutData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !aboutData) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const { intro, educations = [], experiences = [], skills = {} } = aboutData;

  // Convert skills items to categories format for display
  // Group skills by category
  const skillsCategories = skills?.items ? (() => {
    const categories = {};
    skills.items.forEach((skill) => {
      const category = skill.category || "Other";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(skill.name);
    });
    return categories;
  })() : {};

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Hero Section with Profile Picture */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 md:py-40">
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
            {/* Profile Picture with Rounded Rectangle and Floating Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Square Profile Picture Container (4:4 aspect ratio) */}
              <div 
                className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] border-2 border-white/30 rounded-3xl overflow-hidden z-0"
              >
                <img 
                  src={intro?.profileImage || "./Me2.jpg"} 
                  alt={intro?.name || "Sohan Sarang"} 
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />

                {/* Floating Tag with Scrolling Text - On top of image, right bottom corner */}
                <div className="absolute bottom-3 right-3 w-[196px] h-12 md:w-[280px] md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden z-10">
                  {/* Fade effect on left (starting) */}
                  <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent z-20 pointer-events-none"></div>
                  
                  {/* Fade effect on right (ending) */}
                  <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[#080808] via-[#080808]/80 to-transparent z-20 pointer-events-none"></div>
                  
                  {/* Scrolling Text Container */}
                  <div className="flex items-center h-full overflow-hidden relative">
                    <div className="flex items-center gap-4 md:gap-6 animate-scroll-infinite whitespace-nowrap">
                      {intro?.scrollingSkills && intro.scrollingSkills.length > 0 ? (
                        <>
                          {[...intro.scrollingSkills, ...intro.scrollingSkills, ...intro.scrollingSkills, ...intro.scrollingSkills].map((skill, idx) => (
                            <React.Fragment key={idx}>
                              <span className="text-white/90 text-xs md:text-sm font-medium">{skill}</span>
                              {idx < [...intro.scrollingSkills, ...intro.scrollingSkills, ...intro.scrollingSkills, ...intro.scrollingSkills].length - 1 && (
                                <span className="text-white/60">•</span>
                              )}
                            </React.Fragment>
                          ))}
                        </>
                      ) : (
                        <>
                          <span className="text-white/90 text-xs md:text-sm font-medium">Analyze</span>
                          <span className="text-white/60">•</span>
                          <span className="text-white/90 text-xs md:text-sm font-medium">Design</span>
                          <span className="text-white/60">•</span>
                          <span className="text-white/90 text-xs md:text-sm font-medium">Develop</span>
                          <span className="text-white/60">•</span>
                          <span className="text-white/90 text-xs md:text-sm font-medium">Testing</span>
                          <span className="text-white/60">•</span>
                          <span className="text-white/90 text-xs md:text-sm font-medium">Deployment</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Introduction Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 text-center max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                {intro?.name || "Sohan Sarang"}
              </h1>
              <h2 className="text-2xl md:text-3xl text-blue-400 mb-6 font-semibold">
                {intro?.title || "Full-Stack Web Developer"}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                {intro?.description || "I'm a passionate full-stack web developer with a strong foundation in modern web technologies."}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {intro?.tags?.map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap size={32} className="text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Education</h2>
          </div>
          
          <div className="space-y-6">
            {educations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No education information available.</p>
            ) : (
              educations.map((edu, index) => (
                <motion.div
                  key={edu._id || index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{edu.degree}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{edu.university}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{edu.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 mt-2 md:mt-0">
                      <Calendar size={16} />
                      <span className="font-semibold">{edu.year}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{edu.description}</p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Briefcase size={32} className="text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
          </div>
          
          <div className="space-y-6">
            {experiences.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No experience information available.</p>
            ) : (
              experiences.map((exp, index) => (
                <motion.div
                  key={exp._id || index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-2">
                        <span className="font-semibold text-white">{exp.company}</span>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 mt-2 md:mt-0">
                      <Calendar size={16} />
                      <span className="font-semibold">{exp.period}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Award size={18} className="text-blue-400" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Code size={32} className="text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Skills</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(skillsCategories).length === 0 ? (
              <p className="text-gray-400 text-center py-8 col-span-2">No skills information available.</p>
            ) : (
              Object.entries(skillsCategories).map(([category, skillList], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 text-blue-400">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-sm font-medium bg-white/10 text-white border border-white/20 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      <style>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes float-simple {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-scroll-infinite {
          animation: scroll-infinite 18s linear infinite;
          display: inline-flex;
          flex-shrink: 0;
          will-change: transform;
        }
        
        .animate-float-simple {
          animation: float-simple 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Aboutsection;
