
const Inicio = document.getElementById("inicio")
const Biblioteca = document.getElementById("Biblioteca")
const anuario = document.getElementById("anuario")


Inicio.addEventListener('click',() => {

  Swal.fire({
    title: '¿Estás seguro?',
    text: "se cerrara tu sesion si haces esto.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'No, cancelar'
  }).then((result) => {
  if (result.isConfirmed) {
    window.location.href = "index.html";
  } else {
    window.location.href = "pagina-administrador.html";
  }
  });

})


Biblioteca.addEventListener('click',() => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "se cerrara tu sesion si haces esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "biblioteca.html";
    } else {
      window.location.href = "pagina-administrador.html";
    }
    });

})


Anuario.addEventListener('click',() => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "se cerrara tu sesion si haces esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "index.html";
    } else {
      window.location.href = "pagina-administrador.html";
    }
    });
 
})

async function uploadFile() {
      const input = document.getElementById('fileInput');
      const file = input.files[0];
      if (!file) return alert('Seleccioná un archivo');

      const formData = new FormData();
      formData.append('file', file);
      
              if (file.name.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
                const input = document.getElementById('fileInput');
                const file = input.files[0];
                if (!file) return alert('Seleccioná un archivo');

                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch(`${API_URL}/upload`, {
                  method: 'POST',
                  body: formData,
                });

                if (res.ok) {
                  alert('Archivo subido con éxito');
                  input.value = '';
                  fetchFiles(); // actualizar lista
                } else {
                  alert('Error al subir archivo');
                  console.log(res)
                }
            } else {
                alert('Archivo incompatible');
            }
      // const input = document.getElementById('fileInput');
      // const file = input.files[0];
      // if (!file) return alert('Seleccioná un archivo');

      // const formData = new FormData();
      // formData.append('file', file);

      const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) { 
        alert('Archivo subido con éxito');
        input.value = '';
        fetchFiles(); // actualizar lista
      } else {
        alert('Error al subir archivo');
      }
    }