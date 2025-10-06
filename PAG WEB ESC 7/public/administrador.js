
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

async function uploadFile(inputId = 'fileInput') {
  const input = document.getElementById(inputId);
  const file = input && input.files ? input.files[0] : null;
  if (!file) {
    alert('Seleccioná un archivo');
    return;
  }

  if (!file.name.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
    alert('Archivo incompatible');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (res.ok) {
    alert('Archivo subido con éxito');
    input.value = '';
    if (typeof fetchFiles === 'function') {
      fetchFiles();
    }
  } else {
    alert('Error al subir archivo');
    try { console.log(await res.text()); } catch (_) {}
  }
}