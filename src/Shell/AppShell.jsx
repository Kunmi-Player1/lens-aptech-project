import React, { useEffect, useState } from 'react'
import PageHome from '../pages/PageHome.jsx'
import PageCatalog from '../pages/PageCatalog.jsx'
import PageCompare from '../pages/PageCompare.jsx'
import PageContact from '../pages/PageContact.jsx'

export default function AppShell() {
  const [navOpen, setNavOpen] = useState(false)
  const [active, setActive] = useState('home')

  // Observe which section is currently visible to highlight nav item
  useEffect(() => {
    const ids = ['home', 'catalog', 'compare', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      {
        root: null,
        rootMargin: '0px 0px -50% 0px',
        threshold: [0.25, 0.5, 0.75]
      }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Dynamically adjust scroll-offset based on header height
  useEffect(() => {
    const updateOffset = () => {
      const h = document.querySelector('.siteHeader')?.offsetHeight || 0
      document.documentElement.style.setProperty('--anchor-offset', `${h}px`)
    }
    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [])

  const navCls = (id) => (active === id ? 'navLink navLinkActive' : 'navLink')

  return (
    <>
      <header className="siteHeader">
        <div className="siteHeaderInner">
          <a href="#home" className="brand" onClick={() => setNavOpen(false)}>
            <img src="/assets/icons/lens-shop-logo.svg" alt="" className="brandLogo" />
            <span className="brandText">Lens Shop</span>
          </a>
          <button
            className="navToggleButton"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            onClick={() => setNavOpen(v => !v)}
          >
            <span className="navToggleIcon"></span>
            <span className="visuallyHidden">Menu</span>
          </button>
          <nav id="site-nav" className="navArea" data-open={navOpen ? 'true' : 'false'}>
            <ul className="navList">
              <li>
                <a href="#home" className={navCls('home')} onClick={() => setNavOpen(false)}>
                  Home
                </a>
              </li>
              <li>
                <a href="#catalog" className={navCls('catalog')} onClick={() => setNavOpen(false)}>
                  Catalog
                </a>
              </li>
              <li>
                <a href="#compare" className={navCls('compare')} onClick={() => setNavOpen(false)}>
                  Compare
                </a>
              </li>
              <li>
                <a href="#contact" className={navCls('contact')} onClick={() => setNavOpen(false)}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mainArea">
        <div id="home" className="sectionBlock"><PageHome /></div>
        <div id="catalog" className="sectionBlock"><PageCatalog /></div>
        <div id="compare" className="sectionBlock"><PageCompare /></div>
        <div id="contact" className="sectionBlock"><PageContact /></div>
      </main>

      <footer className="siteFooter">
        <div className="siteFooterInner">
          <a href="#home" className="footerBrand">
            <img src="/assets/icons/lens-shop-favicon.svg" alt="" className="footerLogo" />
            <span className="footerText">Lens Shop</span>
          </a>
        </div>
      </footer>
    </>
  )
}
