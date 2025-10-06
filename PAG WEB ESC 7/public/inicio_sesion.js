

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");


    const validUser = "admin";
    const validPass = "123456";

    if (user === validUser && pass === validPass) {
      alert("¡Inicio de sesión exitoso!");
      // Redirigir o mostrar otra sección
      window.location.href = "pagina-administrador.html"; // ejemplo
    } else {
      errorMsg.textContent = "Usuario o contraseña incorrectos.";
    }
  }