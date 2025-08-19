import React, { useEffect, useState } from "react";
import "../styles/PageHome.css";

export default function PageHome() {
  const [backgroundImg, setBackgroundImg] = useState("/assets/wallpaper/lightmode.jpg");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setFade(true); // start fading out
      setTimeout(() => {
        if (document.body.classList.contains("dark")) {
          setBackgroundImg("/assets/wallpaper/back3.jpg");
        } else {
          setBackgroundImg("/assets/wallpaper/back1.jpg");
        }
        setFade(false); // fade back in
      }, 300); // half of transition time
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <div className="main1">
        <img
          className={`background ${fade ? "hidden" : ""}`}
          src={backgroundImg}
          alt="A person wearing glasses"
        />
      </div>

      <div className="main2">
        <h1 className="pageTitle1">Persol Eyewear</h1>
        <p className="pageLead">Discover timeless Italian craftsmanship with modern style.</p>
        <p className="pageDescription">
          Explore our exclusive collection of premium lenses and frames. Compare designs, find your
          perfect match, and experience eyewear made for comfort, clarity, and confidence.
        </p>
      </div>
    </section>
  );
}
