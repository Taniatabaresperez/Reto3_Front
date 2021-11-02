function datosEspecialidad() {
    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Specialty/all",
        type: 'GET',

        success: function (response) {
            mostrarTabla(response);
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}


function datoEspEspecialidad(idDato) {
    $.ajax({
        dataType: 'JSON',
        url: "http://129.151.123.97:8080/api/Specialty/" + idDato,
        type: 'GET',
        success: function (response) {
            $("#id").val(response.id);
            $("#id").attr("readonly", true);
            $("#name").val(response.name);
            $("#description").val(response.description);
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function crearE() {
    if ($("#name").val() == "" || $("#description").val() == "") {
        alert("Todos los campos son obligatorios")
    } else if ($("#name").val().length > 45) {
        alert("El nombre debe ser un texto de máximo 45 caracteres");
    } else if ($("#description").val().length > 250) {
        alert("La descripción debe ser un texto de máximo 250 caracteres");
    } else {
        let datos = {
            name: $("#name").val(),
            description: $("#description").val()
        }

        $.ajax({
            dataType: 'JSON',
            data: JSON.stringify(datos),
            url: "http://129.151.123.97:8080/api/Specialty/save",
            contentType: "application/JSON; charset=utf-8",
            type: 'POST',

            statusCode: {
                201: function () {
                    alert("Los datos se guardaron correctamente");
                    $("#datos").empty();
                    $("#id").attr("readonly", false);
                    limpiarCampos();
                    datosEspecialidad();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se guardaron correctamente");
            }
        });
    }
}

function actualizarEsp() {
    let datos = {
        id: $("#id").val(),
        name: $("#name").val(),
        description: $("#description").val(),
    }
    if ($("#name").val().length > 45) {
        alert("El nombre debe ser un texto de máximo 45 caracteres");
    } else if ($("#description").val().length > 250) {
        alert("La descripción debe ser un texto de máximo 250 caracteres");
    } else {
        let dataToSend = JSON.stringify(datos);
        $.ajax({
            dataType: 'JSON',
            data: dataToSend,
            contentType: "application/JSON",
            url: "http://129.151.123.97:8080/api/Specialty/update",
            type: 'PUT',

            statusCode: {
                201: function () {
                    alert("Los datos se modificaron correctamente");
                    $("#datos").empty();
                    $("#id").attr("readonly", false);
                    limpiarCampos();
                    datosEspecialidad();
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("Los datos no se modificaron correctamente");
            }
        });
    }
}

function borrarEsp(idEspecialidad) {
    let dataToSend = JSON.stringify(idEspecialidad);
    $.ajax({
        dataType: 'JSON',
        data: dataToSend,
        url: "http://129.151.123.97:8080/api/Specialty/" + idEspecialidad,
        type: 'DELETE',
        contentType: 'application/JSON',

        statusCode: {
            204: function () {
                alert("Dato eliminado correctamente");
                $("#datos").empty();
                datosEspecialidad();
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
    $("#description").val("");
}

function mostrarTabla(misDatos) {
    let tabla = "<table>";
    for (i = 0; i < misDatos.length; i++) {
        tabla += "<tr>";
        tabla += "<td>" + misDatos[i].name + "</td>";
        tabla += "<td>" + misDatos[i].description + "</td>";
        let seleccionar = "<select>";
        for (let j = 0; j < misDatos[i].doctors.length; j++) {
            const element = misDatos[i].doctors[j];
            seleccionar += `<option value="${element.id}"> ${element.name} </option>`;
        }
        //console.log(seleccionar)
        seleccionar += "</select>"
        tabla += `<td>${seleccionar}</td>`
        tabla += "<td> </td>"
        tabla += '<td><button onclick="borrarEsp(' + misDatos[i].id + ')">Borrar</button></td>';
        tabla += '<td><button onclick="datoEspEspecialidad(' + misDatos[i].id + ')">Cargar dato</button></td>';
        tabla += "</tr>";
    }
    tabla += "</table>";
    $("#datos").html(tabla);

}
