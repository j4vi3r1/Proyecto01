// Globals usados por producto.js
var isLoggedIn = false;
var isAdmin = false;
var currentUser = null;

/* ----------------- Helpers localStorage ----------------- */
function getUsuarios() { return JSON.parse(localStorage.getItem('usuarios') || '[]'); }
function saveUsuarios(u){ localStorage.setItem('usuarios', JSON.stringify(u)); }
function findUsuario(usuario, password) {
    const usuarios = getUsuarios();
    return usuarios.find(u => u.usuario === usuario && u.password === password);
}
function usuarioExiste(usuario) {
    return getUsuarios().some(u => u.usuario === usuario);
}

function getComentarios() { return JSON.parse(localStorage.getItem('comentarios') || '[]'); }
function saveComentarios(comentarios) { localStorage.setItem('comentarios', JSON.stringify(comentarios)); }

function getCarrito() { return JSON.parse(localStorage.getItem('carrito') || '[]'); }
function saveCarrito(carrito) { localStorage.setItem('carrito', JSON.stringify(carrito)); }

/* ----------------- Session persistence ----------------- */
function saveSession(usuarioObj) { localStorage.setItem('miau_session', JSON.stringify(usuarioObj)); }
function clearSession() { localStorage.removeItem('miau_session'); }
function loadSession() {
    const s = localStorage.getItem('miau_session');
    if (!s) { isLoggedIn = false; isAdmin = false; currentUser = null; return; }
    try {
        const u = JSON.parse(s);
        if (u && u.usuario) { isLoggedIn = true; isAdmin = !!u.admin; currentUser = u.usuario; }
        else { isLoggedIn = false; isAdmin = false; currentUser = null; }
    } catch (e) { isLoggedIn = false; isAdmin = false; currentUser = null; }
}

/* ----------------- Theme persistence ----------------- */
// mode: 'light' or 'dark'
function saveThemeMode(mode) { localStorage.setItem('miau_theme_mode', mode); }
function loadThemeMode() {
    const m = localStorage.getItem('miau_theme_mode') || 'light';
    return (m === 'dark') ? 'dark' : 'light';
}
/* ----------------- Carrito (expuesto) ----------------- */
function agregarAlCarrito(producto) {
    const carrito = getCarrito();
    const existente = carrito.find(p => p.nombre === producto.nombre);
    if (existente) existente.cantidad += 1;
    else carrito.push({ ...producto, cantidad: 1 });
    saveCarrito(carrito);
    mostrarCarritoSidebar();
}
function mostrarCarritoSidebar() {
    const sidebar = document.getElementById('carrito-sidebar');
    const lista = document.getElementById('carrito-lista');
    const totalDiv = document.getElementById('carrito-total');
    const floating = document.getElementById('floating-cart');
    if (!sidebar || !lista || !totalDiv) return;
    const carrito = getCarrito();
    lista.innerHTML = '';
    let total = 0;
    carrito.forEach((item, idx) => {
        const div = document.createElement('div');
        div.style.marginBottom = '1rem';
        div.innerHTML = `<strong>${item.nombre}</strong> x${item.cantidad}<br>$${item.precio * item.cantidad}
            <button data-idx="${idx}" class="remove-one" style="margin-left:10px;background:#dc3545;color:#fff;border:none;padding:0.2rem 0.7rem;border-radius:3px;cursor:pointer;">Eliminar</button>`;
        lista.appendChild(div);
        total += item.precio * item.cantidad;
    });
    if (carrito.length > 0) {
        const borrarTodoBtn = document.createElement('button');
        borrarTodoBtn.textContent = 'Vaciar carrito';
        borrarTodoBtn.style = 'background:#dc3545;color:#fff;border:none;padding:0.5rem 1rem;border-radius:4px;cursor:pointer;margin-top:1rem;';
        borrarTodoBtn.onclick = function() { saveCarrito([]); mostrarCarritoSidebar(); };
        lista.appendChild(borrarTodoBtn);
    }
    totalDiv.textContent = 'Total: $' + total;
    sidebar.style.display = 'block';
    if (floating) floating.classList.add('hidden');

    lista.querySelectorAll('button.remove-one').forEach(b => {
        b.addEventListener('click', function() {
            const idx = parseInt(b.dataset.idx);
            const carrito = getCarrito();
            if (!carrito[idx]) return;
            if (carrito[idx].cantidad > 1) carrito[idx].cantidad -= 1;
            else carrito.splice(idx, 1);
            saveCarrito(carrito);
            mostrarCarritoSidebar();
        });
    });
}

/* ----------------- UI: login, register, modals, comentarios ----------------- */
document.addEventListener('DOMContentLoaded', function() {
    // load persistent session & theme first
    loadSession();
    var themeMode = loadThemeMode(); // 'light'|'dark'

    const btn = document.getElementById('toggle-theme');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLogin = document.getElementById('close-login');
    const loginSubmit = document.getElementById('login-submit');
    const loginUsuario = document.getElementById('login-usuario');
    const loginPassword = document.getElementById('login-password');

    const registerModal = document.getElementById('register-modal');
    const closeRegister = document.getElementById('close-register');
    const registerSubmit = document.getElementById('register-submit');
    const registerUsuario = document.getElementById('register-usuario');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');

    const floatingCartBtn = document.getElementById('floating-cart');
    const cerrarCarritoBtn = document.getElementById('cerrar-carrito');

    // apply theme/admin combination based on persisted theme and session
    function applyThemeAndAdmin() {
        // limpiar clases
        document.body.classList.remove('dark-mode','green-mode','dark-green');

        if (isAdmin) {
            if (themeMode === 'dark') {
                document.body.classList.add('dark-green'); // admin + dark => verde oscuro
                if (btn) btn.textContent = 'Modo verde bosque';
            } else {
                document.body.classList.add('green-mode'); // admin + light => verde claro
                if (btn) btn.textContent = 'Modo verde bosque';
            }
        } else {
            if (themeMode === 'dark') {
                document.body.classList.add('dark-mode'); // usuario normal + dark
                if (btn) btn.textContent = 'Modo oscuro';
            } else {
                // usuario normal + light (por defecto)
                if (btn) btn.textContent = 'Modo oscuro';
            }
        }
    }

    // reflect session in UI (button texts, admin controls, comments)
    function reflectSessionUI() {
        if (loginBtn) loginBtn.textContent = isLoggedIn ? 'Cerrar sesión' : 'Login';
        if (typeof updateAdminUI === 'function') updateAdminUI();
        if (typeof renderComentarios === 'function') renderComentarios();
        applyThemeAndAdmin();
    }

    // initial UI reflect
    reflectSessionUI();

    // Theme toggle button: toggle mode and persist
    if (btn) {
        btn.addEventListener('click', function() {
            themeMode = (themeMode === 'dark') ? 'light' : 'dark';
            saveThemeMode(themeMode);
            applyThemeAndAdmin();
        });
    }

    // Floating cart handlers
    if (floatingCartBtn) floatingCartBtn.addEventListener('click', (e)=> { e.preventDefault(); mostrarCarritoSidebar(); });
    if (cerrarCarritoBtn) cerrarCarritoBtn.addEventListener('click', ()=> {
        const sidebar = document.getElementById('carrito-sidebar');
        if (sidebar) sidebar.style.display = 'none';
        const floating = document.getElementById('floating-cart');
        if (floating) floating.classList.remove('hidden');
    });

    // Register modal open/close (asegurar también display)
    if (registerBtn && registerModal) registerBtn.addEventListener('click', () => {
        registerModal.classList.add('active');
        registerModal.style.display = 'flex';
    });
    if (closeRegister && registerModal) closeRegister.addEventListener('click', () => {
        registerModal.classList.remove('active');
        registerModal.style.display = 'none';
    });

    // Login button: open modal or logout
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (!isLoggedIn) {
                if (loginModal) {
                    loginModal.classList.add('active');
                    loginModal.style.display = 'flex';
                }
            } else {
                // logout
                isLoggedIn = false; isAdmin = false; currentUser = null;
                clearSession();
                // keep theme preference (don't clear theme)
                if (typeof renderProductos === 'function') renderProductos().then(()=> { if (typeof renderComentarios === 'function') renderComentarios(); if (typeof updateAdminUI === 'function') updateAdminUI(); });
                reflectSessionUI();
            }
        });
    }

    if (closeLogin && loginModal) closeLogin.addEventListener('click', () => {
        loginModal.classList.remove('active');
        loginModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.classList.remove('active');
            registerModal.style.display = 'none';
        }
    });

    // Login submit -> persist session on success
    if (loginSubmit) {
        loginSubmit.addEventListener('click', function() {
            const usuario = (loginUsuario && loginUsuario.value.trim()) || '';
            const password = (loginPassword && loginPassword.value) || '';
            const user = findUsuario(usuario, password);
            if (user) {
                isLoggedIn = true;
                isAdmin = !!user.admin;
                currentUser = user.usuario;
                saveSession({ usuario: currentUser, admin: isAdmin });
                if (loginModal) { loginModal.classList.remove('active'); loginModal.style.display = 'none'; }
                if (loginUsuario) loginUsuario.value = '';
                if (loginPassword) loginPassword.value = '';
                reflectSessionUI();
            } else alert('Usuario o contraseña incorrectos.');
        });
    }

    // Register submit -> ocultar modal después de registro
    if (registerSubmit) {
        registerSubmit.addEventListener('click', function() {
            const usuario = (registerUsuario && registerUsuario.value.trim()) || '';
            const email = (registerEmail && registerEmail.value.trim()) || '';
            const password = (registerPassword && registerPassword.value) || '';
            let claveAdmin = prompt('Clave para crear admin (dejar vacío si no):');
            let esAdmin = false;
            if (claveAdmin && claveAdmin === "miau2025") esAdmin = true;
            else if (claveAdmin && claveAdmin !== "miau2025") { alert('Clave incorrecta.'); return; }
            if (!usuario || !email || !password) { alert('Completa todos los campos.'); return; }
            if (usuarioExiste(usuario)) { alert('El usuario ya existe.'); return; }
            const usuarios = getUsuarios();
            usuarios.push({ usuario, email, password, admin: esAdmin });
            saveUsuarios(usuarios);
            alert('Registro exitoso.');
            if (registerModal) { registerModal.classList.remove('active'); registerModal.style.display = 'none'; }
            if (registerUsuario) registerUsuario.value = '';
            if (registerEmail) registerEmail.value = '';
            if (registerPassword) registerPassword.value = '';
        });
    }

    // Comentario form (if exists) - ahora valida y bloquea sólo a admin (no a cualquier usuario logeado)
    const comentarioForm = document.getElementById('comentario-form');
    const comentarioText = document.getElementById('comentario-text');
    const comentarioNombre = document.getElementById('comentario-nombre');

    if (comentarioForm && comentarioText && comentarioNombre) {
        comentarioForm.addEventListener('submit', function(e){
            e.preventDefault();
            const nombre = comentarioNombre.value.trim();
            const texto = comentarioText.value.trim();
            if (!nombre) { alert('Por favor ingresa tu nombre.'); comentarioNombre.focus(); return; }
            if (!texto) { alert('Por favor escribe tu comentario.'); comentarioText.focus(); return; }
            // ahora sólo los administradores quedan bloqueados para agregar reseñas
            if (isAdmin) { alert('El administrador no puede agregar comentarios.'); return; }

            const ahora = new Date();
            const comentario = {
                nombre: nombre,
                texto: texto,
                fecha: ahora.toLocaleDateString(),
                hora: ahora.toLocaleTimeString()
            };
            const comentarios = getComentarios();
            comentarios.unshift(comentario);
            saveComentarios(comentarios);

            comentarioText.value = '';
            comentarioNombre.value = '';

            if (typeof renderComentarios === 'function') renderComentarios();
        });
    }

    // renderComentarios: solo mostrar la lista y el título cuando isAdmin === true
    if (typeof renderComentarios !== 'function') {
        window.renderComentarios = function() {
            const list = document.getElementById('comentarios-list');
            const form = document.getElementById('comentario-form');
            const title = document.getElementById('reseñas-title');
            if (!list) return;

            if (isAdmin) {
                if (title) title.style.display = '';
                if (form) form.style.display = 'none';
                list.style.display = '';
                const comentarios = getComentarios();
                list.innerHTML = '';
                if (comentarios.length === 0) {
                    list.innerHTML = '<div class="comentario">No hay comentarios aún.</div>';
                    return;
                }
                comentarios.forEach(com => {
                    const d = document.createElement('div');
                    d.className = 'comentario';
                    d.style = 'margin-bottom:1rem;padding:0.6rem;border-radius:6px;background:#fff;border:1px solid #e6e6e6;';
                    d.innerHTML = `<strong>${escapeHtml(com.nombre)}</strong> <small style="color:#666">— ${com.fecha} ${com.hora}</small><br>${escapeHtml(com.texto)}`;
                    list.appendChild(d);
                });
            } else {
                // no admin: ocultar título y lista, mostrar el formulario
                if (title) title.style.display = 'none';
                list.style.display = 'none';
                if (form) form.style.display = 'block';
            }
        };
    }

    // util: escapar texto al mostrar
    if (typeof escapeHtml !== 'function') {
        window.escapeHtml = function(str) {
            if (!str) return '';
            return str.replace(/[&<>"']/g, function(m) {
                return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m];
            });
        };
    }

    // ensure UI reflects session on load
    reflectSessionUI();

}); // end DOMContentLoaded