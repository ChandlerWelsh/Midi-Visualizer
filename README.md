# Synthesia

**Synthesia** is a powerful, real-time visualizer that reacts to both Audio (microphone) and MIDI input. Built with React, Three.js, and WebMidi, it allows you to create complex, layered visual compositions that pulse and evolve with your music.

## Features

- 🎵 **Multi-Modal Input**: Drive visuals with Microphone audio, MIDI notes/CCs, or a mix of both.
- 🎨 **Layer System**: Compose visuals using multiple layers (Particles, Spirals, Terrain, Waveforms, etc.).
- 🎛️ **MIDI Mapping**: Map physical MIDI knobs and faders to any slider in the UI.
- 🌊 **Audio Reactivity**: Visuals respond to frequency and amplitude data.
- 🚀 **High Performance**: Powered by Three.js and React Three Fiber.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

## Usage Guide

### 1. Audio & MIDI Setup
- **Input Mode**: Click the mode toggle in the sidebar to switch between:
    - **AUDIO**: Visuals react primarily to microphone input.
    - **MIDI**: Visuals react to MIDI note velocity and CC values.
    - **MIX**: Combines both inputs for maximum versatility.
- **MIDI Devices**: Select your MIDI controller from the dropdown in the sidebar. If none are detected, ensure your device is plugged in before opening the app (or refresh the page).

### 2. Working with Layers
The **Layers Panel** is the heart of Synthesia.
- **Add Layer**: Click `+ Add Layer` to create a new visual element.
- **Visual Types**: Select from various generators like *Particles*, *Shapes*, *Spiral*, *Terrain*, etc.
- **Blend Modes**: Experiment with *Add*, *Screen*, or *Multiply* to create complex compositing effects.
- **Controls**:
    - **Opacity**: Master transparency for the layer.
    - **Reactivity/Midi Sense**: How strongly the layer responds to dynamic input (volume/velocity).

### 3. MIDI Mapping (Learn Mode)
You can map physical MIDI controls to almost any slider in the interface.

1. **Enable Learn Mode**: Toggle the **"Learn"** switch at the top of the sidebar.
2. **Select UI Control**: Click on a slider (e.g., "Speed", "Radius", "Opacity") you want to control. It will highlight to indicate it's waiting for input.
3. **Move MIDI Control**: Turn a knob or move a fader on your MIDI controller.
4. **Link Established**: The UI will confirm the mapping (e.g., "Mapped to CC 74").
5. **Exit Learn Mode**: Toggle "Learn" off to resume normal operation.

Active mappings are listed in the **Mapping Panel** at the bottom of the sidebar, where you can delete them individually.

## Technology Stack

- **Core**: React 19, TypeScript, Vite
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **State Management**: Zustand
- **Audio/MIDI**: Web Audio API, WebMidi.js
