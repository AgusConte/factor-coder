document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://68a5f9362a3deed2960f825b.mockapi.io/productos";
  const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

  const IN_PAGES = location.pathname.toLowerCase().includes("/paginas/");
  const PREFIX = IN_PAGES ? "../" : "./";

  const contHome         = document.querySelector("#productos");
  const contParts        = document.querySelector("#lista-parts");
  const contProtecciones = document.querySelector("#lista-protecciones");
  const contArmadas      = document.querySelector("#lista-armadas");
  const contBicis        = document.querySelector("#lista-bicis");

  const carritoPanel    = document.querySelector("#carritoPanel");
  const abrirCarritoBtn = document.querySelector(".carrito-btn");
  const cerrarCarritoBtn= document.querySelector(".cerrar-carrito");
  const listaCarrito    = document.querySelector("#lista-carrito");
  const totalCarritoEl  = document.querySelector("#total-carrito");
  const cantidadSpan    = document.querySelector("#carrito-cantidad");
  const comprarBtn      = document.querySelector("#comprar-btn");

  let carrito;
  try {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  } catch {
    carrito = [];
  }
  carrito = carrito.map(it => ({ ...it, qty: it.qty ? it.qty : 1 }));

  const guardarCarrito = () => localStorage.setItem("carrito", JSON.stringify(carrito));
  const totalCarrito = () => carrito.reduce((a, b) => a + b.precio * b.qty, 0);
  const unidadesCarrito = () => carrito.reduce((a, b) => a + b.qty, 0);

  const actualizarUIcarrito = () => {
    if (cantidadSpan) cantidadSpan.textContent = unidadesCarrito();
    if (totalCarritoEl) totalCarritoEl.innerHTML = `<strong>Total:</strong> ${currency.format(totalCarrito())}`;
    if (!listaCarrito) return;
    listaCarrito.innerHTML = "";
    carrito.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "item-carrito";
      li.innerHTML = `
        <span><strong>${item.nombre}</strong><br>${currency.format(item.precio)} x ${item.qty}</span>
        <div class="acciones">
          <button class="menos" data-i="${i}" aria-label="Disminuir">−</button>
          <button class="mas" data-i="${i}" aria-label="Aumentar">+</button>
          <button class="eliminar-item" data-i="${i}" aria-label="Eliminar">&times;</button>
        </div>
      `;
      listaCarrito.appendChild(li);
    });
  };

  function agregarProducto(p) {
    const idx = carrito.findIndex(it => it.id === p.id);
    if (idx >= 0) carrito[idx].qty += 1;
    else carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, imagen: p.imagen, qty: 1 });
    guardarCarrito();
    actualizarUIcarrito();
  }

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".agregar-carrito");
    if (addBtn) {
      const id = addBtn.dataset.id;
      const prod = (window.__CATALOGO__ || []).find(x => String(x.id) === String(id));
      if (prod) agregarProducto(prod);
    }

    const btnDel = e.target.closest(".eliminar-item");
    const btnMas = e.target.closest(".mas");
    const btnMenos = e.target.closest(".menos");
    if (btnDel)  { carrito.splice(parseInt(btnDel.dataset.i), 1); guardarCarrito(); actualizarUIcarrito(); }
    if (btnMas)  { carrito[parseInt(btnMas.dataset.i)].qty += 1;  guardarCarrito(); actualizarUIcarrito(); }
    if (btnMenos){ const i=parseInt(btnMenos.dataset.i); carrito[i].qty = Math.max(1, carrito[i].qty-1); guardarCarrito(); actualizarUIcarrito(); }
  });

  abrirCarritoBtn?.addEventListener("click", (e) => { e.preventDefault(); carritoPanel?.classList.add("abierto"); });
  cerrarCarritoBtn?.addEventListener("click", () => carritoPanel?.classList.remove("abierto"));
  comprarBtn?.addEventListener("click", () => {
    if (!carrito.length) {
      Toastify({
        text: "Tu carrito está vacío",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#ff4d4d"
      }).showToast();
      return;
    }
  
    carrito = [];
    guardarCarrito();
    actualizarUIcarrito();
  
    Toastify({
      text: "¡Gracias por tu compra!",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "#4CAF50"
    }).showToast();
  });

  async function obtenerProductos() {
    try {
      const r = await fetch(API_URL, { cache: "no-store" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch {
      return [];
    }
  }

  const card = (p) => `
    <div class="producto">
      <a href="#"><img src="${PREFIX}${p.imagen}" alt="${p.nombre}"></a>
      <h3>${p.nombre}</h3>
      <p class="precio">${currency.format(p.precio)}</p>
      <button class="btn btn-primary agregar-carrito" data-id="${p.id}">Agregar al carrito</button>
    </div>
  `;

  function renderLista(contenedor, items) {
    if (!contenedor) return;
    contenedor.innerHTML = items.length ? items.map(card).join("") : `<p style="padding:12px">No hay productos para mostrar.</p>`;
  }

  const CATALOGO = await obtenerProductos();
  window.__CATALOGO__ = CATALOGO;

  if (contHome) renderLista(contHome, CATALOGO.slice(0, 6));
  if (contParts) {
    const items = CATALOGO.filter(p => (p.categoria || "").toLowerCase() === "parts");
    renderLista(contParts, items);
  }
  if (contProtecciones) {
    const items = CATALOGO.filter(p => (p.categoria || "").toLowerCase() === "protecciones");
    renderLista(contProtecciones, items);
  }
  if (contArmadas || contBicis) {
    const items = CATALOGO.filter(p => {
      const c = (p.categoria || "").toLowerCase();
      return c === "armadas" || c === "bicis";
    });
    if (contArmadas) renderLista(contArmadas, items);
    if (contBicis)   renderLista(contBicis,   items);
  }

  actualizarUIcarrito();

  window.addEventListener("pageshow", () => {
    try { carrito = JSON.parse(localStorage.getItem("carrito")) || []; } catch { carrito = []; }
    carrito = carrito.map(it => ({ ...it, qty: it.qty ? it.qty : 1 }));
    actualizarUIcarrito();
  });
});
