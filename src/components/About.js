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

            <div className="max-w-4xl mx-auto">
              <p className="text-lg leading-7 text-gray-600 mb-6">
                Wellbands started with a promise to change the way we think
                about health. It wasn’t just an idea. It came from loss, hope,
                and the belief that healthcare should be different.
              </p>

              <p className="text-lg leading-7 text-gray-600 mb-6">
                When our founder, Amari Fields was 11 years old, he lost his
                grandmother to blood cancer. She was more than family. She was a
                dreamer, always writing ideas in her notebook about how the
                world could be better. But she never got the chance to bring
                them to life. By the time doctors found her illness, it was too
                late.
              </p>

              <p className="text-lg leading-7 text-gray-600 mb-6">
                That loss changed everything. Years later, Amari found her
                notebook again. It reminded him of her vision, her belief in new
                possibilities. It made him ask, what if we could see illness
                coming before it was too late? What if there was a way to help
                people take control of their health earlier? He made a promise
                to her, to himself, and to every family that has faced the same
                pain.
              </p>

              <p className="text-lg leading-7 text-gray-600 mb-6">
                That promise became Wellbands.
              </p>

              <p className="text-lg leading-7 text-gray-600 mb-6">
                Wellbands is not just another wearable. It doesn’t rely on
                reactive sensors and outdated metrics. It looks deeper, using
                quantum sensors and AI to detect early signs of health
                imbalances before symptoms appear. This gives people the chance
                to act sooner and take control of their well-being before
                problems get worse.
              </p>

              <p className="text-lg leading-7 text-gray-600 mb-6">
                For too long, healthcare has been reactive. We wait for
                problems, then try to fix them. But what if we could help people
                see those problems coming? What if small changes today could
                prevent suffering tomorrow? That is what we are building.
              </p>

              <p className="text-lg leading-7 text-gray-600 mb-6">
                Wellbands is more than technology. It is a commitment to a
                future where people can take control of their health, prevent
                illness, and live longer, healthier lives. It is for the
                families, the dreamers, and the people who believe that health
                should not be left to chance.
              </p>

              <p className="text-lg leading-7 text-gray-600">
                The future of health is not about waiting. It is about acting
                early. That is what Wellbands is here to do.
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
