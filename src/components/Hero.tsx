
import React from "react";
import { ArrowDown } from "lucide-react";

const Hero: React.FC = () => {
  const handleScrollDown = () => {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] w-full flex flex-col justify-center items-center relative px-4 py-16">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 animate-fade-in">
        <span className="block">Protect Your</span>
        <span className="text-gradient">Digital Identity</span>
      </h1>
      
      <p className="text-lg md:text-xl text-center text-gray-300 max-w-3xl mb-10 animate-fade-in delay-100">
        Create strong, unbreakable passwords and check your current ones for vulnerabilities.
        Take control of your online security with our powerful password tools.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
        <a 
          href="#generator"
          className="px-6 py-3 font-medium rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all animate-fade-in delay-200"
        >
          Generate Password
        </a>
        <a 
          href="#checker"
          className="px-6 py-3 font-medium rounded-lg bg-transparent border border-gray-600 text-gray-200 hover:bg-gray-800 transition-all animate-fade-in delay-300"
        >
          Check Strength
        </a>
      </div>

      <button 
        onClick={handleScrollDown}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
    </section>
  );
};

export default Hero;
