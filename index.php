<?php include 'header.php' ?>
    <main>
        <h2>Productos Destacados</h2>

        <!-- Contenedor vacío: los productos se cargarán desde js/json/productos.json -->
        <div class="productos" id="productos-container">
            <!-- renderProductos() llenará este contenedor -->
        </div>

        <!-- Botón para administradores: agregar producto (hidden por defecto; mostrado por JS si isAdmin) -->
        <div style="text-align:center;margin-top:1rem;">
            <button id="add-product-btn" class="add-product-btn" style="display:none;padding:.6rem 1rem;border-radius:6px;background:#ffc107;border:none;cursor:pointer;">
                + Agregar producto
            </button>
        </div>
    </main>

    <!-- Botón flotante del carrito -->
    <div class="cart-float-container">
        <button id="floating-cart" type="button" title="Abrir carrito" aria-label="Abrir carrito">🛒</button>   
    </div>

  
    
    <!-- Sidebar del carrito -->
    <div id="carrito-sidebar" style="display:none; position:fixed; top:0; right:0; width:350px; height:100vh; background:#fff; box-shadow:-2px 0 10px rgba(0,0,0,0.2); z-index:2000; padding:2rem 1rem 1rem 1rem; overflow-y:auto;">
        <button id="cerrar-carrito" style="position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
        <h2>Carrito</h2>
        <div id="carrito-lista"></div>
        <div id="carrito-total" style="margin-top:1rem; font-weight:bold;"></div>
    </div>



<?php include 'footer.php' ?>