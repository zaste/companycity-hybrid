# **CompanyCity: Especificación Técnica Nativa**

## **Stack Propuesto: Web Platform Native**

### **Core Technologies**
```javascript
// Rendering 3D
- WebGL 2.0 (nativo)
- WebGPU (cuando esté disponible)
- OffscreenCanvas (workers)

// Componentes
- Web Components nativos
- Custom Elements v1
- Shadow DOM v1
- CSS Custom Properties

// Estado
- IndexedDB (persistencia)
- BroadcastChannel (tabs sync)
- Service Workers (offline)

// Performance
- WebAssembly (cálculos pesados)
- SharedArrayBuffer (parallelismo)
- Atomics (sincronización)
```

## **Arquitectura Sin Framework**

### **1. Custom Element Base**
```javascript
class CityElement extends HTMLElement {
  static observedAttributes = ['level', 'zoom', 'data-source'];
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.abortController = new AbortController();
    
    // WebGL context
    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    
    // Worker pool para cálculos
    this.workerPool = new WorkerPool(navigator.hardwareConcurrency);
  }
  
  connectedCallback() {
    this.shadowRoot.appendChild(this.canvas);
    this.setupIntersectionObserver();
    this.setupResizeObserver();
    this.initializeRenderer();
  }
  
  // Lazy loading con Intersection Observer
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startRendering();
        } else {
          this.pauseRendering();
        }
      });
    });
    observer.observe(this);
  }
}

customElements.define('company-city', CityElement);
```

### **2. Renderer WebGL Puro**
```javascript
class CityRenderer {
  constructor(gl) {
    this.gl = gl;
    this.programs = new Map();
    this.buffers = new Map();
    this.textures = new Map();
    
    // Instanced rendering para buildings
    this.instancedArrays = gl.getExtension('ANGLE_instanced_arrays');
    
    // VAOs para performance
    this.vaoExt = gl.getExtension('OES_vertex_array_object');
  }
  
  // Shader compilation con cache
  async loadShader(name) {
    // Check cache first
    const cached = await caches.match(`/shaders/${name}`);
    if (cached) return cached.text();
    
    // Compile and cache
    const response = await fetch(`/shaders/${name}`);
    const source = await response.text();
    
    const cache = await caches.open('shaders-v1');
    cache.put(`/shaders/${name}`, response.clone());
    
    return source;
  }
  
  // Render con frustum culling
  render(viewMatrix, projectionMatrix, nodes) {
    const frustum = this.calculateFrustum(viewMatrix, projectionMatrix);
    
    // Cull nodes fuera del frustum
    const visibleNodes = nodes.filter(node => 
      frustum.containsSphere(node.boundingSphere)
    );
    
    // Sort por distancia (front-to-back)
    visibleNodes.sort((a, b) => a.distance - b.distance);
    
    // Batch por material
    const batches = this.batchByMaterial(visibleNodes);
    
    // Render cada batch
    batches.forEach(batch => {
      this.gl.useProgram(batch.program);
      this.renderBatch(batch);
    });
  }
}
```

### **3. Sistema de Partículas con WebGL**
```javascript
class ParticleSystem {
  constructor(gl, maxParticles = 100000) {
    this.gl = gl;
    this.maxParticles = maxParticles;
    
    // Transform feedback para physics en GPU
    this.transformFeedback = gl.createTransformFeedback();
    
    // Double buffering para update
    this.buffers = {
      position: [
        gl.createBuffer(),
        gl.createBuffer()
      ],
      velocity: [
        gl.createBuffer(),
        gl.createBuffer()
      ]
    };
    
    this.currentBuffer = 0;
  }
  
  update(deltaTime) {
    const gl = this.gl;
    
    // Swap buffers
    this.currentBuffer = 1 - this.currentBuffer;
    
    // Bind para transform feedback
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.transformFeedback);
    
    // Update en GPU
    gl.useProgram(this.updateProgram);
    gl.uniform1f(this.deltaTimeLocation, deltaTime);
    
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, this.activeParticles);
    gl.endTransformFeedback();
  }
}
```

### **4. Web Workers para Cálculos**
```javascript
// worker-pool.js
class WorkerPool {
  constructor(size = 4) {
    this.workers = Array(size).fill(null).map(() => 
      new Worker('/workers/city-calculator.js', { type: 'module' })
    );
    this.queue = [];
    this.busy = new Map();
  }
  
  async calculate(task, transferables = []) {
    const worker = await this.getAvailableWorker();
    
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      
      worker.onmessage = (e) => {
        if (e.data.id === id) {
          this.releaseWorker(worker);
          resolve(e.data.result);
        }
      };
      
      worker.postMessage({ id, task }, transferables);
    });
  }
}

// city-calculator.js (worker)
self.onmessage = async (e) => {
  const { id, task } = e.data;
  
  switch(task.type) {
    case 'layout':
      const result = calculateForceDirectedLayout(task.nodes);
      self.postMessage({ id, result }, [result.buffer]);
      break;
      
    case 'pathfinding':
      const path = await calculatePath(task.from, task.to);
      self.postMessage({ id, result: path });
      break;
  }
};
```

### **5. Estado con BroadcastChannel**
```javascript
class CityState {
  constructor() {
    this.channel = new BroadcastChannel('company-city-state');
    this.state = new Map();
    
    // IndexedDB para persistencia
    this.db = null;
    this.initDB();
    
    // Sync entre tabs
    this.channel.onmessage = (e) => {
      this.handleStateUpdate(e.data);
    };
  }
  
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CompanyCity', 1);
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        
        // Store para estado
        if (!db.objectStoreNames.contains('state')) {
          db.createObjectStore('state', { keyPath: 'id' });
        }
        
        // Store para cache de geometría
        if (!db.objectStoreNames.contains('geometry')) {
          const store = db.createObjectStore('geometry', { keyPath: 'id' });
          store.createIndex('level', 'level', { unique: false });
        }
      };
      
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve();
      };
    });
  }
  
  async updateState(key, value) {
    // Update local
    this.state.set(key, value);
    
    // Persist
    const tx = this.db.transaction(['state'], 'readwrite');
    await tx.objectStore('state').put({ id: key, value });
    
    // Broadcast
    this.channel.postMessage({ type: 'update', key, value });
  }
}
```

### **6. Streaming de Datos con EventSource**
```javascript
class CityDataStream {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.eventSource = null;
    this.reconnectDelay = 1000;
    
    // Streams para diferentes tipos de datos
    this.streams = new Map();
    
    this.connect();
  }
  
  connect() {
    this.eventSource = new EventSource(this.endpoint);
    
    this.eventSource.onopen = () => {
      console.log('Data stream connected');
      this.reconnectDelay = 1000;
    };
    
    this.eventSource.onerror = () => {
      this.eventSource.close();
      setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
    };
    
    // Diferentes tipos de eventos
    this.eventSource.addEventListener('metrics', (e) => {
      const data = JSON.parse(e.data);
      this.updateMetrics(data);
    });
    
    this.eventSource.addEventListener('flow', (e) => {
      const data = JSON.parse(e.data);
      this.updateFlows(data);
    });
  }
  
  // Stream processing con TransformStream
  createProcessingStream(type) {
    return new TransformStream({
      transform(chunk, controller) {
        // Process según tipo
        const processed = processData(type, chunk);
        controller.enqueue(processed);
      }
    });
  }
}
```

### **7. WebAssembly para Performance Crítica**
```rust
// city_physics.rs -> compile to WASM
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct CityPhysics {
    nodes: Vec<Node>,
    springs: Vec<Spring>,
}

#[wasm_bindgen]
impl CityPhysics {
    pub fn new(node_count: usize) -> CityPhysics {
        CityPhysics {
            nodes: Vec::with_capacity(node_count),
            springs: Vec::new(),
        }
    }
    
    pub fn step(&mut self, delta_time: f32) {
        // Aplicar fuerzas
        for spring in &self.springs {
            let force = spring.calculate_force(&self.nodes);
            self.nodes[spring.node_a].apply_force(force);
            self.nodes[spring.node_b].apply_force(-force);
        }
        
        // Integrar velocidades
        for node in &mut self.nodes {
            node.integrate(delta_time);
        }
    }
    
    pub fn get_positions(&self) -> Vec<f32> {
        self.nodes.iter()
            .flat_map(|n| vec![n.x, n.y, n.z])
            .collect()
    }
}
```

### **8. Progressive Web App**
```javascript
// service-worker.js
const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  geometry: `geometry-${CACHE_VERSION}`,
  textures: `textures-${CACHE_VERSION}`,
  data: `data-${CACHE_VERSION}`
};

// Cache estratégico
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Geometría: cache-first
  if (url.pathname.startsWith('/geometry/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetchAndCache(event.request))
    );
    return;
  }
  
  // API data: network-first con fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAMES.data).then(cache => 
            cache.put(event.request, clone)
          );
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
});
```

### **9. View Transitions API**
```javascript
class CityNavigator {
  async navigateToLevel(newLevel) {
    // Check if API is available
    if (!document.startViewTransition) {
      this.immediateTransition(newLevel);
      return;
    }
    
    // Capture current state
    const transition = document.startViewTransition(async () => {
      // Update DOM
      await this.updateLevel(newLevel);
    });
    
    // Animate with CSS
    await transition.ready;
    
    // Custom animation for 3D elements
    this.animate3DTransition(transition);
  }
  
  animate3DTransition(transition) {
    // Morph between levels
    const oldCanvas = document.querySelector('::view-transition-old(city-canvas)');
    const newCanvas = document.querySelector('::view-transition-new(city-canvas)');
    
    // Custom WebGL transition
    this.morphRenderer.morph(oldCanvas, newCanvas);
  }
}
```

### **10. CSS Containment para Performance**
```css
/* Componente base con containment */
company-city {
  display: block;
  contain: layout style paint;
  content-visibility: auto;
  contain-intrinsic-size: 100vw 100vh;
}

/* Transiciones nativas con GPU */
.city-level {
  transform: translateZ(0); /* Force GPU layer */
  will-change: transform, opacity;
}

/* Custom properties para theming */
:root {
  --city-bg-primary: #0a0a0f;
  --city-accent: #8b5cf6;
  --city-success: #00ff88;
  --city-warning: #ffaa00;
  --city-critical: #ff0055;
}

/* Container queries para responsive */
@container (min-width: 768px) {
  .city-controls {
    flex-direction: row;
  }
}

/* Animations con Web Animations API */
@keyframes pulse {
  from { 
    scale: 1;
    filter: brightness(1);
  }
  to { 
    scale: 1.1;
    filter: brightness(1.5);
  }
}
```

## **Ventajas del Enfoque Nativo**

### **1. Performance Superior**
- Sin overhead de frameworks
- Acceso directo a GPU
- Workers para paralelismo real
- WASM para cálculos críticos

### **2. Calidad Visual**
- WebGL 2.0 = shaders avanzados
- Transform feedback = partículas masivas
- Instanced rendering = miles de buildings
- WebGPU futuro = compute shaders

### **3. Experiencia Fluida**
- View Transitions API = morphing suave
- OffscreenCanvas = rendering en worker
- Content-visibility = render solo visible
- IntersectionObserver = lazy loading

### **4. Escalabilidad**
- Web Components = verdadera modularidad
- Sin dependencias externas
- Bundle size mínimo
- Tree shaking natural

### **5. Futuro-Proof**
- APIs estándar W3C
- Sin lock-in de framework
- Compatible con WebGPU
- Progressive enhancement

## **Comparación Visual**

### **Con Frameworks (Three.js + React)**
```javascript
// ~300KB min + gzip
// Multiple render passes
// Virtual DOM overhead
// Limited by React reconciliation
```

### **Nativo Propuesto**
```javascript
// ~50KB min + gzip
// Direct GPU access
// Zero overhead
// Limited solo por hardware
```

## **Resultado: MEJOR calidad visual**

1. **Más partículas** (100k vs 10k)
2. **Shaders más complejos** (sin abstracción)
3. **Transiciones más fluidas** (View Transitions API)
4. **Menor latencia** (sin VDOM)
5. **Efectos imposibles en frameworks** (compute shaders)

## **Conclusión**

El enfoque nativo no solo mantiene la calidad visual de CompanyCity - la **mejora significativamente** mientras reduce complejidad y mejora performance. Es más trabajo inicial pero resulta en una experiencia superior y más mantenible a largo plazo.
