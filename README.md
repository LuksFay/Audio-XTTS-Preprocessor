<table>
<tr>
<td width="300"><img src="src/assets/hero.png" width="280" alt="Audio XTTS Preprocessor"></td>
<td>

# 🎙️ Audio XTTS Preprocessor

> *"The difference between a robotic clone and a natural voice is how you prepare the samples."*
> **— Arcade Estudio**

</td>
</tr>
</table>

---

## 📑 Navegación

[📝 1. Descripción](#-1-descripción) · [⚡ 2. Características](#-2-características) · [🔧 3. Cómo funciona](#-3-cómo-funciona) · [📦 4. Instalación](#-4-instalación) · [📁 5. Estructura](#-5-estructura)

---

### 📝 1. Descripción

**Audio XTTS Preprocessor** es una herramienta web que prepara muestras de voz para el sistema de clonación de voz **XTTS v2**, garantizando que tus audios cumplan con los parámetros exactos que el modelo requiere.

**Stack:** React 19 + Vite 8 · Wavesurfer.js · Tailwind CSS 4 · Web Audio API

**Procesamiento 100% local** — ningún archivo sube a servidores, todo corre en tu navegador.

---

### ⚡ 2. Características

<details name="tab">
<summary><b>🎵 Carga de audio</b></summary>

- Drag & drop o selector de archivos
- Compatible con MP3, WAV, MPEG
- Decodificación con Web Audio API
- Visualización instantánea de forma de onda
</details>

<details name="tab">
<summary><b>✂️ Edición visual</b></summary>

- Selección de región por arrastre en la waveform
- **Trim / Crop** — conserva solo la región seleccionada
- **Cut Middle** — elimina la selección y empalma los extremos
- **Remove Start** — borra todo antes del playhead
- **Remove End** — borra todo después del playhead
- Reproducción con play/pause
</details>

<details name="tab">
<summary><b>📤 Exportación optimizada para XTTS v2</b></summary>

- **24,000 Hz** de sample rate (el que XTTS espera)
- **Mono** — downmix estéreo a mono automático
- **WAV** — formato sin pérdida
- Resampling inteligente con OfflineAudioContext
</details>

<details name="tab">
<summary><b>🔒 Privacidad total</b></summary>

- Todo el procesamiento ocurre en el navegador
- No hay backend, no hay subida de archivos
- No se necesita conexión a internet después de cargar la app
</details>

---

### 🔧 3. Cómo funciona

```
Archivo de audio (MP3/WAV)
        │
        ▼
   decodeAudioData() ← Web Audio API
        │
        ▼
   Waveform interactiva ← Wavesurfer.js + Regions plugin
        │
        ▼
   Edición: Trim / Cut / Remove ← manipulación directa del AudioBuffer
        │
        ▼
   Export: processAudioForExport()
        │  ├── Downmix a Mono
        │  └── Resample a 24,000 Hz
        ▼
   audioBufferToWav() → WAV descargable
```

---

### 📦 4. Instalación

```bash
git clone <url-del-repositorio>
cd converter
npm install
npm run dev
```

Para build de producción:

```bash
npm run build   # → carpeta dist/ lista para hosting estático
```

---

### 📁 5. Estructura

```
converter/
├── index.html                  # Entry point (actualizar meta tags)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx                # Punto de entrada React
│   ├── App.jsx                 # Orquestador principal
│   ├── index.css               # Estilos globales
│   ├── assets/
│   │   └── hero.png            # Banner del proyecto
│   └── components/
│       ├── FileUploader.jsx    # Drag & drop + carga
│       ├── WaveformWorkspace.jsx # Visualización + regiones
│       ├── AudioControls.jsx   # Botones de edición
│       └── ExportSection.jsx   # Exportación XTTS v2
│   └── utils/
│       └── audioUtils.js       # slice, concatenate, processAudioForExport
```

---

*Herramienta desarrollada por [Arcade Estudio](https://arcadeestudio.com.br) para potenciar tu flujo de trabajo con clonación de voz por IA.*

[🚀 Probar online →](https://arcadeestudio.com.br)
