import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import dashawn from "../assets/dashawn-logo.png";

function Home() {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen pt-4">
      <Navbar />

      <main className="container mx-auto px-4 pt-[90px]">
        <section className="mb-[100px] px-2 lg:px-[12px]">
          <h1 className="text-4xl text-center leading-10 font-extrabold text-gray-800 mb-10">
            Welcome to Wellbands
          </h1>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-7 text-gray-500 mb-6">
              Wellbands is the next evolution in health wearables, introducing a
              proactive approach to health management that addresses what
              traditional devices cannot. While most wearables track metrics
              like heart rate and steps after something has already happened,
              Wellbands focuses on detecting energetic imbalances in the body,
              long before symptoms or disease develop. This innovative approach
              offers individuals the opportunity to address issues at their
              root, helping to prevent chronic illness and support lifelong
              wellness.
            </p>

            <p className="text-lg leading-7 text-gray-500 mb-6">
              There is a silent progression to illness that often goes
              unnoticed. It begins with subtle energetic imbalances that
              accumulate over time. These imbalances eventually manifest as
              symptoms and, without intervention, can develop into chronic
              diseases or worse. Traditional wearables operate reactively,
              tracking health metrics only after a problem arises. Wellbands is
              different. By monitoring the body’s biofield through advanced
              quantum sensing, Wellbands identifies disruptions and provides
              actionable insights to rebalance the body before these imbalances
              lead to physical symptoms or illness.
            </p>

            <p className="text-lg leading-7 text-gray-500 mb-6">
              The benefits of Wellbands are significant. First, it aims to
              eliminate the development of chronic disease by addressing
              imbalances early. Second, it can expand life expectancy by
              offering a more comprehensive and proactive approach to health
              management. Finally, it helps individuals achieve balance in a
              fast-paced, stress-filled world, supporting both mental and
              physical well-being.
            </p>

            <p className="text-lg leading-7 text-gray-500 mb-6">
              This revolutionary technology merges ancient wisdom about the
              body’s energy fields with cutting-edge quantum sensing. By
              providing real-time feedback and actionable insights, Wellbands
              empowers users to take control of their health like never before.
              The future of health is no longer about reacting to problems, it
              is about preventing them. Wellbands is proud to lead this change,
              creating a path to better health and a longer, more balanced life
              for everyone.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
          <h2 className="text-3xl font-bold text-center mb-16">
            Expert Endorsements
          </h2>

          <div className="max-w-3xl mx-auto">
            <blockquote className="p-8 bg-white rounded-2xl shadow-lg">
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
                  className="w-5 h-5 rounded-full !w-[20px] !h-[20px]"
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
