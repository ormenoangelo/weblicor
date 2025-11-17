
let carrito = [];
function scrollToCatalog() { document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }); }
function buscarProducto() {
    let input = document.getElementById('buscador').value.toLowerCase();
    let productos = document.querySelectorAll('.producto');
    productos.forEach(p => {
        let nombre = p.querySelector('h5').textContent.toLowerCase();
        p.style.display = nombre.includes(input) ? 'block' : 'none';
    });
}
function filtrar(tipo) {
    let productos = document.querySelectorAll('.producto');
    productos.forEach(p => {
        p.style.display = (tipo === 'todos' || p.dataset.tipo === tipo) ? 'block' : 'none';
    });
}
function agregarCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
}
function actualizarCarrito() {
    let contenido = document.getElementById('carritoContenido');
    if (carrito.length === 0) {
        contenido.innerHTML = '<p>No hay productos en el carrito.</p>';
    } else {
        contenido.innerHTML = '<ul>' + carrito.map(item => '<li>' + item + '</li>').join('') + '</ul>';
    }
}
