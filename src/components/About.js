import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function About() {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen pt-4">
      <Navbar />

      <div className="container mx-auto px-4 pt-[90px]">
        <section className="mb-[150px] px-2 lg:px-[12px]">
          <div className="container mx-auto">
            <h2 className="text-4xl text-center leading-10 font-extrabold text-gray-800 mb-10">
              About Wellbands
            </h2>

            <div className="">
              <p className="text-lg leading-7 text-gray-500 mb-6">
                Wellbands was born from a deeply personal story of loss, hope,
                and a vision to transform healthcare. Our founder, Amari Fields,
                lost his grandmother to blood cancer at just 11 years old. She
                was a visionary who saw the world not as it was, but as it could
                be. Before she passed, she left behind a notebook filled with
                ideas for innovations that could have changed lives. Her ability
                to imagine groundbreaking possibilities inspired Amari, but she
                never had the chance to bring those ideas to life.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                Losing her left Amari with a deep sense of helplessness. He
                never wanted anyone else to feel the pain of losing a loved one
                to a preventable illness. Years later, upon rediscovering his
                grandmother’s notebook, Amari realized he had inherited her
                visionary gift. This discovery became a turning point, leading
                to a promise he made to her, to create a device that could have
                saved her life and would one day save the lives of many others.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                From that promise, Wellbands was born.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                Wellbands is not just another piece of technology. It is a
                mission to redefine how we approach health. The device focuses
                on identifying the root causes of illness long before symptoms
                appear. While traditional health tools react to problems after
                they surface, Wellbands empowers individuals to act early by
                addressing unseen imbalances in the body’s energy fields.
              </p>

              <p className="text-lg leading-7 text-gray-500">
                This is not just about monitoring health. It is about creating a
                future where people can take control of their well-being,
                prevent illness, and live longer, healthier lives. Wellbands is
                a tribute to the dream Amari’s grandmother never got to fulfill
                and a promise to families everywhere that health and wellness
                should be accessible to all.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default About;
