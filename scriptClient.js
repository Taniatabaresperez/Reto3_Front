function datosCliente() {
    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Client/all",
        type: 'GET',

        success: function (response) {
            mostrarTabla(response);
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function datoEspCliente(idDato) {
    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Client/" + idDato,
        type: 'GET',
        success: function (response) {

            $("#idClient").val(response.idClient);
            $("#idClient").attr("readonly", true);
            $("#email").val(response.email);
            $("#email").attr("disabled", true);
            $("#password").val(response.password);
            $("#name").val(response.name);
            $("#age").val(response.age);
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function crearC() {

    let datos = {
        email: $("#email").val(),
        password: $("#password").val(),
        name: $("#name").val(),
        age: $("#age").val()
    }
    if ($("#email").val() == "" || $("#password").val() == "" || $("#name").val() == "" || $("#age").val() == "") {
        alert("Todos los campos son obligatorios")
    } else if ($("#password").val().length > 45) {
        alert("La contraseña debe ser un texto de máximo 45 caracteres");
    } else if ($("#name").val().length > 250) {
        alert("El nombre debe ser un texto de máximo 250 caracteres");
    } else {
        $.ajax({
            dataType: 'JSON',
            data: JSON.stringify(datos),
            url: "http://129.151.123.97:8080/api/Client/save",
            contentType: "application/JSON; charset=utf-8",
            type: 'POST',

            statusCode: {
                201: function () {
                    alert("Los datos se guardaron correctamente");
                    $("#datos2").empty();
                    $("#idClient").attr("readonly", false);
                    limpiarCampos();
                    datosCliente();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se guardaron correctamente");
            }
        });
    }
}

function actualizarCliente() {
    let datos = {
        idClient: Number.parseInt($("#idClient").val()),
        //email: $("#email").val(),
        password: $("#password").val(),
        name: $("#name").val(),
        age: Number.parseInt($("#age").val())
    }
    if ($("#password").val().length > 45) {
        alert("La contraseña debe ser un texto de máximo 45 caracteres");
    } else if ($("#name").val().length > 250) {
        alert("El nombre debe ser un texto de máximo 250 caracteres");
    } else {
        $.ajax({
            dataType: 'JSON',
            url: "http://129.151.123.97:8080/api/Client/update",
            data: JSON.stringify(datos),
            contentType: "application/json",
            type: 'PUT',

            statusCode: {
                201: function () {
                    alert("Los datos se modificaron correctamente");
                    $("#datos2").empty();
                    $("#idClient").attr("readonly", false);
                    $("#email").attr("disabled", false);
                    limpiarCampos();
                    datosCliente();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se modificaron correctamente");
            }
        });
    }
}
async function validarRelacion(idCliente) {
    const client = await $.ajax({
        url: "http://129.151.123.97:8080/api/Client/" + idCliente,
        type: "GET",
        dataType: "JSON"
    });
    if (client.messages.length === 0 && client.reservations.length === 0) {
        borrarCliente(idCliente);
    } else {
        alert("No se puede borrar un cliente que tenga un mensaje o una reservación")
    }
}

function borrarCliente(idCliente) {
    let dataToSend = JSON.stringify(idCliente);
    $.ajax({
        dataType: 'JSON',
        data: dataToSend,
        url: "http://129.151.123.97:8080/api/Client/" + idCliente,
        type: 'DELETE',
        contentType: 'application/JSON',

        statusCode: {

            204: function () {
                alert("Dato eliminado correctamente");
                $("#datos2").empty();
                datosCliente();
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            alert("El dato no se pudo eliminar correctamente");
        }

    });
}

function limpiarCampos() {
    $("#idClient").val("");
    $("#email").val("");
    $("#password").val("");
    $("#name").val("");
    $("#age").val("");
}

function mostrarTabla(misDatos) {

    let tabla = "<table class='ui center aligned celled table'>" + 
    "<thead><tr><th>Email</th><th>Nombre</th><th>Edad</th><th>Mensaje</th><th>Reservacion</th><th colspan='3'></th></tr></thead>";
    for (i = 0; i < misDatos.length; i++) {
        tabla += "<tr>";
        tabla += "<td>" + misDatos[i].email + "</td>";
        tabla += "<td>" + misDatos[i].name + "</td>";
        tabla += "<td>" + misDatos[i].age + "</td>";
        let seleccionar = "<select>";
        for (let j = 0; j < misDatos[i].messages.length; j++) {
            const element = misDatos[i].messages[j];
            seleccionar += `<option value="${element.idMessage}"> ${element.messageText} </option>`;

        }
        seleccionar += "</select>"
        tabla += `<td>${seleccionar}</td>`

        let selecciona = "<select>";
        for (let j = 0; j < misDatos[i].reservations.length; j++) {
            const element = misDatos[i].reservations[j];
            selecciona += `<option value="${element.idReservation}"> ${element.idReservation} </option>`;
        }
        selecciona += "</select>"
        tabla += `<td>${selecciona}</td>`

        tabla += "<td> </td>"
        tabla += "<td> <button class='ui yellow button' onclick='validarRelacion(" + misDatos[i].idClient + ")'>Borrar</button>";
        tabla += "<td> <button class='ui red button' onclick='datoEspCliente(" + misDatos[i].idClient + ")'>Cargar dato</button>";
        tabla += "</tr>";
    }
    tabla += "</table>";
    $("#datos2").html(tabla);
}
