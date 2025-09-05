import { useEffect, useMemo, useState } from "react";
import Cart from "../Cart/cart.js";

export default function CartPanel({ open, onClose }) {
  const [state, setState] = useState({
    items: Cart.all(),
    totals: Cart.totals(),
  });
  const nf = useMemo(
    () =>
      new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }),
    []
  );

  useEffect(() => {
    function onChange(e) {
      const d = e.detail || { items: Cart.all(), totals: Cart.totals() };
      setState({ items: d.items, totals: d.totals });
    }
    window.addEventListener("cart:change", onChange);
    return () => window.removeEventListener("cart:change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cartOverlay" onClick={onClose}>
      <aside className="cartPanel" onClick={(e) => e.stopPropagation()}>
        <header className="cartHeader">
          <h2 className="cartTitle">Cart</h2>
          <button className="cartClose" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="cartBody">
          {state.items.length === 0 ? (
            <p className="cartEmpty">Your cart is empty.</p>
          ) : (
            <ul className="cartList">
              {state.items.map((it) => (
                <li className="cartItemRow" key={it.id}>
                  <img
                    className="cartItemImage"
                    src={`/assets/frames/${it.image}`}
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/icons/lens-shop-logo.svg")
                    }
                    alt=""
                  />
                  <div className="cartItemMain">
                    <div className="cartItemTitle">{it.title}</div>
                    <div className="cartItemPrice">{nf.format(it.price)}</div>
                  </div>
                  <div className="qtyControls">
                    <button
                      className="qtyButton"
                      onClick={() => Cart.setQty(it.id, it.qty - 1)}
                    >
                      −
                    </button>
                    <input
                      className="qtyInput"
                      value={it.qty}
                      onChange={(e) => Cart.setQty(it.id, e.target.value)}
                      inputMode="numeric"
                    />
                    <button
                      className="qtyButton"
                      onClick={() => Cart.setQty(it.id, it.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="removeButton"
                    onClick={() => Cart.remove(it.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="cartFooter">
          <div className="cartTotals">
            <span className="cartTotalQty">{state.totals.qty} items</span>
            <span className="cartTotalPrice">
              {nf.format(state.totals.price)}
            </span>
          </div>
          <div className="cartActions">
            <button
              className="cartClear"
              onClick={() => Cart.clear()}
              disabled={state.items.length === 0}
            >
              Clear
            </button>
            <button
              className="cartConfirm"
              onClick={() => {
                if (state.items.length && window.confirm("Confirm order?")) {
                  Cart.clear();
                  onClose();
                }
              }}
              disabled={state.items.length === 0}
            >
              Confirm
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
