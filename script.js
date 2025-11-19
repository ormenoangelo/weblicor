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
    let productosHtml = '';
    if (carrito.length === 0) {
        productosHtml = '<p>No hay productos en el carrito.</p>';
    } else {
        let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        productosHtml = '<ul>' + carrito.map(item =>
            `<li>${item.nombre} x${item.cantidad} - S/${(item.precio * item.cantidad).toFixed(2)} <button class='btn btn-sm btn-danger ms-2' onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button></li>`
        ).join('') + `</ul><hr><p class='fw-bold'>Total: S/${total.toFixed(2)}</p>`;
    }
    // Formulario de contacto siempre visible
    const formHtml = `
        <form id='formContacto' class='mt-3'>
            <div class='mb-2'>
                <input type='text' class='form-control' id='contactoNombre' placeholder='Tu nombre' required>
            </div>
            <div class='mb-2'>
                <input type='tel' class='form-control' id='contactoTelefono' placeholder='Tu teléfono' required>
            </div>
            <div class='mb-2'>
                <input type='text' class='form-control' id='contactoDireccion' placeholder='Dirección de entrega' required>
            </div>
        </form>
    `;
    contenido.innerHTML = productosHtml + formHtml;
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

function finalizarCompraWhatsapp() {
    if (carrito.length === 0) {
        mostrarToast('El carrito está vacío');
        return;
    }
    // Obtener datos del formulario
    const nombre = document.getElementById('contactoNombre').value.trim();
    const telefonoContacto = document.getElementById('contactoTelefono').value.trim();
    const direccion = document.getElementById('contactoDireccion').value.trim();
    if (!nombre || !telefonoContacto || !direccion) {
        mostrarToast('Por favor completa tus datos de contacto');
        return;
    }
    let mensaje = `¡Hola! Quiero hacer un pedido:\n`;
    mensaje += `Nombre: ${nombre}\n`;
    mensaje += `Teléfono: ${telefonoContacto}\n`;
    mensaje += `Dirección: ${direccion}\n\n`;
    carrito.forEach(item => {
        mensaje += `- ${item.nombre} x${item.cantidad} (S/${(item.precio * item.cantidad).toFixed(2)})\n`;
    });
    let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    mensaje += `Total: S/${total.toFixed(2)}`;
    const telefono = '945460792'; // Cambia por el número real
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Inicialización
renderCatalogo();
actualizarCarrito();
