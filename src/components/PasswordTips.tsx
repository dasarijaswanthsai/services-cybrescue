
import React, { useEffect, useRef } from "react";

interface TipCardProps {
  title: string;
  description: string;
  index: number;
}

const TipCard: React.FC<TipCardProps> = ({ title, description, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass gradient-border rounded-xl p-6 opacity-0 translate-y-10 transition-all duration-700 delay-${
        index * 100
      }`}
    >
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};

const PasswordTips: React.FC = () => {
  const tips = [
    {
      title: "Use a Passphrase",
      description:
        "Instead of a single word, use a phrase with spaces or special characters. These are easier to remember but harder to crack.",
    },
    {
      title: "Avoid Personal Information",
      description:
        "Never use your name, birthday, or other personal details that someone could easily find or guess.",
    },
    {
      title: "Don't Reuse Passwords",
      description:
        "Using the same password across multiple sites puts all your accounts at risk if one gets compromised.",
    },
    {
      title: "Use a Password Manager",
      description:
        "A password manager can generate and store strong, unique passwords for each of your accounts.",
    },
    {
      title: "Enable Two-Factor Authentication",
      description:
        "Add an extra layer of security by requiring a second form of verification beyond just your password.",
    },
    {
      title: "Update Regularly",
      description:
        "Change your passwords every few months, especially for sensitive accounts like banking and email.",
    },
  ];

  return (
    <section id="tips" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          <span className="text-gradient">Password Security Tips</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <TipCard
              key={index}
              title={tip.title}
              description={tip.description}
              index={index}
            />
          ))}
        </div>

        <div className="mt-16 glass gradient-border rounded-xl p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Common Password Mistakes</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="font-medium text-red-400 mb-2">Using sequential numbers</p>
              <p className="text-sm text-gray-300">Like "password123" or "abc123"</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="font-medium text-red-400 mb-2">Dictionary words</p>
              <p className="text-sm text-gray-300">Simple words are easily cracked</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="font-medium text-red-400 mb-2">Using keyboard patterns</p>
              <p className="text-sm text-gray-300">Like "qwerty" or "asdfgh"</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="font-medium text-red-400 mb-2">Substituting letters</p>
              <p className="text-sm text-gray-300">Just replacing 'a' with '@' isn't enough</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="font-medium text-red-400 mb-2">Short passwords</p>
              <p className="text-sm text-gray-300">Fewer than 8 characters is risky</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="font-medium text-red-400 mb-2">Writing them down</p>
              <p className="text-sm text-gray-300">Especially on sticky notes near your computer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordTips;
