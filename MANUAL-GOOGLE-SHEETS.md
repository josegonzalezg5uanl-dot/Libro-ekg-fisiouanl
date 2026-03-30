# Manual: Google Sheets + Apps Script
## Cómo recibir los registros del quiz automáticamente en una hoja de cálculo

> **Tiempo estimado:** 15–20 minutos  
> **Lo que lograrás:** Cada vez que un alumno haga clic en "Enviar", una fila nueva aparecerá automáticamente en tu Google Sheet con todos sus datos de sesión.

---

## Qué vas a construir

```
Alumno hace clic en "Enviar"
        │
        ▼
  Libro digital (JS)
  empaqueta los datos en JSON
        │
        ▼  HTTP POST
  Google Apps Script (Web App)
  — recibe el JSON
  — abre tu Google Sheet
  — agrega una fila por cada respuesta
        │
        ▼
  Tu Google Sheet
  ✅ Nueva fila visible al instante
```

---

## PASO 1 — Crear el Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja nueva.

2. Nómbrala, por ejemplo: **`ECG_FISIOUANL_Registros`**

3. En la pestaña inferior renombra la hoja **`Sheet1`** a **`Sesiones`**
   - Clic derecho en la pestaña → Rename → escribe `Sesiones`

4. **NO pongas encabezados manualmente** — el script los creará solo en la primera ejecución.

5. Copia la **URL** de tu Sheet desde la barra del navegador. La necesitarás en el Paso 3.
   - Ejemplo: `https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F.../edit`
   - El ID del Sheet es la parte entre `/d/` y `/edit` → `1A2B3C4D5E6F...`

---

## PASO 2 — Abrir el editor de Apps Script

1. En tu Google Sheet, ve al menú:
   **Extensions → Apps Script**
   *(En español: Extensiones → Apps Script)*

2. Se abrirá una nueva pestaña con el editor de código.

3. Borra todo el contenido que aparece por defecto (el `function myFunction() {}`).

4. **Pega exactamente el siguiente código:**

---

```javascript
// ============================================================
//  ECG FISIOUANL — Apps Script Receptor de Sesiones
//  Versión 1.0 — 2025
//
//  Recibe un POST con datos de sesión del libro digital
//  y agrega una fila por cada evento (quiz o likert).
// ============================================================

// ── CONFIGURACIÓN ──────────────────────────────────────────
const SHEET_QUIZES        = 'Quizes';         // pestaña para respuestas del quiz
const SHEET_AUTOPERCEP    = 'Autopercepcion'; // pestaña para Likert/autopercepción
const MAX_ROWS_PER_SEND   = 200;              // límite de filas por envío (seguridad)

// Encabezados para la pestaña Quizes
const HEADERS_QUIZES = [
  'Timestamp_Envio',
  'Nombre',
  'Matricula',
  'Inicio_Sesion',
  'Capitulo',
  'Pregunta',
  'Respuesta_Dada',
  'Fue_Correcta',
  'Respuesta_Correcta',
  'Tiempo_seg',
  'Reflexion_Elegida',
  'Puntos',
  'Racha'
];

// Encabezados para la pestaña Autopercepcion
const HEADERS_AUTOPERCEP = [
  'Timestamp_Envio',
  'Nombre',
  'Matricula',
  'Inicio_Sesion',
  'Capitulo',
  'Concepto',
  'Nivel_Num',
  'Nivel_Texto'
];

// ── FUNCIÓN PRINCIPAL: recibe el POST ──────────────────────
function doPost(e) {
  // Cabeceras CORS — permiten que el libro (en cualquier dominio) envíe datos
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    // 1. Parsear el JSON recibido
    const payload = JSON.parse(e.postData.contents);
    const ss      = SpreadsheetApp.getActiveSpreadsheet();

    // 2. Timestamp del momento en que llega al servidor
    const ahora = new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' });

    // ── PESTAÑA QUIZES ──────────────────────────────────────
    const sheetQ = ss.getSheetByName(SHEET_QUIZES);
    if (!sheetQ) {
      return jsonResponse({ ok: false, error: 'Pestaña "' + SHEET_QUIZES + '" no encontrada.' }, corsHeaders);
    }

    // Crear encabezados si está vacía
    if (sheetQ.getLastRow() === 0) {
      sheetQ.appendRow(HEADERS_QUIZES);
      const rQ = sheetQ.getRange(1, 1, 1, HEADERS_QUIZES.length);
      rQ.setFontWeight('bold');
      rQ.setBackground('#1565c0');
      rQ.setFontColor('#ffffff');
      sheetQ.setFrozenRows(1);
    }

    // Insertar filas de Quiz
    const quizRows = [];
    (payload.quizEvents || []).slice(0, MAX_ROWS_PER_SEND).forEach(ev => {
      quizRows.push([
        ahora,
        payload.nombre           || '',
        payload.matricula        || '',
        payload.inicio           || '',
        ev.capitulo              || '',
        ev.pregunta_texto        || '',
        ev.respuesta_dada        || '',
        ev.fue_correcta          ? 'SI' : 'NO',
        ev.respuesta_correcta    || '',
        ev.tiempo_seg            || 0,
        ev.reflexion_elegida     || '',
        ev.puntos                || 0,
        ev.racha                 || 0
      ]);
    });

    if (quizRows.length > 0) {
      sheetQ.getRange(sheetQ.getLastRow() + 1, 1, quizRows.length, HEADERS_QUIZES.length)
            .setValues(quizRows);
      sheetQ.autoResizeColumns(1, 5);
    }

    // ── PESTAÑA AUTOPERCEPCION ──────────────────────────────
    const sheetA = ss.getSheetByName(SHEET_AUTOPERCEP);
    if (!sheetA) {
      return jsonResponse({ ok: false, error: 'Pestaña "' + SHEET_AUTOPERCEP + '" no encontrada.' }, corsHeaders);
    }

    // Crear encabezados si está vacía
    if (sheetA.getLastRow() === 0) {
      sheetA.appendRow(HEADERS_AUTOPERCEP);
      const rA = sheetA.getRange(1, 1, 1, HEADERS_AUTOPERCEP.length);
      rA.setFontWeight('bold');
      rA.setBackground('#2e7d32');
      rA.setFontColor('#ffffff');
      sheetA.setFrozenRows(1);
    }

    // Insertar filas de Likert
    const likertRows = [];
    (payload.likertEvents || []).slice(0, MAX_ROWS_PER_SEND).forEach(ev => {
      likertRows.push([
        ahora,
        payload.nombre    || '',
        payload.matricula || '',
        payload.inicio    || '',
        ev.capitulo       || '',
        ev.concepto       || '',
        ev.nivel_num      || '',
        ev.nivel_texto    || ''
      ]);
    });

    if (likertRows.length > 0) {
      sheetA.getRange(sheetA.getLastRow() + 1, 1, likertRows.length, HEADERS_AUTOPERCEP.length)
            .setValues(likertRows);
      sheetA.autoResizeColumns(1, 5);
    }

    // ── RESPUESTA DE ÉXITO ──────────────────────────────────
    return jsonResponse({
      ok:              true,
      filas_quiz:      quizRows.length,
      filas_likert:    likertRows.length,
      estudiante:      payload.nombre,
      mensaje:         'Sesion registrada correctamente en Google Sheets.'
    }, corsHeaders);

  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() }, corsHeaders);
  }
}

// ── Maneja preflight OPTIONS (CORS) ────────────────────────
function doGet(e) {
  return jsonResponse({ ok: true, mensaje: 'ECG Script activo. Usa POST para enviar datos.' }, {});
}

// ── Helper: respuesta JSON ──────────────────────────────────
function jsonResponse(data, extraHeaders) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
```

---

## PASO 3 — Guardar el script

1. Haz clic en el ícono de **💾 guardar** (o `Ctrl+S` / `Cmd+S`).
2. Nómbralo como quieras, por ejemplo: **`ECG Receptor`**

---

## PASO 4 — Publicar como Web App

> ⚠️ Este es el paso más importante. Si no lo haces, el libro no puede enviar datos.

1. En la barra superior del editor de Apps Script, haz clic en:
   **Deploy → New deployment**
   *(En español: Implementar → Nueva implementación)*

2. Aparece un cuadro. Haz clic en el ícono ⚙️ (engranaje) junto a "Select type" y elige:
   **Web app**

3. Llena los campos así:

   | Campo | Valor |
   |---|---|
   | **Description** | `ECG FISIOUANL v1` |
   | **Execute as** | `Me (tu@correo.com)` |
   | **Who has access** | `Anyone` ← **MUY IMPORTANTE** |

   > "Anyone" es necesario para que el libro (un sitio web externo) pueda enviar datos sin que los alumnos inicien sesión en Google.

4. Haz clic en **Deploy**.

5. Google te pedirá que **autorices los permisos**:
   - Clic en "Authorize access"
   - Elige tu cuenta de Google
   - Verás una pantalla "Google hasn't verified this app" → haz clic en **"Advanced"** → **"Go to ECG Receptor (unsafe)"**
   - Haz clic en **"Allow"**

   > Esta advertencia es normal para scripts propios. Google no ha "verificado" el script porque no está publicado en la tienda de Google, pero lo creaste tú mismo.

6. Después de autorizar, verás una pantalla con:
   ```
   ✅ New deployment created
   Web app URL: https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
   ```

7. **Copia esa URL completa.** La necesitas en el Paso 5.

---

## PASO 5 — Conectar el libro digital con tu Sheet

1. Abre el archivo **`js/main.js`** del proyecto del libro.

2. Busca este bloque de código (aproximadamente línea **381**):

   ```javascript
   // — INTENTO DE ENVÍO —
   // Por ahora usa FormSubmit (correo gratuito sin backend).
   // Sustituir la URL cuando se configure otra opción.
   const ENDPOINT = 'https://formsubmit.co/ajax/ECG_GUIA_FISIOUANL@reemplazar.com';
   ```

   > **Tip para encontrarlo:** usa `Ctrl+F` (o `Cmd+F`) en tu editor y busca el texto `formsubmit.co`

3. Reemplaza **solo la línea del ENDPOINT** con tu URL del Apps Script:

   ```javascript
   // — INTENTO DE ENVÍO —
   // Google Sheets via Apps Script
   const ENDPOINT = 'https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec';
   ```
   *(Sustituye `XXXXXXXXXXXXXXXX` por el ID real — la URL completa que copiaste en el Paso 4)*

4. Guarda el archivo `main.js`.

5. Si el libro está publicado en Netlify, arrastra la **carpeta completa** del proyecto actualizado al panel de Netlify para republicarlo.

---

## PASO 6 — Probar el sistema

1. Abre el libro en el navegador.
2. Identifícate (nombre + matrícula en la portada).
3. Entra al Quiz del Capítulo 1 y responde aunque sea 2 preguntas.
4. Haz clic en el botón **"Enviar"** del header.
5. Deberías ver: `✅ ¡Sesión enviada correctamente!`
6. Abre tu Google Sheet — deberían aparecer filas nuevas.

---

## Estructura de la hoja resultante

Cada envío genera filas en **dos pestañas separadas**:

### Pestaña `Quizes` (encabezado azul 🔵)

| Timestamp_Envio | Nombre | Matricula | Inicio_Sesion | Capitulo | Pregunta | Respuesta_Dada | Fue_Correcta | Respuesta_Correcta | Tiempo_seg | Reflexion_Elegida | Puntos | Racha |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 29/03/2025 10:31 | Ana García | 2150234 | 29/03/2025 10:20 | Capítulo 1 | ¿Cuál es el potencial…? | B. –90 mV | SI | B. –90 mV | 12 | | 145 | 1 |
| 29/03/2025 10:31 | Ana García | 2150234 | 29/03/2025 10:20 | Capítulo 1 | Durante la Fase 2… | A. Na⁺ | NO | C. Ca²⁺ | 8 | Más o menos | -30 | 0 |
| 29/03/2025 10:31 | Ana García | 2150234 | 29/03/2025 10:20 | Capítulo 1 | Durante la Fase 2… | C. Ca²⁺ | SI | C. Ca²⁺ | 19 | | 112 | 1 |

### Pestaña `Autopercepcion` (encabezado verde 🟢)

| Timestamp_Envio | Nombre | Matricula | Inicio_Sesion | Capitulo | Concepto | Nivel_Num | Nivel_Texto |
|---|---|---|---|---|---|---|---|
| 29/03/2025 10:31 | Ana García | 2150234 | 29/03/2025 10:20 | Capítulo 1 | Potencial de Acción Cardíaco | 3 | Lo entiendo pero con dudas |
| 29/03/2025 10:31 | Ana García | 2150234 | 29/03/2025 10:20 | Capítulo 1 | Vectores y deflexiones | 4 | Con pequeñas dudas |

---

## Solución de problemas frecuentes

### ❌ El libro dice "No se pudo enviar"
- **Causa más probable:** La URL del ENDPOINT en `main.js` no está actualizada con tu URL real.
- **Verifica:** Que la URL empiece con `https://script.google.com/macros/s/` y termine en `/exec`.

### ❌ El script corre pero no aparecen filas en el Sheet
- **Causa probable:** El nombre de alguna pestaña no coincide exactamente.
- **Verifica:** Que las pestañas se llamen exactamente `Quizes` y `Autopercepcion` (sin tildes, sin espacios) — igual que `SHEET_QUIZES` y `SHEET_AUTOPERCEP` en el código.

### ❌ Error "Authorization required"
- **Causa:** No completaste el paso de autorizar permisos.
- **Solución:** En Apps Script → Deploy → Manage deployments → edita el deployment existente → vuelve a hacer clic en Deploy y autoriza.

### ❌ La URL expiró o cambió
- Cada vez que editas el script y haces un **nuevo deployment**, la URL cambia.
- Si actualizas el script, usa **"Manage deployments" → editar el deployment existente** para mantener la misma URL.

### ❌ Los datos llegan pero con celdas vacías
- Es normal: las filas de Quiz tienen vacíos en columnas de Likert y viceversa.
- Usa filtros en el Sheet para ver solo `Tipo = Quiz` o `Tipo = Likert`.

---

## Cómo ver el progreso del grupo

Una vez que tienes datos en el Sheet, puedes:

1. **Filtrar por matrícula** para ver el historial de un alumno específico.
2. **Filtrar por `Fue_Correcta = NO`** para identificar qué preguntas tienen más errores.
3. **Insertar tabla dinámica** (Insert → Pivot table) para ver promedio de aciertos por capítulo.
4. **Insertar gráfica** de los niveles de Likert para ver autopercepción del grupo.

---

## Actualizaciones futuras del script

Si necesitas cambiar algo del script (por ejemplo, agregar más columnas), el proceso es:

1. Editar el código en Apps Script.
2. **Deploy → Manage deployments**.
3. Haz clic en el ícono ✏️ (editar) del deployment existente.
4. En "Version" selecciona **"New version"** y haz clic en **Deploy**.
5. La URL **no cambia** — el libro sigue funcionando sin modificaciones.

---

## Notas técnicas importantes

### Bug resuelto: "Enviar" no reconoce el nombre aunque aparece en el header

Este problema fue detectado y corregido en marzo 2025. Si el bug reaparece (por ejemplo, al reinstalar el proyecto desde cero), la causa es:

- `session.js` guarda el nombre del alumno con la clave interna **`identity`**
- Versiones antiguas de `main.js` la buscaban como **`identidad`** (con *d*) — siempre `undefined`
- La corrección en `js/main.js` usa triple fallback:

  ```javascript
  const identidad = sessionData.identity          // clave correcta de session.js
                 || sessionData.identidad         // compatibilidad hacia atras
                 || JSON.parse(localStorage.getItem('ecg_identity') || '{}'); // fallback
  ```

Verifica que esta línea exista en `submitSession()` (alrededor de la línea 353 de `main.js`).

---

*Manual creado para: Guía de Electrocardiografía — FISIOUANL · 2025*  
*Última actualización: 2025-03-29*
