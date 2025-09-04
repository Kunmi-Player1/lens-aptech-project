  import { useEffect, useRef, useState } from "react";
  import PageHome from "../pages/PageHome.jsx";
  import PageCatalog from "../pages/PageCatalog.jsx";
  import PageCompare from "../pages/PageCompare.jsx";
  import PageContact from "../pages/PageContact.jsx";
  import Cart from "../cart/cart.js";
  import CartPanel from "../Components/CartPanel.jsx";
  import "../styles/AppShell.css"
  import Loader from "../Components/Loader.jsx";
  import PageQuestiona from "../pages/PageQuestiona.jsx";

  function Header({ onOpenCart, activeId, qty, navOpen, onToggleNav, onNavClick }) {

    const [darkMode, setDarkMode] = useState(false);
      const [backgroundImg, setBackgroundImg] = useState("/assets/wallpaper/lightmode.jpg");
        const [loading, setLoading] = useState(true);

    useEffect(() => {
      const savedMode = localStorage.getItem("darkMode");
      if (savedMode === "true") {
        setDarkMode(true);
        document.body.classList.add("dark");
      }
    }, []);

    useEffect(() => {
      localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleDarkToggle = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      document.body.classList.toggle("dark", newMode);
    };

    return (
      <header className="siteHeader">


        <div className="siteHeaderInner">
          <a className="brand" href="#home" onClick={() => onNavClick("home")}>
            <img className="brandLogo" src="/assets/icons/lens-shop-logo.svg" alt="" />
            <span className="brandText">Persol</span>
          </a>

          <button
            className="navToggleButton"
            aria-expanded={navOpen ? "true" : "false"}
            aria-haspopup="menu"
            aria-controls="site-nav"
            onClick={onToggleNav}
          >
            <span className="navToggleIcon" aria-hidden="true"></span>
            <span className="visuallyHidden">{navOpen ? "Close menu" : "Open menu"}</span>
          </button>

          <nav id="site-nav" className="navArea" data-open={navOpen ? "true" : "false"}>
            <ul className="navList">
              <li><a className={activeId === "home" ? "navLink navLinkActive" : "navLink"} href="#home" onClick={() => onNavClick("home")}>Home</a></li>
              <li><a className={activeId === "catalog" ? "navLink navLinkActive" : "navLink"} href="#catalog" onClick={() => onNavClick("catalog")}>Catalog</a></li>
              <li><a className={activeId === "compare" ? "navLink navLinkActive" : "navLink"} href="#compare" onClick={() => onNavClick("compare")}>Compare</a></li>
              <li><a className={activeId === "contact" ? "navLink navLinkActive" : "navLink"} href="#contact" onClick={() => onNavClick("contact")}>Contact</a></li>
            </ul>
          </nav>

        <div className="cartHeader">
            <button className="cartHeaderButton" onClick={onOpenCart} aria-label="Open cart">
              <span className="cartHeaderIcon">🛒</span>
              <span className="cartHeaderBadge" aria-live="polite">{qty}</span>
            </button>

        {/* Dark Mode Toggle */}
  <button 
    className="darkModeButton" 
    onClick={handleDarkToggle} 
    aria-label="Toggle dark mode"
  >
    {darkMode ?  <span className="lightdark" style={{ color: "white" }}>⏾</span> : "☀︎"}
  </button>

      </div>

        </div>
      </header>
    );
  }

  export default function AppShell() {
    const [activeId, setActiveId] = useState("home");
    const [openCart, setOpenCart] = useState(false);
    const [qty, setQty] = useState(Cart.totals().qty);
    const [navOpen, setNavOpen] = useState(false);
    const sectionsRef = useRef({});

    useEffect(() => {
      const onChange = () => setQty(Cart.totals().qty);
      window.addEventListener("cart:change", onChange);
      return () => window.removeEventListener("cart:change", onChange);
    }, []);

    // Lock background scroll when cart or nav is open
    useEffect(() => {
      document.body.style.overflow = openCart || navOpen ? "hidden" : "auto";
    }, [openCart, navOpen]);

    // Observe sections + set initial anchor offset for sticky header
    useEffect(() => {
      const sections = ["home", "catalog", "compare", "contact"].map(id => document.getElementById(id));
      const map = {};
      sections.forEach(s => { if (s) map[s.id] = s; });
      sectionsRef.current = map;

      const header = document.querySelector(".siteHeader");
      const headerH = header ? header.getBoundingClientRect().height : 72;
      document.documentElement.style.setProperty("--anchor-offset", `${headerH}px`);

      const io = new IntersectionObserver(
        entries => {
          const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]) setActiveId(visible[0].target.id);
        },
        { rootMargin: `-${headerH + 1}px 0px 0px 0px`, threshold: [0.3, 0.6, 0.9] }
      );
      sections.forEach(s => s && io.observe(s));
      return () => io.disconnect();
    }, []);

    // Keep --anchor-offset perfectly in sync with header height (no “sliver” gaps)
    useEffect(() => {
      const header = document.querySelector(".siteHeader");
      if (!header) return;
      const setOffset = () => {
        const h = Math.round(header.getBoundingClientRect().height);
        document.documentElement.style.setProperty("--anchor-offset", `${h}px`);
      };
      setOffset();
      const ro = new ResizeObserver(setOffset);
      ro.observe(header);
      const onResize = () => setOffset();
      window.addEventListener("resize", onResize);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }, []);

    // Close mobile nav on navigation, ESC, or when leaving mobile width
    useEffect(() => {
      const close = () => setNavOpen(false);
      const onKey = e => { if (e.key === "Escape") setNavOpen(false); };
      const onResize = () => { if (window.innerWidth > 900) setNavOpen(false); };
      window.addEventListener("hashchange", close);
      window.addEventListener("keydown", onKey);
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("hashchange", close);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
      };
    }, []);

    const handleNavClick = id => {
      setActiveId(id);
      setNavOpen(false);
    };

    return (
      <>
        <Header
          onOpenCart={() => setOpenCart(true)}
          activeId={activeId}
          qty={qty}
          navOpen={navOpen}
          onToggleNav={() => setNavOpen(v => !v)}
          onNavClick={handleNavClick}
        />

        {navOpen && (
          <button
            type="button"
            className="navScrim"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          />
        )}

        <main className="mainArea">
          <section id="home" className="sectionBlock container"><PageHome /></section>
          <section id="catalog" className="sectionBlock container"><PageCatalog onOpenCart={() => setOpenCart(true)} /></section>
          <section id="compare" className="sectionBlock container"><PageCompare onOpenCart={() => setOpenCart(true)} /></section>
          <section id="question" className="sectionBlock container"><PageQuestiona /></section>
          <section id="contact" className="sectionBlock container"><PageContact /></section>
        </main>

  <footer className="siteFooter">
    <div className="siteFooterInner">
    
      <div className="footerBrand">
        <span className="footerText">Persol</span>
      </div>


        <h5>JOIN THE EXPERIENCE</h5>
        <p>Sign up for our newsletter to receive the latest news and exclusive offers.</p>

        <form className="footerNewsletter">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>

      <ul className="footerLinks">
        <li><a href="#privacy">Privacy Policy</a></li>
        <li><a href="#terms">Terms of Service</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#contact">Contact Us</a></li>
        <li><a href="#help">Help Center</a></li>
      </ul>

      <div className="footerExtra">

        <p>© 2025 Persol. All Rights Reserved.</p>
      </div>
    </div>
  </footer>

        {openCart && <CartPanel open={openCart} onClose={() => setOpenCart(false)} />}
      </>
    );
  }
