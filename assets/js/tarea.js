//LECCIÓN 3

//Clase tarea
class Tarea {
  constructor(id, descripcion) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = false; // false = pendiente, true = completada
    const fechaCreacion = new Date(); // const porque no se reasigna.
    this.fechaCreacion = fechaCreacion;
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
  agregarTarea(descripcion) {
    const id = this.#tareas.length + 1; // Generar ID.
    const tarea = new Tarea(id, descripcion);
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
// SELECTORES DE HTML & MANIPULACIÓN DEL DOM
// ------------------------------------------

const formulario = document.getElementById("formulario");
const input = document.getElementById("tarea");
const listaTareas = document.getElementById("lista-tareas");
const gestor = new GestorTareas();

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const descripcion = input.value.trim();
  if (descripcion) {
    gestor.agregarTarea(descripcion);
    mostrarTareas();
    input.value = ""; // Limpiar el input
  }
});

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

    //span para descripción
    const spanDescripcion = document.createElement("span");
    spanDescripcion.textContent = tarea.descripcion;
    spanDescripcion.classList.add("descripcion");

    //Contenedor de tick y botones
    const contAcciones = document.createElement("div");
    contAcciones.classList.add("d-flex", "align-items-center");

    // span para tick con espacio fijo
    const spanTick = document.createElement("span");
    spanTick.style.display = "inline-block";
    spanTick.style.width = "20px";
    // Tick si está completada
    if (tarea.estado) {
      spanTick.textContent = " ✔";
      spanTick.style.color = "purple";
    }

    // Botón Hecho
    const botonHecho = document.createElement("button");
    botonHecho.textContent = "Listo";
    botonHecho.classList.add("btn", "btn-success", "btn-sm", "ms-2");
    botonHecho.addEventListener("click", () => {
      gestor.cambiarEstado(tarea.id);
      mostrarTareas();
    });

    // Botón Eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "✕";
    botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
    botonEliminar.addEventListener("click", () => {
      gestor.eliminarTarea(tarea.id);
      mostrarTareas();
    });

    // Efecto hover con mouseover y mouseout
    li.addEventListener("mouseover", () => {
      li.style.backgroundColor = "#c5dddc";
    });
    li.addEventListener("mouseout", () => {
      li.style.backgroundColor = "";
    });

    // Ensamblar acciones
    contAcciones.appendChild(spanTick);
    contAcciones.appendChild(botonHecho);
    contAcciones.appendChild(botonEliminar);

    // Fila
    li.appendChild(spanDescripcion);
    li.appendChild(contAcciones);

    listaTareas.appendChild(li);
  });
}
mostrarTareas(); // Mostrar tareas al cargar la página

const buscar = document.getElementById("buscar");
buscar.addEventListener("keyup", () => {
  const filtro = buscar.value.toLowerCase().trim();
  const tareas = listaTareas.querySelectorAll("li");
  tareas.forEach((li) => {
    const spanDescripcion = li.querySelector(".descripcion");
    const texto = spanDescripcion.textContent.toLowerCase();
    li.style.display = texto.includes(filtro) ? "" : "none";
  });
});
