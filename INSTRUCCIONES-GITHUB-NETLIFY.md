# 📚 Guía de Electrocardiografía — Libro Digital

Repositorio del libro digital interactivo de ECG para la FISIOUANL.

---

## 🚀 Cómo sincronizar el libro automáticamente

Este repositorio incluye un **GitHub Actions Workflow** que descarga automáticamente todos los archivos del libro desde Genspark y los sube a este repositorio, listo para Netlify.

### ▶️ Pasos para subir el workflow y usarlo

#### Paso 1 — Subir el archivo del workflow a GitHub

1. En tu repositorio, haz clic en **Add file → Upload files**
2. Sube el archivo: `.github/workflows/sync-book.yml`
   - ⚠️ Importante: la ruta debe quedar exactamente así en el repo:  
     `.github/workflows/sync-book.yml`
3. Escribe el mensaje: *"Agregar workflow de sincronización"*
4. Haz clic en **Commit changes**

> **Truco para crear la carpeta**: en GitHub puedes escribir directamente el nombre de ruta en el campo de nombre de archivo. Escribe `.github/workflows/sync-book.yml` y GitHub crea las carpetas automáticamente.

---

#### Paso 2 — Ejecutar el workflow manualmente

1. Ve a la pestaña **Actions** en tu repositorio
2. En el panel izquierdo selecciona: **📚 Sincronizar Libro ECG desde Genspark**
3. Haz clic en **Run workflow** → **Run workflow** (botón verde)
4. Espera ~1–2 minutos
5. Verás ✅ verde cuando termine

Después de esto, todos los archivos del libro estarán en tu repositorio.

---

#### Paso 3 — Conectar con Netlify

1. Entra a [https://app.netlify.com](https://app.netlify.com)
2. Haz clic en **Add new site → Import an existing project**
3. Elige **GitHub**
4. Autoriza Netlify y selecciona el repo `Libro-ekg-fisiouanl`
5. Configuración:
   - **Branch**: `main`
   - **Build command**: *(dejar vacío)*
   - **Publish directory**: `/` *(o dejar vacío)*
6. Haz clic en **Deploy site**

¡Listo! Netlify te dará una URL pública como `https://tu-libro-ecg.netlify.app`.

---

## 🔄 Flujo de trabajo para actualizaciones

```
Editar en Genspark
       ↓
Ir a Actions en GitHub → Run workflow
       ↓
GitHub descarga los archivos nuevos automáticamente
       ↓
Netlify detecta el cambio y redespliega
       ↓
Tu sitio en vivo se actualiza 🎉
```

---

## 📁 Estructura del proyecto

```
Libro-ekg-fisiouanl/
├── index.html              ← Portada con animación ECG
├── chapter-1.html          ← Fundamentos Fisiológicos y Técnicos
├── chapter-2.html          ← Anatomía de las Derivaciones
├── chapter-3.html          ← Componentes del Trazado Normal
├── chapter-4.html          ← Metodología de Interpretación
├── chapter-5.html          ← Patologías Básicas
├── chapter-6.html          ← Talleres de Práctica
├── ecg-monitor.html        ← Monitor ECG interactivo
├── css/
│   └── style.css           ← Estilos globales (modo oscuro/claro)
├── js/
│   ├── main.js             ← Navegación, búsqueda, progreso
│   └── ecg-monitor.js      ← Motor del monitor ECG animado
├── images/
│   ├── potencial-accion-ecg.png
│   ├── regiones-cardiacas-ecg.png
│   ├── derivaciones-frontales.png
│   └── electrodos-precordiales2.png
└── .github/
    └── workflows/
        └── sync-book.yml   ← ← ← ESTE ARCHIVO
```

---

## 🛠️ Tecnologías usadas

- HTML5 + CSS3 + JavaScript (Vanilla)
- Canvas API para el monitor ECG animado
- SVG + CSS animations para la portada
- Sin frameworks, sin dependencias pesadas

---

## ❓ Problemas comunes

| Problema | Solución |
|---|---|
| El workflow falla con error 403 | Verifica que la URL de Genspark sigue activa |
| Netlify no actualiza | Ve a Deploys → Trigger deploy → Deploy site |
| Las imágenes no cargan | Asegúrate de que la carpeta `images/` tiene todos los archivos |

---

*Actualizado automáticamente por GitHub Actions*
