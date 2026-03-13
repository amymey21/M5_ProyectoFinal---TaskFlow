/* ---------------------------------
-----------LECCION 5----------------
----------------------------------*/
//Clase tarea
class Tarea {
  constructor(id, descripcion, fechaLimite = null) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = false; // false = pendiente, true = completada
    const fechaCreacion = new Date(); // const porque no se reasigna.
    this.fechaCreacion = fechaCreacion;
    this.fechaLimite = fechaLimite; //propiedad opcional
  }
  // Método para cambiar el estado de la tarea
  cambiarEstado() {
    this.estado = !this.estado;
  }
}

// Clase GestorTareas
class GestorTareas {
  #tareas = []; // Array privado

  // Método para crear tareas
  agregarTarea(descripcion, fechaLimite = null) {
    const id = this.#tareas.length + 1; // Generar ID.
    const tarea = new Tarea(id, descripcion, fechaLimite);
    this.#tareas.push(tarea);
  }

  // Método para eliminar tareas por id
  eliminarTarea(id) {
    const index = this.#tareas.findIndex((tarea) => tarea.id === id); // const porque se calcula una sola vez.
    if (index === -1) {
      console.log("Tarea no encontrada");
      return;
    }
    this.#tareas.splice(index, 1);
  }

  // Método para cambiar estado por id
  cambiarEstado(id) {
    let tarea = this.#tareas.find((tarea) => tarea.id === id); //let porque puede ser undefined.
    if (!tarea) {
      console.log("Tarea no encontrada");
      return;
    }
    tarea.cambiarEstado();
  }

  // Método para listar tareas
  listarTareas() {
    return this.#tareas;
  }
}

// ------------------------------------------
// SELECTORES DE HTML, SELECTORES & MANIPULACIÓN DEL DOM
// ------------------------------------------

const gestor = new GestorTareas();
const formulario = document.getElementById("formulario");
const input = document.getElementById("tarea");
const listaTareas = document.getElementById("lista-tareas");
const inputFecha = document.getElementById("fecha-limite");
const buscar = document.getElementById("buscar");
const clima = document.getElementById("clima");
const API_KEY = "35c44cb58ab54eb5996151331260603";

// Evento para consultar clima
clima.addEventListener("click", () => {
  const ciudad = prompt("¿Qué ciudad quieres consultar?");
  if (ciudad) buscarClima(ciudad);
});

// Función para consultar clima usando async/await
async function buscarClima(ciudad) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${ciudad}&lang=es`;
  try {
    let respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);
    let datos = await respuesta.json();

    // Insertar datos en el DOM
    document.getElementById("resultado-clima").innerHTML = `
    <h3>${datos.location.name} (${datos.location.country})</h3>
    <p>${datos.current.temp_c}°C</p>
    <p>${datos.current.condition.text}</p>
    <img src="${datos.current.condition.icon}" alt="icono clima">
    `;
    // Guardar última consulta en localStorage
    localStorage.setItem("ultimaCiudad", JSON.stringify(datos));
  } catch (error) {
    document.getElementById("resultado-clima").innerHTML =
      `<p class="text-danger">No se pudo obtener el clima</p>`;
  }
}
// Al cargar página, mostrar última ciudad consultada o clima por defecto
window.addEventListener("load", () => {
  const ultimo = localStorage.getItem("ultimaCiudad");
  if (ultimo) {
    const data = JSON.parse(ultimo);
    document.getElementById("resultado-clima").innerHTML = `
      <h5>${data.location.name} (${data.location.country})</h5>
      <p>🌡️ ${data.current.temp_c}℃</p>
      <p>☁️ ${data.current.condition.text}</p>
      <img src="${data.current.condition.icon}" alt="icono clima">
    `;
  } else {
    buscarClima("Santiago, Chile"); //Clima por defecto.
  }
});

// Evento para filtrar tareas en tiempo real con una letra de la palabra
buscar.addEventListener("keyup", () => {
  const filtro = buscar.value.toLowerCase().trim();
  const tareas = listaTareas.querySelectorAll("li");
  tareas.forEach((li) => {
    const spanDescripcion = li.querySelector(".descripcion");
    const texto = spanDescripcion.textContent.toLowerCase();
    li.style.display = texto.includes(filtro) ? "" : "none";
  });
});

// Evento para agregar tareas con retraso y mostrar notificación
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const descripcion = input.value.trim();
  const fechaLimite = inputFecha.value ? new Date(inputFecha.value) : null;
  // Retraso
  if (descripcion) {
    setTimeout(() => {
      gestor.agregarTarea(descripcion, fechaLimite);
      mostrarTareas();
      // Mostrar notificación
      const notificacion = document.getElementById("notificacion");
      notificacion.textContent = "¡Tarea agregada con éxito!";
      notificacion.style.display = "block";
      //Ocultar notificación después unos segundos
      setTimeout(() => {
        notificacion.style.display = "none";
      }, 2500);
    }, 1000);
    input.value = ""; // Limpiar tarea
    inputFecha.value = ""; // Limpiar fecha
  }
});

// Función para iniciar contador regresivo
function iniciarContador(fechaLimite, spanContador) {
  const intervalo = setInterval(() => {
    const ahora = new Date();
    const diferencia = fechaLimite - ahora;
    // Fecha límite cumplida, detener contador y mostrar mensaje.
    if (diferencia <= 0) {
      clearInterval(intervalo);
      spanContador.textContent = "¿La terminaste, cierto?";
    } else {
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor(
        (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
      // Texto del contador
      spanContador.textContent = `Quedan ${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }
  }, 1000);
}

// Función para mostrar tareas en el DOM
function mostrarTareas() {
  listaTareas.innerHTML = ""; // Limpiar la lista para que no se dupliquen.
  gestor.listarTareas().forEach((tarea) => {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
    );

    // Span para descripción
    const spanDescripcion = document.createElement("span");
    spanDescripcion.textContent = tarea.descripcion;
    spanDescripcion.classList.add("descripcion");
    li.appendChild(spanDescripcion);

    // Iniciar contador si hay fecha límite
    if (tarea.fechaLimite) {
      const spanContador = document.createElement("span");
      spanContador.classList.add(
        "badge",
        "bg-info-subtle",
        "text-dark",
        "ms-3",
      );
      li.appendChild(spanContador);
      iniciarContador(tarea.fechaLimite, spanContador);
    }

    // --------------------------------------------------------------------

    // CONTENEDOR DE ACCIONES (tick, botones)
    const contAcciones = document.createElement("div");
    contAcciones.classList.add("d-flex", "align-items-center");

    //---------------- BOTON HECHO
    // Botón Hecho
    const botonHecho = document.createElement("button");
    botonHecho.textContent = "Listo";
    botonHecho.classList.add("btn", "btn-success", "btn-sm", "ms-2");
    botonHecho.addEventListener("click", () => {
      gestor.cambiarEstado(tarea.id);
      if (tarea.fechaLimite) {
        tarea.fechaLimite = null; // Eliminar contador
      }
      mostrarTareas();
    });

    // --------------- TICK
    // span para tick con espacio fijo
    const spanTick = document.createElement("span");
    spanTick.style.display = "inline-block";
    spanTick.style.width = "20px";
    // Tick si está completada
    if (tarea.estado) {
      spanTick.textContent = " ✔";
      spanTick.style.color = "purple";
      spanDescripcion.classList.add(
        "text-decoration-line-through",
        "text-muted",
      );
    }

    // -------------- BOTON ELIMINAR
    // Botón Eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "✕";
    botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
    botonEliminar.addEventListener("click", () => {
      gestor.eliminarTarea(tarea.id);
      mostrarTareas();
    });

    // Efecto hover con mouseover y mouseout en filas
    li.addEventListener("mouseover", () => {
      li.style.backgroundColor = "#88d8d5";
    });
    li.addEventListener("mouseout", () => {
      li.style.backgroundColor = "";
    });

    // ---------------------------------------------------------------------

    // Ensamblar acciones
    contAcciones.appendChild(spanTick);
    contAcciones.appendChild(botonHecho);
    contAcciones.appendChild(botonEliminar);

    //Agregar acciones al li
    li.appendChild(contAcciones);

    //Agregar la fila a la lista
    listaTareas.appendChild(li);
  });
}
mostrarTareas(); // Mostrar tareas al cargar la página
