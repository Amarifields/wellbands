import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import dashawn from "../assets/dashawn-logo.png";
import { FaAtom, FaChartLine, FaRocket } from "react-icons/fa";

function Home() {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-[90px]">
        <section className="mb-[100px] px-2 lg:px-[12px]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 space-y-6 gap-6 lg:gap-8 mb-24 px-4 sm:px-6 lg:px-8">
              {/* First Box - Exactly like the others */}
              <div className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative group md:col-span-3">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
                  The First Quantum AI Wearable
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-gray-500">
                  Wellbands is the first wearable that uses quantum sensors and
                  AI to monitor your health in ways no other device can. While
                  smartwatches track heart rate and steps, Wellbands looks
                  deeper. It detects the earliest signs of imbalances in the
                  body before symptoms appear. This means you can take action
                  sooner, stay healthier, and live longer.
                </p>
              </div>

              {/* What is Quantum Sensing */}
              <div className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
                <FaAtom className="text-4xl text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
                  What is Quantum Sensing?
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-gray-500">
                  Quantum sensors are the most advanced measurement tools in
                  existence. They can detect changes in the body at a
                  microscopic level, things traditional wearables and medical
                  tests can't see. We combine quantum sensing with AI offering
                  real time insights into your health, helping you prevent
                  issues before they happen.
                </p>
              </div>

              {/* Why This Matters */}
              <div className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
                <FaChartLine className="text-4xl text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
                  Why This Matters
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-gray-500">
                  Most health problems don't happen overnight. They develop
                  slowly, often without symptoms, until they become serious.
                  Wellbands helps you catch these early signals so you can make
                  small changes that have a big impact over time. It's not just
                  about tracking, it's about staying ahead of your health.
                </p>
              </div>

              {/* The Future of Health */}
              <div className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
                <FaRocket className="text-4xl text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
                  A New Era of Health
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-gray-500">
                  We are creating a new category of health technology, one that
                  puts prevention first. Wellbands is designed for anyone who
                  wants to optimize their health, prevent disease, and take
                  control of their future. This is more than a wearable. This is
                  the next step in human health.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
          <h2 className="text-3xl font-bold text-center mb-16">
            Expert Endorsements
          </h2>

          <div className="max-w-3xl mx-auto">
            <blockquote className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
              <p className="text-lg italic text-gray-600 mb-4">
                "Holistic, preventative, integrative medicine is the future of
                fostering healthy communities and populations. Wellbands will
                lead the way with the ability to identify imbalances in the body
                before health issues arise"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={dashawn}
                  alt="Dr. DaShawn Robinson"
                  className="w-16 h-16 rounded-full"
                  style={{ width: "70px", height: "70px" }}
                />
                <div>
                  <cite className="font-bold">Dr. DaShawn Robinson</cite>
                  <p className="text-sm text-gray-500">
                    Doctor of Health Sciences, University of New Haven
                  </p>
                </div>
              </div>
            </blockquote>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
