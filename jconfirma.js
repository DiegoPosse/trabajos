
const urlLibros = 
  "https://648bd8ca8620b8bae7ebda6d.mockapi.io/libros"
const urlVentas = 
  "https://648bd8ca8620b8bae7ebda6d.mockapi.io/ventas"
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
    let libros = JSON.parse(localStorage.getItem("libros"));
    let tabla = document.getElementById("tabla-venta");
    if (tabla) {
      let tbody = tabla.getElementsByTagName("tbody")[0];
      let total = 0;
      for (let i = 0; i < carrito.length; i++) {
        let libro = carrito[i];
        let id =libro.id
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
      const totalElement = document.getElementById("total");
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
    // Obtiene los valores del formulario de cliente
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("telefono").value;
    let totalElement =document.getElementById("total").textContent;
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
          
          // Crea un objeto cliente con los datos del formulario
          let cliente = {
            nombre: nombre,
            email: email,
            telefono: telefono
          };
          // Crea un objeto venta con los datos del formulario
          let venta = {
            ...cliente,
            compras : carrito,
            totalventa: totalElement,
          };
         
          let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
          ventas.push(venta);
          
          //carga la venta al localstorage
          localStorage.setItem("ventas", JSON.stringify(ventas));
          //carga la venta a Mockapi
          agregarVentaAsync(venta)
          
          
          // Descontar el stock de cada libro en el carrito
          
          for (let i = 0; i < carrito.length; i++) {
            let libro = carrito[i];
            let libroEnStock = libros.find(l => l.titulo === libro.titulo);
             libroEnStock.stock -= libro.cantidad;
             libroIdCarrito = libro.id
             let libroStock = {
              id : libro.id,
              titulo : libro.titulo,
              autor : libro.autor,
              precio: libro.precio,
              stock : libro.stock-libro.cantidad
             }
           
             editarLibrosAsync(libroIdCarrito,libroStock) 
                       }
          // Agrega los libros con stock 0 a librosAEliminar
          
          let librosAEliminar = [];
          for (let i = 0; i < libros.length; i++) {
            let libro = libros[i];
          
            if (libro.stock === 0 || libro.stock == null) {
                librosAEliminar.push(libro);
            }
          }
       
          
          // Elimina los libros con stock 0 del array libros
          for (let i = 0; i < librosAEliminar.length; i++) {
           let libro = librosAEliminar[i];
           let index = libros.indexOf(libro);
           let idLibro=libro.id
           libros.splice(index, 1);
           
           elimLibroAsyncSinStock(idLibro);
           
                     
          }
          
          //localStorage.setItem("libros", JSON.stringify(libros));
          Swal.fire({
            icon: 'success',
            title: 'Confirmado !! Su pago a sido procesado.',
            showConfirmButton: false,
            timer: 2500
          })
          
         
          
          libros=[]
          localStorage.removeItem("carrito");
          carrito = []
          // Redirige al usuario a la pagina principal
          function myFunction() {
            window.location.href = "index.html";
          }
          
          setTimeout(myFunction, 3000);
          
            
         
          
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
  
async function editarLibrosAsync(idEdit,data) {
  
  const resp = await fetch(`${urlLibros}/${idEdit}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dataRes = await resp.json();

 
}
async function elimLibroAsyncSinStock(idElim) {
  const resp = await fetch(`${urlLibros}/${idElim}`, {
    method: "DELETE",
  });
  const data = await resp.json();
 
 
}
async function agregarVentaAsync(venta) {
  const resp = await fetch(urlVentas, {
    method: "POST",
    body: JSON.stringify(venta),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();

  ventas.push(data)
  localStorage.setItem("ventas", JSON.stringify(data));
  return
}
