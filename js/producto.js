// Producto: carga, render y admin add-product
// Depende de globals: isAdmin, agregarAlCarrito, mostrarCarritoSidebar (definidos en script.js)

(function(){
    // helpers locales para productos (expuestos globalmente)
    window.getProductos = function() { return JSON.parse(localStorage.getItem('productos') || '[]'); };
    window.saveProductos = function(productos) { localStorage.setItem('productos', JSON.stringify(productos)); };

    async function fetchProductosFromFile() {
        try {
            const res = await fetch('js/json/productos.json', {cache: "no-store"});
            if (!res.ok) throw new Error('Fetch productos.json error ' + res.status);
            const prods = await res.json();
            return Array.isArray(prods) ? prods : [];
        } catch (err) {
            console.error('fetchProductosFromFile', err);
            return [];
        }
    }

    // renderProductos expuesto globalmente
    window.renderProductos = async function() {
        const productosDiv = document.getElementById('productos-container') || document.querySelector('.productos');
        if (!productosDiv) return;
        productosDiv.innerHTML = '';
        let productos = getProductos();
        if (!productos || productos.length === 0) {
            productos = await fetchProductosFromFile();
            if (productos.length) saveProductos(productos);
        }

        // número mínimo de casillas a mostrar (3 columnas x 2 filas = 6)
        const minSlots = 6;
        const slots = Math.max(minSlots, productos.length);

        for (let i = 0; i < slots; i++) {
            const prod = productos[i];
            const div = document.createElement('div');
            div.className = 'producto';
            if (prod) {
                // producto real
                div.innerHTML = `
                    <div class="prod-img-wrap">
                        <img src="${prod.img}" alt="${prod.nombre}" onerror="this.onerror=null; this.src='media/placeholder.png';">
                    </div>
                    <h3 contenteditable="${isAdmin}">${prod.nombre}</h3>
                    <p contenteditable="${isAdmin}">$${prod.precio} c/u</p>
                    <button class="add-to-cart">Agregar al carrito</button>
                    ${isAdmin ? `<div class="admin-controls" style="margin-top:.5rem;">
                        <button class="editar-btn" data-idx="${i}" style="background:#ffc107;color:#333;margin-right:.4rem;">Editar</button>
                        <button class="borrar-btn" data-idx="${i}" style="background:#dc3545;color:#fff;">Borrar</button>
                    </div>` : ''}
                `;
            } else {
                // placeholder vacío (próximamente)
                div.classList.add('placeholder');
                div.innerHTML = `
                    <div class="prod-img-wrap placeholder-img"></div>
                    <h3>Próximamente</h3>
                    <p>&nbsp;</p>
                    <button class="add-to-cart" disabled >Próximamente</button>
                `;
            }
            productosDiv.appendChild(div);
        }

        // Attach events: add to cart (solo para productos reales)
        productosDiv.querySelectorAll('.producto').forEach((card, idx) => {
            const productosActuales = getProductos();
            if (!productosActuales[idx]) return; // placeholder -> no handler
            const addBtn = card.querySelector('.add-to-cart');
            if (addBtn) {
                addBtn.addEventListener('click', function() {
                    const productos = getProductos();
                    if (!productos[idx]) return;
                    if (typeof window.agregarAlCarrito === 'function') window.agregarAlCarrito(productos[idx]);
                    else console.warn('agregarAlCarrito no definido');
                });
            }
        });

        // editar / borrar (admin) - re-query solo botones presentes
        productosDiv.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(btn.dataset.idx);
                const prodDiv = btn.closest('.producto');
                const nombreEl = prodDiv.querySelector('h3');
                const precioEl = prodDiv.querySelector('p');
                nombreEl.contentEditable = true;
                precioEl.contentEditable = true;
                nombreEl.focus();
                btn.textContent = 'Guardar';
                btn.onclick = function() {
                    const productos = getProductos();
                    productos[idx].nombre = nombreEl.textContent.trim();
                    productos[idx].precio = parseInt(precioEl.textContent.replace(/[^0-9]/g, '')) || 0;
                    saveProductos(productos);
                    window.renderProductos();
                };
            });
        });
        productosDiv.querySelectorAll('.borrar-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(btn.dataset.idx);
                const productos = getProductos();
                productos.splice(idx, 1);
                saveProductos(productos);
                window.renderProductos();
            });
        });

        // después de render actualizar UI admin si existe la función
        if (typeof window.updateAdminUI === 'function') window.updateAdminUI();
    };

    // Admin: botón para agregar producto (inserta al inicio)
    document.addEventListener('DOMContentLoaded', function(){
        const addProductBtn = document.getElementById('add-product-btn');
        if (!addProductBtn) return;
        addProductBtn.addEventListener('click', async function () {
            const nombre = prompt('Nombre del producto:');
            if (!nombre) return;
            const precioRaw = prompt('Precio (solo números):', '0');
            const precio = parseInt((precioRaw || '0').replace(/[^0-9]/g, ''), 10) || 0;
            const img = prompt('Ruta/URL de la imagen (ej: media/auto4.jpg) o un URL:', 'media/auto3.png') || 'media/auto3.png';
            const productos = getProductos();
            productos.unshift({ nombre: nombre.trim(), precio: precio, img: img.trim() });
            saveProductos(productos);
            await window.renderProductos();
            if (typeof window.updateAdminUI === 'function') window.updateAdminUI();
        });
    });

    // UI helper para mostrar/ocultar botón add-product y marcar editable
    window.updateAdminUI = function() {
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) addProductBtn.style.display = (isAdmin ? '' : 'none');
        document.querySelectorAll('.productos .producto h3, .productos .producto p').forEach(el => {
            el.contentEditable = Boolean(isAdmin);
        });
    };

})();