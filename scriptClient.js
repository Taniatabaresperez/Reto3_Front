function datosCliente() {
    $.ajax({
        dataType: 'JSON',
        url: "http://localhost:8080/api/Client/all",
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
        url: "http://localhost:8080/api/Client/" + idDato,
        type: 'GET',
        success: function (response) {

            $("#idClient").val(response.idClient);
            $("#idClient").attr("readonly", true);
            $("#email").val(response.email);
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

    $.ajax({
        dataType: 'JSON',
        data: JSON.stringify(datos),
        url: "http://localhost:8080/api/Client/save",
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

function actualizarCliente() {
    let datos = {
        idClient: Number.parseInt($("#idClient").val()),
        email: $("#email").val(),
        password: $("#password").val(),
        name: $("#name").val(),
        age: Number.parseInt($("#age").val())
    }

    $.ajax({
        dataType: 'JSON',
        url: "http://localhost:8080/api/Client/update",
        data: JSON.stringify(datos),
        contentType: "application/json",
        type: 'PUT',

        statusCode: {
            201: function () {
                alert("Los datos se modificaron correctamente");
                $("#datos2").empty();
                $("#idClient").attr("readonly", false);
                limpiarCampos();
                datosCliente();
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            alert("Los datos no se modificaron correctamente");
        }
    });
}

function borrarCliente(idCliente) {
    let dataToSend = JSON.stringify(idCliente);
    console.log(dataToSend)
    $.ajax({
        dataType: 'JSON',
        data: dataToSend,
        url: "http://localhost:8080/api/Client/" + idCliente,
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

    let tabla = "<table>";
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
            selecciona += `<option value="${element.idReservation}"> ${element.startDate} </option>`;
        }
        selecciona += "</select>"
        tabla += `<td>${selecciona}</td>`

        tabla += "<td> </td>"
        tabla += '<td><button onclick="borrarCliente(' + misDatos[i].idClient + ')">Borrar</button></td>';
        tabla += '<td><button onclick="datoEspCliente(' + misDatos[i].idClient + ')">Cargar dato</button></td>';
        tabla += "</tr>";
    }
    tabla += "</table>";
    $("#datos2").html(tabla);
}

$(document).ready(function(){
    datosCliente();
})