import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function About() {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen pt-4">
      <Navbar />

      <div className="container mx-auto px-4 pt-[90px]">
        <section className="mb-[150px] px-2 lg:px-[90px]">
          <div className="container mx-auto">
            <h2 className="text-4xl text-center leading-10 font-extrabold text-gray-800 mb-10">
              About Wellbands
            </h2>

            <div className="">
              <p className="text-lg leading-7 text-gray-500 mb-6">
                Wellbands started with a young boy's wish to make a difference.
                When our founder, Amari, was 11, he lost his grandmother to
                cancer. She was a person full of ideas that the world never got
                to see. That loss made Amari think hard about health and how
                catching sickness early can make all the difference. That's why
                we created Wellbands.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                We make smartwatches that do more than just tell time. They keep
                an eye on your health every second of the day. Our watches are
                like having a doctor on your wrist that understands you more
                every day. They watch over your heartbeat, check how you sleep,
                and notice the little changes that can be signs of bigger health
                issues. This way, you can know about health problems before they
                get serious.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                With a Wellbands watch, you are part of a big family that looks
                after each other. Every person who wears our watch makes it
                better for everyone else. We're proud that our watches are
                smart, that they give you health information you can trust, and
                that they help everyone learn more about staying healthy.
              </p>

              <p className="text-lg leading-7 text-gray-500">
                We're building a future where everyone can know more about their
                health and do something about it early. It's a big dream, and we
                want you to be a part of it. We believe in better health for
                everyone, and we're working every day to make that happen.
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
