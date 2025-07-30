# CompanyCity Architecture

## Filosofía de Diseño

CompanyCity utiliza una arquitectura híbrida que combina lo mejor de Web Components y ES6 Classes:

- **30% Web Components**: Para elementos de UI que se benefician de encapsulación
- **70% ES6 Classes**: Para lógica de negocio y renderizado 3D

## Decisiones Arquitectónicas Clave

### 1. Por qué Híbrido?

#### ✅ Web Components donde brillan:
- **Encapsulación de estilos**: Shadow DOM para UI components
- **Reutilización**: Elementos UI que aparecen múltiples veces
- **API declarativa**: `<cc-navigation>` es más claro que `new Navigation()`

#### ✅ Clases ES6 donde son mejores:
- **Performance**: Three.js sin overhead de Shadow DOM
- **Flexibilidad**: Acceso directo a WebGL/Canvas
- **Simplicidad**: Menos ceremonial para lógica pura

### 2. Three.js fuera de Shadow DOM

```javascript
// ❌ NO hacer esto
class Scene3D extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Three.js no funciona bien aquí
  }
}

// ✅ Hacer esto
class SceneManager {
  constructor(container) {
    this.renderer = new THREE.WebGLRenderer();
    container.appendChild(this.renderer.domElement); // DOM directo
  }
}
```

### 3. Estado Reactivo Simple

En lugar de librerías complejas, usamos Proxy nativo:

```javascript
class StateManager extends EventTarget {
  constructor() {
    super();
    this.state = new Proxy({}, {
      set: (target, key, value) => {
        const oldValue = target[key];
        target[key] = value;
        this.dispatchEvent(new CustomEvent('state-change', {
          detail: { key, value, oldValue }
        }));
        return true;
      }
    });
  }
}
```

### 4. Navegación como Transición de Cámara

En lugar de cambiar componentes, movemos la cámara:

```javascript
class Navigation {
  navigateToLevel(targetLevel, path) {
    // No cambiamos de componente
    // Movemos la cámara al nuevo nivel
    const target = this.getTargetPosition(path);
    this.animator.cameraTo(target, 2000); // 2 segundos
    
    // Actualizamos qué objetos son visibles
    this.updateVisibility(targetLevel);
  }
}
```

### 5. Patrones de Organización

Cada nivel tiene patrones específicos que definen cómo se organizan sus elementos:

#### District Patterns:
```javascript
const DISTRICT_PATTERNS = {
  cyclic: CyclicLayout,    // Circular flow (Market)
  spatial: SpatialLayout,  // Distributed (Technology)
  linear: LinearLayout,    // Sequential (Delivery)
  hub: HubLayout          // Central hub (Finance)
};
```

#### Building Patterns:
```javascript
const BUILDING_PATTERNS = {
  pipeline: PipelineLayout,        // Sequential stages
  parallel: ParallelLayout,        // Concurrent processes
  orchestrator: OrchestratorLayout, // Central coordination
  feedback: FeedbackLayout         // Loop systems
};
```

## Flujo de Datos

```
User Input → Event → StateManager → SceneManager → Three.js → Render
     ↑                                    ↓
     ←─────── UI Update ←── Web Components
```

## Estructura de Componentes

### Web Components (UI Layer)

```javascript
// Solo 4 componentes principales
<company-city-app>           // Shell
  <cc-navigation />          // Breadcrumb navigation
  <div id="viewport" />      // Three.js render target
  <cc-inspector />           // Detail panel
  <cc-overlay />             // Metrics HUD
</company-city-app>
```

### ES6 Classes (Logic Layer)

```javascript
// Managers principales
SceneManager      // Three.js scene, camera, renderer
StateManager      // Application state
Navigation        // Level transitions
DataSync          // WebSocket/API communication
EntityTracker     // Entity journey tracking
MetricsCollector  // Performance & business metrics
```

### Scene Classes (por nivel)

```javascript
EcosystemScene    // Level 0: Multiple companies
CompanyScene      // Level 1: 6 districts
DistrictScene     // Level 2: Buildings with patterns
BuildingScene     // Level 3: Modules with patterns
ModuleScene       // Level 4: Elements
ElementScene      // Level 5: Instances
```

## Performance Optimizations

### 1. Level of Detail (LOD)
```javascript
// Objetos simples cuando están lejos
if (distance > 200) {
  return simplifiedGeometry;
} else {
  return detailedGeometry;
}
```

### 2. Frustum Culling
```javascript
// Solo renderizar lo que está en vista
if (!frustum.containsPoint(object.position)) {
  object.visible = false;
}
```

### 3. Instanced Rendering
```javascript
// Una geometría, múltiples instancias
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.InstancedMesh(geometry, material, 1000);
```

### 4. Object Pooling
```javascript
// Reutilizar objetos en lugar de crear/destruir
class ParticlePool {
  constructor(size) {
    this.pool = Array(size).fill().map(() => new Particle());
    this.available = [...this.pool];
    this.active = [];
  }
}
```

## Navegación y Rutas

### 11,520 Caminos Únicos

```
4 empresas × 6 distritos = 24 rutas (nivel 1→2)
24 × 6 edificios = 144 rutas (nivel 2→3)
144 × 4 módulos = 576 rutas (nivel 3→4)
576 × 4 elementos = 2,304 rutas (nivel 4→5)
2,304 × 5 instancias = 11,520 endpoints
```

### Path Structure
```javascript
const path = [
  'ecosystem',      // Level 0
  'coca-cola',      // Level 1: Company
  'market',         // Level 2: District
  'consideration',  // Level 3: Building
  'demo',          // Level 4: Module
  'enterprise-v21'  // Level 5: Element
];
```

## Event System

### Eventos Principales

```javascript
// Navegación
navigation:zoom-in
navigation:zoom-out
navigation:level-change

// Selección
entity:select
entity:deselect
entity:hover

// Estado
state:change
metrics:update

// Performance
render:frame
performance:warning
```

## Security Considerations

### 1. No localStorage/sessionStorage
```javascript
// ❌ NO usar en artifacts de Claude
localStorage.setItem('state', JSON.stringify(state));

// ✅ Usar memoria
this.state = { ...newState };
```

### 2. Input Sanitization
```javascript
// Siempre sanitizar input del usuario
sanitizeInput(userInput) {
  return userInput
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 1000);
}
```

### 3. CSP Headers
```javascript
// Content Security Policy
"default-src 'self'; script-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline';"
```

## Testing Strategy

### Unit Tests
- Lógica de navegación
- Cálculos de posición
- Estado reactivo

### Integration Tests
- Flujo completo de navegación
- Sincronización de datos
- Renderizado de escenas

### E2E Tests
- User journey completo
- Performance bajo carga
- Responsive design

## Build & Deploy

### Development
```bash
npm run dev
# Vite dev server con HMR
```

### Production
```bash
npm run build
# Optimizado con tree-shaking
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## Future Considerations

### VR/AR Support
- WebXR API para experiencias inmersivas
- Controles espaciales

### Multi-user
- Collaborative exploration
- Shared cursors/selections

### AI Integration
- Pathfinding inteligente
- Recomendaciones de navegación
- Anomaly detection

## Principios de Desarrollo

1. **KISS**: Keep It Simple, Stupid
2. **DRY**: Don't Repeat Yourself
3. **YAGNI**: You Aren't Gonna Need It
4. **Performance First**: Siempre 60 FPS
5. **Accessibility**: Navegable con teclado

---

Esta arquitectura permite escalar a miles de entidades manteniendo performance y claridad de código.