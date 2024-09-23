document.addEventListener('DOMContentLoaded', function() {
  // Mostrar/ocultar pestañas en móviles
  document.getElementById('toggleTabs').addEventListener('click', function() {
    var tabs = document.getElementById('tabs');
    tabs.style.display = tabs.style.display === 'none' || tabs.style.display === '' ? 'flex' : 'none';
  });

  // Manejar clics en las pestañas
  document.querySelectorAll('#tabs a').forEach(tab => {
    tab.addEventListener('click', function(event) {
      event.preventDefault();
      document.querySelectorAll('#tabs a').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.content').forEach(c => c.classList.remove('show'));
      this.classList.add('active');
      document.querySelector(this.getAttribute('href')).classList.add('show');
    });
  });

  // Mostrar la pestaña de inicio por defecto
  document.querySelector('#home').classList.add('show');

  // Añadir evento de clic al botón "ARTIKLE STORE"
  document.getElementById('home-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelectorAll('#tabs a').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content').forEach(c => c.classList.remove('show'));
    document.querySelector('#home').classList.add('show');
    document.querySelector('a[href="#home"]').classList.add('active');
  });

  // Mostrar/ocultar el menú de autenticación al hacer clic en el botón de usuario
  document.getElementById('user-button').addEventListener('click', function() {
    var authMenu = document.getElementById('auth-menu');
    authMenu.style.display = authMenu.style.display === 'none' || authMenu.style.display === '' ? 'block' : 'none';
  });

  // Añadir eventos de clic para el menú de autenticación
  document.querySelectorAll('#auth-menu a').forEach(tab => {
    tab.addEventListener('click', function(event) {
      event.preventDefault();
      document.querySelectorAll('#tabs a').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.content').forEach(c => c.classList.remove('show'));
      document.querySelector(this.getAttribute('href')).classList.add('show');
      document.getElementById('auth-menu').style.display = 'none'; // Ocultar el menú después de seleccionar una opción
    });
  });

  // Manejar el botón para añadir reseña
  const addReviewButton = document.getElementById('add-review-button');
  const reviewFormContainer = document.getElementById('review-form-container');

  addReviewButton.addEventListener('click', function() {
    reviewFormContainer.style.display = reviewFormContainer.style.display === 'none' ? 'block' : 'none';
  });

  // Manejar el envío del formulario de reseñas
  document.getElementById('review-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const reviewText = document.getElementById('review-text').value;
    const userName = 'Usuario'; // Aquí puedes obtener el nombre del usuario logueado
    if (reviewText) {
      // Añadir la reseña al DOM
      const reviewsList = document.getElementById('reviews-list');
      const reviewElement = document.createElement('div');
      reviewElement.className = 'review';
      reviewElement.innerHTML = `<strong>${userName}:</strong> ${reviewText}`;
      reviewsList.appendChild(reviewElement);

      alert('Reseña añadida');
      document.getElementById('review-text').value = ''; // Limpiar el formulario
      reviewFormContainer.style.display = 'none'; // Ocultar el formulario después de enviar
    }
  });
});
document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('new-username').value.trim();
  const password = document.getElementById('new-password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  if (!fullname || !email || !username || !password || !confirmPassword) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  // Guardar el usuario en localStorage
  const user = {
    fullname: fullname,
    email: email,
    username: username,
    password: password
  };

  localStorage.setItem('user', JSON.stringify(user));
  alert('Registro exitoso.');
});
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Obtener el usuario de localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    alert('Inicio de sesión exitoso.');
    // Aquí puedes redirigir al usuario a otra página o mostrar contenido exclusivo
  } else {
    alert('Nombre de usuario o contraseña incorrectos.');
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (isLoggedIn === 'true') {
    alert(`Bienvenido de nuevo, ${loggedInUser}`);
    // Aquí puedes mostrar contenido exclusivo para usuarios logueados
  } else {

  }
});

