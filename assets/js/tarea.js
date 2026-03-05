/* LECCIÓN 1
Clase tarea */
class Tarea {
  constructor(id, descripcion, estado, fechaCreacion) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
  }

  // Método para cambiar el estado de la tarea
  cambiarEstado() {
    this.estado = !this.estado;
  }
}

// Clase GestorTareas
class GestorTareas {
  #tareas = []; // privada

  // Crear tareas
  agregarTarea(tarea) {
    this.#tareas.push(tarea);
  }

  //Eliminar tareas por id
  eliminarTarea(id) {
    const index = this.#tareas.findIndex((tarea) => tarea.id === id);
    if (index === -1) {
      console.log("Tarea noencontrada");
      return;
    }
    this.#tareas.splice(index, 1);
  }

  // Camciar estado por id
  cambiarEstado(id) {
    const tarea = this.#tareas.find((tarea) => tarea.id === id);
    if (!tarea) {
      console.log("Tarea no encontrada");
      return;
    }
    tarea.cambiarEstado();
  }

  // Listar tareas para verlas sin romper encapsulamiento
  listarTareas() {
    return this.#tareas;
  }
}

// ------------------
// TESTEO DEL CÓDIGO
// ------------------

// Crear instancia del gestor
const gestor = new GestorTareas();

// Agregar tareas
gestor.agregarTarea(
  new Tarea(1, "Estudiar POO", false, new Date().toLocaleString()),
);
gestor.agregarTarea(
  new Tarea(2, "Preparar proyecto", true, new Date().toLocaleString()),
);

// Listar tareas
console.log("Lista inicial:", gestor.listarTareas());

// Cambiar estado de la tarea 1
gestor.cambiarEstado(1);
console.log("Después de cambiar estado:", gestor.listarTareas());

// Eliminar tarea 2
gestor.eliminarTarea(2);
console.log("Después de eliminar tarea 2:", gestor.listarTareas());
