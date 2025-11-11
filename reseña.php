<?php include 'header.php' ?>
  <main>
    <h2>Contacto / Reseñas</h2>

    <!-- Formulario de reseña (manteniendo lo anterior y agregando campo nombre) -->
    <section class="reseña-section" style="max-width:720px;margin:1rem auto;padding:1rem;">
      <form id="comentario-form">
        <label for="comentario-nombre">Nombre (obligatorio)</label><br>
        <input id="comentario-nombre" name="nombre" type="text" placeholder="Tu nombre" required
               style="width:100%;padding:.6rem;margin:.4rem 0;border-radius:6px;border:1px solid #ccc;">
        <label for="comentario-text">Comentario (obligatorio)</label><br>
        <textarea id="comentario-text" name="texto" placeholder="Escribe tu reseña..." rows="6" required
                  style="width:100%;padding:.8rem;margin:.4rem 0;border-radius:6px;border:1px solid #ccc;resize:vertical;"></textarea>
        <div style="text-align:right;">
          <button type="submit" id="comentario-submit" style="padding:.6rem 1rem;border-radius:6px;">Enviar reseña</button>
        </div>
      </form>
    </section>

    <!-- Lista de reseñas (mantener existente) -->
    <section class="reseñas-lista" style="max-width:720px;margin:0 auto;padding:1rem;">
      <h3 id="reseñas-title">Reseñas</h3>
      <div id="comentarios-list"></div>
    </section>
  </main>
<?php include 'footer.php' ?>
