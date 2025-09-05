import { useEffect, useMemo, useState, useCallback } from "react";
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

export default function PageCatalog({ onOpenCart }) {
  const all = useProducts();
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [specItem, setSpecItem] = useState(null);

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

  function addToCart(p) {
    Cart.add({ id: p.id, title: p.title, price: p.price, image: p.image }, 1);
    if (onOpenCart) onOpenCart();
  }

  const openSpec = useCallback((p) => {
    setSpecItem(p);
  }, []);
  const closeSpec = useCallback(() => {
    setSpecItem(null);
  }, []);

  useEffect(() => {
    if (!specItem) return;
    function onKey(e) {
      if (e.key === "Escape") closeSpec();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [specItem, closeSpec]);

  function now() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function specPairs(p) {
    const out = [];
    out.push(["Brand", p.brand || "—"]);
    out.push(["Category", p.category || "—"]);
    out.push(["Price", `₦${Number(p.price || 0).toLocaleString("en-NG")}`]);
    if (p.category === "contact_lenses") {
      if (p.material) out.push(["Material", p.material]);
      if (p.waterContent) out.push(["Water content", p.waterContent]);
      if (p.baseCurve) out.push(["Base curve", p.baseCurve]);
      if (p.diameter) out.push(["Diameter", p.diameter]);
      if (p.wear) out.push(["Wear", p.wear]);
      if (p.care) out.push(["Care", p.care]);
    } else {
      if (p.frame) out.push(["Frame", p.frame]);
      if (p.lens) out.push(["Lens", p.lens]);
      if (p.dimensions) out.push(["Dimensions", p.dimensions]);
      if (p.weight) out.push(["Weight", p.weight]);
      if (p.care) out.push(["Care", p.care]);
    }
    return out;
  }

  function splitPairsForDoc(p) {
    const pairs = specPairs(p);
    const head = [];
    const bullets = [];
    let care = "";
    for (let i = 0; i < pairs.length; i++) {
      const k = pairs[i][0],
        v = pairs[i][1];
      if (k === "Care") {
        care = v;
      } else if (k === "Brand" || k === "Category" || k === "Price") {
        head.push([k, v]);
      } else {
        bullets.push([k, v]);
      }
    }
    return { head, bullets, care };
  }

  function downloadSpecPDF(p) {
    const PDF = window.jspdf && window.jspdf.jsPDF;
    if (!PDF) return alert("PDF engine not loaded. Check jsPDF script tag.");
    const doc = new PDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text(`${p.title} Doc`, 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Generated: ${now()}`, 20, y);
    y += 6;
    doc.text(`Website: Lens Shop`, 20, y);
    y += 10;

    const { head, bullets, care } = splitPairsForDoc(p);
    for (let i = 0; i < head.length; i++) {
      doc.text(`${head[i][0]}: ${head[i][1]}`, 20, y);
      y += 6;
    }
    y += 4;

    for (let i = 0; i < bullets.length; i++) {
      doc.text(`• ${bullets[i][0]}: ${bullets[i][1]}`, 20, y);
      y += 6;
    }

    if (care) {
      y += 6;
      const wrap = doc.splitTextToSize(`Care: ${care}`, 170);
      for (let i = 0; i < wrap.length; i++) {
        doc.text(wrap[i], 20, y);
        y += 6;
      }
    }

    doc.save(`${p.id}.pdf`);
  }

  return (
    <div>
      <h2 className="pageTitle">Catalog</h2>
      <p className="pageLead">
        Browse frames and lenses. Filter by brand or category.
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
        <div className="catalogGrid">
          {filtered.map((p) => (
            <article className="productCard" key={p.id}>
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
                  <button className="buttonLink" onClick={() => openSpec(p)}>
                    View spec sheet
                  </button>
                  <button
                    className="buttonPrimary"
                    onClick={() => addToCart(p)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {specItem && (
          <div className="specLayer" onClick={closeSpec}>
            <div
              className="specPanel"
              role="dialog"
              aria-modal="true"
              aria-label="Product specification"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="specHeader">
                <div className="specTitle">{specItem.title}</div>
                <button className="specClose" onClick={closeSpec}>
                  Close
                </button>
              </header>

              <div className="specBody">
                <div className="specImage">
                  <img
                    src={`/assets/frames/${specItem.image}`}
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/icons/lens-shop-logo.svg")
                    }
                    alt=""
                  />
                </div>
                <div className="specDetails">
                  <dl className="specList">
                    {specPairs(specItem).map(([k, v], i) => (
                      <Fragment key={i}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </Fragment>
                    ))}
                  </dl>
                </div>
              </div>

              <footer className="specFooter">
                <button
                  className="btn btnPrimary"
                  onClick={() => downloadSpecPDF(specItem)}
                >
                  Download PDF
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Fragment({ children }) {
  return children;
}
