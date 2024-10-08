document.addEventListener('DOMContentLoaded', function() {
  // Definir las credenciales del administrador
  const adminUsername = 'admin'; // Nombre de usuario del administrador
  const adminPassword = 'admin123'; // Contraseña del administrador

  // Comprobar si ya existe un usuario administrador en localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));

  // Crear el usuario administrador si no existe
  if (!storedUser || storedUser.username !== adminUsername) {
    const adminUser = {
      fullname: 'Administrador',
      email: 'admin@example.com',
      username: adminUsername,
      password: adminPassword,
      role: 'admin' // Rol de administrador
    };
    localStorage.setItem('user', JSON.stringify(adminUser));
    console.log('Usuario administrador creado:', adminUser);
  } else {
    console.log('Usuario ya existe en localStorage:', storedUser);
  }

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

  // Manejar el envío del formulario de inicio de sesión
  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
      // Guardar en localStorage que el usuario está autenticado
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', storedUser.fullname);
      localStorage.setItem('loggedInUsername', storedUser.username);
      localStorage.setItem('userRole', storedUser.role); // Guardar el rol
      alert('Inicio de sesión exitoso');
      location.reload(); // Recargar la página para actualizar el estado
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  });

  // Manejar el envío del formulario de registro
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

    // Guardar el nuevo usuario en localStorage como usuario normal
    const newUser = {
      fullname: fullname,
      email: email,
      username: username,
      password: password,
      role: 'user' // Por defecto, los nuevos usuarios son normales
    };

    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    alert('Registro exitoso. Por favor, inicia sesión.');
    document.getElementById('register-form').reset();
  });

  // Verificación de sesión iniciada
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const loggedInUser = localStorage.getItem('loggedInUser');
  const loggedInUsername = localStorage.getItem('loggedInUsername');

  if (isLoggedIn === 'true') {
    mostrarMensajeBienvenida(loggedInUser, loggedInUsername);
    mostrarOpcionCerrarSesion(); // Mostrar la opción de cerrar sesión
  }

  // Obtener las reseñas de localStorage
  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews.forEach(review => {
    agregarReseñaAlDOM(review);
  });

  // Cargar noticias
  cargarNoticias();
});

// Función para cargar noticias
async function cargarNoticias() {
  const apiKey = 'YOUR_API_KEY'; // Reemplaza esto con tu clave API
  const url = `https://newsapi.org/v2/everything?q=hardware&language=es&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.articles) {
      mostrarNoticias(data.articles);
    } else {
      console.error('No se encontraron artículos');
    }
  } catch (error) {
    console.error('Error al cargar las noticias:', error);
  }
}

// Función para mostrar noticias en el DOM
function mostrarNoticias(articles) {
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = ''; // Limpiar la lista antes de agregar nuevas noticias

  articles.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.className = 'news-article';
    articleElement.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description}</p>
      <a href="${article.url}" target="_blank">Leer más</a>
    `;
    newsList.appendChild(articleElement);
  });
}

// Función para mostrar la opción "Cerrar sesión"
function mostrarOpcionCerrarSesion() {
  const authMenu = document.getElementById('auth-menu');
  const logoutItem = document.createElement('li');
  const logoutLink = document.createElement('a');
  logoutLink.href = '#';
  logoutLink.textContent = 'Cerrar sesión';
  logoutLink.addEventListener('click', function(event) {
    event.preventDefault();
    cerrarSesion();
  });
  logoutItem.appendChild(logoutLink);
  authMenu.appendChild(logoutItem);
}

// Función para cerrar sesión
function cerrarSesion() {
  // Limpiar el estado de sesión en localStorage
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loggedInUsername');
  localStorage.removeItem('userRole'); // Limpiar el rol del usuario

  // Recargar la página o redirigir al inicio
  alert('Has cerrado sesión.');
  location.reload(); // Esto recarga la página para volver a mostrar las opciones de iniciar sesión/registro
}

// Función para mostrar el mensaje de bienvenida
function mostrarMensajeBienvenida(loggedInUser, loggedInUsername) {
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    welcomeMessage.innerText = `Bienvenido, ${loggedInUsername}`;
    welcomeMessage.style.display = 'block';
  }
}

// Función para añadir reseñas al DOM
function agregarReseñaAlDOM(review) {
  const reviewsList = document.getElementById('reviews-list');
  const reviewElement = document.createElement('div');
  reviewElement.className = 'review';
  reviewElement.innerHTML = `<strong>${review.username}:</strong> ${review.text}`;
  
  // Añadir botón de eliminar si el usuario es admin
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'admin') {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'delete-review';
    deleteButton.addEventListener('click', function() {
      eliminarReseña(reviewElement);
    });
    reviewElement.appendChild(deleteButton);
  }

  reviewsList.appendChild(reviewElement);
}

// Función para eliminar una reseña
function eliminarReseña(reviewElement) {
  const reviewsList = document.getElementById('reviews-list');
  reviewsList.removeChild(reviewElement);
  alert('Reseña eliminada.');
}

// Función para manejar el envío del formulario de reseñas
document.getElementById('review-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const reviewText = document.getElementById('review-text').value.trim();
  const username = localStorage.getItem('loggedInUsername');

  if (!reviewText) {
    alert('Por favor, escribe una reseña.');
    return;
  }

  const newReview = {
    username: username,
    text: reviewText
  };

  // Agregar la nueva reseña al DOM
  agregarReseñaAlDOM(newReview);

  // Guardar la reseña en localStorage
  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews.push(newReview);
  localStorage.setItem('reviews', JSON.stringify(reviews));

  // Limpiar el formulario
  document.getElementById('review-form').reset();
});
