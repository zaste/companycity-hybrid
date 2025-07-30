# CompanyCity Hybrid Architecture

3D Infrastructure Visualization System with 6-level navigation:
- Ecosystem → Company → District → Building → Module → Element

## Architecture
- 30% Web Components (UI containers)
- 70% ES6 Classes (logic & rendering)
- Three.js for 3D visualization
- Native Web APIs only

## Structure
```
src/
├── components/     # Web Components for UI
├── scenes/         # Scene management classes
├── core/           # Core services
└── utils/          # Utilities
```