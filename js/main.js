// Clases
class Articulo {
    constructor(nombre, precio, cantidad) {
        this.nombre = nombre.toLowerCase();
        this.precio = precio;
        this.cantidad = cantidad;
    }
}

// Renderizar tabla
function actualizarTabla() {
    const tablaBody = document.getElementById('tablaBody');
    tablaBody.innerHTML = ''; 

    listaArticulos.forEach(articulo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${articulo.nombre}</td>
            <td>$${articulo.precio}</td>
            <td>${articulo.cantidad}</td>
        `;
        tablaBody.appendChild(fila);
    });
}

// Agregar artículos
function agregarArticulo() {
    const nombre = document.getElementById('nombreArticulo').value.toLowerCase();
    const precio = parseFloat(document.getElementById('precioArticulo').value);
    const cantidad = parseInt(document.getElementById('cantidadArticulo').value);

    const articuloExistente = listaArticulos.find(item => item.nombre === nombre);

    if (articuloExistente) {
        mostrarResultado(`El articulo ${nombre} ya existe`, 'warning');
    } else if (nombre && precio > 0 && cantidad > 0) {
        listaArticulos.push(new Articulo(nombre, precio, cantidad));
        localStorage.setItem('listaArticulos', JSON.stringify(listaArticulos));
        mostrarResultado(`Se agregó el articulo: ${nombre} - precio: $${precio} - cantidad: ${cantidad}`, 'success');
        actualizarTabla();
    } else {
        mostrarResultado("Faltan datos o están incorrectos, intenta otra vez", 'error');
    }
}

// Eliminar artículos
function eliminarArticulo() {
    const nombre = document.getElementById('nombreArticulo').value.toLowerCase();
    const cantidad = parseInt(document.getElementById('cantidadArticulo').value);

    const articuloEncontrado = listaArticulos.find(item => item.nombre === nombre);

    if (articuloEncontrado && cantidad > 0 && cantidad <= articuloEncontrado.cantidad) {
        Swal.fire({
            title: '¿Seguro?',
            text: `Vas a eliminar ${cantidad} del stock de ${nombre}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                articuloEncontrado.cantidad -= cantidad;
                if (articuloEncontrado.cantidad === 0) {
                    listaArticulos = listaArticulos.filter(item => item.nombre !== nombre);
                }
                localStorage.setItem('listaArticulos', JSON.stringify(listaArticulos));
                mostrarResultado(`Se eliminó ${cantidad} del stock de ${nombre}`, 'success');
                actualizarTabla();
            } else {
                mostrarResultado('Se canceló la operación', 'info');
            }
        });
    } else {
        mostrarResultado("No se encontró el artículo o la cantidad es inválida", 'error');
    }
}

// Actualizar precio
function modificarPrecio() {
    const nombre = document.getElementById('nombreArticulo').value.toLowerCase();
    const nuevoPrecio = parseFloat(document.getElementById('precioArticulo').value);

    const articuloEncontrado = listaArticulos.find(item => item.nombre === nombre);

    if (articuloEncontrado && nuevoPrecio > 0) {
        articuloEncontrado.precio = nuevoPrecio;
        localStorage.setItem('listaArticulos', JSON.stringify(listaArticulos));
        mostrarResultado(`Se modificó el precio de ${nombre} a $${nuevoPrecio}`, 'success');
        actualizarTabla();
    } else {
        mostrarResultado("No se encontró el artículo o el precio es inválido", 'error');
    }
}

// Alertas
function mostrarResultado(mensaje, tipo) {
    Swal.fire({
        icon: tipo,
        title: 'Resultado',
        text: mensaje,
        confirmButtonText: 'OK'
    });
}

// INICIO DEL PROGRAMA

// Inicializar la lista de artículos desde LS
let listaArticulos = JSON.parse(localStorage.getItem('listaArticulos')) || [];

// Cargamos el JSON si no hay articulos
if (listaArticulos.length === 0) {
    fetch('./js/articulos.json')
        .then((response) => response.json())
        .then((data) => {
            listaArticulos = data.map(item => new Articulo(item.nombre, item.precio, item.cantidad));
            localStorage.setItem('listaArticulos', JSON.stringify(listaArticulos));
            actualizarTabla();
        })
        .catch((error) => console.error('Error al cargar los datos:', error));
} else {
    actualizarTabla();
}

// Mensaje de bienvenida
fetch('./js/mensaje.json')
    .then((response) => response.json())
    .then((data) => {
        mostrarResultado(data.mensaje, 'info');
    })
    .catch((error) => console.error('Error al cargar el mensaje de bienvenida:', error));

// Eventos
document.getElementById('btnAgregar').addEventListener('click', agregarArticulo);
document.getElementById('btnEliminar').addEventListener('click', eliminarArticulo);
document.getElementById('btnModificar').addEventListener('click', modificarPrecio);
