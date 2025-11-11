<!-- Vincular scripts externos: primero script.js (globals y UI general), luego producto.js (render productos) -->

    <script src="js/script.js"></script>
    <script src="js/producto.js"></script>

    <!-- Llamada para inicializar datos y renderizar productos -->
    <script>
    document.addEventListener('DOMContentLoaded', function(){
        if (typeof renderProductos === 'function') renderProductos();
        if (typeof renderComentarios === 'function') renderComentarios();
        if (typeof updateAdminUI === 'function') updateAdminUI();
    });
    </script>
        
    
</body>
<footer>
        &copy; 2025 MIAUtomotriz
    </footer>
</html>