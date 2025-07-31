import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img
              src={image}
              alt="hero"
            />
          </div>
          <div className="hero-content">
            <p>
              Health and wellness are vital aspects of human life. Regular checkups, proper nutrition, and mental peace are essential for a balanced lifestyle. Doctors play a crucial role in diagnosing and treating various ailments, providing care with compassion and expertise. A healthy routine, combined with exercise and rest, ensures long-term well-being. Prevention is better than cure—get vaccinated, eat clean, and consult professionals for any persistent symptoms.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
