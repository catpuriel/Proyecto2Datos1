// mientras no este listo el backend usamos datos de prueba
const USE_MOCK = true;

// algunos productos de prueba basados en los json de Jordanny
const productosMock = [
    { codigo: "AA01", nombre: "Agua Mineral Chirripó 700ml", precio: 700, sj: 30, ala: 24, lib: 40, lim: 30 },
    { codigo: "AA02", nombre: "Petsi 2.5l", precio: 1000, sj: 34, ala: 2, lib: 0, lim: 0 },
    { codigo: "AA03", nombre: "Pastel de chocolate Moussemani", precio: 8500, sj: 7, ala: 0, lib: 0, lim: 0 },
    { codigo: "AA04", nombre: "Café 1620 premium 500g", precio: 6000, sj: 15, ala: 0, lib: 0, lim: 0 },
    { codigo: "AA08", nombre: "Yogurt Tres Pinos Mango 1l", precio: 700, sj: 0, ala: 30, lib: 0, lim: 0 },
    { codigo: "AA14", nombre: "Pan MiBimbo Extra Grande", precio: 2500, sj: 0, ala: 0, lib: 0, lim: 36 },
    { codigo: "AA19", nombre: "Tomahawk TonyHawk 1kg", precio: 8700, sj: 0, ala: 0, lib: 37, lim: 0 }
];

// cambia la pestaña que se ve en pantalla
function verTab(idTab) {
    let tabs = document.getElementsByClassName("tab");

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.add("oculto");
    }

    document.getElementById(idTab).classList.remove("oculto");
}

// llena la tabla del catalogo global
function cargarCatalogo() {
    let tbody = document.getElementById("tbody-catalogo");
    tbody.innerHTML = "";

    if (USE_MOCK) {
        for (let i = 0; i < productosMock.length; i++) {
            let p = productosMock[i];
            tbody.innerHTML +=
                "<tr>" +
                "<td>" + p.codigo + "</td>" +
                "<td>" + p.nombre + "</td>" +
                "<td>₡" + p.precio + "</td>" +
                "<td>" + p.sj + "</td>" +
                "<td>" + p.ala + "</td>" +
                "<td>" + p.lib + "</td>" +
                "<td>" + p.lim + "</td>" +
                "</tr>";
        }
    } else {
        // TODO: conectar con GET /api/catalogo/global cuando este el API
    }
}

// se corre apenas carga la pagina
window.onload = function () {
    cargarCatalogo();
};
