let lista = [];
let salir = false;

while (!salir) {
    const option = prompt(`Opciones:
    1 - Agregar un producto a la lista.
    2 - Remover el último producto de la lista.
    3 - Ordenar la lista por precio.
    4 - Ver la lista y el precio total.
    5 - Terminar lista.`);

    switch (option) {
        case "1":
            const nombre = prompt("Nombre del producto:");
            const cantidad = Number(prompt("Cantidad:"));
            if (isNaN(cantidad) || cantidad <= 0) {
                alert("La cantidad debe ser un número válido mayor que cero.");
                break;
            }
            const precioUnitario = Number(prompt("Precio unitario del producto:"));
            if (isNaN(precioUnitario) || precioUnitario <= 0) {
                alert("El precio debe ser un número válido mayor que cero.");
                break;
            }
            const producto = {
                nombre: nombre,
                cantidad: cantidad,
                precio: cantidad * precioUnitario
            };
            lista.push(producto);
            console.log(`Producto agregado: ${producto.nombre}`);
            break;

        case "2":
            if (lista.length === 0) {
                console.log("La lista está vacía, no hay productos para eliminar.");
                break;
            }
            const eliminado = lista.pop();
            console.log(`Producto eliminado: ${eliminado.nombre}`);
            break;

        case "3":
            if (lista.length === 0) {
                console.log("La lista está vacía, no hay productos para ordenar.");
                break;
            }
            lista.sort((a, b) => a.precio - b.precio);
            console.log("Lista ordenada por precio.");
            break;

        case "4":
            if (lista.length === 0) {
                console.log("La lista está vacía.");
                break;
            }
            let total = 0;
            lista.forEach(producto => total += producto.precio);
            console.table(lista);
            console.log(`Precio total: $${total.toFixed(2)}`);
            break;

        case "5":
            salir = true;
            alert("Fin de la lista");
            break;

        default:
            console.log("Opción no válida");
    }
}
