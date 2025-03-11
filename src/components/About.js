import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function About() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Navbar />

      {/* Main content area */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "80px",
          paddingBottom: "20px",
          boxSizing: "border-box",
        }}
        className="container mx-auto px-4 md:px-8 lg:px-10"
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#1F2937",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          About Wellbands
        </h1>
        {/* Restrict text width for a clean, readable layout */}
        <div className="max-w-4xl mx-auto text-lg leading-7 text-gray-600 space-y-6">
          <p>
            Amari's grandmother passed away from cancer before anyone saw it
            coming. By the time doctors found it, there was nothing they could
            do. Looking back, he realized the signs were probably there long
            before the diagnosis. The technology just wasn't there to catch it,
            and that moment changed everything.
          </p>

          <p>
            Wellbands is creating the first proactive wearable designed to
            predict health risks before symptoms even appear. Instead of just
            tracking steps or sleep, we go deeper reading the body’s energy
            imbalances to catch issues early and guide you back to balance.
          </p>

          <p>
            For too long, health tracking has been about what's already
            happening. Heart rate. Steps. Sleep. But the body doesn't wait until
            symptoms appear to show something is off. It sends signals long
            before that.
          </p>

          <p>
            Wellbands is a new way to think about health. Proactive, not
            reactive. Prevention, not just treatment.
          </p>

          <p>
            We are building technology that listens to the signals your body has
            been sending all along, so you can stay ahead of your health instead
            of chasing it. And this is just the beginning.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
