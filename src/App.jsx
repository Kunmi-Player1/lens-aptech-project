export default function App() {
  return (
    <header className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <img src="/assets/icons/glasses.svg" width="24" height="24" alt="Lens Shop logo" />
          <span>Lens Shop</span>
        </a>

        <nav className="ms-auto d-flex align-items-center gap-3">
          <a className="text-decoration-none" href="#/catalog">Catalog</a>
          <a className="text-decoration-none" href="#/compare">Compare</a>
          <a className="btn btn-primary" href="#/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
