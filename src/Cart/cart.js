const Cart = (() => {
  const KEY = "lensshop_cart_v1";
  let items = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const data = raw ? JSON.parse(raw) : [];
      items = Array.isArray(data) ? data : [];
    } catch {
      items = [];
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
    window.dispatchEvent(new CustomEvent("cart:change", { detail: { items: all(), totals: totals() } }));
  }

  function totals() {
    let qty = 0;
    let price = 0;
    for (let i = 0; i < items.length; i++) {
      const q = Number(items[i].qty) || 0;
      const p = Number(items[i].price) || 0;
      qty += q;
      price += q * p;
    }
    return { qty, price };
  }

  function add(p, q = 1) {
    if (!p || !p.id) return;
    const addQty = Math.max(1, Number(q) || 1);
    const i = items.findIndex(x => x.id === p.id);
    if (i > -1) {
      items[i].qty = (Number(items[i].qty) || 0) + addQty;
    } else {
      items.push({ id: p.id, title: p.title, price: Number(p.price) || 0, image: p.image, qty: addQty });
    }
    save();
  }

  function setQty(id, q) {
    const n = Math.max(1, Number(q) || 1);
    const i = items.findIndex(x => x.id === id);
    if (i > -1) {
      items[i].qty = n;
      save();
    }
  }

  function remove(id) {
    items = items.filter(x => x.id !== id);
    save();
  }

  function clear() {
    items = [];
    save();
  }

  function all() {
    return items.slice();
  }

  load();
  return { add, setQty, remove, clear, all, totals };
})();

export default Cart;
