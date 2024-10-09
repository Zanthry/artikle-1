document.addEventListener('DOMContentLoaded', function() {
  // Definir las credenciales del administrador
  const adminUsername = 'admin'; // Nombre de usuario del administrador
  const adminPassword = 'admin123'; // Contraseña del administrador

  // Comprobar si ya existe un usuario administrador en localStorage
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

  // Crear el usuario administrador si no existe
  if (!storedUsers.some(user => user.username === adminUsername)) {
    const adminUser = {
      fullname: 'Administrador',
      email: 'admin@example.com',
      username: adminUsername,
      password: adminPassword,
      role: 'admin' // Rol de administrador
    };
    storedUsers.push(adminUser); // Agregar el administrador al array de usuarios
    localStorage.setItem('users', JSON.stringify(storedUsers));
    console.log('Usuario administrador creado:', adminUser);
  } else {
    console.log('Usuario administrador ya existe:', storedUsers.find(user => user.username === adminUsername));
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

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = storedUsers.find(user => user.username === username && user.password === password);

    if (loggedInUser) {
      // Guardar en localStorage que el usuario está autenticado
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', loggedInUser.fullname);
      localStorage.setItem('loggedInUsername', loggedInUser.username);
      localStorage.setItem('userRole', loggedInUser.role); // Guardar el rol
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

    // Guardar el nuevo usuario en el array de usuarios como usuario normal
    const newUser = {
      fullname: fullname,
      email: email,
      username: username,
      password: password,
      role: 'user' // Por defecto, los nuevos usuarios son normales
    };

    // Obtener los usuarios actuales
    const currentUsers = JSON.parse(localStorage.getItem('users')) || [];
    currentUsers.push(newUser); // Agregar el nuevo usuario
    localStorage.setItem('users', JSON.stringify(currentUsers)); // Guardar en localStorage

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

    // Mostrar pestaña de usuarios solo para administradores
    if (localStorage.getItem('userRole') === 'admin') {
      document.querySelector('#tabs li:nth-child(5)').style.display = 'list-item'; // Mostrar la pestaña de Usuarios
      cargarUsuarios(); // Llamar a la función para cargar usuarios
    } else {
      document.querySelector('#tabs li:nth-child(5)').style.display = 'none'; // Ocultar si no es admin
    }
  }

  // Obtener las reseñas de localStorage
  cargarReseñasDesdeLocalStorage();

  // Manejar el botón para añadir reseña
  const addReviewButton = document.getElementById('add-review-button');
  const reviewFormContainer = document.getElementById('review-form-container');

  addReviewButton.addEventListener('click', function() {
    // Alternar la visibilidad del formulario de reseña
    reviewFormContainer.style.display = reviewFormContainer.style.display === 'none' ? 'block' : 'none';
  });

  // Manejar el envío del formulario de reseñas
  document.getElementById('review-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío normal del formulario
    const reviewText = document.getElementById('review-text').value; // Obtener el texto de la reseña
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loggedInUser = localStorage.getItem('loggedInUsername');

    if (reviewText && isLoggedIn === 'true') {
      const review = {
        username: loggedInUser,
        text: reviewText,
        date: new Date().toISOString()
      };

      // Obtener las reseñas actuales y agregar la nueva
      let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
      reviews.push(review);
      localStorage.setItem('reviews', JSON.stringify(reviews));

      // Añadir la nueva reseña al DOM
      agregarReseñaAlDOM(review);

      // Limpiar el formulario
      document.getElementById('review-text').value = '';
      reviewFormContainer.style.display = 'none'; // Ocultar el formulario de reseñas
    } else {
      alert('Debes iniciar sesión para dejar una reseña.');
    }
  });

  // Lógica de carga de usuarios para administradores
  function cargarUsuarios() {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos usuarios

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    if (storedUsers.length === 0) {
      usersList.innerHTML = '<p>No hay usuarios registrados.</p>';
    } else {
      const userTable = document.createElement('table');
      userTable.innerHTML = `
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th> <!-- Nueva columna para acciones -->
          </tr>
        </thead>
        <tbody>
          ${storedUsers.map(user => `
            <tr>
              <td>${user.fullname}</td>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>
                <select class="role-select" data-username="${user.username}">
                  <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuario</option>
                  <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                </select>
              </td>
              <td>
                <button class="save-role-button" data-username="${user.username}">Guardar Rol</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      `;
      usersList.appendChild(userTable);
      
      // Añadir eventos a los botones de guardar rol
      document.querySelectorAll('.save-role-button').forEach(button => {
        button.addEventListener('click', function() {
          const username = this.dataset.username;
          const roleSelect = document.querySelector(`.role-select[data-username="${username}"]`);
          const newRole = roleSelect.value;
          editarRolUsuario(username, newRole);
        });
      });
    }
  }

  // Función para editar el rol de un usuario
  function editarRolUsuario(username, newRole) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = storedUsers.findIndex(user => user.username === username);
    
    if (userIndex !== -1) {
      storedUsers[userIndex].role = newRole; // Actualizar el rol
      localStorage.setItem('users', JSON.stringify(storedUsers)); // Guardar en localStorage
      alert(`Rol de ${username} actualizado a ${newRole}`);
    }
  }
});

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
  reviewElement.innerHTML = `
    <div class="review-text">
      <strong>${review.username}:</strong> ${review.text}
    </div>
    <div class="review-date">
      <small>${new Date(review.date).toLocaleString()}</small>
    </div>
  `;

  // Solo mostrar el botón de eliminar si el usuario es administrador
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'admin') {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Usar un icono de papelera
    deleteButton.addEventListener('click', function() {
      eliminarResena(review); // Llamar a la función para eliminar la reseña
    });
    reviewElement.appendChild(deleteButton); // Añadir el botón al contenedor de la reseña
  }

  reviewsList.appendChild(reviewElement);
}

// Función para eliminar reseñas
function eliminarResena(review) {
  // Obtener las reseñas actuales
  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

  // Filtrar la reseña a eliminar
  reviews = reviews.filter(r => r.date !== review.date); // Usa un identificador único para eliminar la reseña

  // Guardar la lista actualizada en localStorage
  localStorage.setItem('reviews', JSON.stringify(reviews));

  // Recargar las reseñas en el DOM
  cargarReseñasDesdeLocalStorage();
}

// Función para cargar reseñas desde localStorage
function cargarReseñasDesdeLocalStorage() {
  const reviewsList = document.getElementById('reviews-list');
  reviewsList.innerHTML = ''; // Limpiar la lista antes de agregar nuevas reseñas

  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews.forEach(review => {
    agregarReseñaAlDOM(review);
  });
}

// Lógica para el modal de imágenes de categoría
const categoryButtons = document.querySelectorAll('.category-button');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const captionText = document.getElementById('caption');
const closeModal = document.getElementById('closeModal');

categoryButtons.forEach(button => {
  button.addEventListener('click', function() {
    const imageSrc = this.getAttribute('data-image');
    modal.style.display = "block";
    modalImage.src = imageSrc;
    captionText.innerHTML = this.textContent; // Título de la imagen
  });
});

// Cerrar el modal
closeModal.onclick = function() {
  modal.style.display = "none";
}

// Cerrar el modal al hacer clic fuera de la imagen
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}
