import { useEffect, useState } from "react";

export default function PageCatalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/data/products.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load products");
        return r.json();
      })
      .then((data) => { if (active) setItems(data); })
      .catch((err) => setError(err.message))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <section>
        <h1 className="pageTitle">Catalog</h1>
        <p className="pageLead">Loading products…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1 className="pageTitle">Catalog</h1>
        <p className="pageLead">Could not load products: {error}</p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="pageTitle">Catalog</h1>
      <p className="pageLead">Browse Lens Shop products and download spec sheets.</p>
      <div className="productGrid">
        {items.map((p) => (
          <article key={p.id} className="productCard">
            <figure className="productMedia">
              <a href={p.image} target="_blank" rel="noreferrer">
                <img className="productImage" src={p.image} alt={p.name} />
              </a>
            </figure>
            <div className="productBody">
              <h2 className="productTitle">{p.name}</h2>
              <div className="productMeta">
                <span className="productBrand">{p.brand}</span>
                <span className="productCategory">{p.category}</span>
              </div>
              <div className="productPrice">₦{Number(p.price).toLocaleString()}</div>
              <div className="productActions">
                <a className="buttonPrimary" href={p.spec}>View spec sheet</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
