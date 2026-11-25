// mientras no este listo el backend usamos datos de prueba
const USE_MOCK = true;

// info de la sede que estamos probando en mock
let sedeActual = {
    id: "SJ",
    nombre: "San José",
    ubicacionVehiculo: "San José"
};

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

    document.getElementById("info-sede").textContent =
        "Sede: " + sedeActual.nombre + " (" + sedeActual.id + ") | Vehículo en: " + sedeActual.ubicacionVehiculo;

    document.getElementById("msg-stock").textContent = "";
    cargarInventarioLocal();
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

// llena el select de productos para agregar stock
function llenarSelectStock() {
    let select = document.getElementById("prod-stock");
    select.innerHTML = "";

    for (let i = 0; i < productosMock.length; i++) {
        let p = productosMock[i];
        let op = document.createElement("option");
        op.value = p.codigo;
        op.textContent = p.codigo + " - " + p.nombre;
        select.appendChild(op);
    }
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

// se corre apenas carga la pagina
window.onload = function () {
    if (!USE_MOCK) {
        document.getElementById("zona-mock").style.display = "none";
    }

    llenarSelectStock();
    cargarCatalogo();
    cargarInventarioLocal();
};
