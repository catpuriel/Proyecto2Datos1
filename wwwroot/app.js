// mientras no este listo el backend usamos datos de prueba
const USE_MOCK = true;

// info de la sede que estamos probando en mock
let sedeActual = {
    id: "SJ",
    nombre: "San José",
    ubicacionVehiculo: "San José",
    tiempoAcumulado: 0
};

// puntos del grafo segun rutas.json
const destinosDisponibles = [
    "Liberia",
    "Cañas",
    "Puntarenas",
    "Orotina",
    "Alajuela",
    "San José",
    "Heredia",
    "Cartago",
    "Paraíso",
    "Turrialba",
    "Guápiles",
    "Siquirres",
    "Limón"
];

// pedidos de ejemplo para probar la vista de entregas en modo mock
let pedidosMock = [
    {
        id: "PED-001",
        fecha: "2026-11-26 09:30",
        sedeOrigen: "SJ",
        destino: "Heredia",
        detalles: [
            { codigo: "AA01", nombre: "Agua Mineral Chirripó 700ml", cantidad: 4, precioUnitario: 700 },
            { codigo: "AA04", nombre: "Café 1620 premium 500g", cantidad: 1, precioUnitario: 6000 }
        ],
        sedesParticipantes: ["SJ"],
        montoTotal: 8800,
        tiempoMin: 0,
        estado: "Pendiente"
    },
    {
        id: "PED-002",
        fecha: "2026-11-26 10:15",
        sedeOrigen: "SJ",
        destino: "Cartago",
        detalles: [
            { codigo: "AA03", nombre: "Pastel de chocolate Moussemani", cantidad: 1, precioUnitario: 8500 }
        ],
        sedesParticipantes: ["SJ"],
        montoTotal: 8500,
        tiempoMin: 0,
        estado: "Pendiente"
    }
];

// lista temporal para ir armando un pedido nuevo
let carritoActual = [];
let contadorPedidos = 3;

// ventas registradas en modo mock (empieza vacio para probar estado inicial sin errores)
let ventasMock = [];
let contadorVentas = 1;

// catalogo completo sacado de los archivos en SeedsJSON/
const productosMock = [
    { codigo: "AA01", nombre: "Agua Mineral Chirripó 700ml", descripcion: "Botella de agua mineral sin gas", categoria: "Bebidas", precio: 700, stock: { SJ: 30, ALA: 24, LIB: 40, LIM: 30 } },
    { codigo: "AA02", nombre: "Petsi 2.5l", descripcion: "Botella de cola Petsi original", categoria: "Bebidas", precio: 1000, stock: { SJ: 34, ALA: 2, LIB: 0, LIM: 0 } },
    { codigo: "AA03", nombre: "Pastel de chocolate Moussemani", descripcion: "Pastel con glaseado de chocolate y chispas", categoria: "Panadería", precio: 8500, stock: { SJ: 7, ALA: 0, LIB: 0, LIM: 0 } },
    { codigo: "AA04", nombre: "Café 1620 premium 500g", descripcion: "Café molido de calidad", categoria: "Bebidas", precio: 6000, stock: { SJ: 15, ALA: 0, LIB: 0, LIM: 0 } },
    { codigo: "AA05", nombre: "Springles de camote L.E 300g", descripcion: "Edición limitada de Springles de camote", categoria: "Snack", precio: 1100, stock: { SJ: 11, ALA: 0, LIB: 0, LIM: 0 } },
    { codigo: "AA06", nombre: "Cereal Kepos sabor jocote 500g", descripcion: "Cereal sabor jocote integral", categoria: "Cereal", precio: 2100, stock: { SJ: 27, ALA: 0, LIB: 5, LIM: 0 } },
    { codigo: "AA07", nombre: "Pasta dental Bob Esponja", descripcion: "Pasta dental sin fluor sabor dulce", categoria: "Aseo", precio: 1700, stock: { SJ: 25, ALA: 0, LIB: 0, LIM: 0 } },
    { codigo: "AA08", nombre: "Yogurt Tres Pinos Mango 1l", descripcion: "Yogurt natural sabor a mango", categoria: "Lacteos", precio: 700, stock: { SJ: 0, ALA: 30, LIB: 0, LIM: 0 } },
    { codigo: "AA09", nombre: "Maní Salado Nuv 250g", descripcion: "Semillas de maní con sal", categoria: "Snacks", precio: 1100, stock: { SJ: 0, ALA: 18, LIB: 0, LIM: 0 } },
    { codigo: "AA10", nombre: "Detergente líquido Ursula 1l", descripcion: "Concentrado de detergente líquido para ropa", categoria: "Limpieza", precio: 3000, stock: { SJ: 0, ALA: 32, LIB: 0, LIM: 0 } },
    { codigo: "AA11", nombre: "Arroz Tio Peludo 4kg", descripcion: "Arroz de grano entero", categoria: "Granos", precio: 1000, stock: { SJ: 0, ALA: 34, LIB: 0, LIM: 0 } },
    { codigo: "AA12", nombre: "Atun Tung Enlatado 140g", descripcion: "Atún en aceite en trocitos", categoria: "Enlatados", precio: 700, stock: { SJ: 0, ALA: 29, LIB: 0, LIM: 0 } },
    { codigo: "AA13", nombre: "Galletas Marta 8 pack", descripcion: "Paquete de 8 galletas Marta", categoria: "Snacks", precio: 1200, stock: { SJ: 0, ALA: 0, LIB: 0, LIM: 9 } },
    { codigo: "AA14", nombre: "Pan MiBimbo Extra Grande", descripcion: "Pan Extra Grande Familiar", categoria: "Panadería", precio: 2500, stock: { SJ: 0, ALA: 0, LIB: 0, LIM: 36 } },
    { codigo: "AA15", nombre: "Jugo de naranja DelCerro 1L", descripcion: "Jugo de naranja natural", categoria: "Bebidas", precio: 2100, stock: { SJ: 0, ALA: 0, LIB: 0, LIM: 29 } },
    { codigo: "AA16", nombre: "Leche Partida 1l", descripcion: "Leche partida de vaca", categoria: "Lacteos", precio: 850, stock: { SJ: 0, ALA: 0, LIB: 12, LIM: 34 } },
    { codigo: "AA17", nombre: "Pasta Fideos Pompeya", descripcion: "Fideos tipo Spaghetti", categoria: "Pasta", precio: 1000, stock: { SJ: 0, ALA: 0, LIB: 0, LIM: 16 } },
    { codigo: "AA18", nombre: "Lomito de Champivaca 500g", descripcion: "Carne en lomo de champivaca", categoria: "Carne", precio: 5700, stock: { SJ: 0, ALA: 0, LIB: 17, LIM: 0 } },
    { codigo: "AA19", nombre: "Tomahawk TonyHawk 1kg", descripcion: "Kilo de Tomahawk", categoria: "Carne", precio: 8700, stock: { SJ: 0, ALA: 0, LIB: 37, LIM: 0 } },
    { codigo: "AA20", nombre: "Crema Sivea 220ml", descripcion: "Crema para hidratación de la piel", categoria: "Aseo", precio: 3500, stock: { SJ: 0, ALA: 0, LIB: 25, LIM: 0 } }
];

// cambia la pestaña que se ve en pantalla
function verTab(idTab) {
    let tabs = document.getElementsByClassName("tab");

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.add("oculto");
    }

    document.getElementById(idTab).classList.remove("oculto");
}

// cambia la sede activa cuando estamos probando con datos mock
function cambiarSedeMock() {
    let id = document.getElementById("sede-mock").value;
    let nombres = {
        SJ: "San José",
        ALA: "Alajuela",
        LIB: "Liberia",
        LIM: "Limón"
    };

    sedeActual.id = id;
    sedeActual.nombre = nombres[id];
    sedeActual.ubicacionVehiculo = nombres[id];
    sedeActual.tiempoAcumulado = 0;

    actualizarHeaderSede();

    document.getElementById("msg-stock").textContent = "";
    document.getElementById("msg-pedido").textContent = "";
    document.getElementById("msg-ruta").textContent = "";
    cargarInventarioLocal();
    cargarPedidos();
    cargarEstadisticas();
}

// actualiza la barra superior con la sede, donde va el vehiculo y el tiempo
function actualizarHeaderSede() {
    document.getElementById("info-sede").textContent =
        "Sede: " + sedeActual.nombre + " (" + sedeActual.id + ") | Vehículo en: " +
        sedeActual.ubicacionVehiculo + " | Tiempo recorrido: " + sedeActual.tiempoAcumulado + " min";
}

// llena la tabla del catalogo global (consulta #5)
function cargarCatalogo() {
    let tbody = document.getElementById("tbody-catalogo");
    let filtro = document.getElementById("buscar-catalogo").value.toLowerCase();
    tbody.innerHTML = "";

    if (USE_MOCK) {
        let contador = 0;

        for (let i = 0; i < productosMock.length; i++) {
            let p = productosMock[i];

            // si el usuario escribio algo, filtramos por codigo o nombre
            if (filtro !== "") {
                let enCodigo = p.codigo.toLowerCase().indexOf(filtro) !== -1;
                let enNombre = p.nombre.toLowerCase().indexOf(filtro) !== -1;
                if (!enCodigo && !enNombre) {
                    continue;
                }
            }

            let sj = p.stock.SJ || 0;
            let ala = p.stock.ALA || 0;
            let lib = p.stock.LIB || 0;
            let lim = p.stock.LIM || 0;
            let total = sj + ala + lib + lim;

            tbody.innerHTML +=
                "<tr>" +
                "<td>" + p.codigo + "</td>" +
                "<td>" + p.nombre + "</td>" +
                "<td>" + p.categoria + "</td>" +
                "<td>₡" + p.precio + "</td>" +
                "<td>" + sj + "</td>" +
                "<td>" + ala + "</td>" +
                "<td>" + lib + "</td>" +
                "<td>" + lim + "</td>" +
                "<td><strong>" + total + "</strong></td>" +
                "</tr>";

            contador++;
        }

        // manejo de tabla vacia para que no quede en blanco
        if (contador === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="vacio">No se encontraron productos.</td></tr>';
        }
    } else {
        // TODO: conectar con GET /api/catalogo/global
    }
}

// llena la tabla de inventario local de la sede actual (consulta #4)
function cargarInventarioLocal() {
    let tbody = document.getElementById("tbody-inventario");
    tbody.innerHTML = "";

    if (USE_MOCK) {
        let contador = 0;

        for (let i = 0; i < productosMock.length; i++) {
            let p = productosMock[i];
            let cantLocal = p.stock[sedeActual.id] || 0;

            // solo mostramos productos que tengan unidades en esta sede
            if (cantLocal > 0) {
                tbody.innerHTML +=
                    "<tr>" +
                    "<td>" + p.codigo + "</td>" +
                    "<td>" + p.nombre + "</td>" +
                    "<td>" + p.descripcion + "</td>" +
                    "<td>" + p.categoria + "</td>" +
                    "<td>₡" + p.precio + "</td>" +
                    "<td><strong>" + cantLocal + "</strong></td>" +
                    "</tr>";

                contador++;
            }
        }

        if (contador === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="vacio">No hay productos en el inventario local de esta sede.</td></tr>';
        }
    } else {
        // TODO: conectar con GET /api/inventario/local
    }
}

// llena los selects de productos (para agregar stock y para hacer pedidos)
function llenarSelectsProductos() {
    let selectStock = document.getElementById("prod-stock");
    let selectPedido = document.getElementById("prod-pedido");
    selectStock.innerHTML = "";
    selectPedido.innerHTML = "";

    for (let i = 0; i < productosMock.length; i++) {
        let p = productosMock[i];
        let texto = p.codigo + " - " + p.nombre + " (₡" + p.precio + ")";

        let op1 = document.createElement("option");
        op1.value = p.codigo;
        op1.textContent = texto;
        selectStock.appendChild(op1);

        let op2 = document.createElement("option");
        op2.value = p.codigo;
        op2.textContent = texto;
        selectPedido.appendChild(op2);
    }
}

// llena el select con los destinos del grafo
function llenarSelectDestinos() {
    let select = document.getElementById("destino-pedido");
    select.innerHTML = "";

    for (let i = 0; i < destinosDisponibles.length; i++) {
        let op = document.createElement("option");
        op.value = destinosDisponibles[i];
        op.textContent = destinosDisponibles[i];
        select.appendChild(op);
    }
}

// busca un producto por codigo en el arreglo mock
function buscarProductoMock(codigo) {
    for (let i = 0; i < productosMock.length; i++) {
        if (productosMock[i].codigo === codigo) {
            return productosMock[i];
        }
    }
    return null;
}

// agrega un producto a la lista temporal antes de confirmar el pedido
function agregarItemPedido() {
    let codigo = document.getElementById("prod-pedido").value;
    let cantidad = parseInt(document.getElementById("cant-pedido").value, 10);
    let msg = document.getElementById("msg-pedido");

    if (isNaN(cantidad) || cantidad <= 0) {
        msg.style.color = "red";
        msg.textContent = "La cantidad debe ser mayor a 0.";
        return;
    }

    let prod = buscarProductoMock(codigo);
    if (prod === null) return;

    // si ya estaba agregado, solo sumamos la cantidad
    let encontrado = false;
    for (let i = 0; i < carritoActual.length; i++) {
        if (carritoActual[i].codigo === codigo) {
            carritoActual[i].cantidad += cantidad;
            encontrado = true;
            break;
        }
    }

    if (!encontrado) {
        carritoActual.push({
            codigo: prod.codigo,
            nombre: prod.nombre,
            cantidad: cantidad,
            precioUnitario: prod.precio
        });
    }

    msg.textContent = "";
    mostrarCarrito();
}

function quitarItemPedido(indice) {
    carritoActual.splice(indice, 1);
    mostrarCarrito();
}

function mostrarCarrito() {
    let tbody = document.getElementById("tbody-carrito");
    let totalSpan = document.getElementById("total-carrito");
    tbody.innerHTML = "";

    if (carritoActual.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="vacio">No hay productos agregados todavía.</td></tr>';
        totalSpan.textContent = "₡0";
        return;
    }

    let total = 0;

    for (let i = 0; i < carritoActual.length; i++) {
        let item = carritoActual[i];
        let subtotal = item.cantidad * item.precioUnitario;
        total += subtotal;

        tbody.innerHTML +=
            "<tr>" +
            "<td>" + item.codigo + "</td>" +
            "<td>" + item.nombre + "</td>" +
            "<td>" + item.cantidad + "</td>" +
            "<td>₡" + subtotal + "</td>" +
            '<td><button onclick="quitarItemPedido(' + i + ')">Quitar</button></td>' +
            "</tr>";
    }

    totalSpan.textContent = "₡" + total;
}

// en rutas.json Liberia y Cañas estan aislados del resto del pais
function hayRutaMock(nombreSede, destino) {
    let sedeEnGuanacaste = (nombreSede === "Liberia");
    let destinoEnGuanacaste = (destino === "Liberia" || destino === "Cañas");
    return sedeEnGuanacaste === destinoEnGuanacaste;
}

// valida y guarda un nuevo pedido (operacion #1)
function confirmarPedido() {
    let msg = document.getElementById("msg-pedido");
    let destino = document.getElementById("destino-pedido").value;

    if (carritoActual.length === 0) {
        msg.style.color = "red";
        msg.textContent = "Agregue al menos un producto al pedido.";
        return;
    }

    if (USE_MOCK) {
        let montoTotal = 0;
        for (let i = 0; i < carritoActual.length; i++) {
            montoTotal += carritoActual[i].cantidad * carritoActual[i].precioUnitario;
        }

        let nuevoId = "PED-00" + contadorPedidos;
        contadorPedidos++;

        // 1. revisar si existe ruta desde la sede actual hasta el destino
        if (!hayRutaMock(sedeActual.nombre, destino)) {
            pedidosMock.push({
                id: nuevoId,
                fecha: obtenerFechaTexto(),
                sedeOrigen: sedeActual.id,
                destino: destino,
                detalles: carritoActual.slice(),
                sedesParticipantes: [],
                montoTotal: montoTotal,
                tiempoMin: 0,
                estado: "Rechazado"
            });

            msg.style.color = "red";
            msg.textContent = "Pedido " + nuevoId + " rechazado: no hay ruta desde " + sedeActual.nombre + " hasta " + destino + ".";
            cargarPedidos();
            return;
        }

        // 2. revisar que haya stock suficiente sumando todas las sedes
        for (let i = 0; i < carritoActual.length; i++) {
            let item = carritoActual[i];
            let prod = buscarProductoMock(item.codigo);
            let stockGlobal = prod.stock.SJ + prod.stock.ALA + prod.stock.LIB + prod.stock.LIM;

            if (stockGlobal < item.cantidad) {
                pedidosMock.push({
                    id: nuevoId,
                    fecha: obtenerFechaTexto(),
                    sedeOrigen: sedeActual.id,
                    destino: destino,
                    detalles: carritoActual.slice(),
                    sedesParticipantes: [],
                    montoTotal: montoTotal,
                    tiempoMin: 0,
                    estado: "Rechazado"
                });

                msg.style.color = "red";
                msg.textContent = "Pedido " + nuevoId + " rechazado: no hay stock global suficiente de " + prod.nombre + " (disponible: " + stockGlobal + ").";
                cargarPedidos();
                return;
            }
        }

        // 3. si paso todo, rebajamos el stock empezando por nuestra sede
        let sedesUsadas = [];
        for (let i = 0; i < carritoActual.length; i++) {
            let item = carritoActual[i];
            let prod = buscarProductoMock(item.codigo);
            let faltante = item.cantidad;
            let orden = [sedeActual.id, "SJ", "ALA", "LIB", "LIM"];

            for (let s = 0; s < orden.length && faltante > 0; s++) {
                let idSede = orden[s];
                if (prod.stock[idSede] > 0) {
                    let tomar = Math.min(prod.stock[idSede], faltante);
                    prod.stock[idSede] -= tomar;
                    faltante -= tomar;
                    if (sedesUsadas.indexOf(idSede) === -1) {
                        sedesUsadas.push(idSede);
                    }
                }
            }
        }

        pedidosMock.push({
            id: nuevoId,
            fecha: obtenerFechaTexto(),
            sedeOrigen: sedeActual.id,
            destino: destino,
            detalles: carritoActual.slice(),
            sedesParticipantes: sedesUsadas,
            montoTotal: montoTotal,
            tiempoMin: 0,
            estado: "Pendiente"
        });

        carritoActual = [];
        mostrarCarrito();
        cargarCatalogo();
        cargarInventarioLocal();
        cargarPedidos();

        msg.style.color = "green";
        msg.textContent = "Pedido " + nuevoId + " confirmado hacia " + destino + " (sedes: " + sedesUsadas.join(", ") + ").";
    } else {
        // TODO: llamar a POST /api/pedidos/crear
    }
}

// arma un texto cortito con los productos de un pedido
function resumirProductos(detalles) {
    if (!detalles || detalles.length === 0) return "-";

    let texto = "";
    for (let i = 0; i < detalles.length; i++) {
        if (i > 0) texto += ", ";
        texto += detalles[i].cantidad + "x " + detalles[i].nombre;
    }
    return texto;
}

// llena las tablas de pedidos pendientes e historial (consultas #2 y #3)
function cargarPedidos() {
    let tbodyPend = document.getElementById("tbody-pendientes");
    let tbodyHist = document.getElementById("tbody-historial");
    tbodyPend.innerHTML = "";
    tbodyHist.innerHTML = "";

    if (USE_MOCK) {
        let cantPend = 0;
        let cantHist = 0;

        for (let i = 0; i < pedidosMock.length; i++) {
            let p = pedidosMock[i];

            // mostramos solo los pedidos registrados en la sede actual
            if (p.sedeOrigen !== sedeActual.id) {
                continue;
            }

            if (p.estado === "Pendiente") {
                tbodyPend.innerHTML +=
                    "<tr>" +
                    "<td>" + p.id + "</td>" +
                    "<td>" + p.fecha + "</td>" +
                    "<td>" + p.destino + "</td>" +
                    "<td>" + resumirProductos(p.detalles) + "</td>" +
                    "<td>₡" + p.montoTotal + "</td>" +
                    "<td>" + p.estado + "</td>" +
                    "</tr>";
                cantPend++;
            }

            let sedesTxt = p.sedesParticipantes.length > 0 ? p.sedesParticipantes.join(", ") : "-";
            let tiempoTxt = p.tiempoMin > 0 ? p.tiempoMin + " min" : "-";

            tbodyHist.innerHTML +=
                "<tr>" +
                "<td>" + p.id + "</td>" +
                "<td>" + p.fecha + "</td>" +
                "<td>" + p.destino + "</td>" +
                "<td>" + sedesTxt + "</td>" +
                "<td>₡" + p.montoTotal + "</td>" +
                "<td>" + tiempoTxt + "</td>" +
                "<td>" + p.estado + "</td>" +
                "</tr>";
            cantHist++;
        }

        if (cantPend === 0) {
            tbodyPend.innerHTML = '<tr><td colspan="6" class="vacio">No hay pedidos pendientes en esta sede.</td></tr>';
        }
        if (cantHist === 0) {
            tbodyHist.innerHTML = '<tr><td colspan="7" class="vacio">Todavía no hay pedidos registrados en esta sede.</td></tr>';
        }
    } else {
        // TODO: conectar con GET /api/pedidos/pendientes y GET /api/pedidos/historial
    }
}

// simula el siguiente paso de entrega con Dijkstra (operacion #3)
function calcularSiguienteEntrega() {
    let msg = document.getElementById("msg-ruta");

    if (USE_MOCK) {
        // buscamos el primer pedido pendiente de esta sede para simular la entrega
        let destinoSiguiente = null;
        for (let i = 0; i < pedidosMock.length; i++) {
            if (pedidosMock[i].sedeOrigen === sedeActual.id && pedidosMock[i].estado === "Pendiente") {
                destinoSiguiente = pedidosMock[i].destino;
                break;
            }
        }

        if (destinoSiguiente === null) {
            msg.style.color = "#444";
            msg.textContent = "No hay entregas pendientes en esta sede.";
            return;
        }

        // tiempo simulado (cuando conectemos el backend viene del Dijkstra de Evan)
        let tiempoTramo = (destinoSiguiente === sedeActual.ubicacionVehiculo) ? 5 : 25;
        let origen = sedeActual.ubicacionVehiculo;
        sedeActual.ubicacionVehiculo = destinoSiguiente;
        sedeActual.tiempoAcumulado += tiempoTramo;

        // entregamos todos los pedidos pendientes que iban para el mismo destino en 1 visita
        let idsEntregados = [];
        for (let i = 0; i < pedidosMock.length; i++) {
            let p = pedidosMock[i];
            if (p.sedeOrigen === sedeActual.id && p.estado === "Pendiente" && p.destino === destinoSiguiente) {
                p.estado = "Entregado";
                p.tiempoMin = sedeActual.tiempoAcumulado;
                idsEntregados.push(p.id);

                // al entregar el pedido tambien queda registrada la venta
                ventasMock.push({
                    idVenta: "VTA-00" + contadorVentas,
                    idPedido: p.id,
                    sedeId: sedeActual.id,
                    fecha: obtenerFechaTexto(),
                    detalles: p.detalles,
                    montoTotal: p.montoTotal
                });
                contadorVentas++;
            }
        }

        msg.style.color = "green";
        msg.textContent =
            "Ruta (Mock): " + origen + " -> " + destinoSiguiente +
            " | Tramo: " + tiempoTramo + " min" +
            " | Acumulado: " + sedeActual.tiempoAcumulado + " min" +
            " | Entregados: " + idsEntregados.join(", ");

        actualizarHeaderSede();
        cargarPedidos();
        cargarEstadisticas();
    } else {
        // TODO: llamar a POST /api/entregas/siguiente
    }
}

// reinicia el vehiculo a la sede para la salida de las 11am o 3pm
function nuevaSalida() {
    let msg = document.getElementById("msg-ruta");

    if (USE_MOCK) {
        sedeActual.ubicacionVehiculo = sedeActual.nombre;
        sedeActual.tiempoAcumulado = 0;
        actualizarHeaderSede();

        msg.style.color = "#1d3557";
        msg.textContent = "Nueva salida iniciada desde " + sedeActual.nombre + " (tiempo reiniciado a 0 min).";
    } else {
        // TODO: llamar a POST /api/entregas/nueva-salida
    }
}

function obtenerFechaTexto() {
    let hoy = new Date();
    return hoy.toISOString().slice(0, 10) + " " + hoy.toTimeString().slice(0, 5);
}

// suma nuevas unidades al inventario local (y luego al backend / RabbitMQ)
function agregarStockLocal() {
    let codigo = document.getElementById("prod-stock").value;
    let cantidad = parseInt(document.getElementById("cant-stock").value, 10);
    let msg = document.getElementById("msg-stock");

    // validar que no metan numeros raros o negativos
    if (isNaN(cantidad) || cantidad <= 0) {
        msg.style.color = "red";
        msg.textContent = "Ingrese una cantidad mayor a 0.";
        return;
    }

    if (USE_MOCK) {
        for (let i = 0; i < productosMock.length; i++) {
            if (productosMock[i].codigo === codigo) {
                productosMock[i].stock[sedeActual.id] += cantidad;
                break;
            }
        }

        msg.style.color = "green";
        msg.textContent = "Se agregaron " + cantidad + " unidades de " + codigo + " en " + sedeActual.nombre + ".";

        // refrescamos ambas tablas para que se vea el cambio
        cargarInventarioLocal();
        cargarCatalogo();
    } else {
        // TODO: llamar a POST /api/inventario/agregar con { codigo, cantidadAgregar }
    }
}

// llena la pestaña de ventas, producto estrella y peores pedidos (consultas #1, #6 y #7)
function cargarEstadisticas() {
    let estrellaP = document.getElementById("estrella-info");
    let tbodyPeores = document.getElementById("tbody-peores");
    let tbodyVentas = document.getElementById("tbody-ventas");
    tbodyPeores.innerHTML = "";
    tbodyVentas.innerHTML = "";

    if (USE_MOCK) {
        // 1. filtrar ventas de la sede actual
        let ventasSede = [];
        for (let i = 0; i < ventasMock.length; i++) {
            if (ventasMock[i].sedeId === sedeActual.id) {
                ventasSede.push(ventasMock[i]);
            }
        }

        // 2. calcular producto estrella en mock (en el backend lo hace StatsService / OrdenamientoPropio)
        let mejorProd = null;
        let mejorIngreso = 0;

        for (let c = 0; c < productosMock.length; c++) {
            let prod = productosMock[c];
            let unidades = 0;

            for (let v = 0; v < ventasSede.length; v++) {
                let dets = ventasSede[v].detalles;
                for (let d = 0; d < dets.length; d++) {
                    if (dets[d].codigo === prod.codigo) {
                        unidades += dets[d].cantidad;
                    }
                }
            }

            let ingresos = unidades * prod.precio;
            if (ingresos > mejorIngreso) {
                mejorIngreso = ingresos;
                mejorProd = {
                    codigo: prod.codigo,
                    nombre: prod.nombre,
                    unidades: unidades,
                    ingresos: ingresos
                };
            }
        }

        if (mejorProd !== null) {
            estrellaP.textContent =
                mejorProd.codigo + " - " + mejorProd.nombre +
                " | Unidades vendidas: " + mejorProd.unidades +
                " | Ingresos totales: ₡" + mejorProd.ingresos;
        } else {
            estrellaP.textContent = "Sin ventas registradas todavía en esta sede.";
        }

        // 3. sacar pedidos entregados con tiempo > 0 para peores pedidos
        let entregados = [];
        for (let i = 0; i < pedidosMock.length; i++) {
            let p = pedidosMock[i];
            if (p.sedeOrigen === sedeActual.id && p.estado === "Entregado" && p.tiempoMin > 0) {
                entregados.push(p);
            }
        }

        // ordenamiento sencillo solo para la vista mock (en C# corre nuestro MergeSort)
        for (let i = 0; i < entregados.length; i++) {
            for (let j = 0; j < entregados.length - 1 - i; j++) {
                let r1 = entregados[j].montoTotal / entregados[j].tiempoMin;
                let r2 = entregados[j + 1].montoTotal / entregados[j + 1].tiempoMin;
                if (r1 > r2) {
                    let aux = entregados[j];
                    entregados[j] = entregados[j + 1];
                    entregados[j + 1] = aux;
                }
            }
        }

        if (entregados.length === 0) {
            tbodyPeores.innerHTML = '<tr><td colspan="6" class="vacio">No hay pedidos entregados todavía para calcular rendimiento.</td></tr>';
        } else {
            for (let i = 0; i < entregados.length; i++) {
                let p = entregados[i];
                let rend = (p.montoTotal / p.tiempoMin).toFixed(2);
                tbodyPeores.innerHTML +=
                    "<tr>" +
                    "<td>" + (i + 1) + "</td>" +
                    "<td>" + p.id + "</td>" +
                    "<td>" + p.destino + "</td>" +
                    "<td>₡" + p.montoTotal + "</td>" +
                    "<td>" + p.tiempoMin + " min</td>" +
                    "<td><strong>₡" + rend + "/min</strong></td>" +
                    "</tr>";
            }
        }

        // 4. pintar historial de ventas
        if (ventasSede.length === 0) {
            tbodyVentas.innerHTML = '<tr><td colspan="5" class="vacio">No hay ventas registradas todavía en esta sede.</td></tr>';
        } else {
            for (let i = 0; i < ventasSede.length; i++) {
                let v = ventasSede[i];
                tbodyVentas.innerHTML +=
                    "<tr>" +
                    "<td>" + v.idVenta + "</td>" +
                    "<td>" + v.idPedido + "</td>" +
                    "<td>" + v.fecha + "</td>" +
                    "<td>" + resumirProductos(v.detalles) + "</td>" +
                    "<td><strong>₡" + v.montoTotal + "</strong></td>" +
                    "</tr>";
            }
        }
    } else {
        // TODO: conectar con GET /api/ventas/estadisticas
    }
}

// se corre apenas carga la pagina
window.onload = function () {
    if (!USE_MOCK) {
        document.getElementById("zona-mock").style.display = "none";
    }

    actualizarHeaderSede();
    llenarSelectsProductos();
    llenarSelectDestinos();
    cargarCatalogo();
    cargarInventarioLocal();
    cargarPedidos();
    cargarEstadisticas();
};
