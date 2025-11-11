<?php include 'header.php' ?>
  <main>
    <h2>Contacto</h2>
    <p>Si tienes alguna pregunta, comentario o necesitas asistencia, no dudes en contactarnos a través de los siguientes medios:</p>

    <?php
    // --- Datos del taller ---
    $taller_nombre = "MIAUtomotriz";
    $taller_slogan = "Tu vehículo en las mejores manos";
    $taller_direccion = "Av. Los Pinos 456, Osorno, Chile";
    $taller_telefono = "+56 9 8765 4321";
    $taller_web = "Miautromotriz.contact@gmail.com";
    $taller_horario = "Lun - Vie: 08:30 - 18:30 | Sáb: 09:00 - 13:00";

    $servicios = [
        "Mantenimiento preventivo y correctivo",
        "Revisión de frenos, suspensión y dirección",
        "Diagnóstico computarizado",
        "Cambio de aceite y filtros",
        "Reparación de motor y transmisión",
        "Servicio eléctrico y escáner automotriz",
        "Venta de repuestos y accesorios originales"
    ];

    $compromiso = "Ofrecemos atención personalizada, transparencia total y compromiso con la seguridad y calidad en cada servicio.";
    ?>

    <section id="infografia-taller" style="margin-top:2rem;">
      <div style="max-width:900px;margin:auto;background:#fff;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.1);overflow:hidden;">
        <header style="padding:28px 32px;background:linear-gradient(90deg,#0074d9,#00bcd4);color:#fff;">
          <h2 style="margin:0 0 8px;"><?php echo htmlspecialchars($taller_nombre); ?></h2>
          <p style="margin:0;"><?php echo htmlspecialchars($taller_slogan); ?></p>
        </header>

        <div style="display:flex;flex-wrap:wrap;gap:24px;padding:24px 32px; color:#333;">
          <div style="flex:1 1 300px;min-width:260px;">
            <div style="background:#f8fbff;border-radius:10px;padding:18px;margin-bottom:16px;">
              <h3>Nuestros servicios</h3>
              <ul style="padding-left:18px;margin:8px 0;">
                <?php foreach($servicios as $s): ?>
                  <li><?php echo htmlspecialchars($s); ?></li>
                <?php endforeach; ?>
              </ul>
            </div>

            <div style="background:#f8fbff;border-radius:10px;padding:18px;">
              <h3>Compromiso</h3>
              <p><?php echo htmlspecialchars($compromiso); ?></p>
            </div>
          </div>

          <div style="flex:1 1 260px;min-width:240px;">
            <div style="background:#f8fbff;border-radius:10px;padding:18px;margin-bottom:16px;">
              <h3>Contáctanos</h3>
              <p><?php echo htmlspecialchars($taller_direccion); ?></p>
              <p>📞 <?php echo htmlspecialchars($taller_telefono); ?></p>
              <p>🌐 <?php echo htmlspecialchars($taller_web); ?></p>
              <p>🕒 <?php echo htmlspecialchars($taller_horario); ?></p>
              
            </div>

            <div style="background:#f8fbff;border-radius:10px;padding:18px;">
              <h3>Por qué elegirnos</h3>
              <ul style="padding-left:18px;margin:8px 0;">
                <li>Personal técnico certificado</li>
                <li>Equipos de diagnóstico modernos</li>
                <li>Presupuestos claros y justos</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>

  </main>
  
<?php include 'footer.php' ?>