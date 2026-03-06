/* LECCIÓN 2
Clase tarea */
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

  // Crear tareas
  agregarTarea(descripcion) {
    const id = this.#tareas.length + 1; // Generar ID.
    const tarea = new Tarea(id, descripcion);
    this.#tareas.push(tarea);
  }

  //Eliminar tareas por id
  eliminarTarea(id) {
    const index = this.#tareas.findIndex((tarea) => tarea.id === id); // const porque se calcula una sola vez.
    if (index === -1) {
      console.log("Tarea no encontrada");
      return;
    }
    this.#tareas.splice(index, 1);
  }

  // Cambiar estado por id
  cambiarEstado(id) {
    let tarea = this.#tareas.find((tarea) => tarea.id === id); //let porque puede ser undefined.
    if (!tarea) {
      console.log("Tarea no encontrada");
      return;
    }
    tarea.cambiarEstado();
  }

  listarTareas() {
    return this.#tareas;
    // Listar tareas para verlas sin romper encapsulamiento
  }
}

// ------------------
// TESTEO DEL CÓDIGO
// ------------------

// INTANCIA del gestor
const gestor = new GestorTareas(); //const porque siempre seá el mismo objeto.

gestor.agregarTarea("Estudiar JavaScript");
gestor.agregarTarea("Hacer ejercicio");

console.log("Lista inicial:", gestor.listarTareas());
gestor.cambiarEstado(1);
console.log("Después de cambiar estado:", gestor.listarTareas());
gestor.eliminarTarea(2);
console.log("Después de eliminar tarea 2:", gestor.listarTareas());
