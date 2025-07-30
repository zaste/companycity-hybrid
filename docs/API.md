## Core Classes

### SceneManager

Manages the Three.js scene, camera, and rendering.

```javascript
class SceneManager {
  constructor(container: HTMLElement)
  
  // Methods
  initialize(): void
  render(): void
  addObject(object: THREE.Object3D): void
  removeObject(object: THREE.Object3D): void
  
  // Camera control
  setCameraPosition(position: THREE.Vector3): void
  setCameraTarget(target: THREE.Vector3): void
  animateCameraTo(position: THREE.Vector3, duration: number): Promise<void>
  
  // Scene management
  setFog(near: number, far: number): void
  setLighting(config: LightingConfig): void
  
  // Properties
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
}
```

### StateManager

Reactive state management using Proxy.

```javascript
class StateManager extends EventTarget {
  constructor()
  
  // State access
  get state(): State
  setState(updates: Partial<State>): void
  
  // Subscription
  subscribe(callback: Function): () => void
  
  // Events
  'state-change': { key: string, value: any, oldValue: any }
}

// State interface
interface State {
  currentLevel: number // 0-5
  currentPath: string[]
  camera: {
    position: THREE.Vector3
    target: THREE.Vector3
    zoom: number
  }
  selection: Set<string>
  filters: Map<string, any>
  metrics: Map<string, number>
}
```

### Navigation

Handles transitions between the 6 levels.

```javascript
class Navigation {
  constructor(sceneManager: SceneManager, stateManager: StateManager)
  
  // Navigation methods
  navigateTo(path: string[]): Promise<void>
  navigateToLevel(level: number, entityId?: string): Promise<void>
  goBack(): void
  goHome(): void
  
  // Path validation
  isValidPath(path: string[]): boolean
  getAvailablePaths(fromPath: string[]): string[][]
  
  // Properties
  currentLevel: number
  currentPath: string[]
  history: string[][]
}
```

### EntityTracker

Tracks entities through their journey.

```javascript
class EntityTracker {
  constructor()
  
  // Tracking
  trackEntity(entity: TrackedEntity): string // returns trackingId
  stopTracking(trackingId: string): void
  getEntity(trackingId: string): TrackedEntity | null
  
  // Journey analysis
  getJourney(trackingId: string): JourneyStep[]
  getCurrentLocation(trackingId: string): Location
  predictNextStep(trackingId: string): Location | null
  
  // Batch operations
  trackMultiple(entities: TrackedEntity[]): string[]
  getActiveEntities(): TrackedEntity[]
}

interface TrackedEntity {
  id: string
  type: 'lead' | 'customer' | 'order' | 'task'
  properties: Record<string, any>
  startTime: Date
}

interface JourneyStep {
  timestamp: Date
  level: number
  location: string
  action: string
  duration: number
}
```

## Scene Classes

### Base Scene Class

```javascript
class BaseScene {
  constructor(sceneManager: SceneManager)
  
  // Lifecycle
  abstract load(data: any): Promise<void>
  abstract unload(): void
  abstract update(deltaTime: number): void
  
  // Common methods
  setVisible(visible: boolean): void
  highlight(entityId: string): void
  clearHighlight(): void
}
```

### EcosystemScene

```javascript
class EcosystemScene extends BaseScene {
  // Load companies
  load(companies: Company[]): Promise<void>
  
  // Hexagon management
  createCompanyHexagon(company: Company): THREE.Mesh
  updateCompanyMetrics(companyId: string, metrics: Metrics): void
  
  // Layout
  arrangeHexagons(companies: Company[]): void
  getHexagonPosition(index: number, total: number): THREE.Vector3
}
```

### DistrictScene

```javascript
class DistrictScene extends BaseScene {
  // Pattern support
  setPattern(pattern: 'cyclic' | 'spatial' | 'linear' | 'hub'): void
  
  // Building management
  addBuilding(building: Building): void
  removeBuilding(buildingId: string): void
  
  // Entity flow
  spawnEntity(entity: FlowEntity): void
  updateEntityPositions(deltaTime: number): void
}
```

## Layout Classes

### Base Layout

```javascript
class BaseLayout {
  arrange(nodes: LayoutNode[]): LayoutResult
  getConnections(nodes: LayoutNode[]): Connection[]
  animate(time: number): void
}

interface LayoutNode {
  id: string
  size: number
  weight?: number
  fixed?: boolean
}

interface LayoutResult {
  positions: Map<string, THREE.Vector3>
  rotations: Map<string, THREE.Euler>
}
```

### Specific Layouts

```javascript
// Circular arrangement
class CyclicLayout extends BaseLayout {
  constructor(options?: {
    radius?: number
    startAngle?: number
    direction?: 'clockwise' | 'counter-clockwise'
  })
}

// Grid or organic distribution
class SpatialLayout extends BaseLayout {
  constructor(options?: {
    algorithm?: 'grid' | 'force-directed' | 'organic'
    spacing?: number
  })
}

// Sequential line
class LinearLayout extends BaseLayout {
  constructor(options?: {
    direction?: 'horizontal' | 'vertical'
    spacing?: number
    curve?: boolean
  })
}

// Central hub with satellites
class HubLayout extends BaseLayout {
  constructor(options?: {
    hubScale?: number
    satelliteDistance?: number
  })
}
```

## Web Components API

### CompanyCityApp

```html
<company-city-app
  initial-level=\"ecosystem\"
  theme=\"dark|light\"
  show-metrics=\"true|false\">
</company-city-app>
```

```javascript
class CompanyCityApp extends HTMLElement {
  // Lifecycle
  connectedCallback(): void
  disconnectedCallback(): void
  
  // Public methods
  navigate(path: string[]): void
  setFilter(filterType: string, value: any): void
  trackEntity(entity: TrackedEntity): void
  
  // Properties
  currentLevel: number
  currentPath: string[]
  
  // Events
  'navigation-change': { path: string[], level: number }
  'entity-selected': { entityId: string, entityType: string }
}
```

### CCNavigation

```html
<cc-navigation
  show-breadcrumb=\"true|false\"
  show-search=\"true|false\">
</cc-navigation>
```

### CCInspector

```html
<cc-inspector
  entity-id=\"entity-123\"
  auto-close=\"true|false\"
  position=\"left|right\">
</cc-inspector>
```

## Event System

### Event Types

```javascript
// Navigation events
interface NavigationEvent {
  type: 'navigation:zoom-in' | 'navigation:zoom-out' | 'navigation:level-change'
  detail: {
    from: string[]
    to: string[]
    level: number
    animated: boolean
  }
}

// Entity events
interface EntityEvent {
  type: 'entity:select' | 'entity:hover' | 'entity:track'
  detail: {
    entityId: string
    entityType: string
    position?: THREE.Vector3
  }
}

// Performance events
interface PerformanceEvent {
  type: 'performance:warning' | 'performance:critical'
  detail: {
    metric: string
    value: number
    threshold: number
    recommendation: string
  }
}
```

### Event Bus Usage

```javascript
// Global event bus
const eventBus = new EventBus();

// Subscribe
eventBus.on('entity:select', (event) => {
  console.log('Selected:', event.detail.entityId);
});

// Emit
eventBus.emit('metrics:update', {
  throughput: 1250,
  latency: 45
});

// Unsubscribe
const unsubscribe = eventBus.on('...', handler);
unsubscribe();
```

## Data Structures

### Company

```typescript
interface Company {
  id: string
  name: string
  industry: string
  metrics: CompanyMetrics
  districts: District[]
  position?: THREE.Vector3
}

interface CompanyMetrics {
  revenue: number
  employees: number
  healthScore: number // 0-100
  growth: number // percentage
}
```

### District

```typescript
interface District {
  id: string
  name: string
  type: 'market' | 'delivery' | 'finance' | 'people' | 'technology' | 'governance'
  pattern: 'cyclic' | 'spatial' | 'linear' | 'hub'
  buildings: Building[]
  metrics: DistrictMetrics
}
```

### Building

```typescript
interface Building {
  id: string
  name: string
  type: string
  pattern: 'pipeline' | 'parallel' | 'orchestrator' | 'feedback'
  modules: Module[]
  position: THREE.Vector3
  metrics: BuildingMetrics
}
```

## Utility Functions

### Geometry Utilities

```javascript
// Create hexagon geometry
createHexagon(radius: number, height?: number): THREE.ExtrudeGeometry

// Calculate positions
calculateCircularPositions(count: number, radius: number): THREE.Vector3[]
calculateGridPositions(count: number, spacing: number): THREE.Vector3[]

// Bezier curves for connections
createBezierCurve(start: THREE.Vector3, end: THREE.Vector3, height?: number): THREE.Curve<THREE.Vector3>
```

### Animation Utilities

```javascript
// Easing functions
function easeInOutCubic(t: number): number
function easeOutElastic(t: number): number

// Interpolation
function lerp(start: number, end: number, t: number): number
function lerpVector3(start: THREE.Vector3, end: THREE.Vector3, t: number): THREE.Vector3

// Animation helpers
function animateValue(from: number, to: number, duration: number, 
                     onUpdate: (value: number) => void): Promise<void>
```

### Performance Utilities

```javascript
// LOD calculation
function calculateLOD(distance: number, thresholds: number[]): number

// Frustum culling
function isInFrustum(object: THREE.Object3D, camera: THREE.Camera): boolean

// Batching
function batchGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry
```

## WebSocket Protocol

### Connection

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8080/ws/companycity');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'jwt-token-here'
}));
```

### Message Types

```javascript
// Subscribe to updates
{
  type: 'subscribe',
  channel: 'metrics',
  filters: {
    level: 'district',
    id: 'market-district'
  }
}

// Real-time updates
{
  type: 'metrics:update',
  data: {
    entityId: 'market-district',
    metrics: {
      throughput: 1523,
      conversion: 0.23
    }
  }
}

// Entity movement
{
  type: 'entity:move',
  data: {
    entityId: 'lead-123',
    from: 'awareness',
    to: 'interest',
    timestamp: 1634567890123
  }
}
```

## REST API Endpoints

### Companies

```
GET    /api/v1/companies
GET    /api/v1/companies/:id
GET    /api/v1/companies/:id/districts
GET    /api/v1/companies/:id/metrics
```

### Navigation

```
GET    /api/v1/navigation/validate?path=ecosystem,coca-cola,market
GET    /api/v1/navigation/children?path=ecosystem,coca-cola
POST   /api/v1/navigation/search
```

### Metrics

```
GET    /api/v1/metrics/:entityId
GET    /api/v1/metrics/:entityId/history?range=1h
POST   /api/v1/metrics/aggregate
```

### Entity Tracking

```
POST   /api/v1/tracking/start
GET    /api/v1/tracking/:trackingId
DELETE /api/v1/tracking/:trackingId
GET    /api/v1/tracking/:trackingId/journey
```

---

For complete implementation examples, see the source code in the `/src` directory.`
    },
    {
      `path`: `docs/CONTRIBUTING.md`,
      `content`: `# Contributing to CompanyCity

Thank you for your interest in contributing to CompanyCity! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of:
  - JavaScript ES6+
  - Three.js
  - Web Components

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/companycity-hybrid.git
   cd companycity-hybrid
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173

## Development Workflow

### 1. Create a Branch

```bash
# For features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/issue-description

# For documentation
git checkout -b docs/what-you-are-documenting
```

### 2. Make Your Changes

Follow the coding standards (see below) and ensure:
- Your code is well-commented
- You've added/updated tests
- Documentation is updated if needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Check code style
npm run lint
```

### 4. Commit Your Changes

We follow conventional commits:

```bash
# Format: <type>(<scope>): <subject>

# Examples:
git commit -m \"feat(navigation): add breadcrumb animation\"
git commit -m \"fix(renderer): memory leak in particle system\"
git commit -m \"docs(api): update SceneManager documentation\"
git commit -m \"perf(districts): optimize hexagon rendering\"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or modifications
- `chore`: Build process or auxiliary tool changes

### 5. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference to related issues
- Screenshots/GIFs for visual changes
- Performance impact notes if relevant

## Coding Standards

### JavaScript/ES6

```javascript
// Use const/let, no var
const MAX_ENTITIES = 1000;
let currentCount = 0;

// Use arrow functions for callbacks
items.map(item => item.id);

// Use template literals
const message = `Found ${count} items`;

// Use destructuring
const { x, y, z } = position;

// Use async/await over promises
async function loadData() {
  const response = await fetch(url);
  return response.json();
}
```

### Classes

```javascript
// ES6 classes with clear documentation
/**
 * Manages district-level scene rendering
 * @extends BaseScene
 */
class DistrictScene extends BaseScene {
  /**
   * @param {SceneManager} sceneManager - Three.js scene manager
   * @param {string} pattern - Layout pattern type
   */
  constructor(sceneManager, pattern) {
    super(sceneManager);
    this.pattern = pattern;
  }
  
  /**
   * Load district data and create visual elements
   * @param {District} districtData - District configuration
   * @returns {Promise<void>}
   */
  async load(districtData) {
    // Implementation
  }
}
```

### Web Components

```javascript
// Minimal Web Components for UI only
class CCNavigation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }
  
  disconnectedCallback() {
    this.removeEventListeners();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.styles}</style>
      <nav>${this.template}</nav>
    `;
  }
}

customElements.define('cc-navigation', CCNavigation);
```

### Three.js Guidelines

```javascript
// Dispose of resources
scene.traverse(child => {
  if (child.geometry) child.geometry.dispose();
  if (child.material) child.material.dispose();
});

// Use object pooling for particles
const particlePool = new ParticlePool(1000);

// Batch similar geometries
const merged = BufferGeometryUtils.mergeBufferGeometries(geometries);

// Use LOD where appropriate
const lod = new THREE.LOD();
lod.addLevel(highDetail, 50);
lod.addLevel(mediumDetail, 100);
lod.addLevel(lowDetail, 200);
```

## Architecture Guidelines

### 1. Follow the 70/30 Rule

- 70% ES6 Classes for logic
- 30% Web Components for UI

### 2. Keep Three.js Outside Shadow DOM

```javascript
// ❌ Don't do this
class MyScene extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Three.js doesn't work well in Shadow DOM
  }
}

// ✅ Do this
class MyScene {
  constructor(container) {
    this.renderer = new THREE.WebGLRenderer();
    container.appendChild(this.renderer.domElement);
  }
}
```

### 3. Use Event-Driven Communication

```javascript
// Use EventBus for decoupled communication`
    }
  ],
  `branch`: `main`
}
