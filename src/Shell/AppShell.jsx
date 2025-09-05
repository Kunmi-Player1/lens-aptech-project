import { useEffect, useRef, useState } from "react";
import PageHome from "../pages/PageHome.jsx";
import PageCatalog from "../pages/PageCatalog.jsx";
import PageCompare from "../pages/PageCompare.jsx";
import PageContact from "../pages/PageContact.jsx";
import Cart from "../Cart/cart.js";
import CartPanel from "../Components/CartPanel.jsx";

function Header({ onOpenCart, activeId, qty }) {
  return (
    <header className="siteHeader">
      <div className="siteHeaderInner container">
        <a className="brand" href="#home">
          <img
            className="brandLogo"
            src="/assets/icons/lens-shop-logo.svg"
            alt=""
          />
          <span className="brandText">Lens Shop</span>
        </a>
        <nav className="navArea" data-open="true">
          <ul className="navList">
            <li>
              <a
                className={
                  activeId === "home" ? "navLink navLinkActive" : "navLink"
                }
                href="#home"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className={
                  activeId === "catalog" ? "navLink navLinkActive" : "navLink"
                }
                href="#catalog"
              >
                Catalog
              </a>
            </li>
            <li>
              <a
                className={
                  activeId === "compare" ? "navLink navLinkActive" : "navLink"
                }
                href="#compare"
              >
                Compare
              </a>
            </li>
            <li>
              <a
                className={
                  activeId === "contact" ? "navLink navLinkActive" : "navLink"
                }
                href="#contact"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <button
          className="cartHeaderButton"
          onClick={onOpenCart}
          aria-label="Open cart"
        >
          <span className="cartHeaderIcon">🛒</span>
          <span className="cartHeaderBadge" aria-live="polite">
            {qty}
          </span>
        </button>
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

  useEffect(() => {
    const sections = ["home", "catalog", "compare", "contact"].map((id) =>
      document.getElementById(id)
    );
    const map = {};
    sections.forEach((s) => {
      if (s) map[s.id] = s;
    });
    sectionsRef.current = map;
    const header = document.querySelector(".siteHeader");
    const headerH = header ? header.getBoundingClientRect().height : 72;
    document.documentElement.style.setProperty(
      "--anchor-offset",
      `${headerH}px`
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: `-${headerH + 1}px 0px 0px 0px`,
        threshold: [0.3, 0.6, 0.9],
      }
    );
    sections.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Header
        onOpenCart={() => setOpenCart(true)}
        activeId={activeId}
        qty={qty}
      />
      <main className="mainArea">
        <section id="home" className="sectionBlock container">
          <PageHome />
        </section>
        <section id="catalog" className="sectionBlock container">
          <PageCatalog onOpenCart={() => setOpenCart(true)} />
        </section>
        <section id="compare" className="sectionBlock container">
          <PageCompare onOpenCart={() => setOpenCart(true)} />
        </section>
        <section id="contact" className="sectionBlock container">
          <PageContact />
        </section>
      </main>
      <footer className="siteFooter">
        <div className="siteFooterInner container">
          <a className="footerBrand" href="#home">
            <img
              className="footerLogo"
              src="/assets/icons/lens-shop-logo.svg"
              alt=""
            />
            <span className="footerText">Lens Shop</span>
          </a>
        </div>
      </footer>

      {openCart && (
        <CartPanel open={openCart} onClose={() => setOpenCart(false)} />
      )}
    </>
  );
}
