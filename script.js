// Array de productos
const productosData = [
    {
        nombre: 'Vino Premium',
        precio: 10.99,
        imagen: 'img/vino.jpg',
        tipo: 'vino',
        descripcion: 'Vino de alta calidad.'
    },
    {
        nombre: 'Cerveza Artesanal',
        precio: 5.99,
        imagen: 'img/azul.jpg',
        tipo: 'cerveza',
        descripcion: 'Cerveza artesanal refrescante.'
    },
    {
        nombre: 'Whisky Escocés',
        precio: 25.99,
        imagen: 'img/red.jpg',
        tipo: 'whisky',
        descripcion: 'Whisky escocés añejo.'
    }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderCatalogo(filtro = 'todos', busqueda = '') {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    let productosFiltrados = productosData.filter(p =>
        (filtro === 'todos' || p.tipo === filtro) &&
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
        return;
    }
    productosFiltrados.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4 producto';
        card.dataset.tipo = producto.tipo;
        card.innerHTML = `
            <div class='card bg-secondary text-light h-100'>
                <img src='${producto.imagen}' class='card-img-top' alt='${producto.nombre}' loading='lazy'>
                <div class='card-body'>
                    <h5 class='card-title'>${producto.nombre}</h5>
                    <p class='card-text'>${producto.descripcion}</p>
                    <p class='card-text fw-bold'>S/${producto.precio.toFixed(2)}</p>
                    <button class='btn btn-warning' onclick="agregarCarrito('${producto.nombre}')">Añadir al carrito</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function scrollToCatalog() {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

function buscarProducto() {
    let input = document.getElementById('buscador').value;
    renderCatalogo('todos', input);
}

function filtrar(tipo) {
    let input = document.getElementById('buscador').value;
    renderCatalogo(tipo, input);
}

function agregarCarrito(nombreProducto) {
    const producto = productosData.find(p => p.nombre === nombreProducto);
    if (!producto) return;
    const item = carrito.find(i => i.nombre === producto.nombre);
    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    mostrarToast(`${producto.nombre} añadido al carrito`);
}

function actualizarCarrito() {
    let contenido = document.getElementById('carritoContenido');
    let cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('carritoCantidad').textContent = cantidad;
    if (carrito.length === 0) {
        contenido.innerHTML = '<p>No hay productos en el carrito.</p>';
    } else {
        let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        contenido.innerHTML = '<ul>' + carrito.map(item =>
            `<li>${item.nombre} x${item.cantidad} - S/${(item.precio * item.cantidad).toFixed(2)} <button class='btn btn-sm btn-danger ms-2' onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button></li>`
        ).join('') + `</ul><hr><p class='fw-bold'>Total: S/${total.toFixed(2)}</p>`;
    }
}

function eliminarDelCarrito(nombreProducto) {
    carrito = carrito.filter(item => item.nombre !== nombreProducto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function mostrarToast(mensaje) {
    // Simple notificación
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-bg-warning border-0 show position-fixed bottom-0 end-0 m-3';
    toast.role = 'alert';
    toast.innerHTML = `<div class='d-flex'><div class='toast-body'>${mensaje}</div><button type='button' class='btn-close me-2 m-auto' onclick='this.parentElement.parentElement.remove()'></button></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Inicialización
renderCatalogo();
actualizarCarrito();
