# Nonstop Typing App - Frontend

[![Deploy Status](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](#) [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)](#)

> **Demo en vivo:** [Tu Link de Vercel Acá](https://nonstop-typingapp.vercel.app/)

Aplicación web para practicar mecanografía de forma continua, enfocada en mejorar la velocidad, precisión y consistencia del usuario. Permite realizar sesiones de escritura, registrar estadísticas y visualizar el progreso a lo largo del tiempo mediante gráficos interactivos.

El backend de este proyecto (API y persistencia de datos) está desarrollado en **Django** y se encuentra desplegado en **Render**. Puedes encontrar el repositorio del backend [aquí](https://github.com/LeitoGonzalez/nonstop-backend).

---

## Funcionalidades

- **Práctica continua:** Sesiones de mecanografía ininterrumpidas.
- **Métricas detalladas:** Medición en tiempo real de WPM (palabras por minuto), precisión, cantidad de errores y puntaje final.
- **Historial y progreso:** Registro de resultados por sesión y gráfico de barras mostrando la evolución del puntaje.
- **Autenticación:** Sistema de registro y login de usuarios.
- **Internacionalización:** Soporte para múltiples idiomas.
- **Modo Offline/Local:** Posibilidad de usar la aplicación sin cuenta mediante almacenamiento local (`localStorage`).

---

## Tecnologías Utilizadas

- **Core:** React, Vite
- **Enrutamiento:** React Router
- **Visualización de Datos:** Chart.js
- **Estilos:** CSS puro

---

## Modos de Uso

La aplicación está diseñada para ser flexible y puede funcionar de dos maneras:

### 1. Sin backend (Modo Local)
- Ideal para pruebas rápidas.
- Las estadísticas y el historial se guardan en el `localStorage` del navegador.
- No requiere iniciar sesión.

### 2. Con backend activo (Recomendado)
- Se habilita el registro y el login.
- Los resultados se asocian a cada usuario.
- El historial se sincroniza y se obtiene directamente desde la API.

---

## Instalación del frontend

```bash
git clone https://github.com/tu-usuario/nonstop-Frontend.git
cd nonstop-Frontend
npm install
npm run dev
```

La aplicación se ejecuta por defecto en: http://localhost:5173

## Uso con y sin backend

### Sin backend:
- La aplicación funciona en modo local
- Las estadísticas se guardan en localStorage
- No es necesario iniciar sesión

### Con backend activo:
- Se habilita el registro y el login
- Los resultados se guardan por usuario
- El historial se obtiene desde la API
- Endpoint esperado del backend: http://127.0.0.1:8000

## Estado del proyecto
Proyecto en desarrollo.
Las funcionalidades principales están implementadas y se continúa trabajando en mejoras visuales y nuevas métricas.

### Autor
Desarrollado por Leo.
