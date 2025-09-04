import React, { useEffect, useState } from "react";
import "../styles/PageHome.css";
import Loader from "../Components/Loader";

export default function PageHome() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const lightWallpapers = [
    "/assets/wallpaper/clear.jpg",
    "/assets/wallpaper/clear2.jpg",
    "/assets/wallpaper/clear3.png",
    "/assets/wallpaper/clear4.jpg",
    "/assets/wallpaper/clear5.jpg",
    "/assets/wallpaper/clear6.jpg",
  ];

  const darkWallpapers = [
    "/assets/wallpaper/black1.jpg",
    "/assets/wallpaper/black2.jpg",
    "/assets/wallpaper/black3.jpg",
    "/assets/wallpaper/black4.jpg",
    "/assets/wallpaper/black5.jpg",
    "/assets/wallpaper/black6.jpg",
  ];

  const wallpapers = darkMode ? darkWallpapers : lightWallpapers;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);

    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains("dark"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wallpapers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [darkMode, wallpapers.length]);

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader />
      </div>
    );
  }

  return (
    <section className="dang sectionBlock" id="home">
      <div className="main1 backgroundWrapper">
        {wallpapers.map((src, index) => (
          <img
            key={index}
            className={`background ${index === currentIndex ? "visible" : ""}`}
            src={src}
            alt={`Background ${index}`}
          />
        ))}
      </div>

      <div className="main2">
        <h1 className="pageTitle1">Persol <span className="highlight">Eyewear</span></h1>
        <p className="pageLead">
          Discover timeless Italian craftsmanship with modern style.
        </p>
        <p className="pageDescription">
          Explore our exclusive collection of premium lenses and frames. Compare
          designs, find your perfect match, and experience eyewear made for
          comfort, clarity, and confidence.
        </p>
      </div>
    </section>
  );
}
