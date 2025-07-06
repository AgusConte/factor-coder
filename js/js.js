
let lista = [];
let salir = false;

while (!salir){
    let option = prompt(`Opciones:
    1 - Agregar un producto a la lista.
    2 - Remover el ultimo producto de la lista.
    3 - Ordenar la lista por precio.
    4 - Ver la lista y el precio total.
    5 - terminar lista.`);
    
    switch (option) {
        
        case "1":
            let producto = {};
            producto.nombre = prompt("Nombre del producto:");
            let cantidad = Number(prompt("Cantidad:"));
            if (isNaN(cantidad)){
                alert("La cantidad debe ser un numero valido");
                break;
            }
            let precio = Number(prompt("Precio unitario del producto:"));
            if (isNaN(precio)){
                alert("El precio debe ser un numero valido");
                break;
            }
            producto.cantidad = cantidad ;
            producto.precio = cantidad * precio;
            lista.push(producto);
            console.log(`Producto agregado: ${producto.nombre}`)
            break;
        case "2":
            let eliminado = lista.pop();
            console.log(`Producto eliminado: ${eliminado.nombre}`)
            break;
        case "3":
            lista.sort((a, b) => a.precio - b.precio);
            break;
        case "4":
            let total = 0;
            lista.forEach((producto) => (total = total + producto.precio));
            console.table(lista);
            console.log(total);
            break;
        case "5":
            salir = true;
            alert("Fin de la lista");
            break;
        default:
            console.log("Opcion no valida");
    }
    
}
