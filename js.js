let libros = JSON.parse(localStorage.getItem("libros")) || [];
// Crea un array vacío para almacenar los libros seleccionados en el carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// Guardar la lista actualizada de libros en el localStorage
localStorage.setItem("libros", JSON.stringify(libros));
mostrarLibros();

// Escucha el evento submit del formulario
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validarFormulario()) {
    agregarLibro();
  }
});

function agregarLibro() {
  let titulo = document.getElementById("titulo").value;
  let autor = document.getElementById("autor").value;
  let precio = document.getElementById("precio").value;
  let stock = document.getElementById("stock").value;

  // Verifica si el libro ya existe en el array
  let existeLibro = libros.find(libro => libro.titulo === titulo && libro.autor === autor);

  if (existeLibro) {
    // Si el libro ya existe, muestra un mensaje de error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El libro ya existe en la lista'
    });
  } else {
    // Si el libro no existe, lo agrega al array y lo guarda en el localStorage
    let libro = {
      titulo: titulo,
      autor: autor,
      precio: parseFloat(precio),
      stock: parseFloat(stock),
    };
    libros.push(libro);
    localStorage.setItem("libros", JSON.stringify(libros));


    // Actualiza la tabla con los libros
    mostrarLibros();


    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'El libro ha sido agregado a la lista'
    });

  }
  // Limpia los campos del formulario
  document.getElementById("formulario").reset();
}

// Llama a la funcion eliminarLibro() con el identificador de la fila
function eliminarLibro(idFila) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Esta seguro de borrar   ?',
    text: "esto no se puede revertir!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, Borrar !',
    cancelButtonText: 'No, cancelar !',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'Eliminado',
        'el item sido borrado.',
        'success'
      )


      let indice = parseInt(idFila.split("-")[1]);

      let libros = JSON.parse(localStorage.getItem("libros"));
      libros.splice(indice, 1);
      localStorage.setItem("libros", JSON.stringify(libros));

      let tabla = document.getElementById("tabla");
      let fila = document.getElementById(idFila);
      tabla.deleteRow(fila.rowIndex - 1);
      mostrarLibros();

    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelado',
        'el item no se ha borrado :)',
        'error'
      )
    }
  })
}
// Funcion de carga/listado de la tabla libros 
function mostrarLibros() {
  let libros = JSON.parse(localStorage.getItem("libros")) || [];
  let tabla = document.getElementById("tabla");
  let rowCount = tabla.rows.length;
  for (let i = rowCount - 1; i >= 0; i--) {
    tabla.deleteRow(i);
  }

  let filtroAutor = document.getElementById("filtro-autor");
  let busquedaTitulo = document.getElementById("busqueda-titulo");
  let btnBuscar = document.getElementById("btn-buscar");

  for (let i = 0; i < libros.length; i++) {
    let libro = libros[i];

    if (
      (filtroAutor.value === "" || libro.autor.toLowerCase().includes(filtroAutor.value.toLowerCase())) &&
      (busquedaTitulo.value === "" || libro.titulo.toLowerCase().includes(busquedaTitulo.value.toLowerCase()))
    ) {
      let fila = tabla.insertRow();
      let celdaTitulo = fila.insertCell(0);
      let celdaAutor = fila.insertCell(1);
      let celdaPrecio = fila.insertCell(2);
      let celdastock = fila.insertCell(3);
      let celdaCheckbox = fila.insertCell(4);
      let celdaEliminar = fila.insertCell(5);
      celdaTitulo.innerHTML = libro.titulo;
      celdaAutor.innerHTML = libro.autor;
      celdaPrecio.innerHTML = "$" + libro.precio;
      celdastock.innerHTML = libro.stock;
      let botonEliminar = document.createElement("button");
      botonEliminar.innerText = "Eliminar";
      botonEliminar.addEventListener("click", function () {
        eliminarLibro(fila.id);
      });
      celdaEliminar.appendChild(botonEliminar);
      fila.id = "fila-" + i;
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = i;
      celdaCheckbox.appendChild(checkbox);
      checkbox.addEventListener("click", function () {
        let libro = libros[this.value];
        agregarAlCarrito(libro);
      });
    }
  }

  btnBuscar.addEventListener("click", function () {
    mostrarLibros();
  });
}

// cargar/listar la tabla del carrito
function mostrarCarrito() {
  let tabla = document.getElementById("tabla-carrito");
  let rowCount = tabla.rows.length;
  for (let i = rowCount - 1; i >= 0; i--) {
    tabla.deleteRow(i);
  }

  if (carrito.length === 0) {
    let fila = tabla.insertRow();
    let celdaMensaje = fila.insertCell(0);
    celdaMensaje.colSpan = 4;
    celdaMensaje.innerHTML = "No hay libros seleccionados en el carrito.";
  } else {
    for (let i = 0; i < carrito.length; i++) {
      let libro = carrito[i];
      let fila = tabla.insertRow();
      let celdaTitulo = fila.insertCell(0);
      let celdaAutor = fila.insertCell(1);
      let celdaPrecio = fila.insertCell(2);
      let celdaCantidad = fila.insertCell(3);
      let botonEliminar = document.createElement("button");
      let celdastock = libro.stock;
      celdaTitulo.innerHTML = libro.titulo;
      celdaAutor.innerHTML = libro.autor;
      celdaPrecio.innerHTML = "$" + libro.precio;
      celdaCantidad.classList.add("cantidad");
      let inputCantidad = document.createElement("input");
      inputCantidad.id = `${libro.titulo}`
      inputCantidad.type = "number";
      inputCantidad.min = 1;
      inputCantidad.value = libro.cantidad;
      celdaCantidad.appendChild(inputCantidad);
      botonEliminar.textContent = "Eliminar";
      fila.appendChild(botonEliminar);
      botonEliminar.addEventListener("click", function () {
        removerDelCarrito(libro);
      });
      inputCantidad.addEventListener("input", () => {
        const libroEncontrado = carrito.find((libro) => libro.titulo == inputCantidad.id)
        libroEncontrado.cantidad = inputCantidad.value
        console.log(libroEncontrado)
        actualizarPreciosTotal();
      });
      actualizarPreciosTotal();
    }
  }
}

// Funcion para agregar un libro al carrito
function agregarAlCarrito(libro) {
  if (carrito.includes(libro)) {
    Swal.fire({
      icon: 'information',
      title: 'atencion',
      text: 'El libro ya está en el carrito'
    });
    return;
  }
  libroAgregado = {
    titulo : libro.titulo,
    autor : libro.autor,
    precio: libro.precio,
    stock : libro.stock,
    cantidad: 1
  }
  carrito.push(libroAgregado);
  console.log(carrito)
  localStorage.setItem("carrito", JSON.stringify(carrito))
  mostrarCarrito()
}

// Funcion para remover un libro del carrito
function removerDelCarrito(libro) {
  let index = carrito.indexOf(libro);
  if (index !== -1) {
    carrito.splice(index, 1);
  }

  mostrarCarrito();
  // actualizarPreciosTotal();
}


// Funcion confirmar compra
function procesarCompra() {

  if (carrito.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El carrito está vacío'
    });
    return;
  }
  for (let i = 0; i < carrito.length; i++) {
    let libro = carrito[i];
    let libroEnStock = libros.find(l => l.titulo === libro.titulo);
    if (libroEnStock.stock < libro.cantidad) {
      Swal.fire({
        icon: 'info',
        title: 'atencion',
        text: `No hay suficiente stock para el libro "${libro.titulo}"`
      });
      return;
    }
  }



  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  // actualizarPreciosTotal();
  localStorage.setItem("carrito", JSON.stringify(carrito));

  window.location.href = "confirmacion.html";



}

// Valida los campos del formulario
function validarFormulario() {
  let titulo = document.getElementById("titulo").value;
  let autor = document.getElementById("autor").value;
  let precio = document.getElementById("precio").value;
  let stock = document.getElementById("stock").value;
  if (titulo === "" || autor === "" || precio === "" || stock === "") {
    Swal.fire({
      icon: 'error',
      title: 'Faltan datos',
      text: 'Por favor, complete todos los campos.',
    })
    return false;
  } else {
    if (libros.includes(titulo)) {
      Swal.fire({
        icon: 'error',
        title: 'Información',
        text: 'Libro existente.',
      })

      return false;
    }
    return true;
  }

}


// Funcion para actualizar el Precio total del carrito
function actualizarPreciosTotal() {
  let precioTotal = carrito.reduce((acc, ite) => acc + ite.precio * ite.cantidad, 0);
  console.log(precioTotal)
  let totalHTML = document.getElementById("precio-total")
  totalHTML.textContent = "$" + precioTotal.toFixed(2);
  
 
}


