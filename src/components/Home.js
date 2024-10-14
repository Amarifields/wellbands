import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function Home() {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen pt-4">
      <Navbar />

      <div className="container mx-auto px-4 pt-[90px]">
        <section className="mb-[150px] px-2 lg:px-[12px]">
          <div className="container mx-auto">
            {/* Title */}
            <h1 className="text-4xl text-center leading-10 font-extrabold text-gray-800 mb-10">
              Welcome to Wellbands
            </h1>

            {/* Content */}
            <div className="">
              <p className="text-lg leading-7 text-gray-500 mb-6">
                At Wellbands, we believe that true health is about more than
                reacting to illness, it’s about preventing it. Our mission is to
                give people the power to listen to their bodies long before
                symptoms arise, to catch the early signals that something may be
                out of balance. In a world where we often wait for problems to
                appear, Wellbands is here to shift the conversation toward
                proactive care.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                We’re developing a revolutionary device that does more than just
                monitor your heart rate or your sleep cycles. Wellbands taps
                into something deeper, the body’s natural energy fields. Every
                organ, every cell, every system within you has a unique
                vibrational frequency. These frequencies can tell us far more
                than any biological marker, and by tracking them in real-time,
                Wellbands helps you prevent imbalances from turning into serious
                health problems.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                The inspiration behind Wellbands comes from a personal story of
                loss. Our founder, Amari Fields, lost his grandmother to cancer
                at a young age, a loss that sparked a lifelong mission. Her
                passing raised one essential question: what if we could have
                known earlier? What if the warning signs had been visible before
                it was too late? Wellbands was born from the belief that no one
                should lose a loved one to preventable illness, and that belief
                fuels our drive to innovate, to create, and to change the future
                of health for millions of people around the world.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                Our vision is simple: to make health care proactive. We believe
                that every person should have access to the tools and technology
                to monitor their well-being, to make small changes today that
                will prevent big problems tomorrow. By using biofrequency
                technology to detect energy imbalances, Wellbands empowers
                individuals to take control of their health, to act before it’s
                too late, and to live longer, healthier, more vibrant lives.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                Wellbands combines ancient wisdom with modern technology.
                Cultures across the world have long believed in the power of
                energy fields, and now, we are using biofrequency monitoring to
                bring that wisdom into the future of health care. Our device
                learns from your body every day, offering personalized health
                insights that grow smarter with every use. It’s not just
                wearable technology, it’s the future of wellness.
              </p>

              <p className="text-lg leading-7 text-gray-500 mb-6">
                We invite you to join us on this journey, to be part of a
                movement that’s changing the way we view health. Wellbands isn’t
                just a product, it’s a revolution in the way we take care of
                ourselves and those we love. Together, we can create a world
                where preventable diseases are no longer the reason we lose the
                people we care about.
              </p>

              <p className="text-lg leading-7 text-gray-500">
                This is the future of health. This is Wellbands.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
