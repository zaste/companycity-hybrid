# **CompanyCity: Especificación Técnica Nativa**

## **Filosofía Core: Native-First, Zero Dependencies**

### **Principios Fundamentales**
1. **Web Standards sobre frameworks**
2. **Browser APIs nativas sobre librerías**
3. **Performance sobre conveniencia**
4. **Future-proof sobre trends**

---

## **1. Arquitectura Base: Web Components Nativos**

### **1.1 Custom Elements API**
```javascript
// Base class para todos los componentes de CompanyCity
class CityElement extends HTMLElement {
  static observedAttributes = ['level', 'zoom', 'data-source'];
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.abortController = new AbortController();
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.connectDataSource();
  }
  
  disconnectedCallback() {
    this.abortController.abort();
    this.cleanup();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.handleAttributeChange(name, newValue);
    }
  }
}

// Definición de elementos
customElements.define('city-view', CityView);
customElements.define('city-district', CityDistrict);
customElements.define('city-building', CityBuilding);
```

### **1.2 Shadow DOM para Encapsulación**
```javascript
class CityView extends CityElement {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          container-type: size;
        }
        
        /* CSS Containment para performance */
        .district {
          contain: layout style paint;
          content-visibility: auto;
        }
        
        /* CSS Container Queries */
        @container (min-width: 768px) {
          .district {
            --district-size: 120px;
          }
        }
      </style>
      
      <canvas id="main-canvas"></canvas>
      <div id="districts-container">
        <slot name="districts"></slot>
      </div>
    `;
  }
}
```

---

## **2. Rendering: WebGL2 + WebGPU (Progressive)**

### **2.1 WebGL2 Base (Soporte Universal)**
```javascript
class CityRenderer {
  constructor(canvas) {
    // Intentar WebGPU primero, fallback a WebGL2
    this.initRenderer(canvas);
  }
  
  async initRenderer(canvas) {
    // Check WebGPU support
    if ('gpu' in navigator) {
      try {
        this.adapter = await navigator.gpu.requestAdapter();
        this.device = await this.adapter.requestDevice();
        this.context = canvas.getContext('webgpu');
        this.rendererType = 'webgpu';
        this.initWebGPU();
      } catch (e) {
        console.log('WebGPU no disponible, usando WebGL2');
        this.initWebGL2(canvas);
      }
    } else {
      this.initWebGL2(canvas);
    }
  }
  
  initWebGL2(canvas) {
    this.gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
      desynchronized: true, // Mejor performance
      preserveDrawingBuffer: false
    });
    
    this.rendererType = 'webgl2';
    
    // Enable extensions
    this.gl.getExtension('EXT_color_buffer_float');
    this.gl.getExtension('OES_texture_float_linear');
    
    this.setupWebGL2Pipeline();
  }
}
```

### **2.2 OffscreenCanvas para Threading**
```javascript
class CityOffscreenRenderer {
  constructor() {
    if ('OffscreenCanvas' in window) {
      this.worker = new Worker('renderer-worker.js', { type: 'module' });
      this.useOffscreen = true;
    } else {
      this.useOffscreen = false;
    }
  }
  
  async createOffscreenCanvas(canvas) {
    if (this.useOffscreen) {
      const offscreen = canvas.transferControlToOffscreen();
      this.worker.postMessage({
        type: 'init',
        canvas: offscreen
      }, [offscreen]);
    }
  }
}

// renderer-worker.js
self.addEventListener('message', async (e) => {
  if (e.data.type === 'init') {
    const renderer = new CityRenderer(e.data.canvas);
    // Render loop in worker thread
  }
});
```

---

## **3. Data Management: Native APIs**

### **3.1 Streams API para Real-time**
```javascript
class CityDataStream {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.decoder = new TextDecoder();
  }
  
  async connect() {
    const response = await fetch(this.endpoint);
    const reader = response.body.getReader();
    
    // ReadableStream con TransformStream
    const stream = new ReadableStream({
      start(controller) {
        return pump();
        
        function pump() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            
            controller.enqueue(value);
            return pump();
          });
        }
      }
    });
    
    // Transform stream para parsing
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = this.decoder.decode(chunk);
        const events = text.split('\n').filter(Boolean);
        
        events.forEach(event => {
          try {
            const data = JSON.parse(event);
            controller.enqueue(data);
          } catch (e) {
            // Handle parsing errors
          }
        });
      }
    });
    
    return stream.pipeThrough(transformStream);
  }
}
```

### **3.2 IndexedDB para Estado Persistente**
```javascript
class CityStateManager {
  constructor() {
    this.dbName = 'CompanyCityDB';
    this.version = 1;
  }
  
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Object stores
        if (!db.objectStoreNames.contains('viewStates')) {
          db.createObjectStore('viewStates', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'userId' });
        }
        
        if (!db.objectStoreNames.contains('cachedData')) {
          const store = db.createObjectStore('cachedData', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }
  
  async saveState(state) {
    const tx = this.db.transaction(['viewStates'], 'readwrite');
    const store = tx.objectStore('viewStates');
    
    return store.put({
      id: 'current',
      state,
      timestamp: Date.now()
    });
  }
}
```

### **3.3 SharedArrayBuffer para Datos Compartidos**
```javascript
class CitySharedData {
  constructor() {
    // Check COOP/COEP headers para SharedArrayBuffer
    this.canUseShared = crossOriginIsolated;
  }
  
  createSharedMetrics(count) {
    if (this.canUseShared) {
      // Buffer compartido entre workers
      this.metricsBuffer = new SharedArrayBuffer(count * Float32Array.BYTES_PER_ELEMENT * 4);
      this.metrics = new Float32Array(this.metricsBuffer);
      
      // Atomics para sincronización
      this.lockBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
      this.lock = new Int32Array(this.lockBuffer);
    } else {
      // Fallback a ArrayBuffer normal
      this.metrics = new Float32Array(count * 4);
    }
  }
  
  updateMetric(index, value) {
    if (this.canUseShared) {
      // Atomic operation
      Atomics.store(this.metrics, index, value);
      Atomics.notify(this.lock, 0);
    } else {
      this.metrics[index] = value;
    }
  }
}
```

---

## **4. Performance: Observer APIs**

### **4.1 Intersection Observer para Renderizado**
```javascript
class CityViewportManager {
  constructor() {
    this.visibleElements = new Set();
    
    // Observer con múltiples thresholds
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        root: null,
        rootMargin: '50px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
      }
    );
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      
      if (entry.isIntersecting) {
        this.visibleElements.add(element);
        
        // Ajustar LOD según visibilidad
        const visibility = entry.intersectionRatio;
        element.setAttribute('lod-level', 
          visibility > 0.75 ? 'high' :
          visibility > 0.5 ? 'medium' :
          visibility > 0.25 ? 'low' : 'minimal'
        );
        
        element.startRendering();
      } else {
        this.visibleElements.delete(element);
        element.stopRendering();
      }
    });
  }
  
  observe(element) {
    this.observer.observe(element);
  }
}
```

### **4.2 ResizeObserver para Responsive**
```javascript
class CityResponsiveManager {
  constructor() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // Usar device pixel ratio para sharp rendering
        const dpr = window.devicePixelRatio || 1;
        
        // Actualizar canvas size
        if (entry.target.tagName === 'CANVAS') {
          entry.target.width = width * dpr;
          entry.target.height = height * dpr;
          entry.target.style.width = `${width}px`;
          entry.target.style.height = `${height}px`;
        }
        
        // Dispatch custom event
        entry.target.dispatchEvent(new CustomEvent('cityresize', {
          detail: { width, height, dpr }
        }));
      }
    });
  }
  
  observe(element) {
    this.resizeObserver.observe(element);
  }
}
```

### **4.3 Performance Observer para Métricas**
```javascript
class CityPerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      memory: 0,
      loadTime: 0
    };
    
    // Observer para diferentes tipos de performance
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processEntry(entry);
      }
    });
    
    this.observer.observe({ 
      entryTypes: ['measure', 'navigation', 'resource', 'largest-contentful-paint'] 
    });
  }
  
  processEntry(entry) {
    switch(entry.entryType) {
      case 'measure':
        if (entry.name === 'city-render-frame') {
          this.updateFPS(entry.duration);
        }
        break;
        
      case 'navigation':
        this.metrics.loadTime = entry.loadEventEnd - entry.fetchStart;
        break;
        
      case 'largest-contentful-paint':
        this.metrics.lcp = entry.startTime;
        break;
    }
  }
  
  measureFrame(callback) {
    performance.mark('frame-start');
    
    callback();
    
    performance.mark('frame-end');
    performance.measure('city-render-frame', 'frame-start', 'frame-end');
  }
}
```

---

## **5. Comunicación: Native Protocols**

### **5.1 WebRTC para P2P Collaboration**
```javascript
class CityCollaboration {
  constructor() {
    this.peers = new Map();
    this.localStream = null;
  }
  
  async initPeerConnection(peerId) {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };
    
    const pc = new RTCPeerConnection(config);
    
    // Data channel para sincronización de estado
    const dataChannel = pc.createDataChannel('citySync', {
      ordered: true,
      maxRetransmits: 3
    });
    
    dataChannel.onopen = () => {
      console.log('P2P channel abierto con', peerId);
    };
    
    dataChannel.onmessage = (event) => {
      this.handlePeerMessage(peerId, event.data);
    };
    
    // Screen sharing para colaboración
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }
    
    this.peers.set(peerId, { pc, dataChannel });
    
    return pc;
  }
  
  async shareScreen() {
    try {
      this.localStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always"
        },
        audio: false
      });
      
      // Agregar a todas las conexiones existentes
      this.peers.forEach(({ pc }) => {
        this.localStream.getTracks().forEach(track => {
          pc.addTrack(track, this.localStream);
        });
      });
    } catch (err) {
      console.error('Error compartiendo pantalla:', err);
    }
  }
  
  broadcastStateChange(state) {
    const message = JSON.stringify({
      type: 'stateUpdate',
      state,
      timestamp: Date.now()
    });
    
    this.peers.forEach(({ dataChannel }) => {
      if (dataChannel.readyState === 'open') {
        dataChannel.send(message);
      }
    });
  }
}
```

### **5.2 WebTransport para Low Latency**
```javascript
class CityWebTransport {
  constructor(url) {
    this.url = url;
    this.transport = null;
    this.streams = new Map();
  }
  
  async connect() {
    try {
      this.transport = new WebTransport(this.url);
      await this.transport.ready;
      
      console.log('WebTransport conectado');
      
      // Bidirectional streams para diferentes tipos de datos
      this.setupStreams();
      
    } catch (e) {
      console.log('WebTransport no soportado, fallback a WebSocket');
      this.fallbackToWebSocket();
    }
  }
  
  async setupStreams() {
    // Stream para métricas real-time
    const metricsStream = await this.transport.createBidirectionalStream();
    this.streams.set('metrics', metricsStream);
    
    // Stream para eventos
    const eventsStream = await this.transport.createBidirectionalStream();
    this.streams.set('events', eventsStream);
    
    // Reader para incoming data
    this.startReading();
  }
  
  async startReading() {
    const reader = this.transport.incomingBidirectionalStreams.getReader();
    
    while (true) {
      const { value: stream, done } = await reader.read();
      if (done) break;
      
      this.handleIncomingStream(stream);
    }
  }
  
  async sendMetrics(metrics) {
    const stream = this.streams.get('metrics');
    const writer = stream.writable.getWriter();
    
    const data = new TextEncoder().encode(JSON.stringify(metrics));
    await writer.write(data);
    writer.releaseLock();
  }
}
```

---

## **6. Interacción: Pointer & Input APIs**

### **6.1 Pointer Events para Precisión**
```javascript
class CityInteractionManager {
  constructor(element) {
    this.element = element;
    this.activePointers = new Map();
    
    // Pointer events (mejor que mouse/touch)
    element.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    element.addEventListener('pointermove', this.handlePointerMove.bind(this));
    element.addEventListener('pointerup', this.handlePointerUp.bind(this));
    element.addEventListener('pointercancel', this.handlePointerCancel.bind(this));
    
    // Capture para mejor performance
    element.setPointerCapture = true;
  }
  
  handlePointerDown(event) {
    this.activePointers.set(event.pointerId, {
      startX: event.clientX,
      startY: event.clientY,
      startTime: event.timeStamp,
      pressure: event.pressure,
      type: event.pointerType // 'mouse', 'pen', 'touch'
    });
    
    // Capture el pointer
    if (event.target.hasPointerCapture) {
      event.target.setPointerCapture(event.pointerId);
    }
    
    // Haptic feedback para touch
    if (event.pointerType === 'touch' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }
  
  handlePointerMove(event) {
    if (!this.activePointers.has(event.pointerId)) return;
    
    const pointer = this.activePointers.get(event.pointerId);
    const deltaX = event.clientX - pointer.startX;
    const deltaY = event.clientY - pointer.startY;
    
    // Multi-touch gestures
    if (this.activePointers.size === 2) {
      this.handlePinchZoom(event);
    } else if (this.activePointers.size === 1) {
      this.handlePan(deltaX, deltaY);
    }
    
    // Pressure sensitivity para stylus
    if (event.pointerType === 'pen') {
      this.handlePressure(event.pressure);
    }
  }
}
```

### **6.2 Input Events para Controles**
```javascript
class CityInputControls extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <input type="range" 
             id="zoom-control"
             min="0.1" 
             max="10" 
             step="0.1" 
             value="1">
      
      <input type="search" 
             id="city-search"
             incremental
             placeholder="Search...">
    `;
    
    // Input event (mejor que change)
    this.querySelector('#zoom-control').addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('zoomchange', {
        detail: { zoom: parseFloat(e.target.value) },
        bubbles: true
      }));
    });
    
    // Search con incremental
    this.querySelector('#city-search').addEventListener('search', (e) => {
      if (e.target.incremental) {
        this.performSearch(e.target.value);
      }
    });
  }
}

customElements.define('city-controls', CityInputControls);
```

---

## **7. Animación: Web Animations API**

### **7.1 WAAPI para Animaciones Complejas**
```javascript
class CityAnimationSystem {
  constructor() {
    this.animations = new Map();
    this.timeline = new DocumentTimeline();
  }
  
  animateDistrictEntry(element) {
    // Keyframes
    const keyframes = [
      { 
        transform: 'scale(0) translateY(50px)', 
        opacity: 0,
        filter: 'blur(10px)'
      },
      { 
        transform: 'scale(1.1) translateY(-5px)', 
        opacity: 0.8,
        filter: 'blur(2px)',
        offset: 0.7
      },
      { 
        transform: 'scale(1) translateY(0)', 
        opacity: 1,
        filter: 'blur(0px)'
      }
    ];
    
    // Options con easing personalizado
    const options = {
      duration: 600,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      fill: 'forwards',
      // Composite para mejor performance
      composite: 'replace'
    };
    
    const animation = element.animate(keyframes, options);
    
    // Promise-based
    animation.finished.then(() => {
      element.classList.add('entered');
    });
    
    this.animations.set(element, animation);
    
    return animation;
  }
  
  createParticleFlow(from, to) {
    const particle = document.createElement('div');
    particle.className = 'city-particle';
    
    // Motion path animation
    const path = this.calculateBezierPath(from, to);
    
    const animation = particle.animate([
      { offsetDistance: '0%' },
      { offsetDistance: '100%' }
    ], {
      duration: 2000,
      easing: 'ease-in-out',
      // Motion path
      motionPath: path,
      motionRotation: 'auto'
    });
    
    return animation;
  }
  
  // Group animations con sincronización
  async animateTransition(fromLevel, toLevel) {
    const fadeOut = fromLevel.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.8)' }
    ], {
      duration: 300,
      fill: 'forwards'
    });
    
    const fadeIn = toLevel.animate([
      { opacity: 0, transform: 'scale(1.2)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 300,
      fill: 'forwards',
      delay: 200 // Overlap suave
    });
    
    // Esperar ambas
    await Promise.all([
      fadeOut.finished,
      fadeIn.finished
    ]);
  }
}
```

---

## **8. Storage: Cache & Persistence**

### **8.1 Cache API para Assets**
```javascript
class CityCacheManager {
  constructor() {
    this.cacheName = 'city-assets-v1';
    this.modelCache = 'city-models-v1';
    this.dataCache = 'city-data-v1';
  }
  
  async cacheModels() {
    const cache = await caches.open(this.modelCache);
    
    // Cache 3D models y texturas
    const models = [
      '/models/building-lod0.glb',
      '/models/building-lod1.glb',
      '/models/building-lod2.glb',
      '/textures/district-texture.ktx2'
    ];
    
    // Add all con estrategia
    await cache.addAll(models);
  }
  
  async getCachedOrFetch(request) {
    // Buscar en cache primero
    const cached = await caches.match(request);
    if (cached) {
      // Actualizar en background si es antiguo
      const age = Date.now() - new Date(cached.headers.get('date')).getTime();
      if (age > 3600000) { // 1 hora
        this.refreshInBackground(request);
      }
      return cached;
    }
    
    // Fetch y cachear
    const response = await fetch(request);
    const cache = await caches.open(this.dataCache);
    
    // Clone porque response es single-use
    cache.put(request, response.clone());
    
    return response;
  }
  
  async refreshInBackground(request) {
    try {
      const fresh = await fetch(request);
      const cache = await caches.open(this.dataCache);
      await cache.put(request, fresh);
    } catch (e) {
      // Falló actualización, usar cache existente
    }
  }
}
```

### **8.2 FileSystem API para Exports**
```javascript
class CityExportManager {
  constructor() {
    this.supportsFileSystem = 'showSaveFilePicker' in window;
  }
  
  async exportView(cityData) {
    if (this.supportsFileSystem) {
      try {
        // File System Access API
        const handle = await window.showSaveFilePicker({
          suggestedName: 'city-view.json',
          types: [{
            description: 'City View Data',
            accept: { 'application/json': ['.json'] }
          }]
        });
        
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(cityData, null, 2));
        await writable.close();
        
      } catch (e) {
        // Usuario canceló o error
        this.fallbackExport(cityData);
      }
    } else {
      this.fallbackExport(cityData);
    }
  }
  
  fallbackExport(data) {
    // Fallback con download tradicional
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'city-view.json';
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  async importView() {
    if (this.supportsFileSystem) {
      const [handle] = await window.showOpenFilePicker({
        types: [{
          description: 'City View Data',
          accept: { 'application/json': ['.json'] }
        }]
      });
      
      const file = await handle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    }
  }
}
```

---

## **9. Accesibilidad: Native ARIA**

### **9.1 Custom Elements Accesibles**
```javascript
class AccessibleCityElement extends HTMLElement {
  constructor() {
    super();
    
    // ARIA por defecto
    this.setAttribute('role', 'application');
    this.setAttribute('aria-label', 'City visualization');
    
    // Keyboard navigation
    this.tabIndex = 0;
  }
  
  connectedCallback() {
    // Keyboard controls
    this.addEventListener('keydown', this.handleKeyboard.bind(this));
    
    // Screen reader announcements
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('role', 'status');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.appendChild(this.announcer);
  }
  
  handleKeyboard(event) {
    const moves = {
      'ArrowUp': () => this.navigate('north'),
      'ArrowDown': () => this.navigate('south'),
      'ArrowLeft': () => this.navigate('west'),
      'ArrowRight': () => this.navigate('east'),
      'PageUp': () => this.zoomIn(),
      'PageDown': () => this.zoomOut(),
      'Home': () => this.goToCity(),
      'Escape': () => this.exitCurrentView()
    };
    
    const action = moves[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }
  
  announce(message) {
    // Announcer para screen readers
    this.announcer.textContent = message;
    
    // Clear después de anunciar
    setTimeout(() => {
      this.announcer.textContent = '';
    }, 1000);
  }
  
  navigate(direction) {
    // Navegación lógica
    const current = this.querySelector('[aria-current="true"]');
    const next = this.findNextElement(current, direction);
    
    if (next) {
      current.removeAttribute('aria-current');
      next.setAttribute('aria-current', 'true');
      next.focus();
      
      this.announce(`Navigated to ${next.getAttribute('aria-label')}`);
    }
  }
}
```

---

## **10. Modularidad: ES Modules Nativos**

### **10.1 Estructura de Módulos**
```javascript
// city-core.mjs
export class CityCore {
  constructor() {
    this.levels = new Map();
    this.currentLevel = 1;
  }
  
  async loadLevel(level) {
    // Dynamic import para code splitting
    const module = await import(`./levels/level-${level}.mjs`);
    const LevelClass = module.default;
    
    const instance = new LevelClass();
    this.levels.set(level, instance);
    
    return instance;
  }
}

// levels/level-1.mjs (City Level)
export default class CityLevel {
  static dependencies = [
    './renderers/webgl-renderer.mjs',
    './utils/district-layout.mjs'
  ];
  
  async init() {
    // Import dependencies on demand
    const modules = await Promise.all(
      CityLevel.dependencies.map(dep => import(dep))
    );
    
    this.renderer = new modules[0].WebGLRenderer();
    this.layout = new modules[1].DistrictLayout();
  }
}

// Import maps para alias limpios
// En index.html:
<script type="importmap">
{
  "imports": {
    "@city/": "/modules/city/",
    "@renderers/": "/modules/renderers/",
    "@utils/": "/modules/utils/"
  }
}
</script>
```

---

## **11. Build: Minimal y Optimizado**

### **11.1 Build Script Nativo**
```javascript
// build.mjs
import { readdir, readFile, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { transform } from 'esbuild';

class CityBuilder {
  async build() {
    // 1. Collect all modules
    const modules = await this.collectModules('./src');
    
    // 2. Bundle with esbuild (solo para minificación)
    const bundle = await transform(modules.join('\n'), {
      loader: 'js',
      minify: true,
      target: 'es2022',
      // Mantener ES modules
      format: 'esm'
    });
    
    // 3. Generate hash for caching
    const hash = createHash('sha256')
      .update(bundle.code)
      .digest('hex')
      .substring(0, 8);
    
    // 4. Write output
    await writeFile(
      `./dist/city-${hash}.mjs`, 
      bundle.code
    );
    
    // 5. Update import map
    await this.updateImportMap(hash);
  }
  
  async updateImportMap(hash) {
    const importMap = {
      imports: {
        "@city/core": `/dist/city-${hash}.mjs`,
        // ... otros mappings
      }
    };
    
    const html = await readFile('./index.html', 'utf-8');
    const updated = html.replace(
      /<script type="importmap">.*?<\/script>/s,
      `<script type="importmap">${JSON.stringify(importMap, null, 2)}</script>`
    );
    
    await writeFile('./dist/index.html', updated);
  }
}
```

---

## **12. Deployment: Modern Standards**

### **12.1 Headers de Seguridad**
```javascript
// Headers necesarios (configurar en servidor/CDN)
const securityHeaders = {
  // Para SharedArrayBuffer
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  
  // Security
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    connect-src 'self' wss: https:;
  `,
  
  // Performance
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  
  // Cache
  'Cache-Control': 'public, max-age=31536000, immutable'
};
```

### **12.2 Service Worker para Offline**
```javascript
// sw.js
const CACHE_VERSION = 'v1';
const CACHE_NAME = `city-${CACHE_VERSION}`;

// Estrategia Cache First para assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      
      return fetch(event.request).then((response) => {
        // No cachear respuestas no exitosas
        if (!response || response.status !== 200) {
          return response;
        }
        
        // Clone y cachear
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
});
```

---

## **13. Stack Final Recomendado**

```javascript
const CompanyCityStack = {
  // Core
  components: 'Web Components nativos (sin Lit)',
  modules: 'ES Modules nativos',
  
  // Rendering  
  primary: 'WebGL2 (universal)',
  future: 'WebGPU (cuando esté disponible)',
  workers: 'OffscreenCanvas',
  
  // State
  local: 'IndexedDB',
  shared: 'SharedArrayBuffer (si available)',
  
  // Communication
  realtime: 'WebTransport > WebSocket fallback',
  p2p: 'WebRTC para colaboración',
  
  // Performance
  viewport: 'Intersection Observer',
  responsive: 'Resize Observer',
  metrics: 'Performance Observer',
  
  // Animation
  complex: 'Web Animations API',
  simple: 'CSS Animations',
  
  // Build
  bundler: 'esbuild (solo minify)',
  modules: 'Native ES modules',
  
  // Zero dependencies
  frameworks: 'Ninguno',
  libraries: 'Ninguno (todo nativo)'
};
```

---

## **Ventajas de este Approach**

1. **Future-proof**: APIs nativas no desaparecen
2. **Performance**: Sin overhead de frameworks
3. **Size**: <50KB core (vs 300KB+ con frameworks)
4. **Maintainable**: Sin dependencias que actualizar
5. **Progressive**: Mejora automática con nuevos browsers
6. **Debuggable**: Stack traces limpios
7. **Standard**: Cualquier developer web lo entiende

Este es el approach más alineado con CompanyCity: usar la plataforma web moderna en su máxima expresión.
