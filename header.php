<?php
session_start();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MIAUtomotriz</title>
    <link rel="icon" type="image/svg+xml" href="media/icon.ico">
    <link rel="stylesheet" href="style03.css">
</head>
<body>
    <header class="site-header">
        <div class="header-left">
            <button id="login-btn" class="login-btn">Login</button>
            <button id="register-btn" class="login-btn">Registrarse</button>
        </div>

        <div class="header-center">
            <h1 class="site-title">MIAUtomotriz</h1>
            <img class="cat-illustration" src="media/logo-miautomotriz.svg" alt="Logo MIAU-tomotriz" />
        </div>

        <div class="header-right">
            <button id="toggle-theme" type="button">Modo oscuro</button>
        </div>

        <nav class="main-nav">
            <a href="index.php">Inicio</a>
            <a href="reseña.php">Reseña</a>
            <a href="contacto.php">Contacto</a>
        </nav>
    </header>

    <!-- Modal de login -->
    <div class="login-modal" id="login-modal" style="display:none;">
        <div class="login-box">
            <button class="close-modal" id="close-login">&times;</button>
            <h2>Iniciar sesión</h2>
            <input type="text" id="login-usuario" placeholder="Usuario">
            <input type="password" id="login-password" placeholder="Contraseña">
            <button id="login-submit">Entrar</button>
        </div>
    </div>

    <!-- Modal de registro -->
    <div class="login-modal" id="register-modal" style="display:none;">
        <div class="login-box">
            <button class="close-modal" id="close-register">&times;</button>
            <h2>Registrarse</h2>
            <input type="text" id="register-usuario" placeholder="Nombre de usuario">
            <input type="email" id="register-email" placeholder="Correo electrónico">
            <input type="password" id="register-password" placeholder="Contraseña">
            <button id="register-submit">Registrar</button>
        </div>
    </div>