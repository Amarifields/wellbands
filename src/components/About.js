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
                Wellbands was born from a deeply personal story of loss, love,
                and a vision to change the way we approach health. When our
                founder, Amari, was just 11 years old, he lost his grandmother
                to cancer. A visionary herself, she left behind dreams and ideas
                she never had the chance to bring into the world. That loss lit
                a fire in Amari, a promise to both her and himself to create a
                future where illness doesn’t take away the ones we love before
                their time.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                Wellbands is more than just technology; it’s the embodiment of
                that promise. We’re creating a revolutionary smartwatch that
                goes beyond tracking typical health metrics like heart rate or
                sleep patterns. We delve deeper, monitoring the body’s energy
                fields to detect imbalances before they manifest into physical
                symptoms or chronic diseases. This isn't just about being
                reactive to illness, it’s about empowering people to stay ahead
                of it.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                Every Wellbands user becomes part of a movement. Our technology
                is rooted in both ancient wisdom and modern science, combining
                the knowledge of energy fields and frequencies with modern
                technology. It learns from you every day, offering personalized
                health insights that grow smarter with each use. In a world
                where we often wait until it’s too late, Wellbands is shifting
                the conversation from reactive care to proactive, life-saving
                health management.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                At Wellbands, we believe that no one should lose a loved one to
                preventable illness. We are building a future where health
                monitoring is not a luxury but a right, accessible to everyone.
                This is not just a company, it’s a mission to save lives,
                transform healthcare, and create a world where people can live
                longer, healthier, and more vibrant lives. And we invite you to
                join us in making that future a reality.
              </p>

              <p className="text-lg leading-7 text-gray-500">
                We are dedicated, relentless, and driven by a belief that the
                health revolution starts here, with Wellbands. Together, we can
                prevent suffering before it begins, and together, we will create
                a healthier tomorrow for everyone.
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
