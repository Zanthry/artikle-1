document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('toggleTabs').addEventListener('click', function() {
    var tabs = document.getElementById('tabs');
    if (tabs.style.display === 'none' || tabs.style.display === '') {
      tabs.style.display = 'flex';
    } else {
      tabs.style.display = 'none';
    }
  });

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
    if (authMenu.style.display === 'none' || authMenu.style.display === '') {
      authMenu.style.display = 'block';
    } else {
      authMenu.style.display = 'none';
    }
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
});
