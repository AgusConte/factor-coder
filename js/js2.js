document.addEventListener("DOMContentLoaded", () => {
  const carritoPanel = document.querySelector("#carritoPanel");
  const abrirCarritoBtn = document.querySelector(".carrito-btn");
  const cerrarCarritoBtn = document.querySelector(".cerrar-carrito");
  const listaCarrito = document.querySelector("#lista-carrito");
  const totalCarrito = document.querySelector("#total-carrito");
  const botonesAgregar = document.querySelectorAll(".agregar-carrito");
  const cantidadSpan = document.querySelector("#carrito-cantidad");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const guardarCarrito = () => localStorage.setItem("carrito", JSON.stringify(carrito));

  const actualizarCantidadCarrito = () => {
    if (cantidadSpan) cantidadSpan.textContent = carrito.length;
  };

  const renderCarrito = () => {
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
      const li = document.createElement("li");
      li.className = "item-carrito";

      li.innerHTML = `
        <span>
          <strong>${producto.nombre}</strong><br>
          $${producto.precio.toLocaleString()}
        </span>
        <button class="eliminar-item" data-index="${index}">&times;</button>
      `;

      listaCarrito.appendChild(li);
      total += producto.precio;
    });

    totalCarrito.innerHTML = `<strong>Total:</strong> $${total.toLocaleString()}`;
    actualizarCantidadCarrito();

    document.querySelectorAll(".eliminar-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        carrito.splice(index, 1);
        guardarCarrito();
        renderCarrito();
      });
    });
  };

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const productoDiv = boton.closest(".producto");
      const nombre = productoDiv.querySelector("h3").innerText;
      const precioTexto = productoDiv.querySelector(".precio").innerText;
      const precio = parseInt(precioTexto.replace(/\D/g, ''), 10);

      carrito.push({ nombre, precio });
      guardarCarrito();
      renderCarrito();
      alert(`${nombre} agregado al carrito`);
    });
  });

  abrirCarritoBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    carritoPanel.classList.add("abierto");
  });

  cerrarCarritoBtn?.addEventListener("click", () => {
    carritoPanel.classList.remove("abierto");
  });

  renderCarrito();
});
