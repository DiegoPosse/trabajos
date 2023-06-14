// Valida los campos del formulario venta
function validarFormulario2() {    
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("telefono").value;
    if (nombre === "" || email === "" || telefono === "" ) {
       Swal.fire({
           icon: 'error',
           title: 'Faltan datos',
           text: 'Por favor, complete todos los campos.',
       })
       return false;
   }
       return true;
   }
       
   // Obtiene los detalles de la venta del carrito 

function cargartablaventa(){
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    let tabla = document.getElementById("tabla-venta");
    if (tabla) {
      let tbody = tabla.getElementsByTagName("tbody")[0];
      let total = 0;
      for (let i = 0; i < carrito.length; i++) {
        let libro = carrito[i];
        let fila = document.createElement("tr");
        let titulo = document.createElement("td");
        let autor = document.createElement("td");
        let cantidad = document.createElement("td");
        let precio = document.createElement("td");
        let subtotal = document.createElement("td");
        titulo.textContent = libro.titulo;
        autor.textContent = libro.autor;
        cantidad.textContent = libro.cantidad;
        precio.textContent = libro.precio.toFixed(2);
        subtotal.textContent = (libro.precio * libro.cantidad).toFixed(2);
        fila.appendChild(titulo);
        fila.appendChild(autor);
        fila.appendChild(cantidad);
        fila.appendChild(precio);
        fila.appendChild(subtotal);
        tbody.appendChild(fila);
        // Calcular el subtotal
        total += libro.precio * libro.cantidad;
      }
      // Agregar el total al pie de la tabla
      let totalElement = document.getElementById("total");
      if (totalElement) {
        totalElement.textContent = total.toFixed(2);
      } else {
        console.error("El elemento total no existe");
      }
    } else {
      console.error("El elemento tabla-venta no existe");
    }
  }
  
  function guardarVenta() {
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    let libros = JSON.parse(localStorage.getItem("libros")) ;
    let total = document.getElementById("total").value;
    // Obtiene los valores del formulario de cliente
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("telefono").value;
    
    if (validarFormulario2()) {
      Swal.fire({
        title: 'Atencion !!',
        text: "Va a confirmar la compra ?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Confirmar!'
      }).then((result) => {
        if (result.isConfirmed) {
          let libros = JSON.parse(localStorage.getItem("libros"));
          // Crea un objeto cliente con los datos del formulario
          let cliente = {
            nombre: nombre,
            email: email,
            telefono: telefono
          };
          // Crea un objeto cliente con los datos del formulario(esto no se esta creando , quedan vacios libros y total)
          let venta = {
            cliente: cliente,
            librosComprados: carrito,
            total: total,
          };
          let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
          ventas.push(venta);
          
          //carga la venta al localstorage
          localStorage.setItem("ventas", JSON.stringify(ventas));
          Swal.fire(
            'Confirmado!',
            'Su pago a sido procesado.',
            'success'
          )
          // Descontar el stock de cada libro en el carrito
          for (let i = 0; i < carrito.length; i++) {
            let libro = carrito[i];
            let libroEnStock = libros.find(l => l.titulo === libro.titulo);
             libroEnStock.stock -= libro.cantidad;
          }
          localStorage.setItem("libros", JSON.stringify(libros));
          let librosAEliminar = [];
          // Agrega los libros con stock 0 a librosAEliminar
          for (let i = 0; i < libros.length; i++) {
            let libro = libros[i];
          
            if (libro.stock === 0 || libro.stock == null) {
                librosAEliminar.push(libro);
            }
          }
   
          console.log("Libros a eliminar:", librosAEliminar);
  
          // Elimina los libros con stock 0 del array libros
          for (let i = 0; i < librosAEliminar.length; i++) {
           let libro = librosAEliminar[i];
           let index = libros.indexOf(libro);
           libros.splice(index, 1);
          }
          console.log("Libros actualizados:", libros);
          localStorage.setItem("libros", JSON.stringify(libros));
          libros=[]
          localStorage.removeItem("carrito");
          carrito = []
          // Redirige al usuario a la pagina principal
          window.location.href = "index.html";
         } else {
          // Si se cancela la compra ...
          // Limpia el carrito 
          localStorage.removeItem("carrito");
          carrito = []
          // Redirige al usuario a la pagina principal
          window.location.href = "index.html";
          return;
        }
      })
    }      
  }
  function actualizarStock() {
	let totalVenta = 0;
	let libros = JSON.parse(localStorage.getItem("libros"));
  
	for (let i = 0; i < libros.length; i++) {
	  let cantidad = parseInt(document.getElementById("cantidadLibros" + i).value);
	  libros[i].stock -= cantidad;
	  totalVenta += parseFloat(libros[i].precio) * cantidad;
	}
  localStorage.setItem("libros", JSON.stringify(libros));
} 

