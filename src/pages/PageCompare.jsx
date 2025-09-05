import { useEffect, useMemo, useState } from "react";
import Cart from "../Cart/cart.js";

function useProducts() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);
  return data;
}

export default function PageCompare({ onOpenCart }) {
  const all = useProducts();

  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");

  const brands = useMemo(
    () => ["all", ...Array.from(new Set(all.map((p) => p.brand)))],
    [all]
  );
  const categories = useMemo(
    () => ["all", ...Array.from(new Set(all.map((p) => p.category)))],
    [all]
  );

  const filtered = useMemo(() => {
    return all.filter(
      (p) =>
        (brand === "all" || p.brand === brand) &&
        (category === "all" || p.category === category)
    );
  }, [all, brand, category]);

  const [selected, setSelected] = useState([]);

  function isSelected(p) {
    for (let i = 0; i < selected.length; i++) {
      if (selected[i].id === p.id) return true;
    }
    return false;
  }

  function toggle(p) {
    let idx = -1;
    for (let i = 0; i < selected.length; i++) {
      if (selected[i].id === p.id) {
        idx = i;
        break;
      }
    }
    if (idx > -1) {
      const next = [];
      for (let i = 0; i < selected.length; i++) {
        if (i !== idx) next.push(selected[i]);
      }
      setSelected(next);
    } else {
      if (selected.length >= 2) return;
      setSelected([...selected, p]);
    }
  }

  function addBoth() {
    for (let i = 0; i < selected.length; i++) {
      const p = selected[i];
      Cart.add({ id: p.id, title: p.title, price: p.price, image: p.image }, 1);
    }
    if (onOpenCart) onOpenCart();
  }

  const table = useMemo(() => {
    if (selected.length !== 2) return null;
    const a = selected[0],
      b = selected[1];
    return (
      <table className="compareTable">
        <thead>
          <tr>
            <th>Feature</th>
            <th>{a.title}</th>
            <th>{b.title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brand</td>
            <td>{a.brand}</td>
            <td>{b.brand}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>{a.category}</td>
            <td>{b.category}</td>
          </tr>
          <tr>
            <td>Price</td>
            <td>₦{a.price.toLocaleString("en-NG")}</td>
            <td>₦{b.price.toLocaleString("en-NG")}</td>
          </tr>
        </tbody>
      </table>
    );
  }, [selected]);

  return (
    <div>
      <h2 className="pageTitle">Compare</h2>
      <p className="pageLead">
        Pick exactly two products to compare. Use the filters to narrow the
        list.
      </p>

      <div className="filterBar">
        <label className="filterOption">
          <span>Brand</span>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label className="filterOption">
          <span>Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="catalogPage">
        <div className="comparePickGrid">
          {filtered.map((p) => {
            const sel = isSelected(p);
            const atLimit = selected.length >= 2 && !sel;
            return (
              <article
                className={sel ? "productCard pickSelected" : "productCard"}
                key={p.id}
              >
                <div className="productMediaBox">
                  <img
                    className="productMedia"
                    src={`/assets/frames/${p.image}`}
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/icons/lens-shop-logo.svg")
                    }
                    alt=""
                  />
                </div>
                <div className="productMain">
                  <h3 className="productTitle">{p.title}</h3>
                  <div className="productMeta">
                    {p.brand} · {p.category}
                  </div>
                  <div className="productPrice">
                    ₦{p.price.toLocaleString("en-NG")}
                  </div>
                  <div className="productActions">
                    <button
                      className="pickButton"
                      aria-pressed={sel ? "true" : "false"}
                      disabled={atLimit}
                      onClick={() => toggle(p)}
                    >
                      {sel ? "Selected" : "Select"}
                    </button>
                    <button
                      className="buttonLink"
                      onClick={() =>
                        Cart.add(
                          {
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            image: p.image,
                          },
                          1
                        )
                      }
                    >
                      Quick add
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {selected.length === 2 && (
          <div className="compareActions">
            <button className="buttonPrimary" onClick={addBoth}>
              Add both to cart
            </button>
          </div>
        )}

        {table}
      </div>
    </div>
  );
}
