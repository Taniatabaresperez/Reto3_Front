function datosDoctor() {
    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Doctor/all",
        type: 'GET',

        success: function (response) {
            mostrarTabla(response);
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function datoEspDoc(idDato) {
    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Doctor/" + idDato,
        type: 'GET',
        success: function (response) {
            console.log(response);

            $("#id").val(response.id);
            $("#id").attr("readonly", true);
            $("#name").val(response.name);
            $("#department").val(response.department);
            $("#department").attr("disabled", true);
            $("#year").val(response.year);
            $("#description").val(response.description);
            $("#specialty").val(response.specialty.id);
            return response;
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

async function traerSpecialty() {
    try {
        var specialty = await $.ajax({
            dataType: 'JSON',
            url: "http://129.151.123.97:8080/api/Specialty/all",
            type: 'GET',

        });
        for (let i = 0; i < specialty.length; i++) {

            let option = document.createElement("option");
            option.setAttribute("class", "select-item");
            option.value = specialty[i].id;
            option.text = specialty[i].name;
            $("#specialty").append(option);
        }
    } catch (error) {
        console.error("Ocurrió un problema al traer los datos")
    }
}

function crearDoctor() {
    let datos = {
        name: $("#name").val(),
        department: $("#department").val(),
        year: Number.parseInt($("#year").val()),
        description: $("#description").val(),
        specialty: { id: Number.parseInt($("#specialty").val()) },
    }

    if ($("#name").val() == "" || $("#department").val() == "" || $("#year").val() == "" || $("#description").val() == "" || $("#specialty").val() == "0") {
        alert("Todos los campos son obligatorios");
    } else if ($("#year").val().length !== 4) {
        alert("El año debe ser un número de 4 dígitos");
    } else if ($("#name").val().length > 45) {
        alert("El nombre debe ser un texto de máximo 45 caracteres");
    } else if ($("#description").val().length > 250) {
        alert("La descripción debe ser un texto de máximo 250 caracteres");
    } else {
        
        $.ajax({
            dataType: 'JSON',
            url: "http://129.151.123.97:8080/api/Doctor/save",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            type: 'POST',

            statusCode: {
                201: function () {
                    alert("Los datos se guardaron correctamente");
                    $("#datos1").empty();
                    $("#id").attr("readonly", false);
                    limpiarCampos();
                    datosDoctor();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se guardaron correctamente");
            }
        });
    }
}

function actualizarDoctores() {
    let datos = {
        id: $("#id").val(),
        name: $("#name").val(),
        //department: $("#department").val(),
        year: Number.parseInt($("#year").val()),
        description: $("#description").val(),
        specialty: { id: Number.parseInt($("#specialty").val()) }
    }
    if ($("#year").val().length !== 4) {
        alert("El año debe ser un número de 4 dígitos");}
    else if ($("#name").val().length > 45) {
        alert("El nombre debe ser un texto de máximo 45 caracteres");
    } else if ($("#description").val().length > 250) {
        alert("La descripción debe ser un texto de máximo 250 caracteres");
    } else {

        let dataToSend = JSON.stringify(datos)
        $.ajax({
            dataType: 'JSON',
            data: dataToSend,
            contentType: "application/json",
            url: "http://129.151.123.97:8080/api/Doctor/update",
            type: 'PUT',

            statusCode: {
                201: function () {
                    alert("Los datos se modificaron correctamente");
                    $("#datos1").empty();
                    $("#id").attr("readonly", false);
                    $("#department").attr("disabled", false);
                    limpiarCampos();
                    datosDoctor();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se modificaron correctamente");
            }

        });
    }
}

async function validarRelacion(idDoctor) {
    const doctor = await $.ajax({
        url: "http://129.151.123.97:8080/api/Doctor/" + idDoctor,
        type: "GET",
        dataType: "JSON"
    });
    if (doctor.messages.length === 0 && doctor.reservations.length === 0) {
        borrarDoc(idDoctor);
    } else {
        alert("No se puede borrar un doctor que tenga un mensaje o una reservación")
    }
}

function borrarDoc(idDoctor) {
    let dataToSend = JSON.stringify(idDoctor);

    $.ajax({
        dataType: 'JSON',
        data: dataToSend,
        url: "http://129.151.123.97:8080/api/Doctor/" + idDoctor,
        type: 'DELETE',
        contentType: 'application/JSON',

        statusCode: {
            204: function () {
                alert("Dato eliminado correctamente");
                $("#datos1").empty();
                datosDoctor();
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            alert("El dato no se pudo eliminar correctamente");
        }

    });
}

function limpiarCampos() {
    $("#id").val("");
    $("#name").val("");
    $("#department").val("");
    $("#year").val("");
    $("#description").val("");
    $("#specialty").val("");
}

function mostrarTabla(misDatos) {
    let tabla = "<table class='ui center aligned celled table'>" + 
    "<thead><tr><th>Nombre</th><th>Departamento</th><th>Año</th><th>Descripcion</th><th>Especialidad</th><th>Mensaje</th><th>Reservacion</th><th colspan='3'></th></tr></thead>";
    for (i = 0; i < misDatos.length; i++) {
        tabla += "<tr>";
        tabla += "<td>" + misDatos[i].name + "</td>";
        tabla += "<td>" + misDatos[i].department + "</td>";
        tabla += "<td>" + misDatos[i].year + "</td>";
        tabla += "<td>" + misDatos[i].description + "</td>";
        tabla += "<td>" + misDatos[i].specialty.name + "</td>";
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

        tabla += "<td> <button class='ui yellow button' onclick='validarRelacion(" + misDatos[i].id + ")'>Borrar</button>";
        tabla += "<td> <button class='ui red button' onclick='datoEspDoc(" + misDatos[i].id + ")'>Cargar dato</button>";
        tabla += "</tr>";
    }
    tabla += "</table>";
    $("#datos1").html(tabla);

}

$(document).ready(function () {
    traerSpecialty();
})

