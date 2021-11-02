function datosReservacion() {

    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Reservation/all",
        type: 'GET',

        success: function (response) {
            mostrarTabla(response);
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function datoEspReservacion(idDato) {

    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Reservation/" + idDato,
        type: 'GET',
        success: function (response) {

            $("#idReservation").val(response.idReservation);
            $("#idReservation").attr("readonly", true);
            $("#startDate").val(response.startDate.split("T")[0]);
            $("#devolutionDate").val(response.devolutionDate.split("T")[0]);
            $("#doctor").empty();
            $("#doctor").append(`<option value = '${response.doctor.id}'> ${response.doctor.name}</option>`);
            $("#client").empty();
            $("#client").append(`<option value = '${response.client.idClient}'> ${response.client.name}</option>`);
            $("#status").val(response.status);

        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

async function traerDoctor() {

    let doctor = await $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Doctor/all",
        type: 'GET',

    });
    for (let i = 0; i < doctor.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("class", "select-item");
        option.value = doctor[i].id;
        option.text = doctor[i].name;
        $("#doctor").append(option);
    }
}

async function traerCliente() {

    let client = await $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Client/all",
        type: 'GET',

    });
    for (let i = 0; i < client.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("class", "select-item");
        option.value = client[i].idClient;
        option.text = client[i].name;
        $("#client").append(option);
    }
}

function crearR() {
    let datos = {
        startDate: $("#startDate").val(),
        devolutionDate: $("#devolutionDate").val(),
        doctor: { id: Number.parseInt($("#doctor").val()) },
        client: { idClient: Number.parseInt($("#client").val()) },
        status: $("#status").val(),
    }
    if ($("#startDate").val() == "" || $("#devolutionDate").val() == "" || $("#doctor").val() == "0" || $("#client").val() == "0" || $("#status").val() == "0") {
        alert("Todods los campos son obligatorios");
    } 
    else if (!validarFechas()) {
        alert("La fecha final debe ser mayor a la fecha inicial");
        
    } else {
        $.ajax({
            dataType: 'JSON',
            data: JSON.stringify(datos),
            url: "http://129.151.123.97:8080/api/Reservation/save",
            contentType: "application/json; charset=utf-8",
            type: 'POST',

            statusCode: {
                201: function () {
                    alert("Los datos se guardaron correctamente");
                    $("#datos4").empty();
                    $("#idReservation").attr("readonly", false);
                    limpiarCampos();
                    datosReservacion();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se guardaron correctamente");
            },
        });
    }
}


function actualizarRes() {
    if (validarFechas()) {
        alert("La fecha final debe ser mayor a la fecha inicial");
    } else {
        let datos = {
            idReservation: $("#idReservation").val(),
            startDate: $("#startDate").val(),
            devolutionDate: $("#devolutionDate").val(),
            status: $("#status").val(),
        }

        $.ajax({
            dataType: 'JSON',
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            url: "http://129.151.123.97:8080/api/Reservation/update",
            type: 'PUT',

            statusCode: {
                201: function () {
                    alert("Los datos se modificaron correctamente");
                    $("#datos4").empty();
                    $("#idReservation").attr("readonly", false);
                    limpiarCampos();
                    datosReservacion();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se modificaron correctamente");
            }
        });
    }
}

function borrarReservacion(idRes) {
    let da_to = {
        id: idRes
    };

    $.ajax({
        dataType: 'json',
        data: JSON.stringify(da_to),
        url: "http://129.151.123.97:8080/api/Reservation/" + idRes,
        type: 'DELETE',
        contentType: 'application/json',

        statusCode: {
            204: function () {
                alert("Dato eliminado correctamente");
                $("#datos4").empty();
                datosReservacion();
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            alert("El dato no se pudo eliminar correctamente");
        }

    });
}

function limpiarCampos() {
    $("#idReservation").val("");
    $("#startDate").val("");
    $("#devolutionDate").val("");
    $("#doctor").val("");
    $("#client").val("");
    $("#status").val("");
}

function validarFechas() {
    let fechainicial = $("#startDate").val();
    let fechafinal = $("#devolutionDate").val();
    if (Date.parse(fechafinal) < Date.parse(fechainicial)) {

        return false;
    }
    return true;
}

function mostrarTabla(misDatos) {
    let tabla = "<table>";
    for (i = 0; i < misDatos.length; i++) {
        tabla += "<tr>";
        tabla += "<td>" + misDatos[i].idReservation + "</td>";
        tabla += "<td>" + misDatos[i].startDate.split("T")[0] + "</td>";
        tabla += "<td>" + misDatos[i].devolutionDate.split("T")[0] + "</td>";
        tabla += "<td>" + misDatos[i].doctor.name + "</td>";
        tabla += "<td>" + misDatos[i].client.idClient + "</td>";
        tabla += "<td>" + misDatos[i].client.name + "</td>";
        tabla += "<td>" + misDatos[i].client.email + "</td>";
        tabla += "<td>" + misDatos[i].status + "</td>";
        tabla += '<td><button onclick="borrarReservacion(' + misDatos[i].idReservation + ')">Borrar</button></td>';
        tabla += '<td><button onclick="datoEspReservacion(' + misDatos[i].idReservation + ')">Cargar dato</button></td>';
        tabla += "</tr>";
    }
    tabla += "</table>";
    $("#datos4").html(tabla);

}

$(document).ready(function () {
    traerDoctor();
    traerCliente();
})