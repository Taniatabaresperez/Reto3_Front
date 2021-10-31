function datosMensaje() {
    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Message/all",
        type: 'GET',

        success: function (response) {
            mostrarTabla(response);
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function datoEspMen(idDato) {

    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Message/" + idDato,
        type: 'GET',
        success: function (response) {
            console.log(response);

            $("#idMessage").val(response.idMessage);
            $("#idMessage").attr("readonly", true);
            $("#messageText").val(response.messageText);
            $("#doctor").empty();
            $("#doctor").append(`<option value = '${response.doctor.id}'> ${response.doctor.name}</option>`);
            $("#client").empty();
            $("#client").append(`<option value = '${response.client.idClient}'> ${response.client.name}</option>`);

        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

async function traerDoctor() {
    try {
        var doctor = await $.ajax({
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
    } catch (error) {
        console.error("Ocurrió un problema al traer los datos")
    }
}

async function traerCliente() {
    try {
        var client = await $.ajax({
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
    } catch (error) {
        console.error("Ocurrió un problema al traer los datos")
    }
}

function crearMen() {
    if ($("#messageText").val() == "" || $("#doctor").val() == "" || $("#client").val() == "") {
        alert("Todods los campos son obligatorios")
    } else {
        let datos = {
            messageText: $("#messageText").val(),
            doctor: { id: Number.parseInt($("#doctor").val()) },
            client: { idClient: Number.parseInt($("#client").val()) },
        }
        console.log(datos)

        $.ajax({
            dataType: 'json',
            url: "http://129.151.123.97:8080/api/Message/save",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            type: 'POST',

            statusCode: {
                201: function () {
                    alert("Los datos se guardaron correctamente");
                    $("#datos3").empty();
                    $("#idMessage").attr("readonly", false);
                    limpiarCampos();
                    datosMensaje();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se guardaron correctamente");
            }
        });
    }
}

function actualizarMen() {
    let datos = {
        idMessage: Number.parseInt($("#idMessage").val()),
        messageText: $("#messageText").val(),
        client: { idClient: Number.parseInt($("#client").val()) },
        


    }
    console.log(datos);

    $.ajax({
        dataType: 'json',
        data: JSON.stringify(datos),
        contentType: "application/json; charset=utf-8",
        url: "http://129.151.123.97:8080/api/Message/update",
        type: 'PUT',

        statusCode: {
            201: function () {
                alert("Los datos se modificaron correctamente");
                $("#datos3").empty();
                $("#idMessage").attr("readonly", false);
                limpiarCampos();
                datosMensaje();
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            alert("Los datos no se modificaron correctamente");
        }
    });
}

function borrarMen(idMen) {

    $.ajax({
        dataType: 'json',
        data: JSON.stringify(idMen),
        url: "http://129.151.123.97:8080/api/Message/" + idMen,
        type: 'DELETE',
        contentType: 'application/json',

        statusCode: {
            204: function () {
                alert("Dato eliminado correctamente");
                $("#datos3").empty();
                datosMensaje();
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("El dato no se pudo eliminar correctamente");
            }
        }
    });
}

function limpiarCampos() {
    $("#idMessage").val("");
    $("#messageText").val("");
    $("#doctor").val("");
    $("#client").val("");
}

function mostrarTabla(misDatos) {

    let tabla = "<table>";
    for (i = 0; i < misDatos.length; i++) {
        tabla += "<tr>";
        tabla += "<td>" + misDatos[i].messageText + "</td>";
        tabla += "<td>" + misDatos[i].doctor.name + "</td>";
        tabla += "<td>" + misDatos[i].client.name + "</td>";
        tabla += '<td><button onclick="borrarMen(' + misDatos[i].idMessage + ')">Borrar</button></td>';
        tabla += '<td><button onclick="datoEspMen(' + misDatos[i].idMessage + ')">Cargar dato</button></td>';
        tabla += "</tr>";
    }
    tabla += "</table>";
    $("#datos3").html(tabla);
}

$(document).ready(function () {
    traerDoctor();
    traerCliente();
})