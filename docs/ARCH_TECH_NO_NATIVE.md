# **CompanyCity: Especificación Técnica Definitiva**

## **1. Arquitectura Core**

### **1.1 Principios Técnicos Fundamentales**

```typescript
// Principio 1: Todo es un Level
interface Level {
  id: string;
  index: number;                    // -3 to +12
  type: 'spatial' | 'transitional' | 'digital';
  parent?: string;
  children: string[];
}

// Principio 2: Zoom Semántico
interface ZoomContext {
  level: number;
  viewportSize: { width: number; height: number };
  dataResolution: 'overview' | 'standard' | 'detailed' | 'granular';
  renderQuality: 'performance' | 'balanced' | 'quality';
}

// Principio 3: Estado Unificado
interface CityState {
  navigation: NavigationState;
  data: DataState;
  visual: VisualState;
  user: UserState;
}
```

### **1.2 Stack Tecnológico Óptimo**

```yaml
# Frontend Core
runtime: 
  - TypeScript 5.3+
  - React 18.3+
  - Next.js 14+ (SSR + optimizaciones)

# 3D Rendering
spatial:
  - Three.js r160+
  - @react-three/fiber 8.0+
  - @react-three/drei 9.0+
  - @react-three/postprocessing

# 2D Visualization  
digital:
  - D3.js v7+
  - Visx (React + D3)
  - Apache ECharts (performance charts)

# State Management
state:
  - Zustand 4.5+ (client state)
  - TanStack Query v5 (server state)
  - Valtio (proxy-based for 3D)
  - Immer (immutability)

# Styling
styles:
  - CSS Modules (components)
  - Vanilla Extract (type-safe)
  - Tailwind CSS v3.4+ (utilities)
  - Framer Motion (animations)

# Performance
optimization:
  - React Compiler (auto-memoization)
  - Million.js (virtual DOM optimization)
  - Partytown (web worker offload)
  - Comlink (worker communication)

# Data Layer
data:
  - GraphQL Yoga (server)
  - GraphQL Codegen (types)
  - WebSocket (Socket.io)
  - EventSource (SSE)
```

### **1.3 Arquitectura de Componentes**

```typescript
// Componente Base para Todos los Niveles
abstract class CityLevel<T extends LevelData> {
  abstract readonly levelIndex: number;
  abstract readonly levelType: 'spatial' | 'transitional' | 'digital';
  
  // Lifecycle
  abstract onEnter(from?: CityLevel<any>): Promise<void>;
  abstract onExit(to?: CityLevel<any>): Promise<void>;
  abstract onUpdate(delta: number): void;
  
  // Rendering
  abstract render(context: RenderContext): ReactNode;
  abstract getRenderPriority(): number;
  
  // Data
  abstract fetchData(filters: FilterSet): Promise<T>;
  abstract subscribeToUpdates(callback: UpdateCallback<T>): Unsubscribe;
  
  // Interaction
  abstract handleClick(event: ClickEvent): void;
  abstract handleHover(event: HoverEvent): void;
  abstract getAvailableActions(): Action[];
  
  // Navigation
  abstract canNavigateTo(level: CityLevel<any>): boolean;
  abstract getNavigationCost(to: CityLevel<any>): number;
}
```

## **2. Sistema de Renderizado**

### **2.1 Pipeline de Renderizado Híbrido**

```typescript
class HybridRenderer {
  private spatialRenderer: SpatialRenderer;  // Three.js
  private digitalRenderer: DigitalRenderer;  // Canvas/SVG
  private transitionManager: TransitionManager;
  
  // Render principal - 60fps target
  public render(state: CityState): void {
    const { level } = state.navigation;
    
    if (level <= 7) {
      // Niveles espaciales (Three.js)
      this.renderSpatial(state);
    } else if (level === 7.5) {
      // Transición
      this.renderTransition(state);
    } else {
      // Niveles digitales (2D)
      this.renderDigital(state);
    }
  }
  
  private renderSpatial(state: CityState): void {
    // LOD automático basado en zoom
    const lod = this.calculateLOD(state.navigation.zoomLevel);
    
    // Frustum culling
    const visibleObjects = this.frustumCull(state.visual.camera);
    
    // Instanced rendering para elementos repetidos
    this.spatialRenderer.renderInstanced(visibleObjects, lod);
    
    // Post-processing
    this.applyPostProcessing(state.visual.quality);
  }
}
```

### **2.2 Sistema LOD (Level of Detail)**

```typescript
interface LODConfiguration {
  distance: number;
  complexity: 'minimal' | 'reduced' | 'standard' | 'full';
  features: {
    shadows: boolean;
    reflections: boolean;
    particles: boolean;
    animations: boolean;
    postProcessing: boolean;
  };
}

const LOD_LEVELS: LODConfiguration[] = [
  {
    distance: 0,
    complexity: 'full',
    features: {
      shadows: true,
      reflections: true,
      particles: true,
      animations: true,
      postProcessing: true
    }
  },
  {
    distance: 100,
    complexity: 'standard',
    features: {
      shadows: true,
      reflections: false,
      particles: true,
      animations: true,
      postProcessing: false
    }
  },
  {
    distance: 500,
    complexity: 'reduced',
    features: {
      shadows: false,
      reflections: false,
      particles: true,
      animations: false,
      postProcessing: false
    }
  },
  {
    distance: 1000,
    complexity: 'minimal',
    features: {
      shadows: false,
      reflections: false,
      particles: false,
      animations: false,
      postProcessing: false
    }
  }
];
```

### **2.3 Sistema de Partículas Optimizado**

```typescript
class ParticleSystem {
  private static readonly MAX_PARTICLES = 10000;
  private static readonly PARTICLE_POOL_SIZE = 20000;
  
  private particlePool: ParticlePool;
  private activeParticles: Set<Particle>;
  private particleGeometry: THREE.BufferGeometry;
  private particleMaterial: THREE.ShaderMaterial;
  
  constructor() {
    // Usar geometry instancing para performance
    this.particleGeometry = new THREE.InstancedBufferGeometry();
    
    // Shader customizado para partículas
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cameraPosition: { value: new THREE.Vector3() }
      },
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }
  
  public update(deltaTime: number, camera: THREE.Camera): void {
    // Update solo partículas visibles
    const visibleParticles = this.frustumCullParticles(camera);
    
    // Update en GPU via uniforms
    this.particleMaterial.uniforms.time.value += deltaTime;
    this.particleMaterial.uniforms.cameraPosition.value = camera.position;
    
    // Reciclar partículas fuera de vista
    this.recycleInvisibleParticles(visibleParticles);
  }
}
```

## **3. Sistema de Datos**

### **3.1 Arquitectura de Datos por Nivel**

```typescript
// Datos adaptativos según nivel de zoom
interface DataResolution {
  -3: AggregatedGlobalData;      // Economía mundial agregada
  -2: IndustrySummaryData;       // Resúmenes por sector
  -1: MarketComparisonData;      // Comparativas de mercado
   0: EcosystemRelationData;     // Relaciones principales
   1: CompanySummaryData;        // KPIs empresa
   2: DepartmentMetricsData;     // Métricas departamentales
   3: ZoneOperationalData;       // Datos operacionales
   4: ProcessDetailData;         // Detalle de procesos
   5: StageMetricsData;          // Métricas por etapa
   6: DashboardData;             // Datos del dashboard
   7: PanelData;                 // Datos del panel
   8: ExplorerFullData;          // Datos completos explorer
   9: ElementDetailData;         // Detalle de elemento
  10: PropertyData;              // Propiedades específicas
  11: ValueData;                 // Valores individuales
  12: ActionData;                // Acciones disponibles
}

class AdaptiveDataLoader {
  private cache: LRUCache<string, any>;
  private subscriptions: Map<string, Subscription>;
  
  public async loadForLevel(
    level: number,
    viewport: Viewport,
    filters: FilterSet
  ): Promise<any> {
    const resolution = this.getResolutionForLevel(level);
    const cacheKey = this.getCacheKey(level, viewport, filters);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Load with appropriate granularity
    const data = await this.fetchWithResolution(
      level,
      resolution,
      viewport,
      filters
    );
    
    // Cache with TTL based on level
    const ttl = this.getTTLForLevel(level);
    this.cache.set(cacheKey, data, ttl);
    
    return data;
  }
  
  private getResolutionForLevel(level: number): DataGranularity {
    if (level <= -1) return 'highly-aggregated';
    if (level <= 3) return 'aggregated';
    if (level <= 7) return 'standard';
    return 'detailed';
  }
}
```

### **3.2 Sistema de Actualización en Tiempo Real**

```typescript
class RealTimeUpdateSystem {
  private eventSource: EventSource;
  private webSocket: WebSocket;
  private updateQueue: PriorityQueue<Update>;
  private batchProcessor: BatchProcessor;
  
  constructor(config: RealTimeConfig) {
    // EventSource para updates unidireccionales
    this.eventSource = new EventSource(config.sseEndpoint);
    
    // WebSocket para bidireccional (acciones)
    this.webSocket = new WebSocket(config.wsEndpoint);
    
    // Cola de prioridad para updates
    this.updateQueue = new PriorityQueue(
      (a, b) => a.priority - b.priority
    );
    
    // Batch processor para eficiencia
    this.batchProcessor = new BatchProcessor({
      maxBatchSize: 100,
      maxWaitTime: 16, // 1 frame at 60fps
      processor: this.processBatch.bind(this)
    });
  }
  
  public subscribeToLevel(
    level: number,
    callback: UpdateCallback
  ): Unsubscribe {
    const channel = `level-${level}`;
    
    // Subscribe to appropriate data stream
    if (level <= 4) {
      // Niveles altos: actualizaciones menos frecuentes
      return this.subscribeToAggregated(channel, callback);
    } else {
      // Niveles bajos: actualizaciones en tiempo real
      return this.subscribeToRealTime(channel, callback);
    }
  }
  
  private processBatch(updates: Update[]): void {
    // Deduplicar updates
    const deduped = this.deduplicateUpdates(updates);
    
    // Aplicar en orden de prioridad
    deduped.forEach(update => {
      this.applyUpdate(update);
    });
    
    // Trigger re-render
    this.notifyRenderer();
  }
}
```

### **3.3 GraphQL Schema Optimizado**

```graphql
# Schema principal adaptativo
type Query {
  # Vista por nivel con resolución automática
  cityView(
    level: Int!
    viewport: ViewportInput!
    filters: FilterInput
    resolution: DataResolution
  ): CityViewData!
  
  # Navegación eficiente
  navigationPath(
    from: LevelIdentifier!
    to: LevelIdentifier!
  ): [NavigationStep!]!
  
  # Búsqueda global
  search(
    query: String!
    levels: [Int!]
    limit: Int = 10
  ): [SearchResult!]!
}

type Subscription {
  # Updates en tiempo real por nivel
  levelUpdates(
    level: Int!
    viewport: ViewportInput!
  ): LevelUpdate!
  
  # Alertas globales
  systemAlerts(
    severity: [AlertSeverity!]
  ): Alert!
  
  # Cambios de estado
  stateChanges(
    entityIds: [ID!]!
  ): StateChange!
}

type Mutation {
  # Ejecutar acciones
  executeAction(
    actionId: ID!
    parameters: JSON
    context: ActionContext!
  ): ActionResult!
  
  # Navegación
  navigate(
    to: LevelIdentifier!
    transition: TransitionType
  ): NavigationResult!
}

# Tipos de datos adaptativos
union CityViewData = 
  | GlobalEconomyData      # Level -3
  | IndustryData          # Level -2
  | MarketData            # Level -1
  | EcosystemData         # Level 0
  | CompanyData           # Level 1
  | DistrictData          # Level 2
  | ZoneData              # Level 3
  | BuildingData          # Level 4
  | FloorData             # Level 5
  | ScreenData            # Level 6
  | PanelData             # Level 7
  | ExplorerData          # Level 8+
```

## **4. Sistema de Navegación**

### **4.1 Navegación Predictiva**

```typescript
class PredictiveNavigation {
  private navigationHistory: NavigationEvent[];
  private predictionModel: NavigationPredictor;
  private preloadQueue: PreloadQueue;
  
  public async navigateToLevel(
    targetLevel: number,
    context?: NavigationContext
  ): Promise<void> {
    // Predecir próximos movimientos probables
    const predictions = this.predictionModel.predict(
      this.navigationHistory,
      targetLevel,
      context
    );
    
    // Precargar datos de destinos probables
    predictions.forEach(prediction => {
      if (prediction.probability > 0.3) {
        this.preloadQueue.add({
          level: prediction.level,
          priority: prediction.probability
        });
      }
    });
    
    // Ejecutar navegación
    await this.executeNavigation(targetLevel, context);
    
    // Actualizar historial
    this.navigationHistory.push({
      from: this.currentLevel,
      to: targetLevel,
      timestamp: Date.now(),
      context
    });
  }
  
  private async executeNavigation(
    targetLevel: number,
    context?: NavigationContext
  ): Promise<void> {
    // Calcular ruta óptima
    const path = this.calculateOptimalPath(
      this.currentLevel,
      targetLevel
    );
    
    // Ejecutar transiciones
    for (const step of path) {
      await this.transitionTo(step);
    }
  }
}
```

### **4.2 Sistema de Transiciones**

```typescript
class TransitionSystem {
  private static readonly TRANSITION_DURATION = 800; // ms
  
  public async transitionBetweenLevels(
    from: CityLevel,
    to: CityLevel
  ): Promise<void> {
    const transitionType = this.getTransitionType(from, to);
    
    switch (transitionType) {
      case 'zoom':
        return this.zoomTransition(from, to);
      
      case 'dimensional':
        return this.dimensionalTransition(from, to);
      
      case 'lateral':
        return this.lateralTransition(from, to);
      
      default:
        return this.defaultTransition(from, to);
    }
  }
  
  private async dimensionalTransition(
    from: CityLevel,
    to: CityLevel
  ): Promise<void> {
    // Transición especial Panel -> Explorer
    const timeline = gsap.timeline();
    
    // 1. Panel se ilumina y pulsa
    timeline.to(from.element, {
      scale: 1.1,
      brightness: 1.5,
      duration: 0.2
    });
    
    // 2. Panel se expande
    timeline.to(from.element, {
      scale: 10,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    });
    
    // 3. Fade in del explorer
    timeline.fromTo(to.element, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4 }
    );
    
    await timeline.play();
  }
}
```

## **5. Sistema de Interacción**

### **5.1 Gestos y Controles**

```typescript
class InteractionSystem {
  private gestureRecognizer: GestureRecognizer;
  private hapticFeedback: HapticController;
  private inputAdapters: Map<InputType, InputAdapter>;
  
  constructor() {
    // Reconocimiento de gestos complejos
    this.gestureRecognizer = new GestureRecognizer({
      gestures: [
        'tap', 'doubleTap', 'longPress',
        'pan', 'pinch', 'rotate',
        'swipeUp', 'swipeDown', 'swipeLeft', 'swipeRight'
      ]
    });
    
    // Adapters para diferentes inputs
    this.inputAdapters.set('mouse', new MouseAdapter());
    this.inputAdapters.set('touch', new TouchAdapter());
    this.inputAdapters.set('keyboard', new KeyboardAdapter());
    this.inputAdapters.set('gamepad', new GamepadAdapter());
  }
  
  public handleInteraction(event: InteractionEvent): void {
    // Normalizar input
    const normalized = this.normalizeInput(event);
    
    // Reconocer gesto
    const gesture = this.gestureRecognizer.recognize(normalized);
    
    // Ejecutar acción basada en contexto
    const action = this.mapGestureToAction(
      gesture,
      this.currentLevel,
      this.hoveredElement
    );
    
    // Feedback háptico si disponible
    if (this.hapticFeedback.isAvailable()) {
      this.hapticFeedback.trigger(action.feedbackType);
    }
    
    // Ejecutar acción
    this.executeAction(action);
  }
}

// Mapeo de gestos por nivel
const GESTURE_MAPPINGS = {
  spatial: {
    tap: 'select',
    doubleTap: 'zoomIn',
    pinch: 'zoom',
    pan: 'rotate',
    swipeUp: 'levelUp',
    swipeDown: 'levelDown'
  },
  digital: {
    tap: 'select',
    doubleTap: 'expand',
    pinch: 'zoom',
    pan: 'pan',
    swipeLeft: 'nextPanel',
    swipeRight: 'previousPanel'
  }
};
```

### **5.2 Sistema de Selección Inteligente**

```typescript
class SelectionSystem {
  private raycaster: THREE.Raycaster;
  private selectionBuffer: SelectionBuffer;
  private highlightPass: HighlightPass;
  
  public updateSelection(
    pointer: Vector2,
    camera: Camera,
    scene: Scene
  ): SelectionResult {
    // Raycast con priorización
    const intersections = this.performPrioritizedRaycast(
      pointer,
      camera,
      scene
    );
    
    if (intersections.length === 0) {
      return { type: 'none' };
    }
    
    // Selección inteligente basada en contexto
    const selected = this.intelligentSelection(
      intersections,
      this.currentLevel,
      this.userIntent
    );
    
    // Highlight visual
    this.highlightPass.highlight(selected);
    
    // Preparar información contextual
    const context = this.gatherContext(selected);
    
    return {
      type: 'object',
      object: selected,
      context,
      actions: this.getAvailableActions(selected)
    };
  }
  
  private intelligentSelection(
    intersections: Intersection[],
    level: number,
    intent: UserIntent
  ): Object3D {
    // Priorizar por relevancia semántica
    const scored = intersections.map(hit => ({
      object: hit.object,
      score: this.calculateRelevanceScore(
        hit.object,
        level,
        intent,
        hit.distance
      )
    }));
    
    // Retornar el más relevante
    return scored.sort((a, b) => b.score - a.score)[0].object;
  }
}
```

## **6. Sistema de Performance**

### **6.1 Optimización Automática**

```typescript
class PerformanceOptimizer {
  private frameTimeBuffer: CircularBuffer<number>;
  private qualityController: QualityController;
  private readonly TARGET_FPS = 60;
  private readonly MIN_FPS = 30;
  
  public update(deltaTime: number): void {
    // Monitorear framerate
    this.frameTimeBuffer.push(deltaTime);
    const avgFrameTime = this.frameTimeBuffer.average();
    const currentFPS = 1000 / avgFrameTime;
    
    // Ajustar calidad dinámicamente
    if (currentFPS < this.MIN_FPS) {
      this.decreaseQuality();
    } else if (currentFPS > this.TARGET_FPS * 1.2) {
      this.increaseQuality();
    }
  }
  
  private decreaseQuality(): void {
    const currentSettings = this.qualityController.current;
    
    // Orden de degradación
    const degradationOrder = [
      () => this.qualityController.setPostProcessing(false),
      () => this.qualityController.setShadows(false),
      () => this.qualityController.setParticleCount(0.5),
      () => this.qualityController.setLODBias(1),
      () => this.qualityController.setRenderScale(0.75)
    ];
    
    // Aplicar siguiente degradación
    for (const degrade of degradationOrder) {
      if (degrade()) break;
    }
  }
}
```

### **6.2 Sistema de Caching Inteligente**

```typescript
class IntelligentCache {
  private memoryCache: LRUCache<string, CacheEntry>;
  private persistentCache: IndexedDBCache;
  private cacheStrategy: CacheStrategy;
  
  constructor() {
    // Cache en memoria con límite adaptativo
    const memoryLimit = this.calculateMemoryLimit();
    this.memoryCache = new LRUCache({ max: memoryLimit });
    
    // Cache persistente para datos grandes
    this.persistentCache = new IndexedDBCache({
      name: 'CompanyCity',
      version: 1,
      stores: ['geometry', 'textures', 'data']
    });
    
    // Estrategia basada en patrones de uso
    this.cacheStrategy = new AdaptiveCacheStrategy();
  }
  
  public async get<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    // Check memory cache
    const memCached = this.memoryCache.get(key);
    if (memCached && !this.isStale(memCached)) {
      return memCached.data;
    }
    
    // Check persistent cache
    const persistCached = await this.persistentCache.get(key);
    if (persistCached && !this.isStale(persistCached)) {
      // Promote to memory cache
      this.memoryCache.set(key, persistCached);
      return persistCached.data;
    }
    
    // Fetch and cache
    const data = await fetcher();
    this.cache(key, data);
    
    return data;
  }
  
  private cache(key: string, data: any): void {
    const entry = {
      data,
      timestamp: Date.now(),
      size: this.estimateSize(data),
      accessCount: 0
    };
    
    // Decidir dónde cachear basado en estrategia
    const strategy = this.cacheStrategy.decide(entry);
    
    if (strategy.includes('memory')) {
      this.memoryCache.set(key, entry);
    }
    
    if (strategy.includes('persistent')) {
      this.persistentCache.set(key, entry);
    }
  }
}
```

## **7. Sistema de Extensibilidad**

### **7.1 Plugin System**

```typescript
interface CityPlugin {
  id: string;
  name: string;
  version: string;
  
  // Hooks del ciclo de vida
  onInstall?: (city: CityAPI) => Promise<void>;
  onUninstall?: (city: CityAPI) => Promise<void>;
  onLevelChange?: (from: number, to: number) => void;
  onDataUpdate?: (update: DataUpdate) => void;
  
  // Extensiones
  levels?: LevelExtension[];
  explorers?: ExplorerExtension[];
  visualizations?: VisualizationExtension[];
  interactions?: InteractionExtension[];
  
  // Configuración
  config?: PluginConfig;
  permissions?: PluginPermissions;
}

// API expuesta a plugins
interface CityAPI {
  // Navegación
  navigateTo(level: number, context?: any): Promise<void>;
  getCurrentLevel(): number;
  
  // Datos
  fetchData(query: DataQuery): Promise<any>;
  subscribeToData(query: DataQuery, callback: Function): Unsubscribe;
  
  // Visualización
  addVisualization(id: string, component: Component): void;
  removeVisualization(id: string): void;
  
  // UI
  showNotification(notification: Notification): void;
  openModal(modal: Modal): void;
  
  // Storage
  storage: {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    remove(key: string): Promise<void>;
  };
}

// Ejemplo: Plugin de Compliance
const compliancePlugin: CityPlugin = {
  id: 'compliance-monitor',
  name: 'Compliance Monitor',
  version: '1.0.0',
  
  explorers: [{
    id: 'compliance-explorer',
    name: 'Compliance View',
    icon: 'shield-check',
    component: ComplianceExplorer,
    levels: [8, 9, 10] // Disponible en estos niveles
  }],
  
  visualizations: [{
    id: 'compliance-overlay',
    type: 'overlay',
    component: ComplianceOverlay,
    applicableLevels: [1, 2, 3, 4] // Ciudad a Building
  }],
  
  onDataUpdate: (update) => {
    if (update.type === 'compliance-violation') {
      // Mostrar alerta
      city.showNotification({
        type: 'warning',
        title: 'Compliance Alert',
        message: update.message,
        actions: [{
          label: 'View Details',
          action: () => city.navigateTo(8, { 
            explorer: 'compliance-explorer',
            focusId: update.entityId 
          })
        }]
      });
    }
  }
};
```

### **7.2 Sistema de Temas**

```typescript
interface CityTheme {
  id: string;
  name: string;
  
  // Tokens de diseño
  tokens: {
    colors: ColorTokens;
    spacing: SpacingTokens;
    typography: TypographyTokens;
    shadows: ShadowTokens;
    animations: AnimationTokens;
  };
  
  // Materiales Three.js
  materials: {
    building: THREE.Material;
    district: THREE.Material;
    particle: THREE.Material;
    connection: THREE.Material;
  };
  
  // Shaders personalizados
  shaders?: {
    vertex?: string;
    fragment?: string;
    uniforms?: Record<string, THREE.IUniform>;
  };
  
  // Configuración de ambiente
  environment: {
    fog?: THREE.Fog;
    lighting: LightingConfig;
    postProcessing: PostProcessingConfig;
  };
}

// Sistema de temas dinámicos
class ThemeSystem {
  private currentTheme: CityTheme;
  private transitions: ThemeTransition[];
  
  public async switchTheme(
    newTheme: CityTheme,
    duration: number = 1000
  ): Promise<void> {
    const transition = new ThemeTransition(
      this.currentTheme,
      newTheme,
      duration
    );
    
    // Animar transición
    await transition.animate({
      onUpdate: (progress) => {
        this.applyThemeBlend(
          this.currentTheme,
          newTheme,
          progress
        );
      }
    });
    
    this.currentTheme = newTheme;
  }
}
```

## **8. Arquitectura de Backend**

### **8.1 Microservicios Especializados**

```yaml
services:
  # Servicio de navegación y estructura
  navigation-service:
    tech: Node.js + Fastify
    database: Neo4j (grafo)
    responsibilities:
      - Rutas óptimas entre niveles
      - Estructura jerárquica
      - Permisos de navegación
    
  # Servicio de datos en tiempo real
  realtime-service:
    tech: Node.js + Socket.io
    database: Redis (pub/sub)
    responsibilities:
      - WebSocket connections
      - Event streaming
      - Presence management
  
  # Servicio de agregación
  aggregation-service:
    tech: Go + gRPC
    database: ClickHouse
    responsibilities:
      - Métricas agregadas por nivel
      - Time-series data
      - Cálculos complejos
  
  # Servicio de renderizado
  render-service:
    tech: Rust + WebAssembly
    cache: Cloudflare Workers
    responsibilities:
      - Geometría procedural
      - Optimización de assets
      - LOD generation
  
  # API Gateway
  gateway:
    tech: GraphQL Mesh
    features:
      - Federation
      - Caching
      - Rate limiting
      - Auth/Auth
```

### **8.2 Esquema de Base de Datos**

```sql
-- PostgreSQL: Datos estructurados
CREATE TABLE levels (
  id UUID PRIMARY KEY,
  index INTEGER UNIQUE NOT NULL, -- -3 to 12
  type VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  parent_id UUID REFERENCES levels(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE entities (
  id UUID PRIMARY KEY,
  level_id UUID REFERENCES levels(id),
  type VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  position POINT NOT NULL,
  properties JSONB,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || (properties->>'description'))
  ) STORED
);

-- TimescaleDB: Métricas temporales
CREATE TABLE metrics (
  time TIMESTAMPTZ NOT NULL,
  entity_id UUID NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  tags JSONB,
  PRIMARY KEY (entity_id, metric_name, time)
);

SELECT create_hypertable('metrics', 'time');

-- Neo4j: Relaciones y navegación
CREATE (n:Level {
  id: $id,
  index: $index,
  type: $type
})

CREATE (a:Entity)-[:BELONGS_TO]->(l:Level)
CREATE (a:Entity)-[:CONNECTED_TO {weight: $weight}]->(b:Entity)
CREATE (l1:Level)-[:PARENT_OF]->(l2:Level)
```

## **9. Deployment y DevOps**

### **9.1 Configuración de Kubernetes**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: companycity-frontend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: frontend
        image: companycity/frontend:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        env:
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            configMapKeyRef:
              name: companycity-config
              key: api.url
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: companycity-frontend
spec:
  selector:
    app: companycity-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: companycity-frontend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: companycity-frontend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### **9.2 CI/CD Pipeline**

```yaml
# .github/workflows/deploy.yml
name: Deploy CompanyCity

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: Integration tests
        run: npm run test:integration
      
      - name: E2E tests
        run: npm run test:e2e
        
  performance:
    runs-on: ubuntu-latest
    steps:
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/city
            http://localhost:3000/explorer
          budgetPath: ./lighthouse-budget.json
          
  build:
    needs: [test, performance]
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: |
          docker build -t companycity/frontend:${{ github.sha }} .
          docker tag companycity/frontend:${{ github.sha }} companycity/frontend:latest
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push companycity/frontend:${{ github.sha }}
          docker push companycity/frontend:latest
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            k8s/frontend-deployment.yaml
            k8s/frontend-service.yaml
          images: |
            companycity/frontend:${{ github.sha }}
```

## **10. Monitoreo y Observabilidad**

### **10.1 Stack de Observabilidad**

```typescript
// Configuración de telemetría
import { trace, metrics } from '@opentelemetry/api';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

class TelemetrySystem {
  private tracer = trace.getTracer('companycity', '1.0.0');
  private meter = metrics.getMeter('companycity', '1.0.0');
  
  // Métricas personalizadas
  private navigationCounter = this.meter.createCounter('navigation_total', {
    description: 'Total navigation events'
  });
  
  private renderHistogram = this.meter.createHistogram('render_duration', {
    description: 'Render frame duration',
    unit: 'ms'
  });
  
  private activeUsersGauge = this.meter.createUpDownCounter('active_users', {
    description: 'Currently active users'
  });
  
  public trackNavigation(from: number, to: number): void {
    const span = this.tracer.startSpan('navigation');
    
    span.setAttributes({
      'navigation.from': from,
      'navigation.to': to,
      'navigation.type': this.getNavigationType(from, to)
    });
    
    this.navigationCounter.add(1, {
      from_level: from.toString(),
      to_level: to.toString()
    });
    
    span.end();
  }
  
  public trackRenderFrame(duration: number): void {
    this.renderHistogram.record(duration, {
      quality: this.currentQuality,
      level: this.currentLevel.toString()
    });
  }
}
```

### **10.2 Dashboards de Monitoreo**

```yaml
# Grafana Dashboard Configuration
dashboards:
  - name: CompanyCity Overview
    panels:
      - title: Active Users by Level
        query: |
          sum by (level) (
            companycity_active_users
          )
        visualization: graph
        
      - title: Navigation Flow
        query: |
          sum by (from_level, to_level) (
            rate(companycity_navigation_total[5m])
          )
        visualization: heatmap
        
      - title: Render Performance
        query: |
          histogram_quantile(0.95,
            sum by (le, level) (
              rate(companycity_render_duration_bucket[5m])
            )
          )
        visualization: graph
        alert:
          condition: "> 16.67" # Below 60fps
          
      - title: Data Loading Times
        query: |
          histogram_quantile(0.95,
            rate(companycity_data_load_duration_bucket[5m])
          )
        visualization: graph
```

## **11. Testing Strategy**

### **11.1 Testing Pyramid**

```typescript
// Unit Tests (60%)
describe('NavigationSystem', () => {
  it('should calculate optimal path between levels', () => {
    const nav = new NavigationSystem();
    const path = nav.calculatePath(-1, 4);
    
    expect(path).toEqual([
      { from: -1, to: 0, type: 'zoom-in' },
      { from: 0, to: 1, type: 'zoom-in' },
      { from: 1, to: 2, type: 'drill-down' },
      { from: 2, to: 3, type: 'drill-down' },
      { from: 3, to: 4, type: 'drill-down' }
    ]);
  });
});

// Integration Tests (30%)
describe('CityRenderer Integration', () => {
  it('should render all levels without errors', async () => {
    const renderer = new CityRenderer();
    
    for (let level = -3; level <= 12; level++) {
      const scene = await renderer.renderLevel(level);
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    }
  });
});

// E2E Tests (10%)
describe('CompanyCity E2E', () => {
  it('should navigate from planet to action', async () => {
    await page.goto('http://localhost:3000');
    
    // Start at planet level
    await expect(page).toHaveURL(/level=-3/);
    
    // Navigate through levels
    await page.click('[data-testid="city-usa"]');
    await page.click('[data-testid="district-sales"]');
    await page.click('[data-testid="building-crm"]');
    await page.click('[data-testid="enter-building"]');
    await page.click('[data-testid="control-center"]');
    await page.click('[data-testid="process-panel"]');
    
    // Should reach explorer
    await expect(page).toHaveURL(/explorer=process/);
  });
});
```

### **11.2 Performance Tests**

```typescript
// Performance benchmarks
describe('Performance Benchmarks', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should maintain 60fps during navigation', () => {
    cy.startPerformanceCapture();
    
    // Navigate through multiple levels
    cy.navigateToLevel(1);
    cy.navigateToLevel(2);
    cy.navigateToLevel(3);
    cy.navigateToLevel(4);
    
    cy.endPerformanceCapture().then((metrics) => {
      expect(metrics.fps.average).to.be.at.least(55);
      expect(metrics.fps.percentile95).to.be.at.least(50);
      expect(metrics.jank.count).to.be.lessThan(5);
    });
  });
  
  it('should load levels within SLA', () => {
    const levelLoadTimes = {
      '-3': 1000,  // Planet: 1s
      '0': 800,    // Ecosystem: 800ms
      '1': 600,    // City: 600ms
      '4': 500,    // Building: 500ms
      '8': 400     // Explorer: 400ms
    };
    
    Object.entries(levelLoadTimes).forEach(([level, maxTime]) => {
      cy.measureLoadTime(() => {
        cy.navigateToLevel(parseInt(level));
      }).should('be.lessThan', maxTime);
    });
  });
});
```

## **12. Especificación de API**

### **12.1 REST API Endpoints**

```typescript
// API Routes
const routes = {
  // Navigation
  'GET /api/levels': 'Get all available levels',
  'GET /api/levels/:id': 'Get specific level data',
  'GET /api/navigation/path': 'Calculate navigation path',
  
  // Data
  'GET /api/data/:level': 'Get data for level',
  'POST /api/data/query': 'Complex data query',
  'WS /api/data/stream': 'Real-time data stream',
  
  // Search
  'GET /api/search': 'Global search',
  'GET /api/search/suggestions': 'Search suggestions',
  
  // Actions
  'GET /api/actions/:entityId': 'Get available actions',
  'POST /api/actions/:actionId': 'Execute action',
  
  // User
  'GET /api/user/preferences': 'Get user preferences',
  'PUT /api/user/preferences': 'Update preferences',
  'GET /api/user/history': 'Navigation history',
  
  // Analytics
  'POST /api/analytics/event': 'Track event',
  'GET /api/analytics/insights': 'Get insights'
};

// Type-safe API client
class CityAPIClient {
  async getLevel<T extends Level>(
    id: string,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(`/levels/${id}`, {
      method: 'GET',
      ...options
    });
  }
  
  async queryData<T>(
    query: DataQuery,
    options?: RequestOptions
  ): Promise<QueryResult<T>> {
    return this.request<QueryResult<T>>('/data/query', {
      method: 'POST',
      body: query,
      ...options
    });
  }
}
```

---

## **Conclusión**

Esta especificación técnica proporciona una base sólida y escalable para implementar CompanyCity. Los principios clave son:

1. **Arquitectura basada en niveles** con transiciones semánticas
2. **Renderizado híbrido** optimizado para cada tipo de vista
3. **Sistema de datos adaptativo** que ajusta resolución por zoom
4. **Performance first** con optimización automática
5. **Extensibilidad** mediante plugins y temas
6. **Observabilidad completa** para monitoreo en producción

La implementación debe comenzar con el MVP (niveles 1-4) y expandirse gradualmente, manteniendo siempre los estándares de performance y calidad definidos.
