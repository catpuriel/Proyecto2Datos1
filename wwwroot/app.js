// en false usa el backend real en C# (cambiar a true si se quiere probar solo el html sin prender dotnet)
const USE_MOCK = false;

// copia en memoria del catalogo que llega del API (para llenar selects)
let catalogoActual = [];

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

// pide al backend la info de la sede actual (GET /api/sede/info)
async function cargarInfoSede() {
    if (USE_MOCK) {
        actualizarHeaderSede();
        return;
    }

    try {
        let resp = await fetch("/api/sede/info");
        if (!resp.ok) {
            return;
        }

        let data = await resp.json();
        sedeActual.id = data.id || sedeActual.id;
        sedeActual.nombre = data.nombre || data.sede || sedeActual.nombre;
        sedeActual.ubicacionVehiculo = data.ubicacionActualVehiculo || data.ubicacionActual || sedeActual.nombre;
        sedeActual.tiempoAcumulado = data.tiempoAcumuladoRecorrido || data.tiempoTotalMin || 0;

        actualizarHeaderSede();
    } catch (err) {
        console.log("No se pudo cargar /api/sede/info:", err);
    }
}

// helper para sacar el stock de una sede sin importar si viene como objeto o arreglo de ExistenciaSede
function obtenerStockDeSede(prod, idSede) {
    if (prod.stock && prod.stock[idSede] !== undefined) {
        return prod.stock[idSede];
    }

    let listaSedes = prod.existenciasPorSede || prod.stockGlobal || prod.stockPorSede;
    if (listaSedes && listaSedes.length > 0) {
        for (let i = 0; i < listaSedes.length; i++) {
            if (listaSedes[i].idSede === idSede) {
                return listaSedes[i].cantidad || 0;
            }
        }
    }

    return 0;
}

// llena la tabla del catalogo global (consulta #5 - GET /api/catalogo/global)
async function cargarCatalogo() {
    let tbody = document.getElementById("tbody-catalogo");
    let filtro = document.getElementById("buscar-catalogo").value.toLowerCase();
    tbody.innerHTML = "";

    let lista = productosMock;

    if (!USE_MOCK) {
        try {
            let resp = await fetch("/api/catalogo/global");
            if (!resp.ok) {
                tbody.innerHTML = '<tr><td colspan="9" class="vacio">Error al cargar el catálogo global desde el servidor.</td></tr>';
                return;
            }
            lista = await resp.json();
            catalogoActual = lista;
            llenarSelectsProductos();
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="9" class="vacio">No se pudo conectar con /api/catalogo/global.</td></tr>';
            return;
        }
    }

    let contador = 0;

    for (let i = 0; i < lista.length; i++) {
        let p = lista[i];
        let codigo = p.codigo || "";
        let nombre = p.nombre || "";
        let categoria = p.categoria || "-";
        let precio = p.precioVenta !== undefined ? p.precioVenta : (p.precio || 0);

        // si el usuario escribio algo, filtramos por codigo o nombre
        if (filtro !== "") {
            let enCodigo = codigo.toLowerCase().indexOf(filtro) !== -1;
            let enNombre = nombre.toLowerCase().indexOf(filtro) !== -1;
            if (!enCodigo && !enNombre) {
                continue;
            }
        }

        let sj = obtenerStockDeSede(p, "SJ") || obtenerStockDeSede(p, "SAN");
        let ala = obtenerStockDeSede(p, "ALA");
        let lib = obtenerStockDeSede(p, "LIB");
        let lim = obtenerStockDeSede(p, "LIM");
        let total = sj + ala + lib + lim;

        tbody.innerHTML +=
            "<tr>" +
            "<td>" + codigo + "</td>" +
            "<td>" + nombre + "</td>" +
            "<td>" + categoria + "</td>" +
            "<td>₡" + precio + "</td>" +
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
}

// llena la tabla de inventario local de la sede actual (consulta #4 - GET /api/inventario/local)
async function cargarInventarioLocal() {
    let tbody = document.getElementById("tbody-inventario");
    tbody.innerHTML = "";

    let listaLocal = [];

    if (USE_MOCK) {
        for (let i = 0; i < productosMock.length; i++) {
            let p = productosMock[i];
            let cantLocal = p.stock[sedeActual.id] || 0;
            if (cantLocal > 0) {
                listaLocal.push({
                    codigo: p.codigo,
                    nombre: p.nombre,
                    descripcion: p.descripcion,
                    categoria: p.categoria,
                    precio: p.precio,
                    cantidadLocal: cantLocal
                });
            }
        }
    } else {
        try {
            let resp = await fetch("/api/inventario/local");
            if (!resp.ok) {
                tbody.innerHTML = '<tr><td colspan="6" class="vacio">Error al cargar el inventario local.</td></tr>';
                return;
            }
            listaLocal = await resp.json();
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="6" class="vacio">No se pudo conectar con /api/inventario/local.</td></tr>';
            return;
        }
    }

    if (!listaLocal || listaLocal.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="vacio">No hay productos en el inventario local de esta sede.</td></tr>';
        return;
    }

    for (let i = 0; i < listaLocal.length; i++) {
        let p = listaLocal[i];
        // soporta tanto Producto completo como ExistenciaSede sencilla
        let codigo = p.codigo || p.producto || "-";
        let nombre = p.nombre || codigo;
        let descripcion = p.descripcion || "-";
        let categoria = p.categoria || "-";
        let precio = p.precioVenta !== undefined ? p.precioVenta : (p.precio !== undefined ? p.precio : 0);
        let cantidad = p.cantidadLocal !== undefined ? p.cantidadLocal : (p.cantidad || 0);

        tbody.innerHTML +=
            "<tr>" +
            "<td>" + codigo + "</td>" +
            "<td>" + nombre + "</td>" +
            "<td>" + descripcion + "</td>" +
            "<td>" + categoria + "</td>" +
            "<td>₡" + precio + "</td>" +
            "<td><strong>" + cantidad + "</strong></td>" +
            "</tr>";
    }
}

// llena los selects de productos (para agregar stock y para hacer pedidos)
function llenarSelectsProductos() {
    let selectStock = document.getElementById("prod-stock");
    let selectPedido = document.getElementById("prod-pedido");
    selectStock.innerHTML = "";
    selectPedido.innerHTML = "";

    let fuente = (USE_MOCK || catalogoActual.length === 0) ? productosMock : catalogoActual;

    for (let i = 0; i < fuente.length; i++) {
        let p = fuente[i];
        let precio = p.precioVenta !== undefined ? p.precioVenta : (p.precio || 0);
        let texto = p.codigo + " - " + p.nombre + " (₡" + precio + ")";

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

// busca un producto por codigo en el catalogo cargado (real o mock)
function buscarProductoMock(codigo) {
    let fuente = (USE_MOCK || catalogoActual.length === 0) ? productosMock : catalogoActual;
    for (let i = 0; i < fuente.length; i++) {
        if (fuente[i].codigo === codigo) {
            return fuente[i];
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
            precioUnitario: prod.precioVenta !== undefined ? prod.precioVenta : (prod.precio || 0)
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
        let etiqueta = detalles[i].nombre || detalles[i].codigoProducto || detalles[i].codigo || "Producto";
        texto += detalles[i].cantidad + "x " + etiqueta;
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

// suma nuevas unidades al inventario local (POST /api/inventario/agregar)
async function agregarStockLocal() {
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
        try {
            let resp = await fetch("/api/inventario/agregar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigo: codigo,
                    cantidadAgregar: cantidad,
                    cantidad: cantidad
                })
            });

            if (resp.ok) {
                msg.style.color = "green";
                msg.textContent = "Se agregaron " + cantidad + " unidades de " + codigo + " correctamente.";
                cargarInventarioLocal();
                cargarCatalogo();
            } else {
                let errTexto = await resp.text();
                msg.style.color = "red";
                msg.textContent = "Error al agregar stock: " + (errTexto || resp.status);
            }
        } catch (err) {
            msg.style.color = "red";
            msg.textContent = "No se pudo conectar con /api/inventario/agregar.";
        }
    }
}

// llena la pestaña de ventas, producto estrella y peores pedidos (GET /api/ventas/estadisticas)
async function cargarEstadisticas() {
    let estrellaP = document.getElementById("estrella-info");
    let tbodyPeores = document.getElementById("tbody-peores");
    let tbodyVentas = document.getElementById("tbody-ventas");
    tbodyPeores.innerHTML = "";
    tbodyVentas.innerHTML = "";

    let ventasSede = [];
    let mejorProd = null;
    let peores = [];

    if (USE_MOCK) {
        // 1. filtrar ventas de la sede actual
        for (let i = 0; i < ventasMock.length; i++) {
            if (ventasMock[i].sedeId === sedeActual.id) {
                ventasSede.push(ventasMock[i]);
            }
        }

        // 2. calcular producto estrella en mock (en el backend lo hace StatsService / OrdenamientoPropio)
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
                    codigoProducto: prod.codigo,
                    nombre: prod.nombre,
                    unidadesVendidas: unidades,
                    ingresosTotales: ingresos
                };
            }
        }

        // 3. sacar pedidos entregados con tiempo > 0 para peores pedidos
        for (let i = 0; i < pedidosMock.length; i++) {
            let p = pedidosMock[i];
            if (p.sedeOrigen === sedeActual.id && p.estado === "Entregado" && p.tiempoMin > 0) {
                peores.push({
                    idPedido: p.id,
                    destino: p.destino,
                    montoTotal: p.montoTotal,
                    tiempoTrasladoMinutos: p.tiempoMin
                });
            }
        }

        // ordenamiento sencillo solo para la vista mock (en C# corre nuestro MergeSort)
        for (let i = 0; i < peores.length; i++) {
            for (let j = 0; j < peores.length - 1 - i; j++) {
                let r1 = peores[j].montoTotal / peores[j].tiempoTrasladoMinutos;
                let r2 = peores[j + 1].montoTotal / peores[j + 1].tiempoTrasladoMinutos;
                if (r1 > r2) {
                    let aux = peores[j];
                    peores[j] = peores[j + 1];
                    peores[j + 1] = aux;
                }
            }
        }
    } else {
        try {
            let resp = await fetch("/api/ventas/estadisticas");
            if (!resp.ok) {
                estrellaP.textContent = "Error al cargar estadísticas desde el servidor.";
                tbodyPeores.innerHTML = '<tr><td colspan="6" class="vacio">Error al cargar peores pedidos.</td></tr>';
                tbodyVentas.innerHTML = '<tr><td colspan="5" class="vacio">Error al cargar historial de ventas.</td></tr>';
                return;
            }

            let data = await resp.json();
            ventasSede = data.historialVentas || data.ventas || [];
            mejorProd = data.productoEstrella || null;
            peores = data.peoresPedidos || [];
        } catch (err) {
            estrellaP.textContent = "No se pudo conectar con /api/ventas/estadisticas.";
            tbodyPeores.innerHTML = '<tr><td colspan="6" class="vacio">No se pudo conectar con el servidor.</td></tr>';
            tbodyVentas.innerHTML = '<tr><td colspan="5" class="vacio">No se pudo conectar con el servidor.</td></tr>';
            return;
        }
    }

    // pintar producto estrella
    if (mejorProd !== null) {
        let cod = mejorProd.codigoProducto || mejorProd.codigo || "";
        let nom = mejorProd.nombre ? " - " + mejorProd.nombre : "";
        let uds = mejorProd.unidadesVendidas !== undefined ? mejorProd.unidadesVendidas : (mejorProd.unidades || 0);
        let ing = mejorProd.ingresosTotales !== undefined ? mejorProd.ingresosTotales : (mejorProd.ingresos || 0);

        estrellaP.textContent = cod + nom + " | Unidades vendidas: " + uds + " | Ingresos totales: ₡" + ing;
    } else {
        estrellaP.textContent = "Sin ventas registradas todavía en esta sede.";
    }

    // pintar peores pedidos
    if (peores.length === 0) {
        tbodyPeores.innerHTML = '<tr><td colspan="6" class="vacio">No hay pedidos entregados todavía para calcular rendimiento.</td></tr>';
    } else {
        for (let i = 0; i < peores.length; i++) {
            let p = peores[i];
            let idPed = p.idPedido || p.id || "-";
            let monto = p.montoTotal || 0;
            let tiempo = p.tiempoTrasladoMinutos || p.tiempoMin || 0;
            let rend = tiempo > 0 ? (monto / tiempo).toFixed(2) : "0.00";

            tbodyPeores.innerHTML +=
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + idPed + "</td>" +
                "<td>" + (p.destino || "-") + "</td>" +
                "<td>₡" + monto + "</td>" +
                "<td>" + tiempo + " min</td>" +
                "<td><strong>₡" + rend + "/min</strong></td>" +
                "</tr>";
        }
    }

    // pintar historial de ventas
    if (ventasSede.length === 0) {
        tbodyVentas.innerHTML = '<tr><td colspan="5" class="vacio">No hay ventas registradas todavía en esta sede.</td></tr>';
    } else {
        for (let i = 0; i < ventasSede.length; i++) {
            let v = ventasSede[i];
            let idVenta = v.idVenta || v.id || "-";
            let idPed = v.idPedido || v.pedidoId || "-";
            let fecha = v.fechaTransaccion || v.fecha || "-";
            let detalles = v.detalles || v.productosVendidos || [];

            tbodyVentas.innerHTML +=
                "<tr>" +
                "<td>" + idVenta + "</td>" +
                "<td>" + idPed + "</td>" +
                "<td>" + fecha + "</td>" +
                "<td>" + resumirProductos(detalles) + "</td>" +
                "<td><strong>₡" + (v.montoTotal || 0) + "</strong></td>" +
                "</tr>";
        }
    }
}

// se corre apenas carga la pagina
window.onload = function () {
    if (!USE_MOCK) {
        document.getElementById("zona-mock").style.display = "none";
    }

    cargarInfoSede();
    llenarSelectsProductos();
    llenarSelectDestinos();
    cargarCatalogo();
    cargarInventarioLocal();
    cargarPedidos();
    cargarEstadisticas();
};
