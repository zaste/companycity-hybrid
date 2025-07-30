# 🏗️ CompanyCity: Especificación Técnica Unificada Completa

## 📋 **ÍNDICE GENERAL**

1. [**ARQUITECTURA GENERAL**](#1-arquitectura-general)
2. [**ESPECIFICACIONES POR NIVEL**](#2-especificaciones-por-nivel)
3. [**MAPA COMPLETO DE NAVEGACIÓN**](#3-mapa-completo-de-navegación)
4. [**SISTEMA DE DATOS Y APIs**](#4-sistema-de-datos-y-apis)
5. [**SISTEMA DE RENDERING**](#5-sistema-de-rendering)
6. [**SISTEMA DE ESTADO Y EVENTOS**](#6-sistema-de-estado-y-eventos)
7. [**REAL-TIME DATA STREAMING**](#7-real-time-data-streaming)
8. [**SEGURIDAD Y PERFORMANCE**](#8-seguridad-y-performance)
9. [**TESTING Y DEPLOYMENT**](#9-testing-y-deployment)
10. [**MÉTRICAS Y MONITORING**](#10-métricas-y-monitoring)

---

## 🎯 **1. ARQUITECTURA GENERAL**

### **1.1 Stack Tecnológico Base**

```javascript
Core Technologies:
├── Frontend: Vanilla JavaScript + Web Components (LitElement)
├── Rendering: Canvas 2D/WebGL2 + OffscreenCanvas
├── State Management: EventTarget + CustomEvents + Proxy
├── Data Layer: WebSocket + REST APIs + IndexedDB
├── Storage: In-memory only (no localStorage/sessionStorage)
├── Workers: Web Workers + SharedArrayBuffer
├── Styling: CSS3 + CSS Custom Properties
└── Build & Deploy: Vite + ESBuild + Web Components Polyfills

Frontend:
- Web Components (LitElement) - UI modular y reutilizable
- TypeScript - Type safety y mejor DX
- Canvas 2D/WebGL2 - Render de alto rendimiento
- CSS Custom Properties - Theming dinámico
- Web Workers - Processing pesado sin bloquear UI
- SharedArrayBuffer - Compartir datos entre workers

Backend Integration:
- WebSocket (native) - Real-time data streaming
- Fetch API - REST/GraphQL communication
- IndexedDB - Client-side caching
- Web Streams API - Streaming data processing

Build & Deploy:
- Vite - Fast bundling y HMR
- ESBuild - Ultra-fast compilation
- Web Components Polyfills - Browser compatibility
```

### **1.2 Arquitectura de Componentes**

```html
<company-city-app>
  <navigation-controller>
    <zoom-controls></zoom-controls>
    <breadcrumb-trail></breadcrumb-trail>
    <search-global></search-global>
  </navigation-controller>
  
  <main-viewport>
    <level-renderer current-level="ecosystem|company|district|building|module|element">
      <!-- Dynamic component loading -->
      <ecosystem-view></ecosystem-view>
      <company-view></company-view>
      <district-view pattern="cyclic|spatial|linear|hub"></district-view>
      <building-view pattern="pipeline|parallel|orchestrator|feedback"></building-view>
      <module-view pattern="control|inventory|dashboard|stream"></module-view>
      <element-view pattern="detail|config|history|compare"></element-view>
    </level-renderer>
  </main-viewport>
  
  <side-panel>
    <entity-tracker></entity-tracker>
    <metrics-overlay></metrics-overlay>
    <time-controls></time-controls>
    <comparison-panel></comparison-panel>
  </side-panel>
  
  <overlay-system>
    <entity-inspector></entity-inspector>
    <configuration-modal></configuration-modal>
    <search-results></search-results>
  </overlay-system>
</company-city-app>
```

### **1.3 Base Component Class**

```javascript
// Base Web Component Structure
class CompanyCityComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = new Proxy({}, {
      set: (target, key, value) => {
        target[key] = value;
        this.render();
        this.dispatchEvent(new CustomEvent('state-change', {
          detail: { key, value },
          bubbles: true
        }));
        return true;
      }
    });
  }

  connectedCallback() {
    this.initialize();
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  // Abstract methods to be implemented by subclasses
  initialize() { throw new Error('Must implement initialize()'); }
  render() { throw new Error('Must implement render()'); }
  cleanup() { throw new Error('Must implement cleanup()'); }
}

// Enhanced Base Level Component
export abstract class BaseLevel extends LitElement {
  @property({ type: String }) levelType: LevelType;
  @property({ type: Object }) data: LevelData;
  @property({ type: String }) pattern: PatternType;
  @property({ type: Number }) zoomLevel: number = 1;
  @property({ type: Object }) camera: CameraState;
  
  abstract render(): TemplateResult;
  abstract onZoomIn(targetId: string): void;
  abstract onZoomOut(): void;
  abstract onEntityClick(entity: Entity): void;
  
  protected dispatchNavigationEvent(detail: NavigationEventDetail) {
    this.dispatchEvent(new CustomEvent('navigation-change', {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}

// Types
type LevelType = 'ecosystem' | 'company' | 'district' | 'building' | 'module' | 'element';
type PatternType = 'cyclic' | 'spatial' | 'linear' | 'hub' | 'pipeline' | 'parallel' | 'orchestrator' | 'feedback' | 'control' | 'inventory' | 'dashboard' | 'stream';

interface LevelData {
  id: string;
  name: string;
  type: LevelType;
  pattern: PatternType;
  entities: Entity[];
  connections: Connection[];
  metrics: Metrics;
  children?: LevelData[];
}
```

---

## 📍 **2. ESPECIFICACIONES POR NIVEL**

### **2.1 NIVEL 1: ECOSYSTEM**

#### **Web Component: `<ecosystem-view>`**

```javascript
class EcosystemView extends CompanyCityComponent {
  static get observedAttributes() {
    return ['companies', 'view-mode', 'filter-criteria'];
  }

  initialize() {
    this.companies = [];
    this.viewMode = 'market'; // market, performance, competitive, geographic
    this.filterCriteria = null;
    this.camera = { x: 0, y: 0, zoom: 1 };
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100vh;
          background: radial-gradient(circle at center, #1a1a2e, #0f0f23);
        }
        #canvas {
          width: 100%;
          height: 100%;
          cursor: grab;
        }
        #controls {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.8);
          padding: 16px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        .view-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 8px 16px;
          margin: 4px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .view-btn:hover, .view-btn.active {
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
      </style>
      <canvas id="canvas"></canvas>
      <div id="controls">
        <button class="view-btn active" data-view="market">Market View</button>
        <button class="view-btn" data-view="performance">Performance</button>
        <button class="view-btn" data-view="competitive">Competitive</button>
        <button class="view-btn" data-view="geographic">Geographic</button>
      </div>
    `;
    this.initializeCanvas();
  }

  initializeCanvas() {
    const canvas = this.shadowRoot.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    this.renderCompanies();
    this.attachCanvasListeners();
  }

  renderCompanies() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Hexagonal isometric rendering logic
    this.companies.forEach((company, index) => {
      const hexagon = this.calculateHexagonPosition(index, this.companies.length);
      this.drawCompanyHexagon(company, hexagon);
      
      // Draw connections between companies
      this.drawCompanyConnections(company, index);
    });
    
    // Render flowing entities between companies
    this.renderInterCompanyFlow();
  }

  calculateHexagonPosition(index, total) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      size: 60 + (company.metrics.healthScore / 100) * 40
    };
  }

  drawCompanyHexagon(company, position) {
    const { x, y, size } = position;
    const healthColor = this.getHealthColor(company.metrics.healthScore);
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw hexagon with 3D isometric effect
    this.drawIsometricHexagon(size, healthColor, company.metrics.healthScore);
    
    // Add company name
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = `${size / 6}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(company.name, 0, size / 4);
    
    // Add metrics display
    this.drawCompanyMetrics(company.metrics, size);
    
    this.ctx.restore();
  }

  drawIsometricHexagon(size, color, health) {
    const depth = size * 0.3;
    
    // Draw hexagon shape with depth
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();
    
    // Create gradient based on health
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, this.lightenColor(color, 30));
    gradient.addColorStop(1, color);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Add 3D effect
    this.ctx.strokeStyle = this.lightenColor(color, 20);
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Add health indicator pulse
    if (health < 50) {
      this.addPulseEffect(size, '#ff4444');
    } else if (health < 80) {
      this.addPulseEffect(size, '#ffaa44');
    }
  }
}

customElements.define('ecosystem-view', EcosystemView);
```

#### **Data Model: Company Entity**

```typescript
interface CompanyEntity {
  id: string;
  name: string;
  industry: string;
  region: string;
  size: 'startup' | 'sme' | 'enterprise';
  metrics: CompanyMetrics;
  districts: DistrictSummary[];
  visualState: CompanyVisualState;
  relationships: CompanyRelationship[];
}

interface CompanyMetrics {
  revenue: MonetaryValue;
  employees: number;
  marketShare: number;
  growthRate: number;
  healthScore: number; // 0-100
  performanceIndex: number;
  strategicMetrics: StrategicMetrics;
}

interface CompanyVisualState {
  position: { x: number; y: number };
  color: string;
  animation: 'idle' | 'pulse' | 'alert' | 'processing';
  connections: string[]; // IDs of connected companies
  size: number;
  opacity: number;
}

interface CompanyRelationship {
  sourceId: string;
  targetId: string;
  type: 'competitor' | 'partner' | 'supplier' | 'customer';
  strength: number; // 0-1
  direction: 'bidirectional' | 'source-to-target' | 'target-to-source';
}

interface EcosystemData {
  companies: CompanyEntity[];
  relationships: CompanyRelationship[];
  marketData: MarketMetrics;
  competitiveAnalysis: CompetitiveData;
  timeframe: TimeRange;
}
```

### **2.2 NIVEL 2: COMPANY**

#### **Web Component: `<company-view>`**

```javascript
class CompanyView extends CompanyCityComponent {
  static get observedAttributes() {
    return ['company-id', 'view-mode', 'time-period'];
  }

  initialize() {
    this.companyId = null;
    this.districts = [];
    this.viewMode = 'functional'; // functional, performance, flow
    this.timePeriod = 'current';
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          grid-template-rows: 80px 1fr 60px;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        #header {
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 24px;
          backdrop-filter: blur(10px);
        }
        #districts-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 24px;
          padding: 24px;
          background: rgba(0,0,0,0.1);
        }
        #footer {
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }
        .company-title {
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        .company-metrics {
          display: flex;
          gap: 16px;
          color: rgba(255,255,255,0.8);
        }
      </style>
      <div id="header">
        <company-breadcrumb></company-breadcrumb>
        <h1 class="company-title">${this.companyName}</h1>
        <div class="company-metrics">
          <span>Health: ${this.companyHealth}%</span>
          <span>Revenue: ${this.companyRevenue}</span>
          <span>Employees: ${this.companyEmployees}</span>
        </div>
        <company-controls></company-controls>
      </div>
      <div id="districts-container">
        ${this.renderDistricts()}
      </div>
      <div id="footer">
        <company-metrics-summary></company-metrics-summary>
        <time-range-selector></time-range-selector>
        <view-mode-selector></view-mode-selector>
      </div>
    `;
  }

  renderDistricts() {
    const districtOrder = ['market', 'delivery', 'finance', 'people', 'technology', 'governance'];
    
    return districtOrder.map((type, index) => {
      const district = this.districts.find(d => d.type === type) || this.createDefaultDistrict(type);
      return `
        <district-card 
          district-id="${district.id}"
          name="${district.name}"
          type="${district.type}"
          health="${district.health}"
          pattern="${district.pattern}"
          position="${index}">
        </district-card>
      `;
    }).join('');
  }

  createDefaultDistrict(type) {
    const districtNames = {
      market: 'Market District',
      delivery: 'Delivery District', 
      finance: 'Finance District',
      people: 'People District',
      technology: 'Technology District',
      governance: 'Governance District'
    };
    
    return {
      id: `${this.companyId}-${type}`,
      name: districtNames[type],
      type,
      health: 75,
      pattern: type === 'market' ? 'cyclic' : 'linear'
    };
  }
}

customElements.define('company-view', CompanyView);
```

#### **Web Component: `<district-card>`**

```javascript
class DistrictCard extends CompanyCityComponent {
  static get observedAttributes() {
    return ['district-id', 'name', 'type', 'health', 'pattern', 'position'];
  }

  render() {
    const health = parseInt(this.getAttribute('health'));
    const type = this.getAttribute('type');
    const pattern = this.getAttribute('pattern');
    const healthColor = this.getHealthColor(health);
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(15px);
          border-radius: 16px;
          padding: 24px;
          border: 2px solid ${healthColor};
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        :host(:hover) {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border-color: ${this.lightenColor(healthColor, 30)};
        }
        .district-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .district-icon {
          font-size: 28px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .pattern-indicator {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 20px;
          opacity: 0.7;
        }
        .health-indicator {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${healthColor};
          position: absolute;
          top: 16px;
          left: 16px;
          box-shadow: 0 0 10px ${healthColor}50;
        }
        h3 {
          color: white;
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        .district-type {
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 20px;
        }
        .metric {
          background: rgba(0,0,0,0.2);
          padding: 12px;
          border-radius: 8px;
          text-align: center;
        }
        .metric-value {
          font-size: 16px;
          font-weight: bold;
          color: white;
        }
        .metric-label {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
        }
        .flow-animation {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, ${healthColor}, transparent);
          animation: flow 2s ease-in-out infinite;
        }
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      </style>
      <div class="health-indicator"></div>
      <div class="pattern-indicator">${this.getPatternIcon(pattern)}</div>
      <div class="district-header">
        <div class="district-icon">${this.getDistrictIcon(type)}</div>
        <div>
          <h3>${this.getAttribute('name')}</h3>
          <div class="district-type">${type}</div>
        </div>
      </div>
      <div class="metrics" id="metrics-container">
        <div class="metric">
          <div class="metric-value" id="throughput">--</div>
          <div class="metric-label">Throughput</div>
        </div>
        <div class="metric">
          <div class="metric-value" id="efficiency">--</div>
          <div class="metric-label">Efficiency</div>
        </div>
        <div class="metric">
          <div class="metric-value" id="capacity">--</div>
          <div class="metric-label">Capacity</div>
        </div>
        <div class="metric">
          <div class="metric-value" id="alerts">--</div>
          <div class="metric-label">Alerts</div>
        </div>
      </div>
      <div class="flow-animation"></div>
    `;
    
    this.loadMetrics();
    this.attachClickListener();
  }

  getDistrictIcon(type) {
    const icons = {
      'market': '🎯',
      'delivery': '⚙️', 
      'finance': '💰',
      'people': '👥',
      'technology': '💻',
      'governance': '⚖️'
    };
    return icons[type] || '📊';
  }

  getPatternIcon(pattern) {
    const icons = {
      'cyclic': '🔄',
      'spatial': '🌐',
      'linear': '➡️',
      'hub': '🌟',
      'pipeline': '⚡',
      'parallel': '📊',
      'orchestrator': '🎼',
      'feedback': '🔄'
    };
    return icons[pattern] || '📊';
  }

  getHealthColor(health) {
    if (health >= 80) return '#4ade80';
    if (health >= 60) return '#fbbf24';
    if (health >= 40) return '#fb923c';
    return '#ef4444';
  }

  attachClickListener() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('district-navigate', {
        detail: {
          districtId: this.getAttribute('district-id'),
          districtType: this.getAttribute('type')
        },
        bubbles: true
      }));
    });
  }
}

customElements.define('district-card', DistrictCard);
```

### **2.3 NIVEL 3: DISTRICT**

#### **Web Component: `<district-view>`**

```javascript
class DistrictView extends CompanyCityComponent {
  static get observedAttributes() {
    return ['district-id', 'pattern-type', 'view-mode'];
  }

  initialize() {
    this.districtId = null;
    this.patternType = 'cyclic'; // cyclic, spatial, linear, hub
    this.buildings = [];
    this.entities = [];
    this.viewMode = 'flow'; // flow, performance, capacity
    this.animationSystem = null;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100vh;
          background: radial-gradient(circle at center, #1a1a2e, #0f0f23);
          position: relative;
        }
        #canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
        #overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        #controls {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          background: rgba(0,0,0,0.8);
          padding: 16px;
          border-radius: 12px;
          pointer-events: all;
          backdrop-filter: blur(10px);
        }
        .view-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .view-btn:hover, .view-btn.active {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        #pattern-info {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(0,0,0,0.8);
          padding: 16px;
          border-radius: 8px;
          color: white;
          pointer-events: all;
        }
      </style>
      <canvas id="canvas"></canvas>
      <div id="overlay">
        <div id="pattern-info">
          <h3>${this.getPatternTitle()}</h3>
          <p>${this.getPatternDescription()}</p>
        </div>
        <district-breadcrumb></district-breadcrumb>
        <entity-tracker></entity-tracker>
        <performance-hud></performance-hud>
      </div>
      <div id="controls">
        <button class="view-btn active" data-view="flow">Flow View</button>
        <button class="view-btn" data-view="performance">Performance</button>
        <button class="view-btn" data-view="capacity">Capacity</button>
        <button class="view-btn" data-view="insights">Insights</button>
      </div>
    `;
    
    this.initializeDistrictCanvas();
  }

  initializeDistrictCanvas() {
    const canvas = this.shadowRoot.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    
    // Initialize animation system
    this.animationSystem = new EntityAnimationSystem(canvas, this.buildings, this.entities);
    
    // Initialize pattern-specific rendering
    this.renderPattern();
    this.startEntityAnimation();
    this.attachCanvasListeners();
  }

  renderPattern() {
    switch(this.patternType) {
      case 'cyclic':
        this.renderCyclicPattern();
        break;
      case 'spatial':
        this.renderSpatialPattern();
        break;
      case 'linear':
        this.renderLinearPattern();
        break;
      case 'hub':
        this.renderHubPattern();
        break;
    }
  }

  renderCyclicPattern() {
    const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
    
    // For Market District: Awareness → Interest → Consideration → Purchase → Retention → Advocacy
    const marketBuildings = [
      { name: 'Awareness', color: '#4f46e5', metrics: { throughput: 1200, conversion: 85 } },
      { name: 'Interest', color: '#7c3aed', metrics: { throughput: 1020, conversion: 78 } },
      { name: 'Consideration', color: '#c026d3', metrics: { throughput: 795, conversion: 45 } },
      { name: 'Purchase', color: '#dc2626', metrics: { throughput: 358, conversion: 92 } },
      { name: 'Retention', color: '#ea580c', metrics: { throughput: 329, conversion: 88 } },
      { name: 'Advocacy', color: '#65a30d', metrics: { throughput: 290, conversion: 23 } }
    ];
    
    this.buildings = marketBuildings;
    
    this.buildings.forEach((building, index) => {
      const angle = (index / this.buildings.length) * 2 * Math.PI - Math.PI / 2;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      
      building.position = { x, y };
      this.drawBuilding(building, { x, y });
      
      // Draw arrow to next building (cyclic flow)
      const nextIndex = (index + 1) % this.buildings.length;
      const nextAngle = (nextIndex / this.buildings.length) * 2 * Math.PI - Math.PI / 2;
      const nextX = center.x + Math.cos(nextAngle) * radius;
      const nextY = center.y + Math.sin(nextAngle) * radius;
      
      this.drawFlowConnection({ x, y }, { x: nextX, y: nextY }, building.metrics.throughput);
    });
    
    // Draw center info
    this.drawCenterInfo(center, {
      title: 'Market Flow',
      totalThroughput: this.buildings.reduce((sum, b) => sum + b.metrics.throughput, 0),
      avgConversion: this.buildings.reduce((sum, b) => sum + b.metrics.conversion, 0) / this.buildings.length
    });
  }

  renderSpatialPattern() {
    const cols = Math.ceil(Math.sqrt(this.buildings.length));
    const rows = Math.ceil(this.buildings.length / cols);
    const spacing = { 
      x: (this.canvas.width - 200) / (cols + 1), 
      y: (this.canvas.height - 200) / (rows + 1) 
    };
    
    this.buildings.forEach((building, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = spacing.x * (col + 1) + 100;
      const y = spacing.y * (row + 1) + 100;
      
      building.position = { x, y };
      this.drawBuilding(building, { x, y });
      
      // Draw proximity connections
      this.drawProximityConnections(building, index);
    });
  }

  renderLinearPattern() {
    const startX = 150;
    const endX = this.canvas.width - 150;
    const spacing = (endX - startX) / (this.buildings.length - 1);
    const y = this.canvas.height / 2;
    
    this.buildings.forEach((building, index) => {
      const x = startX + index * spacing;
      
      building.position = { x, y };
      this.drawBuilding(building, { x, y });
      
      // Draw pipeline arrow to next building
      if (index < this.buildings.length - 1) {
        const nextX = startX + (index + 1) * spacing;
        this.drawPipelineConnection({ x: x + 40, y }, { x: nextX - 40, y }, building.metrics.throughput);
      }
    });
  }

  renderHubPattern() {
    const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    const hubBuilding = this.buildings[0]; // First building is the hub
    const satelliteBuildings = this.buildings.slice(1);
    
    // Draw hub in center
    this.drawBuilding(hubBuilding, center, true);
    
    // Draw satellites in circle around hub
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.25;
    satelliteBuildings.forEach((building, index) => {
      const angle = (index / satelliteBuildings.length) * 2 * Math.PI;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      
      building.position = { x, y };
      this.drawBuilding(building, { x, y });
      
      // Draw connection to hub
      this.drawHubConnection(center, { x, y }, building.metrics.throughput);
    });
  }

  drawBuilding(building, position, isHub = false) {
    const { x, y } = position;
    const size = isHub ? 80 : 60;
    const color = building.color || '#4f46e5';
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw building as hexagon with 3D effect
    this.drawBuildingHexagon(size, color, building.metrics);
    
    // Add building name
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = `bold ${size / 8}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(building.name, 0, isHub ? -10 : 0);
    
    // Add metrics if not hub
    if (!isHub && building.metrics) {
      this.ctx.font = `${size / 12}px Arial`;
      this.ctx.fillText(`${building.metrics.throughput}/h`, 0, size / 3);
      this.ctx.fillText(`${building.metrics.conversion}%`, 0, size / 2);
    }
    
    this.ctx.restore();
    
    // Store click area for interaction
    building.clickArea = { x: x - size, y: y - size, width: size * 2, height: size * 2 };
  }

  drawBuildingHexagon(size, color, metrics) {
    // Draw hexagon with performance-based styling
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();
    
    // Create gradient based on performance
    const performance = metrics.conversion || 50;
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    
    if (performance >= 80) {
      gradient.addColorStop(0, this.lightenColor(color, 30));
      gradient.addColorStop(1, color);
    } else if (performance >= 60) {
      gradient.addColorStop(0, this.lightenColor('#fbbf24', 20));
      gradient.addColorStop(1, '#fbbf24');
    } else {
      gradient.addColorStop(0, this.lightenColor('#ef4444', 20));
      gradient.addColorStop(1, '#ef4444');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Add stroke
    this.ctx.strokeStyle = this.lightenColor(color, 40);
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Add performance indicator glow
    if (performance >= 90) {
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = color;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }
  }

  drawFlowConnection(from, to, throughput) {
    const intensity = Math.min(throughput / 1000, 1); // Normalize throughput
    
    this.ctx.save();
    
    // Draw flowing line
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    
    // Create curved arrow
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const controlX = midX + (to.y - from.y) * 0.1;
    const controlY = midY - (to.x - from.x) * 0.1;
    
    this.ctx.quadraticCurveTo(controlX, controlY, to.x, to.y);
    
    // Style based on throughput
    this.ctx.strokeStyle = `rgba(64, 224, 208, ${0.3 + intensity * 0.7})`;
    this.ctx.lineWidth = 2 + intensity * 4;
    this.ctx.stroke();
    
    // Add animated flow particles
    this.addFlowParticles(from, to, throughput);
    
    // Draw arrowhead
    this.drawArrowhead(from, to, intensity);
    
    this.ctx.restore();
  }

  addFlowParticles(from, to, throughput) {
    const particleCount = Math.floor(throughput / 200);
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    
    for (let i = 0; i < Math.min(particleCount, 10); i++) {
      const progress = (i / particleCount + performance.now() / 2000) % 1;
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
      this.ctx.fillStyle = '#40e0d0';
      this.ctx.fill();
    }
  }

  startEntityAnimation() {
    if (this.animationSystem) {
      this.animationSystem.start();
    }
  }

  getPatternTitle() {
    const titles = {
      'cyclic': 'Cyclic Flow Pattern',
      'spatial': 'Spatial Distribution',
      'linear': 'Linear Pipeline',
      'hub': 'Hub & Spoke Model'
    };
    return titles[this.patternType] || 'District Pattern';
  }

  getPatternDescription() {
    const descriptions = {
      'cyclic': 'Continuous cycle where entities flow through connected stages and return to start',
      'spatial': 'Distributed layout where buildings operate independently in allocated space',
      'linear': 'Sequential pipeline where entities progress through ordered stages',
      'hub': 'Central hub coordinates all activities with satellite buildings'
    };
    return descriptions[this.patternType] || 'Custom district pattern';
  }
}

customElements.define('district-view', DistrictView);
```

#### **Entity Animation System**

```javascript
class EntityAnimationSystem {
  constructor(canvas, buildings, entities) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.buildings = buildings;
    this.entities = entities;
    this.animationId = null;
    this.time = 0;
  }

  start() {
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  animate() {
    this.time += 16; // ~60fps
    this.updateEntities();
    this.renderEntities();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateEntities() {
    this.entities.forEach(entity => {
      // Update entity position based on path and speed
      if (entity.path && entity.currentPathIndex < entity.path.length - 1) {
        const current = entity.path[entity.currentPathIndex];
        const next = entity.path[entity.currentPathIndex + 1];
        
        // Smooth interpolation between path points
        entity.progress += entity.speed * (entity.priority === 'high' ? 1.5 : 1);
        
        if (entity.progress >= 1) {
          entity.progress = 0;
          entity.currentPathIndex++;
          
          // Trigger building entry event
          this.triggerBuildingEvent(entity, next.buildingId, 'enter');
        }
        
        // Bezier curve interpolation for smooth movement
        const t = this.easeInOutCubic(entity.progress);
        entity.x = current.position.x + (next.position.x - current.position.x) * t;
        entity.y = current.position.y + (next.position.y - current.position.y) * t;
        
        // Add slight random variation for natural movement
        entity.x += Math.sin(this.time * 0.01 + entity.id.charCodeAt(0)) * 2;
        entity.y += Math.cos(this.time * 0.01 + entity.id.charCodeAt(0)) * 2;
      }
      
      // Update entity state
      this.updateEntityState(entity);
    });
  }

  renderEntities() {
    this.entities.forEach(entity => {
      this.ctx.save();
      this.ctx.translate(entity.x, entity.y);
      
      // Rotate entity based on movement direction
      if (entity.path && entity.currentPathIndex < entity.path.length - 1) {
        const current = entity.path[entity.currentPathIndex];
        const next = entity.path[entity.currentPathIndex + 1];
        const angle = Math.atan2(next.position.y - current.position.y, next.position.x - current.position.x);
        this.ctx.rotate(angle);
      }
      
      // Draw entity based on type and state
      switch(entity.type) {
        case 'lead':
          this.drawLead(entity);
          break;
        case 'customer':
          this.drawCustomer(entity);
          break;
        case 'task':
          this.drawTask(entity);
          break;
        case 'data':
          this.drawData(entity);
          break;
        case 'request':
          this.drawRequest(entity);
          break;
      }
      
      this.ctx.restore();
      
      // Draw entity trail if moving fast
      if (entity.speed > 0.05) {
        this.drawEntityTrail(entity);
      }
    });
  }

  drawLead(entity) {
    const size = entity.priority === 'high' ? 8 : 6;
    const color = this.getLeadColor(entity);
    
    // Main body
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Glow effect for hot leads
    if (entity.priority === 'high') {
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
    
    // Status indicator
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size + 2, 0, 2 * Math.PI);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Add pulsing animation for high priority
    if (entity.priority === 'high') {
      const pulse = 1 + Math.sin(this.time * 0.01) * 0.2;
      this.ctx.scale(pulse, pulse);
      this.ctx.fill();
    }
  }

  drawCustomer(entity) {
    const size = 7;
    const color = '#4ade80'; // Green for converted customers
    
    // Draw diamond shape
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size);
    this.ctx.lineTo(size, 0);
    this.ctx.lineTo(0, size);
    this.ctx.lineTo(-size, 0);
    this.ctx.closePath();
    
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Add sparkle effect
    this.drawSparkles(size);
  }

  drawTask(entity) {
    const size = 5;
    const color = this.getTaskColor(entity.status);
    
    // Draw square
    this.ctx.fillStyle = color;
    this.ctx.fillRect(-size/2, -size/2, size, size);
    
    // Add status border
    this.ctx.strokeStyle = this.lightenColor(color, 30);
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(-size/2, -size/2, size, size);
  }

  drawData(entity) {
    const size = 4;
    
    // Draw flowing data packet
    this.ctx.beginPath();
    this.ctx.rect(-size, -size/2, size*2, size);
    this.ctx.fillStyle = '#60a5fa';
    this.ctx.fill();
    
    // Add data flow lines
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(-size + i*2, -size/4);
      this.ctx.lineTo(-size + i*2 + 1, size/4);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }
  }

  getLeadColor(entity) {
    switch(entity.priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#65a30d';
      default: return '#6b7280';
    }
  }

  getTaskColor(status) {
    switch(status) {
      case 'completed': return '#4ade80';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#eab308';
      case 'blocked': return '#ef4444';
      default: return '#6b7280';
    }
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  triggerBuildingEvent(entity, buildingId, eventType) {
    // Dispatch custom event for building interactions
    document.dispatchEvent(new CustomEvent('entity-building-event', {
      detail: {
        entityId: entity.id,
        buildingId,
        eventType,
        timestamp: Date.now()
      }
    }));
  }
}
```

### **2.4 NIVEL 4: BUILDING**

#### **Web Component: `<building-view>`**

```javascript
class BuildingView extends CompanyCityComponent {
  static get observedAttributes() {
    return ['building-id', 'pattern-type', 'modules'];
  }

  initialize() {
    this.buildingId = null;
    this.patternType = 'pipeline'; // pipeline, parallel, orchestrator, feedback-loop
    this.modules = [];
    this.activeEntities = [];
    this.performanceData = null;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          grid-template-rows: 80px 1fr 80px;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        #header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
        }
        #modules-container {
          padding: 24px;
          overflow: auto;
          position: relative;
        }
        #footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
        }
        .building-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .building-title {
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        .pattern-badge {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .module-pipeline {
          display: flex;
          align-items: center;
          gap: 40px;
          padding: 24px;
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        .module-parallel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .module-orchestrator {
          display: grid;
          grid-template-areas: 
            "module1 orchestrator module2"
            "module3 orchestrator module4";
          grid-template-columns: 1fr 200px 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 24px;
          align-items: center;
        }
        .module-feedback {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 24px;
          position: relative;
        }
        .pipeline-flow {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4ade80, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 2px;
          animation: flowAnimation 3s ease-in-out infinite;
        }
        @keyframes flowAnimation {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .performance-summary {
          display: flex;
          gap: 20px;
          color: white;
        }
        .perf-metric {
          text-align: center;
        }
        .perf-value {
          font-size: 18px;
          font-weight: bold;
        }
        .perf-label {
          font-size: 12px;
          opacity: 0.8;
        }
      </style>
      <div id="header">
        <div class="building-header">
          <building-breadcrumb></building-breadcrumb>
          <h2 class="building-title">${this.buildingName}</h2>
          <div class="pattern-badge">${this.patternType}</div>
        </div>
        <building-controls></building-controls>
      </div>
      <div id="modules-container">
        ${this.renderModules()}
        ${this.renderEntityFlow()}
      </div>
      <div id="footer">
        <div class="performance-summary">
          <div class="perf-metric">
            <div class="perf-value" id="throughput">--</div>
            <div class="perf-label">Throughput/h</div>
          </div>
          <div class="perf-metric">
            <div class="perf-value" id="efficiency">--</div>
            <div class="perf-label">Efficiency %</div>
          </div>
          <div class="perf-metric">
            <div class="perf-value" id="capacity">--</div>
            <div class="perf-label">Capacity %</div>
          </div>
          <div class="perf-metric">
            <div class="perf-value" id="sla">--</div>
            <div class="perf-label">SLA %</div>
          </div>
        </div>
        <entity-flow-controls></entity-flow-controls>
      </div>
    `;
    
    this.loadPerformanceData();
  }

  renderModules() {
    const containerClass = `module-${this.patternType}`;
    
    let moduleElements;
    
    switch(this.patternType) {
      case 'pipeline':
        moduleElements = this.renderPipelineModules();
        break;
      case 'parallel':
        moduleElements = this.renderParallelModules();
        break;
      case 'orchestrator':
        moduleElements = this.renderOrchestratorModules();
        break;
      case 'feedback-loop':
        moduleElements = this.renderFeedbackModules();
        break;
      default:
        moduleElements = this.renderDefaultModules();
    }

    return `
      <div class="${containerClass}">
        ${moduleElements}
        ${this.patternType === 'pipeline' ? '<div class="pipeline-flow"></div>' : ''}
      </div>
    `;
  }

  renderPipelineModules() {
    // Example: Consideration Building → Lead Qualification → Demo → Proposal → Negotiation
    const pipelineModules = [
      { name: 'Lead Qualification', type: 'scoring', status: 'healthy', throughput: 120 },
      { name: 'Demo/Presentation', type: 'interaction', status: 'healthy', throughput: 98 },
      { name: 'Proposal Generation', type: 'documentation', status: 'warning', throughput: 87 },
      { name: 'Negotiation Support', type: 'collaboration', status: 'healthy', throughput: 76 }
    ];
    
    return pipelineModules.map((module, index) => `
      <module-card
        module-id="${module.name.toLowerCase().replace(/\s+/g, '-')}"
        name="${module.name}"
        type="${module.type}"
        status="${module.status}"
        throughput="${module.throughput}"
        pattern="pipeline"
        position="${index}">
      </module-card>
    `).join('');
  }

  renderParallelModules() {
    return this.modules.map(module => `
      <module-card
        module-id="${module.id}"
        name="${module.name}"
        type="${module.type}"
        status="${module.status}"
        pattern="parallel">
      </module-card>
    `).join('');
  }

  renderOrchestratorModules() {
    const orchestrator = this.modules.find(m => m.type === 'orchestrator');
    const workers = this.modules.filter(m => m.type !== 'orchestrator');
    
    let html = '';
    
    // Place worker modules in grid areas
    workers.forEach((module, index) => {
      const gridArea = `module${index + 1}`;
      html += `
        <module-card
          module-id="${module.id}"
          name="${module.name}"
          type="${module.type}"
          status="${module.status}"
          pattern="orchestrator"
          style="grid-area: ${gridArea}">
        </module-card>
      `;
    });
    
    // Place orchestrator in center
    if (orchestrator) {
      html += `
        <module-card
          module-id="${orchestrator.id}"
          name="${orchestrator.name}"
          type="${orchestrator.type}"
          status="${orchestrator.status}"
          pattern="orchestrator"
          style="grid-area: orchestrator">
        </module-card>
      `;
    }
    
    return html;
  }

  renderFeedbackModules() {
    return this.modules.map((module, index) => `
      <module-card
        module-id="${module.id}"
        name="${module.name}"
        type="${module.type}"
        status="${module.status}"
        pattern="feedback"
        position="${index}">
      </module-card>
    `).join('');
  }

  renderEntityFlow() {
    if (this.activeEntities.length === 0) return '';
    
    return `
      <entity-flow-visualization
        entities='${JSON.stringify(this.activeEntities)}'
        pattern="${this.patternType}">
      </entity-flow-visualization>
    `;
  }

  loadPerformanceData() {
    // Simulate loading performance metrics
    setTimeout(() => {
      const throughputEl = this.shadowRoot.getElementById('throughput');
      const efficiencyEl = this.shadowRoot.getElementById('efficiency');
      const capacityEl = this.shadowRoot.getElementById('capacity');
      const slaEl = this.shadowRoot.getElementById('sla');
      
      if (throughputEl) throughputEl.textContent = '347';
      if (efficiencyEl) efficiencyEl.textContent = '87';
      if (capacityEl) capacityEl.textContent = '73';
      if (slaEl) slaEl.textContent = '98.2';
    }, 500);
  }
}

customElements.define('building-view', BuildingView);
```

#### **Web Component: `<module-card>`**

```javascript
class ModuleCard extends CompanyCityComponent {
  static get observedAttributes() {
    return ['module-id', 'name', 'type', 'status', 'pattern', 'throughput', 'position'];
  }

  render() {
    const status = this.getAttribute('status');
    const type = this.getAttribute('type');
    const pattern = this.getAttribute('pattern');
    const throughput = this.getAttribute('throughput') || '--';
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(15px);
          border-radius: 16px;
          padding: 24px;
          border: 2px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        :host(:hover) {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 28px rgba(0,0,0,0.3);
          border-color: ${this.getStatusColor(status)};
        }
        .module-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .status-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${this.getStatusColor(status)};
          box-shadow: 0 0 10px ${this.getStatusColor(status)}50;
          position: absolute;
          top: 16px;
          right: 16px;
        }
        .type-badge {
          background: rgba(0,0,0,0.3);
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        h4 {
          color: white;
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        .metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }
        .metric {
          text-align: center;
          background: rgba(0,0,0,0.2);
          padding: 8px;
          border-radius: 6px;
        }
        .metric-value {
          font-weight: bold;
          font-size: 14px;
          color: white;
        }
        .metric-label {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
        }
        .throughput-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, 
            ${this.getStatusColor(status)}20, 
            ${this.getStatusColor(status)}, 
            ${this.getStatusColor(status)}20);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .processing-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: ${status === 'processing' ? 'block' : 'none'};
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      </style>
      <div class="status-indicator"></div>
      <div class="type-badge">${type}</div>
      <h4>${this.getAttribute('name')}</h4>
      <div class="metrics">
        <div class="metric">
          <div class="metric-value">${throughput}</div>
          <div class="metric-label">Throughput</div>
        </div>
        <div class="metric">
          <div class="metric-value" id="latency">--</div>
          <div class="metric-label">Latency</div>
        </div>
        <div class="metric">
          <div class="metric-value" id="success-rate">--</div>
          <div class="metric-label">Success %</div>
        </div>
        <div class="metric">
          <div class="metric-value" id="capacity">--</div>
          <div class="metric-label">Capacity</div>
        </div>
      </div>
      <div class="throughput-indicator"></div>
      <div class="processing-animation"></div>
    `;
    
    this.loadModuleMetrics();
    this.attachClickListener();
  }

  getStatusColor(status) {
    const colors = {
      'healthy': '#4ade80',
      'warning': '#fbbf24',
      'error': '#ef4444',
      'maintenance': '#8b5cf6',
      'processing': '#3b82f6'
    };
    return colors[status] || '#6b7280';
  }

  loadModuleMetrics() {
    // Simulate loading real-time metrics
    setTimeout(() => {
      const latencyEl = this.shadowRoot.getElementById('latency');
      const successRateEl = this.shadowRoot.getElementById('success-rate');
      const capacityEl = this.shadowRoot.getElementById('capacity');
      
      if (latencyEl) latencyEl.textContent = `${Math.floor(Math.random() * 500 + 100)}ms`;
      if (successRateEl) successRateEl.textContent = `${Math.floor(Math.random() * 20 + 80)}%`;
      if (capacityEl) capacityEl.textContent = `${Math.floor(Math.random() * 30 + 60)}%`;
    }, Math.random() * 1000 + 500);
  }

  attachClickListener() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('module-navigate', {
        detail: {
          moduleId: this.getAttribute('module-id'),
          moduleType: this.getAttribute('type')
        },
        bubbles: true
      }));
    });
  }
}

customElements.define('module-card', ModuleCard);
```

### **2.5 NIVEL 5: MODULE**

#### **Web Component: `<module-view>`**

```javascript
class ModuleView extends CompanyCityComponent {
  static get observedAttributes() {
    return ['module-id', 'module-type', 'perspective'];
  }

  initialize() {
    this.moduleId = null;
    this.moduleType = 'saas'; // saas, custom, legacy, manual
    this.perspective = 'business'; // business, technical, operations
    this.elements = [];
    this.selectedElement = null;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          grid-template-rows: 100px 1fr 80px;
          height: 100vh;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        }
        #header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 24px;
        }
        #content {
          padding: 24px;
          overflow: auto;
          background: #f8fafc;
        }
        #footer {
          background: white;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }
        .module-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .module-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }
        .module-type-badge {
          background: #dbeafe;
          color: #1e40af;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .perspective-tabs {
          display: flex;
          gap: 8px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 8px;
        }
        .perspective-tab {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          color: #64748b;
        }
        .perspective-tab.active {
          background: white;
          color: #1e40af;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .elements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .module-controls {
          display: flex;
          gap: 12px;
        }
        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .btn:hover {
          background: #f9fafb;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .btn-primary:hover {
          background: #2563eb;
        }
        .integration-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }
      </style>
      <div id="header">
        <div class="module-header">
          <module-breadcrumb></module-breadcrumb>
          <h2 class="module-title">${this.moduleName}</h2>
          <div class="module-type-badge">${this.moduleType}</div>
        </div>
        <div class="perspective-tabs">
          <button class="perspective-tab active" data-perspective="business">Business</button>
          <button class="perspective-tab" data-perspective="technical">Technical</button>
          <button class="perspective-tab" data-perspective="operations">Operations</button>
        </div>
        <div class="module-controls">
          <button class="btn">Configure</button>
          <button class="btn">Integrate</button>
          <button class="btn btn-primary">Add Element</button>
        </div>
      </div>
      <div id="content">
        <div class="elements-grid">
          ${this.renderElements()}
        </div>
      </div>
      <div id="footer">
        <div class="integration-status">
          <div class="status-dot"></div>
          <span>Connected to 3 integrations</span>
        </div>
        <module-performance-summary></module-performance-summary>
      </div>
    `;
    
    this.attachPerspectiveListeners();
    this.loadElements();
  }

  renderElements() {
    const perspectiveElements = this.getElementsForPerspective(this.perspective);
    
    return perspectiveElements.map(element => `
      <element-card
        element-id="${element.id}"
        name="${element.name}"
        type="${element.type}"
        status="${element.status}"
        instance-count="${element.instances?.length || 0}"
        perspective="${this.perspective}">
      </element-card>
    `).join('');
  }

  getElementsForPerspective(perspective) {
    // Filter elements based on current perspective
    return this.elements.filter(element => {
      switch(perspective) {
        case 'business':
          return element.category === 'business' || element.userFacing;
        case 'technical':
          return element.category === 'technical' || element.systemLevel;
        case 'operations':
          return element.category === 'operations' || element.operational;
        default:
          return true;
      }
    });
  }

  attachPerspectiveListeners() {
    const tabs = this.shadowRoot.querySelectorAll('.perspective-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.perspective = tab.dataset.perspective;
        this.refreshElementView();
      });
    });
  }

  refreshElementView() {
    const elementsGrid = this.shadowRoot.querySelector('.elements-grid');
    elementsGrid.innerHTML = this.renderElements();
  }

  loadElements() {
    // Example elements for Demo/Presentation module
    this.elements = [
      {
        id: 'demo-environments',
        name: 'Demo Environments',
        type: 'environment',
        status: 'active',
        category: 'business',
        userFacing: true,
        instances: [
          { name: 'Enterprise Demo v2.1', status: 'active' },
          { name: 'SME Demo v1.8', status: 'updating' },
          { name: 'Startup Demo v3.0', status: 'archived' }
        ]
      },
      {
        id: 'presentation-assets',
        name: 'Presentation Assets',
        type: 'content',
        status: 'active',
        category: 'business',
        userFacing: true,
        instances: [
          { name: 'Slide Deck - Enterprise', status: 'active' },
          { name: 'Video Library', status: 'active' },
          { name: 'Interactive Demos', status: 'active' }
        ]
      },
      {
        id: 'scheduling-tools',
        name: 'Scheduling Tools',
        type: 'integration',
        status: 'active',
        category: 'operations',
        operational: true,
        instances: [
          { name: 'Calendly Integration', status: 'active' },
          { name: 'Zoom Connector', status: 'active' }
        ]
      },
      {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        type: 'reporting',
        status: 'active',
        category: 'technical',
        systemLevel: true,
        instances: [
          { name: 'Conversion Metrics', status: 'active' },
          { name: 'Engagement Tracking', status: 'active' }
        ]
      }
    ];
    
    this.refreshElementView();
  }
}

customElements.define('module-view', ModuleView);
```

#### **Web Component: `<element-card>`**

```javascript
class ElementCard extends CompanyCityComponent {
  static get observedAttributes() {
    return ['element-id', 'name', 'type', 'status', 'instance-count', 'perspective'];
  }

  render() {
    const status = this.getAttribute('status');
    const type = this.getAttribute('type');
    const instanceCount = this.getAttribute('instance-count') || '0';
    const perspective = this.getAttribute('perspective');
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        :host(:hover) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-color: #3b82f6;
        }
        .element-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .element-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .element-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: ${this.getTypeColor(type)};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .element-details h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        .element-type {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${this.getStatusColor(status)};
        }
        .instances-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .instances-count {
          font-size: 14px;
          color: #374151;
        }
        .instances-badge {
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .element-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .metric {
          text-align: center;
          padding: 8px;
          background: #f8fafc;
          border-radius: 6px;
        }
        .metric-value {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        .metric-label {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .perspective-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${this.getPerspectiveColor(perspective)};
        }
        .element-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        .action-btn {
          flex: 1;
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover {
          background: #f9fafb;
        }
      </style>
      <div class="perspective-indicator"></div>
      <div class="element-header">
        <div class="element-info">
          <div class="element-icon">${this.getTypeIcon(type)}</div>
          <div class="element-details">
            <h4>${this.getAttribute('name')}</h4>
            <div class="element-type">${type}</div>
          </div>
        </div>
        <div class="status-indicator"></div>
      </div>
      <div class="instances-info">
        <span class="instances-count">${instanceCount} instances</span>
        <div class="instances-badge">Active</div>
      </div>
      <div class="element-metrics">
        <div class="metric">
          <div class="metric-value" id="usage">--</div>
          <div class="metric-label">Usage %</div>
        </div>
        <div class="metric">
          <div class="metric-value" id="performance">--</div>
          <div class="metric-label">Performance</div>
        </div>
      </div>
      <div class="element-actions">
        <button class="action-btn">View Instances</button>
        <button class="action-btn">Configure</button>
      </div>
    `;
    
    this.loadElementMetrics();
    this.attachClickListener();
  }

  getTypeIcon(type) {
    const icons = {
      'environment': '🖥️',
      'content': '📄',
      'integration': '🔗',
      'reporting': '📊',
      'workflow': '⚡',
      'data': '💾'
    };
    return icons[type] || '📦';
  }

  getTypeColor(type) {
    const colors = {
      'environment': '#dbeafe',
      'content': '#fef3c7',
      'integration': '#d1fae5',
      'reporting': '#e0e7ff',
      'workflow': '#fce7f3',
      'data': '#f3e8ff'
    };
    return colors[type] || '#f3f4f6';
  }

  getStatusColor(status) {
    const colors = {
      'active': '#10b981',
      'warning': '#f59e0b',
      'error': '#ef4444',
      'inactive': '#6b7280'
    };
    return colors[status] || '#6b7280';
  }

  getPerspectiveColor(perspective) {
    const colors = {
      'business': '#3b82f6',
      'technical': '#8b5cf6',
      'operations': '#10b981'
    };
    return colors[perspective] || '#6b7280';
  }

  loadElementMetrics() {
    setTimeout(() => {
      const usageEl = this.shadowRoot.getElementById('usage');
      const performanceEl = this.shadowRoot.getElementById('performance');
      
      if (usageEl) usageEl.textContent = `${Math.floor(Math.random() * 40 + 60)}`;
      if (performanceEl) performanceEl.textContent = `${(Math.random() * 1 + 4).toFixed(1)}`;
    }, Math.random() * 1000 + 300);
  }

  attachClickListener() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('element-navigate', {
        detail: {
          elementId: this.getAttribute('element-id'),
          elementType: this.getAttribute('type')
        },
        bubbles: true
      }));
    });
  }
}

customElements.define('element-card', ElementCard);
```

### **2.6 NIVEL 6: ELEMENT**

#### **Web Component: `<element-view>`**

```javascript
class ElementView extends CompanyCityComponent {
  static get observedAttributes() {
    return ['element-id', 'element-type'];
  }

  initialize() {
    this.elementId = null;
    this.elementType = 'configuration'; // configuration, inventory, monitoring
    this.instances = [];
    this.selectedInstance = null;
    this.viewMode = 'list'; // list, grid, timeline
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          grid-template-columns: 350px 1fr;
          height: 100vh;
          background: #ffffff;
        }
        #sidebar {
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }
        #main {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .sidebar-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }
        .element-info {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }
        .sidebar-content {
          flex: 1;
          padding: 16px 24px;
          overflow-y: auto;
        }
        .sidebar-footer {
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
        }
        .instance-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .instance-item {
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
          border: 1px solid #e5e7eb;
          background: white;
        }
        .instance-item:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }
        .instance-item.selected {
          background: #dbeafe;
          border-color: #3b82f6;
        }
        .instance-name {
          font-weight: 500;
          color: #111827;
          font-size: 14px;
        }
        .instance-status {
          font-size: 12px;
          margin-top: 4px;
        }
        .instance-meta {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
        }
        .main-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .main-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background: #f9fafb;
        }
        .view-mode-selector {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 6px;
        }
        .view-mode-btn {
          padding: 6px 12px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .view-mode-btn.active {
          background: white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .instance-detail {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        .detail-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .detail-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }
        .detail-actions {
          display: flex;
          gap: 8px;
        }
        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        .btn:hover {
          background: #f9fafb;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .btn-primary:hover {
          background: #2563eb;
        }
        .btn-danger {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }
        .btn-danger:hover {
          background: #dc2626;
        }
        .detail-content {
          padding: 0;
        }
        .detail-section {
          padding: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        .detail-section:last-child {
          border-bottom: none;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }
        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        .config-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .config-item label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        .config-item input, .config-item select, .config-item textarea {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        .config-item input:focus, .config-item select:focus, .config-item textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .metric-card {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }
        .metric-value {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }
        .metric-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .history-timeline {
          position: relative;
        }
        .history-item {
          position: relative;
          padding-left: 32px;
          margin-bottom: 16px;
        }
        .history-item::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6;
        }
        .history-item::after {
          content: '';
          position: absolute;
          left: 11px;
          top: 14px;
          width: 2px;
          height: calc(100% + 8px);
          background: #e5e7eb;
        }
        .history-item:last-child::after {
          display: none;
        }
        .history-timestamp {
          font-size: 12px;
          color: #6b7280;
        }
        .history-action {
          font-weight: 500;
          color: #111827;
          margin-top: 2px;
        }
        .history-details {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
        }
        .no-selection {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }
        .no-selection-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
      </style>
      <div id="sidebar">
        <div class="sidebar-header">
          <h3>Instances</h3>
          <div class="element-info">${this.elementType} • ${this.instances.length} items</div>
        </div>
        <div class="sidebar-content">
          <ul class="instance-list">
            ${this.renderInstanceList()}
          </ul>
        </div>
        <div class="sidebar-footer">
          <button class="btn btn-primary" style="width: 100%;">Add Instance</button>
        </div>
      </div>
      <div id="main">
        <div class="main-header">
          <element-breadcrumb></element-breadcrumb>
          <div class="view-mode-selector">
            <button class="view-mode-btn active" data-view="list">List</button>
            <button class="view-mode-btn" data-view="grid">Grid</button>
            <button class="view-mode-btn" data-view="timeline">Timeline</button>
          </div>
        </div>
        <div class="main-content">
          ${this.renderInstanceDetail()}
        </div>
      </div>
    `;
    
    this.attachInstanceListeners();
    this.loadInstances();
  }

  renderInstanceList() {
    if (this.instances.length === 0) {
      return '<li style="padding: 20px; text-align: center; color: #6b7280;">No instances found</li>';
    }
    
    return this.instances.map(instance => `
      <li class="instance-item ${instance.id === this.selectedInstance?.id ? 'selected' : ''}"
          data-instance-id="${instance.id}">
        <div class="instance-name">${instance.name}</div>
        <div class="instance-status" style="color: ${this.getStatusColor(instance.status)}">
          ${this.getStatusIcon(instance.status)} ${instance.status}
        </div>
        <div class="instance-meta">
          Updated ${this.formatTimestamp(instance.lastUpdated)}
        </div>
      </li>
    `).join('');
  }

  renderInstanceDetail() {
    if (!this.selectedInstance) {
      return `
        <div class="no-selection">
          <div class="no-selection-icon">📦</div>
          <h3>Select an instance to view details</h3>
          <p>Choose an instance from the list to see its configuration, metrics, and history.</p>
        </div>
      `;
    }

    return `
      <div class="instance-detail">
        <div class="detail-header">
          <div>
            <h2 class="detail-title">${this.selectedInstance.name}</h2>
            <div style="color: ${this.getStatusColor(this.selectedInstance.status)}; margin-top: 4px;">
              ${this.getStatusIcon(this.selectedInstance.status)} ${this.selectedInstance.status}
            </div>
          </div>
          <div class="detail-actions">
            <button class="btn">Edit</button>
            <button class="btn">Clone</button>
            <button class="btn">Export</button>
            <button class="btn btn-danger">Delete</button>
          </div>
        </div>
        <div class="detail-content">
          ${this.renderInstanceConfiguration()}
          ${this.renderInstanceMetrics()}
          ${this.renderInstanceHistory()}
        </div>
      </div>
    `;
  }

  renderInstanceConfiguration() {
    const config = this.selectedInstance.configuration || {};
    
    return `
      <div class="detail-section">
        <h3 class="section-title">Configuration</h3>
        <div class="config-grid">
          ${Object.entries(config).map(([key, value]) => `
            <div class="config-item">
              <label>${this.formatConfigKey(key)}</label>
              ${this.renderConfigInput(key, value)}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderConfigInput(key, value) {
    if (typeof value === 'boolean') {
      return `<select data-config-key="${key}">
        <option value="true" ${value ? 'selected' : ''}>Enabled</option>
        <option value="false" ${!value ? 'selected' : ''}>Disabled</option>
      </select>`;
    } else if (typeof value === 'string' && value.length > 50) {
      return `<textarea data-config-key="${key}" rows="3">${value}</textarea>`;
    } else {
      return `<input type="text" value="${value}" data-config-key="${key}">`;
    }
  }

  renderInstanceMetrics() {
    const metrics = this.selectedInstance.metrics || this.generateSampleMetrics();
    
    return `
      <div class="detail-section">
        <h3 class="section-title">Performance Metrics</h3>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${metrics.usage}%</div>
            <div class="metric-label">Usage</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${metrics.uptime}</div>
            <div class="metric-label">Uptime</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${metrics.performance}</div>
            <div class="metric-label">Performance</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${metrics.errors}</div>
            <div class="metric-label">Errors</div>
          </div>
        </div>
      </div>
    `;
  }

  renderInstanceHistory() {
    const history = this.selectedInstance.history || this.generateSampleHistory();
    
    return `
      <div class="detail-section">
        <h3 class="section-title">Change History</h3>
        <div class="history-timeline">
          ${history.map(entry => `
            <div class="history-item">
              <div class="history-timestamp">${this.formatTimestamp(entry.timestamp)}</div>
              <div class="history-action">${entry.action}</div>
              <div class="history-details">${entry.details}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachInstanceListeners() {
    this.addEventListener('click', (e) => {
      const instanceItem = e.target.closest('.instance-item');
      if (instanceItem) {
        const instanceId = instanceItem.dataset.instanceId;
        this.selectInstance(instanceId);
      }
    });
  }

  selectInstance(instanceId) {
    this.selectedInstance = this.instances.find(i => i.id === instanceId);
    this.refreshView();
  }

  refreshView() {
    const sidebarContent = this.shadowRoot.querySelector('.sidebar-content');
    sidebarContent.innerHTML = `<ul class="instance-list">${this.renderInstanceList()}</ul>`;
    
    const mainContent = this.shadowRoot.querySelector('.main-content');
    mainContent.innerHTML = this.renderInstanceDetail();
  }

  loadInstances() {
    // Example instances for Demo Environments element
    this.instances = [
      {
        id: 'enterprise-demo-v21',
        name: 'Enterprise Demo v2.1',
        status: 'active',
        lastUpdated: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        configuration: {
          'environment': 'production',
          'features': 'full-suite',
          'dataSet': 'enterprise-sample',
          'branding': 'company-logo',
          'customization': 'high',
          'performance': 'optimized'
        },
        metrics: {
          usage: 89,
          uptime: '99.8%',
          performance: '4.8/5',
          errors: 3
        },
        history: [
          {
            timestamp: Date.now() - 2 * 60 * 60 * 1000,
            action: 'Configuration updated',
            details: 'Performance optimization enabled'
          },
          {
            timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
            action: 'Version updated',
            details: 'Updated from v2.0 to v2.1'
          }
        ]
      },
      {
        id: 'sme-demo-v18',
        name: 'SME Demo v1.8',
        status: 'updating',
        lastUpdated: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        configuration: {
          'environment': 'staging',
          'features': 'mid-tier',
          'dataSet': 'sme-sample',
          'branding': 'neutral',
          'customization': 'medium'
        }
      },
      {
        id: 'startup-demo-v30',
        name: 'Startup Demo v3.0',
        status: 'archived',
        lastUpdated: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
        configuration: {
          'environment': 'development',
          'features': 'basic',
          'dataSet': 'startup-sample',
          'branding': 'minimal',
          'customization': 'low'
        }
      }
    ];
    
    // Auto-select first instance
    if (this.instances.length > 0) {
      this.selectedInstance = this.instances[0];
    }
    
    this.refreshView();
  }

  getStatusColor(status) {
    const colors = {
      'active': '#10b981',
      'updating': '#f59e0b', 
      'archived': '#6b7280',
      'error': '#ef4444',
      'maintenance': '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  }

  getStatusIcon(status) {
    const icons = {
      'active': '✅',
      'updating': '🔄',
      'archived': '📁',
      'error': '❌',
      'maintenance': '🔧'
    };
    return icons[status] || '⚪';
  }

  formatTimestamp(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60 * 1000) return 'just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }

  formatConfigKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  generateSampleMetrics() {
    return {
      usage: Math.floor(Math.random() * 40 + 60),
      uptime: `${(99 + Math.random()).toFixed(1)}%`,
      performance: `${(4 + Math.random()).toFixed(1)}/5`,
      errors: Math.floor(Math.random() * 10)
    };
  }

  generateSampleHistory() {
    return [
      {
        timestamp: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        action: 'Instance created',
        details: 'New instance created from template'
      },
      {
        timestamp: Date.now() - Math.random() * 48 * 60 * 60 * 1000,
        action: 'Configuration updated',
        details: 'Modified feature set and branding'
      }
    ];
  }
}

customElements.define('element-view', ElementView);
```

---

## 🗺️ **3. MAPA COMPLETO DE NAVEGACIÓN**

### **3.1 Estructura Jerárquica Completa**

```
📍 LEVEL 1: ECOSYSTEM
🌐 Caminos iniciales: 4+ empresas
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  CocaColaCity ──┬── PepsiCity ──┬── MercadonaCity ──┬── Others  │
│       │         │       │       │         │        │           │
│       ▼         ▼       ▼       ▼         ▼        ▼           │
│   [6 Districts] │   [6 Districts] │   [6 Districts] │           │
│                 │                 │                 │           │
│  = 4 × 6 = 24 caminos base hacia Company level                 │
└─────────────────────────────────────────────────────────────────┘
                                   ↓
📍 LEVEL 2: COMPANY → 6 DISTRITOS UNIVERSALES
🏢 Caminos por empresa: 6 distritos × múltiples sub-distritos
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🎯 MARKET ────────── ⚙️ DELIVERY ────────── 💰 FINANCE        │
│    │                   │                     │                 │
│    ├─Digital Market    ├─Product Delivery    ├─Revenue Mgmt    │
│    ├─Traditional       ├─Service Delivery    ├─Cost Control    │
│    └─Brand/Corporate   └─Quality Assurance   └─Investment      │
│         │                      │                    │          │
│         ▼                      ▼                    ▼          │
│    [6 Buildings]         [6 Buildings]        [6 Buildings]    │
│                                                                 │
│  👥 PEOPLE ──────────── 💻 TECHNOLOGY ──────── ⚖️ GOVERNANCE   │
│    │                     │                     │               │
│    ├─Talent Acquisition  ├─Infrastructure      ├─Legal        │
│    ├─Learning & Dev      ├─Security            ├─Compliance   │
│    └─Culture & Engage    └─Data & Analytics    └─Risk Mgmt    │
│         │                      │                    │          │
│         ▼                      ▼                    ▼          │
│    [6 Buildings]         [6 Buildings]        [6 Buildings]    │
│                                                                 │
│  = 6 distritos × ~6 edificios = 36 caminos hacia Building     │
└─────────────────────────────────────────────────────────────────┘
                                   ↓
📍 LEVEL 3: DISTRICT → TODOS LOS EDIFICIOS
🏙️ Ejemplo completo: MARKET District (🔄 CYCLIC)
┌─────────────────────────────────────────────────────────────────┐
│                     🔄 MARKET CYCLE COMPLETO                    │
│                                                                 │
│     AWARENESS ──────────► INTEREST ──────────► CONSIDERATION   │
│        │                     │                      │          │
│        ├─Brand Building      ├─Lead Generation      ├─Sales    │
│        ├─Content Marketing   ├─Demand Creation      ├─Demos    │
│        ├─Advertising         ├─Event Marketing      ├─Proposals│
│        └─PR/Communications   └─Inbound Marketing    └─Qualify  │
│        ▲                     ▲                      ▼          │
│        │                     │                      │          │
│     ADVOCACY ◄───────── RETENTION ◄────────── PURCHASE        │
│        │                     │                      │          │
│        ├─Referrals           ├─Customer Success     ├─Closing  │
│        ├─Case Studies        ├─Support              ├─Contracts│
│        ├─User Community      ├─Account Management   ├─Onboard  │
│        └─Upselling           └─Renewal Management   └─Payment  │
│                                                                 │
│  Otros Districts tendrán sus propios edificios:                │
│  DELIVERY: Design│Build│Test│Deploy│Monitor│Iterate            │
│  FINANCE: Planning│Collection│Management│Reporting│Analysis│Control │
│  PEOPLE: Attract│Select│Develop│Engage│Perform│Transition      │
│  TECHNOLOGY: Infrastructure│Security│Development│Support│Data│Integration │
│  GOVERNANCE: Policy│Review│Approval│Documentation│Monitoring│Remediation │
│                                                                 │
│  = 6 distritos × 6 edificios = 36 caminos hacia Module level  │
└─────────────────────────────────────────────────────────────────┘
                                   ↓
📍 LEVEL 4: BUILDING → TODOS LOS MÓDULOS
🏢 Ejemplo: CONSIDERATION Building → 4 módulos
┌─────────────────────────────────────────────────────────────────┐
│                    ⚡ PIPELINE: CONSIDERATION                    │
│                                                                 │
│  Lead Qualification ─► Demo/Presentation ─► Proposal ─► Negotiation │
│         │                      │               │           │    │
│         ├─Scoring Engine       ├─Demo Environments        ├─Pricing│
│         ├─BANT Assessment      ├─Presentation Assets       ├─Contracts│  
│         ├─Behavior Analysis    ├─Scheduling Tools         ├─Templates│
│         └─CRM Integration      └─Analytics Dashboard       └─Approval│
│         ▼                      ▼               ▼           ▼    │
│    [4 Elements each]      [4 Elements each] [4 Elements each] [4 Elements] │
│                                                                 │
│  Cada Building en cada District tendrá ~4 módulos:             │
│  36 buildings × 4 modules = 144 caminos hacia Element level    │
└─────────────────────────────────────────────────────────────────┘
                                   ↓
📍 LEVEL 5: MODULE → TODOS LOS ELEMENTOS  
📦 Ejemplo: Demo/Presentation Module → 4 elementos
┌─────────────────────────────────────────────────────────────────┐
│              🔧 CONTROL-PANEL: DEMO/PRESENTATION                │
│                                                                 │
│  Demo Environments ─┬─ Presentation Assets ─┬─ Scheduling Tools │
│         │           │         │             │         │        │
│    ├─Enterprise Demo│    ├─Slide Decks     │    ├─Calendly     │
│    ├─SME Demo       │    ├─Video Library   │    ├─Zoom Integration│
│    ├─Startup Demo   │    ├─Interactive     │    ├─Booking Rules │
│    └─Custom Demos   │    └─Case Studies    │    └─Notifications │
│         │           │         │             │         │        │
│         ▼           │         ▼             │         ▼        │
│    [Individual      │    [Individual       │    [Individual   │
│     instances]      │     instances]       │     instances]   │
│                     │                      │                  │
│                Performance Analytics ──────┴─ Reporting Dashboard │
│                     │                                         │
│                ├─Conversion Metrics                          │
│                ├─Engagement Scores                           │
│                ├─Time Analytics                              │
│                └─ROI Tracking                                │
│                     │                                         │
│                     ▼                                         │
│                [Individual instances]                         │
│                                                               │
│  144 modules × 4 elements = 576 caminos hacia instancias     │
└─────────────────────────────────────────────────────────────────┘
                                   ↓
📍 LEVEL 6: ELEMENT → INSTANCIAS ESPECÍFICAS
🔧 Ejemplo: Demo Environments → Instancias individuales
┌─────────────────────────────────────────────────────────────────┐
│                📋 INVENTORY: DEMO ENVIRONMENTS                  │
│                                                                 │
│  Enterprise-Demo-v2.1    SME-Demo-v1.8      Startup-Demo-v3.0  │
│  │                       │                  │                  │
│  ├─Config: Full-featured ├─Config: Mid-tier ├─Config: Basic   │
│  ├─Status: Active        ├─Status: Updating ├─Status: Archive │
│  ├─Usage: 89% (142 uses) ├─Usage: 34% (67)  ├─Usage: 12% (8)  │
│  ├─Last Updated: 2h ago  ├─Updated: 1d ago  ├─Updated: 1w ago │
│  └─Performance: 4.8/5.0  └─Performance: 4.2 └─Performance: 3.9│
│                                                                 │
│  Custom-Demo-A          Custom-Demo-B        Prospect-X-Demo   │
│  │                     │                     │                 │
│  ├─Config: Tailored    ├─Config: Industry   ├─Config: Personal│
│  ├─Status: Ready       ├─Status: Draft      ├─Status: Scheduled│
│  ├─Usage: 5% (3 uses)  ├─Usage: 0% (new)    ├─Usage: Pending  │
│  ├─Created: 3d ago     ├─Created: Today     ├─Created: 1h ago │
│  └─Performance: N/A    └─Performance: N/A   └─Performance: N/A │
│                                                                 │
│  Cada elemento puede tener múltiples instancias (3-10 typical) │
│  576 elements × ~5 instances = ~2,880 endpoints finales        │
└─────────────────────────────────────────────────────────────────┘
```

### **3.2 Conteo Total de Caminos**

```
📊 RAMIFICACIÓN EXPONENCIAL COMPLETA

📊 CONTEO TOTAL DE CAMINOS:
┌─────────────────────────────────────────────────────────────────┐
│  Level 1 → Level 2:    4 empresas × 6 distritos = 24 caminos   │
│  Level 2 → Level 3:    24 × 6 edificios = 144 caminos          │
│  Level 3 → Level 4:    144 × 4 módulos = 576 caminos           │
│  Level 4 → Level 5:    576 × 4 elementos = 2,304 caminos       │
│  Level 5 → Level 6:    2,304 × 5 instancias = 11,520 endpoints │
│                                                                 │
│  🎯 TOTAL: ~11,520 caminos únicos de navegación posibles       │
└─────────────────────────────────────────────────────────────────┘
```

### **3.3 Mapa de Exploración por Dominio**

```
🗺️ MAPA DE EXPLORACIÓN POR DOMINIO:

CAMINOS DE VENTAS (Market District):
Ecosystem → CocaCola → Market → Consideration → Demo → Enterprise-Demo-v2.1
Ecosystem → CocaCola → Market → Consideration → Proposal → Contract-Template-Legal
Ecosystem → CocaCola → Market → Purchase → Closing → Deal-Pipeline-Salesforce
Ecosystem → CocaCola → Market → Retention → Support → Ticket-System-Zendesk
... [~1,920 caminos en dominio Market]

CAMINOS DE TECNOLOGÍA (Technology District):  
Ecosystem → CocaCola → Technology → Security → Identity → User-Directory-LDAP
Ecosystem → CocaCola → Technology → Infrastructure → Cloud → AWS-EC2-Production
Ecosystem → CocaCola → Technology → Development → Frontend → React-Component-Library
Ecosystem → CocaCola → Technology → Data → Analytics → Google-Analytics-Dashboard
... [~1,920 caminos en dominio Technology]

CAMINOS DE FINANZAS (Finance District):
Ecosystem → CocaCola → Finance → Collection → Payment → Stripe-Gateway-Main
Ecosystem → CocaCola → Finance → Planning → Budget → Annual-Budget-2024-Marketing
Ecosystem → CocaCola → Finance → Analysis → Reports → P&L-Dashboard-Q4
Ecosystem → CocaCola → Finance → Control → Audit → Compliance-Check-SOX
... [~1,920 caminos en dominio Finance]
```

### **3.4 Navegación Inteligente**

```
🎯 NAVEGACIÓN INTELIGENTE:

BÚSQUEDA GLOBAL: "stripe" → Encuentra todas las instancias:
├─ Finance → Collection → Payment → Stripe-Gateway-Main
├─ Finance → Collection → Payment → Stripe-Gateway-Backup  
├─ Technology → Integration → APIs → Stripe-API-Connector
└─ Governance → Documentation → Contracts → Stripe-Service-Agreement

ENTITY TRACKING: Lead #12345 → Camino real tomado:
Ecosystem(Benchmark) → CocaCola → Market → Awareness → Content → Blog-Post-A →
Interest → Lead-Gen → Google-Ads → Consideration → Demo → Enterprise-Demo →
Purchase → Closing → Salesforce-Deal → Retention → Success → Account-Manager-John

COMPARATIVE: CocaCola vs Pepsi → Mismos caminos, diferentes métricas:
CocaCola → Market → Consideration → Demo → Conversion: 23%
Pepsi → Market → Consideration → Demo → Conversion: 19%

🚀 RESULTADO: Un universo completo de ~11,520 caminos navegables
   donde cada uno mantiene contexto espacial y semántico, 
   permitiendo exploración libre o guiada según necesidad del usuario.
```

---

## 🗄️ **4. SISTEMA DE DATOS Y APIs**

### **4.1 Data Models Completos**

#### **Base Entity Interface**

```typescript
interface BaseEntity {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance' | 'warning';
  metadata: EntityMetadata;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface EntityMetadata {
  created: Date;
  updated: Date;
  owner: string;
  tags: string[];
  description?: string;
  version?: string;
  environment?: string;
}

interface PerformanceMetrics {
  throughput: number;
  latency: number;
  errorRate: number;
  availability: number;
  lastUpdated: Date;
}

interface BusinessMetrics {
  revenue?: number;
  conversionRate?: number;
  customerSatisfaction?: number;
  roi?: number;
  lastUpdated: Date;
}

interface OperationalMetrics {
  capacity: number;
  utilization: number;
  efficiency: number;
  sla: number;
  lastUpdated: Date;
}

interface Metrics {
  performance: PerformanceMetrics;
  business: BusinessMetrics;
  operational: OperationalMetrics;
}

interface VisualState {
  position: { x: number; y: number; z?: number };
  color: string;
  animation: 'idle' | 'pulse' | 'alert' | 'processing';
  opacity: number;
  size: number;
}
```

#### **Navigation Models**

```typescript
interface NavigationPath {
  ecosystem?: string;
  company?: string;
  district?: string;
  building?: string;
  module?: string;
  element?: string;
}

interface NavigationEventDetail {
  action: 'zoom-in' | 'zoom-out' | 'navigate-to' | 'entity-follow';
  targetLevel: LevelType;
  targetId: string;
  targetData?: any;
  path?: NavigationPath;
}

interface BreadcrumbItem {
  level: LevelType;
  name: string;
  id: string;
  path: NavigationPath;
}
```

#### **Level-Specific Models**

```typescript
// Ecosystem Level
interface EcosystemData {
  companies: CompanyEntity[];
  relationships: CompanyRelationship[];
  marketData: MarketMetrics;
  competitiveAnalysis: CompetitiveData;
  timeframe: TimeRange;
}

interface CompanyEntity extends BaseEntity {
  industry: string;
  region: string;
  size: 'startup' | 'sme' | 'enterprise';
  metrics: CompanyMetrics;
  districts: DistrictSummary[];
  visualState: CompanyVisualState;
  relationships: CompanyRelationship[];
}

interface CompanyMetrics {
  revenue: MonetaryValue;
  employees: number;
  marketShare: number;
  growthRate: number;
  healthScore: number; // 0-100
  performanceIndex: number;
  strategicMetrics: StrategicMetrics;
}

// District Level
interface DistrictEntity extends BaseEntity {
  companyId: string;
  districtType: DistrictType;
  pattern: PatternType;
  buildings: BuildingEntity[];
  entities: FlowEntity[];
  performance: PerformanceMetrics;
  capacity: CapacityMetrics;
  visualState: DistrictVisualState;
}

interface DistrictVisualState extends VisualState {
  flowDirection: 'clockwise' | 'counterclockwise' | 'bidirectional';
  connectionStyle: 'straight' | 'curved' | 'animated';
  entityCount: number;
  patternLayout: PatternLayout;
}

interface FlowEntity {
  id: string;
  type: 'lead' | 'customer' | 'task' | 'data' | 'request';
  currentBuildingId: string;
  targetBuildingId?: string;
  path: PathPoint[];
  currentPathIndex: number;
  progress: number; // 0-1
  speed: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  properties: Record<string, any>;
  visualState: EntityVisualState;
}

interface PathPoint {
  buildingId: string;
  position: { x: number; y: number };
  timestamp: Date;
  duration: number; // ms
}

// Building Level
interface BuildingEntity extends BaseEntity {
  districtId: string;
  buildingType: string;
  pattern: PatternType;
  modules: ModuleEntity[];
  performance: PerformanceMetrics;
  capacity: CapacityMetrics;
  sla: SLAConfiguration;
  workflow: WorkflowConfig;
}

interface ModuleEntity extends BaseEntity {
  buildingId: string;
  moduleType: 'saas' | 'custom' | 'legacy' | 'manual';
  vendor?: string;
  version?: string;
  elements: ElementEntity[];
  integrations: Integration[];
  configuration: ModuleConfiguration;
  performance: PerformanceMetrics;
}

// Element Level
interface ElementEntity extends BaseEntity {
  moduleId: string;
  elementType: 'configuration' | 'data' | 'interface' | 'process';
  category: 'business' | 'technical' | 'operations';
  instances: InstanceEntity[];
  schema: ElementSchema;
  validation: ValidationRules;
  userFacing?: boolean;
  systemLevel?: boolean;
  operational?: boolean;
}

interface InstanceEntity extends BaseEntity {
  elementId: string;
  configuration: Record<string, any>;
  state: InstanceState;
  history: HistoryEntry[];
  metrics: InstanceMetrics;
}

interface InstanceState {
  current: Record<string, any>;
  desired: Record<string, any>;
  status: 'synced' | 'pending' | 'error' | 'unknown';
  lastChanged: Date;
  changeReason: string;
}

// Integration Models
interface Integration {
  id: string;
  type: 'api' | 'webhook' | 'database' | 'file' | 'manual';
  source: string;
  target: string;
  endpoint?: string;
  authentication: AuthConfig;
  dataMapping: DataMapping[];
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  configuration: IntegrationConfig;
}

interface AuthConfig {
  type: 'none' | 'basic' | 'oauth' | 'apikey' | 'certificate';
  credentials?: CredentialConfig;
  endpoints?: AuthEndpoints;
}

interface DataMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  validation?: ValidationRule;
}

// Configuration Models
interface ModuleConfiguration {
  apiEndpoints?: string[];
  credentials?: CredentialConfig;
  settings: Record<string, any>;
  integrations: IntegrationConfig[];
  features: FeatureConfig[];
}

interface WorkflowConfig {
  pattern: PatternType;
  stages: WorkflowStage[];
  rules: WorkflowRule[];
  automation: AutomationConfig[];
}

interface WorkflowStage {
  id: string;
  name: string;
  type: string;
  inputs: StageInput[];
  outputs: StageOutput[];
  conditions: StageCondition[];
}

// Time and Analytics Models
interface TimeRange {
  start: Date;
  end: Date;
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year';
}

interface HistoryEntry {
  timestamp: Date;
  action: string;
  details: string;
  userId: string;
  changes: Record<string, { old: any; new: any }>;
}

interface InstanceMetrics {
  usage: number;
  uptime: string;
  performance: string;
  errors: number;
  lastUpdated: Date;
}

// Search and Filter Models
interface SearchResult {
  id: string;
  name: string;
  type: string;
  level: LevelType;
  path: string;
  navigationPath: NavigationPath;
  relevanceScore: number;
  matchType: 'exact' | 'partial' | 'fuzzy';
  context: SearchContext;
}

interface SearchContext {
  entity: BaseEntity;
  parentPath: BreadcrumbItem[];
  relatedEntities: string[];
  matchedFields: string[];
}

interface FilterConfig {
  status: EntityStatus[];
  types: EntityType[];
  owners: string[];
  tags: string[];
  performanceThresholds: Record<string, number>;
  dateRange?: TimeRange;
}

// Entity Tracking Models
interface TrackedEntity {
  id: string;
  name: string;
  type: 'lead' | 'customer' | 'product' | 'request' | 'task';
  currentLocation: string;
  currentPath: NavigationPath;
  journey: JourneyStep[];
  properties: Record<string, any>;
  startTime: Date;
  expectedEndTime?: Date;
}

interface JourneyStep {
  timestamp: Date;
  location: string;
  locationPath: NavigationPath;
  action: string;
  status: 'completed' | 'current' | 'failed' | 'skipped';
  duration?: number;
  metrics?: Record<string, any>;
  notes?: string;
}
```

### **4.2 REST API Endpoints**

```typescript
// Base API Configuration
const API_BASE = '/api/v1';
const WS_BASE = '/ws/v1';

// Ecosystem APIs
GET    /api/v1/ecosystem
GET    /api/v1/ecosystem/companies
GET    /api/v1/ecosystem/companies/{id}
GET    /api/v1/ecosystem/relationships
POST   /api/v1/ecosystem/compare
GET    /api/v1/ecosystem/market-data
GET    /api/v1/ecosystem/competitive-analysis

// Company APIs
GET    /api/v1/companies/{id}
GET    /api/v1/companies/{id}/districts
GET    /api/v1/companies/{id}/performance
GET    /api/v1/companies/{id}/metrics/timeline
POST   /api/v1/companies/{id}/actions
PUT    /api/v1/companies/{id}/configuration

// District APIs
GET    /api/v1/districts/{id}
GET    /api/v1/districts/{id}/buildings
GET    /api/v1/districts/{id}/entities
GET    /api/v1/districts/{id}/flow
GET    /api/v1/districts/{id}/performance
POST   /api/v1/districts/{id}/simulate
POST   /api/v1/districts/{id}/optimize

// Building APIs
GET    /api/v1/buildings/{id}
GET    /api/v1/buildings/{id}/modules
GET    /api/v1/buildings/{id}/performance
GET    /api/v1/buildings/{id}/workflow
POST   /api/v1/buildings/{id}/control
PUT    /api/v1/buildings/{id}/workflow

// Module APIs
GET    /api/v1/modules/{id}
GET    /api/v1/modules/{id}/elements
GET    /api/v1/modules/{id}/config
GET    /api/v1/modules/{id}/integrations
PUT    /api/v1/modules/{id}/config
POST   /api/v1/modules/{id}/actions
POST   /api/v1/modules/{id}/integrations
DELETE /api/v1/modules/{id}/integrations/{integrationId}

// Element APIs
GET    /api/v1/elements/{id}
GET    /api/v1/elements/{id}/instances
GET    /api/v1/elements/{id}/schema
POST   /api/v1/elements/{id}/instances
PUT    /api/v1/elements/{id}/instances/{instanceId}
DELETE /api/v1/elements/{id}/instances/{instanceId}
GET    /api/v1/elements/{id}/instances/{instanceId}/history
POST   /api/v1/elements/{id}/instances/{instanceId}/actions

// Search & Filter APIs
GET    /api/v1/search?q={query}&level={level}&filters={filters}
POST   /api/v1/search/advanced
GET    /api/v1/entities/{id}/journey
GET    /api/v1/entities/{id}/relationships
GET    /api/v1/compare?entities={ids}&metrics={metrics}

// Real-time Tracking APIs
GET    /api/v1/tracking/entities
POST   /api/v1/tracking/entities/{id}/start
DELETE /api/v1/tracking/entities/{id}/stop
GET    /api/v1/tracking/entities/{id}/current-location
GET    /api/v1/tracking/entities/{id}/journey

// Time & Analytics APIs
GET    /api/v1/analytics/timeline?start={date}&end={date}
GET    /api/v1/analytics/predictions?entity={id}&horizon={duration}
GET    /api/v1/analytics/anomalies?level={level}&threshold={value}
GET    /api/v1/analytics/performance?path={navigationPath}
GET    /api/v1/analytics/bottlenecks?district={id}

// Configuration & Management APIs
GET    /api/v1/config/patterns
GET    /api/v1/config/templates
POST   /api/v1/config/templates
GET    /api/v1/config/integrations/available
POST   /api/v1/config/integrations/test
GET    /api/v1/users/permissions
GET    /api/v1/users/preferences
PUT    /api/v1/users/preferences

// Health & Monitoring APIs
GET    /api/v1/health
GET    /api/v1/metrics/system
GET    /api/v1/alerts/active
POST   /api/v1/alerts/acknowledge/{id}
GET    /api/v1/logs?level={level}&component={component}
```

### **4.3 WebSocket Events**

```typescript
// Real-time Data Events
interface WebSocketEvent {
  type: string;
  timestamp: Date;
  entityId: string;
  level: 'ecosystem' | 'company' | 'district' | 'building' | 'module' | 'element';
  data: any;
  source: string;
}

// Entity Movement Events
interface EntityMoveEvent extends WebSocketEvent {
  type: 'entity:move';
  data: {
    entityId: string;
    fromPosition: { x: number; y: number };
    toPosition: { x: number; y: number };
    path: PathPoint[];
    estimatedDuration: number;
    priority: string;
  };
}

// Performance Events
interface PerformanceEvent extends WebSocketEvent {
  type: 'performance:update';
  data: {
    metrics: PerformanceMetrics;
    trend: 'improving' | 'degrading' | 'stable';
    alerts: Alert[];
    thresholds: Record<string, number>;
  };
}

// Configuration Events
interface ConfigurationEvent extends WebSocketEvent {
  type: 'config:change';
  data: {
    field: string;
    oldValue: any;
    newValue: any;
    changedBy: string;
    reason: string;
    validationResult: ValidationResult;
  };
}

// Alert Events
interface AlertEvent extends WebSocketEvent {
  type: 'alert:triggered' | 'alert:resolved';
  data: {
    alertId: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    affectedEntities: string[];
    actionRequired: boolean;
    autoResolved: boolean;
  };
}

// Flow Events
interface FlowEvent extends WebSocketEvent {
  type: 'flow:entity-enter' | 'flow:entity-exit' | 'flow:bottleneck' | 'flow:optimization';
  data: {
    entityId: string;
    buildingId: string;
    metrics: FlowMetrics;
    impact: FlowImpact;
  };
}

// WebSocket Client Implementation
class CompanyCityWebSocket {
  private ws: WebSocket;
  private subscriptions: Map<string, Set<Function>> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  connect(url: string = `${WS_BASE}/events`) {
    this.ws = new WebSocket(url);
    
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  private onOpen() {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
    
    // Send authentication if required
    this.authenticate();
  }

  private onMessage(event: MessageEvent) {
    try {
      const data: WebSocketEvent = JSON.parse(event.data);
      this.handleEvent(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private onClose() {
    console.log('WebSocket disconnected');
    this.attemptReconnect();
  }

  private onError(error: Event) {
    console.error('WebSocket error:', error);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect();
      }, delay);
    }
  }

  subscribe(eventType: string, callback: Function) {
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, new Set());
    }
    this.subscriptions.get(eventType)!.add(callback);
    
    // Send subscription message to server
    this.send({
      type: 'subscribe',
      eventType,
      timestamp: new Date()
    });
  }

  unsubscribe(eventType: string, callback: Function) {
    const callbacks = this.subscriptions.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
      
      if (callbacks.size === 0) {
        this.subscriptions.delete(eventType);
        
        // Send unsubscription message to server
        this.send({
          type: 'unsubscribe',
          eventType,
          timestamp: new Date()
        });
      }
    }
  }

  private handleEvent(event: WebSocketEvent) {
    const callbacks = this.subscriptions.get(event.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in WebSocket callback:', error);
        }
      });
    }
    
    // Also trigger wildcard subscriptions
    const wildcardCallbacks = this.subscriptions.get('*');
    if (wildcardCallbacks) {
      wildcardCallbacks.forEach(callback => callback(event));
    }
  }

  private send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private authenticate() {
    // Implementation would depend on authentication strategy
    const token = localStorage.getItem('auth-token'); // Note: this is example only
    if (token) {
      this.send({
        type: 'authenticate',
        token,
        timestamp: new Date()
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
```

---

## 🎨 **5. SISTEMA DE RENDERING**

### **5.1 Canvas Rendering Engine**

```javascript
class CompanyCityRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1, rotation: 0 };
    this.renderQueue = [];
    this.animationId = null;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.targetFPS = 60;
    
    // Performance tracking
    this.performanceMonitor = new PerformanceMonitor();
    
    // Render layers
    this.layers = {
      background: [],
      entities: [],
      connections: [],
      ui: [],
      effects: []
    };
  }

  start() {
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  animate(currentTime = 0) {
    this.deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Throttle to target FPS
    const targetFrameTime = 1000 / this.targetFPS;
    if (this.deltaTime >= targetFrameTime) {
      this.performanceMonitor.startMeasurement('frame');
      
      this.clear();
      this.processRenderQueue();
      this.renderLayers();
      
      this.performanceMonitor.endMeasurement('frame');
    }
    
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Clear all layers
    Object.keys(this.layers).forEach(layer => {
      this.layers[layer] = [];
    });
  }

  processRenderQueue() {
    // Sort render queue by z-index and layer
    this.renderQueue.sort((a, b) => {
      if (a.layer !== b.layer) {
        const layerOrder = ['background', 'entities', 'connections', 'ui', 'effects'];
        return layerOrder.indexOf(a.layer) - layerOrder.indexOf(b.layer);
      }
      return a.zIndex - b.zIndex;
    });
    
    // Distribute items to layers
    this.renderQueue.forEach(item => {
      if (this.layers[item.layer]) {
        this.layers[item.layer].push(item);
      }
    });
    
    this.renderQueue = [];
  }

  renderLayers() {
    this.ctx.save();
    this.applyCamera();
    
    // Render each layer in order
    Object.keys(this.layers).forEach(layerName => {
      this.renderLayer(this.layers[layerName]);
    });
    
    this.ctx.restore();
  }

  renderLayer(items) {
    items.forEach(item => {
      this.renderItem(item);
    });
  }

  applyCamera() {
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.rotate(this.camera.rotation);
    this.ctx.translate(-this.camera.x, -this.camera.y);
  }

  addToRenderQueue(item) {
    // Frustum culling - only add visible items
    if (this.isInViewport(item)) {
      // Apply level of detail
      const lodItem = this.applyLOD(item);
      this.renderQueue.push(lodItem);
    }
  }

  isInViewport(item) {
    const viewport = this.getViewportBounds();
    const itemBounds = this.getItemBounds(item);
    
    return this.boundsIntersect(viewport, itemBounds);
  }

  getViewportBounds() {
    const halfWidth = (this.canvas.width / 2) / this.camera.zoom;
    const halfHeight = (this.canvas.height / 2) / this.camera.zoom;
    
    return {
      left: this.camera.x - halfWidth,
      right: this.camera.x + halfWidth,
      top: this.camera.y - halfHeight,
      bottom: this.camera.y + halfHeight
    };
  }

  getItemBounds(item) {
    return {
      left: item.x - item.width / 2,
      right: item.x + item.width / 2,
      top: item.y - item.height / 2,
      bottom: item.y + item.height / 2
    };
  }

  boundsIntersect(a, b) {
    return a.left < b.right && a.right > b.left && 
           a.top < b.bottom && a.bottom > b.top;
  }

  applyLOD(item) {
    const distance = this.getDistanceFromCamera(item);
    const lodLevel = this.calculateLODLevel(distance);
    
    return {
      ...item,
      lodLevel,
      detail: this.getLODDetail(lodLevel)
    };
  }

  calculateLODLevel(distance) {
    if (distance < 200) return 'high';
    if (distance < 500) return 'medium';
    return 'low';
  }

  getLODDetail(level) {
    switch(level) {
      case 'high': return { complexity: 1.0, effects: true, shadows: true };
      case 'medium': return { complexity: 0.7, effects: true, shadows: false };
      case 'low': return { complexity: 0.3, effects: false, shadows: false };
      default: return { complexity: 0.1, effects: false, shadows: false };
    }
  }

  renderItem(item) {
    switch(item.type) {
      case 'hexagon':
        this.renderHexagon(item);
        break;
      case 'connection':
        this.renderConnection(item);
        break;
      case 'entity':
        this.renderEntity(item);
        break;
      case 'text':
        this.renderText(item);
        break;
      case 'effect':
        this.renderEffect(item);
        break;
    }
  }

  // Hexagon rendering for ecosystem/company levels
  renderHexagon(item) {
    const { x, y, size, color, label, lodLevel } = item;
    const detail = item.detail || this.getLODDetail(lodLevel || 'high');
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw hexagon shape
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();
    
    // Apply LOD-based rendering
    if (detail.complexity > 0.5) {
      // High detail - gradient fill
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, this.lightenColor(color, 30));
      gradient.addColorStop(1, color);
      this.ctx.fillStyle = gradient;
    } else {
      // Low detail - solid fill
      this.ctx.fillStyle = color;
    }
    
    this.ctx.fill();
    
    // Add stroke
    this.ctx.strokeStyle = this.lightenColor(color, 20);
    this.ctx.lineWidth = detail.complexity > 0.7 ? 3 : 1;
    this.ctx.stroke();
    
    // Add shadow if high detail
    if (detail.shadows) {
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }
    
    // Add label if medium+ detail
    if (detail.complexity > 0.3 && label) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = `${size / 6}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(label, 0, 0);
    }
    
    this.ctx.restore();
  }

  // Isometric rendering for 3D buildings
  renderIsometricBuilding(item) {
    const { x, y, width, height, depth, color, status } = item;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Calculate isometric coordinates
    const isoX = (width - height) * Math.cos(Math.PI / 6);
    const isoY = (width + height) * Math.sin(Math.PI / 6);
    
    // Draw top face
    this.ctx.beginPath();
    this.ctx.moveTo(0, -depth);
    this.ctx.lineTo(width * Math.cos(Math.PI / 6), -width * Math.sin(Math.PI / 6) - depth);
    this.ctx.lineTo(isoX, isoY - depth);
    this.ctx.lineTo(-height * Math.cos(Math.PI / 6), height * Math.sin(Math.PI / 6) - depth);
    this.ctx.closePath();
    this.ctx.fillStyle = this.lightenColor(color, 30);
    this.ctx.fill();
    
    // Draw left face
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-height * Math.cos(Math.PI / 6), height * Math.sin(Math.PI / 6));
    this.ctx.lineTo(-height * Math.cos(Math.PI / 6), height * Math.sin(Math.PI / 6) - depth);
    this.ctx.lineTo(0, -depth);
    this.ctx.closePath();
    this.ctx.fillStyle = this.darkenColor(color, 20);
    this.ctx.fill();
    
    // Draw right face
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(width * Math.cos(Math.PI / 6), -width * Math.sin(Math.PI / 6));
    this.ctx.lineTo(width * Math.cos(Math.PI / 6), -width * Math.sin(Math.PI / 6) - depth);
    this.ctx.lineTo(0, -depth);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Add status indicator
    if (status !== 'normal') {
      this.addStatusIndicator(0, -depth - 10, status);
    }
    
    this.ctx.restore();
  }

  renderConnection(item) {
    const { from, to, strength, animated, color } = item;
    
    this.ctx.save();
    
    // Create flowing line
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    
    // Use quadratic curve for smooth connections
    const controlX = (from.x + to.x) / 2 + (to.y - from.y) * 0.1;
    const controlY = (from.y + to.y) / 2 - (to.x - from.x) * 0.1;
    this.ctx.quadraticCurveTo(controlX, controlY, to.x, to.y);
    
    // Style based on strength
    this.ctx.strokeStyle = color || `rgba(64, 224, 208, ${0.3 + strength * 0.7})`;
    this.ctx.lineWidth = 1 + strength * 3;
    this.ctx.stroke();
    
    // Add animated flow if enabled
    if (animated) {
      this.addFlowAnimation(from, to, strength);
    }
    
    // Draw arrowhead
    this.drawArrowhead(from, to, strength);
    
    this.ctx.restore();
  }

  addFlowAnimation(from, to, strength) {
    const particleCount = Math.floor(strength * 5);
    const time = performance.now() * 0.001;
    
    for (let i = 0; i < particleCount; i++) {
      const progress = (i / particleCount + time) % 1;
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
      this.ctx.fillStyle = '#40e0d0';
      this.ctx.fill();
    }
  }

  drawArrowhead(from, to, strength) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLength = 10 + strength * 5;
    
    this.ctx.save();
    this.ctx.translate(to.x, to.y);
    this.ctx.rotate(angle);
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-headLength, -headLength/2);
    this.ctx.lineTo(-headLength, headLength/2);
    this.ctx.closePath();
    this.ctx.fillStyle = '#40e0d0';
    this.ctx.fill();
    
    this.ctx.restore();
  }

  renderEntity(item) {
    const { x, y, type, status, priority, size } = item;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    switch(type) {
      case 'lead':
        this.renderLead(status, priority, size);
        break;
      case 'customer':
        this.renderCustomer(status, size);
        break;
      case 'task':
        this.renderTask(status, size);
        break;
      case 'data':
        this.renderDataPacket(size);
        break;
    }
    
    this.ctx.restore();
  }

  renderLead(status, priority, size = 6) {
    const color = this.getLeadColor(priority);
    
    // Main body
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Glow effect for high priority
    if (priority === 'high' || priority === 'critical') {
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
    
    // Status ring
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size + 2, 0, 2 * Math.PI);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  renderCustomer(status, size = 7) {
    // Diamond shape for customers
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size);
    this.ctx.lineTo(size, 0);
    this.ctx.lineTo(0, size);
    this.ctx.lineTo(-size, 0);
    this.ctx.closePath();
    
    this.ctx.fillStyle = '#4ade80';
    this.ctx.fill();
    
    // Add sparkle effect
    this.addSparkleEffect(size);
  }

  renderTask(status, size = 5) {
    const color = this.getTaskColor(status);
    
    // Square shape
    this.ctx.fillStyle = color;
    this.ctx.fillRect(-size/2, -size/2, size, size);
    
    // Status border
    this.ctx.strokeStyle = this.lightenColor(color, 30);
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(-size/2, -size/2, size, size);
  }

  renderDataPacket(size = 4) {
    // Flowing data packet
    this.ctx.fillStyle = '#60a5fa';
    this.ctx.fillRect(-size, -size/2, size*2, size);
    
    // Data flow lines
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(-size + i*2, -size/4);
      this.ctx.lineTo(-size + i*2 + 1, size/4);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }
  }

  addSparkleEffect(size) {
    const sparkles = 4;
    for (let i = 0; i < sparkles; i++) {
      const angle = (i / sparkles) * 2 * Math.PI;
      const distance = size + 3;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 1, 0, 2 * Math.PI);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
    }
  }

  addStatusIndicator(x, y, status) {
    const size = 5;
    const color = this.getStatusColor(status);
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Pulsing effect for alerts
    if (status === 'error' || status === 'warning') {
      const pulse = 1 + Math.sin(performance.now() * 0.01) * 0.3;
      this.ctx.save();
      this.ctx.scale(pulse, pulse);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  // Utility functions
  lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + 
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + 
      (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)
    ).toString(16).slice(1);
  }

  getLeadColor(priority) {
    const colors = {
      'critical': '#dc2626',
      'high': '#ea580c',
      'medium': '#ca8a04',
      'low': '#65a30d'
    };
    return colors[priority] || '#6b7280';
  }

  getTaskColor(status) {
    const colors = {
      'completed': '#4ade80',
      'in-progress': '#3b82f6',
      'pending': '#eab308',
      'blocked': '#ef4444'
    };
    return colors[status] || '#6b7280';
  }

  getStatusColor(status) {
    const colors = {
      'healthy': '#4ade80',
      'warning': '#fbbf24',
      'error': '#ef4444',
      'maintenance': '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  }

  getDistanceFromCamera(item) {
    const dx = item.x - this.camera.x;
    const dy = item.y - this.camera.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Camera controls
  setCamera(x, y, zoom = this.camera.zoom, rotation = this.camera.rotation) {
    this.camera = { x, y, zoom, rotation };
  }

  moveCamera(deltaX, deltaY) {
    this.camera.x += deltaX;
    this.camera.y += deltaY;
  }

  zoomCamera(factor, centerX = this.canvas.width / 2, centerY = this.canvas.height / 2) {
    const newZoom = Math.max(0.1, Math.min(5, this.camera.zoom * factor));
    
    // Zoom towards point
    const worldPos = this.screenToWorld(centerX, centerY);
    this.camera.zoom = newZoom;
    const newWorldPos = this.screenToWorld(centerX, centerY);
    
    this.camera.x += worldPos.x - newWorldPos.x;
    this.camera.y += worldPos.y - newWorldPos.y;
  }

  screenToWorld(screenX, screenY) {
    const x = (screenX - this.canvas.width / 2) / this.camera.zoom + this.camera.x;
    const y = (screenY - this.canvas.height / 2) / this.camera.zoom + this.camera.y;
    return { x, y };
  }

  worldToScreen(worldX, worldY) {
    const x = (worldX - this.camera.x) * this.camera.zoom + this.canvas.width / 2;
    const y = (worldY - this.camera.y) * this.camera.zoom + this.canvas.height / 2;
    return { x, y };
  }

  // Resize handling
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Maintain aspect ratio for camera
    const aspectRatio = width / height;
    // Adjust camera bounds if needed
  }
}
```

### **5.2 Performance Optimization**

```javascript
class PerformanceOptimizer {
  constructor() {
    this.frameRate = 60;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.performanceMetrics = {
      fps: 0,
      frameTime: 0,
      renderTime: 0,
      entityCount: 0,
      memoryUsage: 0
    };
    
    // Optimization settings
    this.settings = {
      maxEntities: 1000,
      cullingMargin: 100,
      lodDistances: [200, 500, 1000],
      batchSize: 50
    };
  }

  shouldRender(currentTime) {
    this.deltaTime = currentTime - this.lastFrameTime;
    const targetFrameTime = 1000 / this.frameRate;
    
    if (this.deltaTime >= targetFrameTime) {
      this.lastFrameTime = currentTime;
      this.updatePerformanceMetrics();
      return true;
    }
    
    return false;
  }

  updatePerformanceMetrics() {
    this.performanceMetrics.fps = 1000 / this.deltaTime;
    this.performanceMetrics.frameTime = this.deltaTime;
    
    // Monitor memory if available
    if (performance.memory) {
      this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
    }
  }

  // Level of Detail (LOD) system
  optimizeRenderQueue(items, camera, canvas) {
    const optimizedItems = [];
    
    // First pass: frustum culling
    const visibleItems = items.filter(item => 
      this.isInViewport(item, camera, canvas)
    );
    
    // Second pass: apply LOD
    visibleItems.forEach(item => {
      const distance = this.getDistanceFromCamera(item, camera);
      const lodLevel = this.calculateLOD(distance);
      
      optimizedItems.push({
        ...item,
        lodLevel,
        priority: this.calculateRenderPriority(item, distance)
      });
    });
    
    // Third pass: sort by priority and limit count
    optimizedItems.sort((a, b) => b.priority - a.priority);
    
    return optimizedItems.slice(0, this.settings.maxEntities);
  }

  isInViewport(item, camera, canvas) {
    const margin = this.settings.cullingMargin;
    const left = camera.x - (canvas.width / 2) / camera.zoom - margin;
    const right = camera.x + (canvas.width / 2) / camera.zoom + margin;
    const top = camera.y - (canvas.height / 2) / camera.zoom - margin;
    const bottom = camera.y + (canvas.height / 2) / camera.zoom + margin;
    
    return item.x >= left && item.x <= right && 
           item.y >= top && item.y <= bottom;
  }

  calculateLOD(distance) {
    const [close, medium, far] = this.settings.lodDistances;
    
    if (distance < close) return 'high';
    if (distance < medium) return 'medium';
    if (distance < far) return 'low';
    return 'minimal';
  }

  calculateRenderPriority(item, distance) {
    let priority = 1 / Math.max(1, distance / 100); // Distance-based
    
    // Boost priority for important items
    if (item.type === 'selected') priority *= 10;
    if (item.type === 'alert') priority *= 5;
    if (item.animated) priority *= 2;
    
    return priority;
  }

  getDistanceFromCamera(item, camera) {
    const dx = item.x - camera.x;
    const dy = item.y - camera.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Batch rendering for similar items
  batchRender(items, renderFunction) {
    const batches = this.createBatches(items);
    
    batches.forEach(batch => {
      // Set up batch state
      this.setupBatchState(batch);
      
      // Render all items in batch
      batch.items.forEach(item => {
        renderFunction(item, batch.state);
      });
      
      // Clean up batch state
      this.cleanupBatchState(batch);
    });
  }

  createBatches(items) {
    const batches = new Map();
    
    items.forEach(item => {
      const key = this.getBatchKey(item);
      
      if (!batches.has(key)) {
        batches.set(key, {
          type: item.type,
          color: item.color,
          lodLevel: item.lodLevel,
          items: [],
          state: {}
        });
      }
      
      batches.get(key).items.push(item);
    });
    
    return Array.from(batches.values());
  }

  getBatchKey(item) {
    return `${item.type}-${item.color}-${item.lodLevel}`;
  }

  setupBatchState(batch) {
    // Setup common rendering state for batch
    batch.state.fillStyle = batch.color;
    batch.state.strokeStyle = this.lightenColor(batch.color, 20);
  }

  cleanupBatchState(batch) {
    // Clean up any batch-specific state
    batch.state = {};
  }

  // Adaptive performance scaling
  adaptPerformance() {
    const currentFPS = this.performanceMetrics.fps;
    const targetFPS = this.frameRate;
    
    if (currentFPS < targetFPS * 0.8) {
      // Performance is poor, reduce quality
      this.reduceQuality();
    } else if (currentFPS > targetFPS * 0.95) {
      // Performance is good, can increase quality
      this.increaseQuality();
    }
  }

  reduceQuality() {
    // Reduce entity count
    this.settings.maxEntities = Math.max(100, this.settings.maxEntities * 0.8);
    
    // Increase LOD distances (less detail at same distance)
    this.settings.lodDistances = this.settings.lodDistances.map(d => d * 0.8);
    
    console.log('Performance: Reduced quality settings');
  }

  increaseQuality() {
    // Increase entity count (with limit)
    this.settings.maxEntities = Math.min(2000, this.settings.maxEntities * 1.1);
    
    // Decrease LOD distances (more detail at same distance)
    this.settings.lodDistances = this.settings.lodDistances.map(d => d * 1.1);
    
    console.log('Performance: Increased quality settings');
  }

  // Memory management
  monitorMemory() {
    if (performance.memory) {
      const memoryInfo = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
      
      // Trigger garbage collection suggestions if memory is high
      const usagePercent = memoryInfo.used / memoryInfo.limit;
      if (usagePercent > 0.8) {
        this.triggerMemoryCleanup();
      }
      
      return memoryInfo;
    }
    
    return null;
  }

  triggerMemoryCleanup() {
    // Clear caches
    this.clearCaches();
    
    // Reduce entity count temporarily
    this.settings.maxEntities = Math.max(50, this.settings.maxEntities * 0.5);
    
    console.warn('High memory usage detected, triggering cleanup');
  }

  clearCaches() {
    // Clear any cached render data
    // Implementation would depend on specific caching strategy
  }

  // Performance reporting
  getPerformanceReport() {
    return {
      ...this.performanceMetrics,
      settings: { ...this.settings },
      timestamp: Date.now()
    };
  }
}

// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.measurements = new Map();
    this.thresholds = {
      frame: 16, // 60fps = 16ms per frame
      render: 10,
      update: 5
    };
  }

  startMeasurement(name) {
    performance.mark(`${name}-start`);
  }

  endMeasurement(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const entries = performance.getEntriesByName(name);
    const duration = entries[entries.length - 1].duration;
    
    this.recordMeasurement(name, duration);
    this.checkThreshold(name, duration);
    
    return duration;
  }

  recordMeasurement(name, duration) {
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    
    const measurements = this.measurements.get(name);
    measurements.push(duration);
    
    // Keep only last 60 measurements
    if (measurements.length > 60) {
      measurements.shift();
    }
  }

  checkThreshold(name, duration) {
    const threshold = this.thresholds[name];
    if (threshold && duration > threshold) {
      console.warn(`Performance threshold exceeded for ${name}: ${duration.toFixed(2)}ms > ${threshold}ms`);
      
      // Dispatch performance warning
      document.dispatchEvent(new CustomEvent('performance-warning', {
        detail: { name, duration, threshold }
      }));
    }
  }

  getAverageTime(name) {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) return 0;
    
    return measurements.reduce((sum, time) => sum + time, 0) / measurements.length;
  }

  getStats(name) {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) return null;
    
    const sorted = [...measurements].sort((a, b) => a - b);
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: this.getAverageTime(name),
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }
}
```

---

## 🔄 **6. SISTEMA DE ESTADO Y EVENTOS**

### **6.1 Event System**

```javascript
class CompanyCityEventSystem extends EventTarget {
  constructor() {
    super();
    this.eventQueue = [];
    this.processing = false;
    this.eventHistory = [];
    this.maxHistorySize = 1000;
    
    // Event handlers registry
    this.handlers = new Map();
    
    // Performance tracking
    this.eventMetrics = {
      totalEvents: 0,
      averageProcessingTime: 0,
      queueLength: 0
    };
  }

  // Enhanced event dispatching with priority and batching
  dispatchPriorityEvent(type, detail, priority = 'normal', options = {}) {
    const event = new CustomEvent(type, { 
      detail: { 
        ...detail, 
        priority,
        timestamp: Date.now(),
        id: this.generateEventId()
      },
      ...options
    });
    
    if (priority === 'immediate') {
      this.processEvent(event);
    } else {
      this.eventQueue.push({ event, priority, timestamp: Date.now() });
      
      // Process queue if not already processing
      if (!this.processing) {
        this.scheduleProcessing();
      }
    }
    
    this.eventMetrics.totalEvents++;
    this.eventMetrics.queueLength = this.eventQueue.length;
    
    return event.detail.id;
  }

  scheduleProcessing() {
    // Use requestIdleCallback if available, otherwise setTimeout
    if (window.requestIdleCallback) {
      requestIdleCallback(() => this.processEventQueue());
    } else {
      setTimeout(() => this.processEventQueue(), 0);
    }
  }

  processEventQueue() {
    if (this.processing) return;
    
    this.processing = true;
    const startTime = performance.now();
    
    // Sort by priority and timestamp
    this.eventQueue.sort((a, b) => {
      const priorities = { 'critical': 4, 'high': 3, 'normal': 2, 'low': 1 };
      const priorityDiff = priorities[b.priority] - priorities[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp; // FIFO for same priority
    });
    
    // Process events in batches
    const batchSize = 10;
    const batch = this.eventQueue.splice(0, batchSize);
    
    batch.forEach(({ event }) => {
      this.processEvent(event);
    });
    
    // Update metrics
    const processingTime = performance.now() - startTime;
    this.updateProcessingMetrics(processingTime, batch.length);
    
    this.processing = false;
    
    // Continue processing if more events in queue
    if (this.eventQueue.length > 0) {
      this.scheduleProcessing();
    }
  }

  processEvent(event) {
    try {
      // Add to history
      this.addToHistory(event);
      
      // Dispatch event
      this.dispatchEvent(event);
      
      // Call registered handlers
      this.callRegisteredHandlers(event);
      
    } catch (error) {
      console.error('Error processing event:', error, event);
      
      // Dispatch error event
      this.dispatchEvent(new CustomEvent('event-processing-error', {
        detail: { originalEvent: event, error }
      }));
    }
  }

  callRegisteredHandlers(event) {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

  // Event handler registration
  registerHandler(eventType, handler, options = {}) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    const handlerWithOptions = {
      handler,
      once: options.once || false,
      priority: options.priority || 'normal'
    };
    
    this.handlers.get(eventType).add(handlerWithOptions);
    
    return () => this.unregisterHandler(eventType, handlerWithOptions);
  }

  unregisterHandler(eventType, handlerWithOptions) {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handlerWithOptions);
      
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  // Event batching for performance
  batchEvents(events, batchType = 'default') {
    const batchId = this.generateEventId();
    
    const batchEvent = new CustomEvent('event-batch', {
      detail: {
        batchId,
        batchType,
        events: events.map(e => e.detail),
        count: events.length,
        timestamp: Date.now()
      }
    });
    
    this.dispatchEvent(batchEvent);
    return batchId;
  }

  // Event history management
  addToHistory(event) {
    this.eventHistory.push({
      type: event.type,
      detail: event.detail,
      timestamp: event.detail.timestamp || Date.now()
    });
    
    // Maintain history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  getEventHistory(filter = {}) {
    let filtered = this.eventHistory;
    
    if (filter.type) {
      filtered = filtered.filter(e => e.type === filter.type);
    }
    
    if (filter.since) {
      filtered = filtered.filter(e => e.timestamp >= filter.since);
    }
    
    if (filter.limit) {
      filtered = filtered.slice(-filter.limit);
    }
    
    return filtered;
  }

  // Performance metrics
  updateProcessingMetrics(processingTime, eventCount) {
    const currentAvg = this.eventMetrics.averageProcessingTime;
    const totalProcessed = this.eventMetrics.totalEvents - this.eventQueue.length;
    
    this.eventMetrics.averageProcessingTime = 
      (currentAvg * (totalProcessed - eventCount) + processingTime) / totalProcessed;
  }

  getEventMetrics() {
    return {
      ...this.eventMetrics,
      queueLength: this.eventQueue.length,
      historySize: this.eventHistory.length,
      handlersCount: this.handlers.size
    };
  }

  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup
  clearEventQueue() {
    this.eventQueue = [];
    this.processing = false;
  }

  clearEventHistory() {
    this.eventHistory = [];
  }

  destroy() {
    this.clearEventQueue();
    this.clearEventHistory();
    this.handlers.clear();
  }
}

// Global event types
const EVENTS = {
  // Navigation events
  NAVIGATION: {
    ZOOM_IN: 'navigation:zoom-in',
    ZOOM_OUT: 'navigation:zoom-out',
    LEVEL_CHANGE: 'navigation:level-change',
    ENTITY_SELECT: 'navigation:entity-select',
    PATH_CHANGE: 'navigation:path-change',
    BREADCRUMB_CLICK: 'navigation:breadcrumb-click'
  },
  
  // Entity events
  ENTITY: {
    MOVE: 'entity:move',
    UPDATE: 'entity:update',
    CREATE: 'entity:create',
    DELETE: 'entity:delete',
    SELECT: 'entity:select',
    TRACK_START: 'entity:track-start',
    TRACK_STOP: 'entity:track-stop',
    ENTER_BUILDING: 'entity:enter-building',
    EXIT_BUILDING: 'entity:exit-building'
  },
  
  // Performance events
  PERFORMANCE: {
    UPDATE: 'performance:update',
    ALERT: 'performance:alert',
    THRESHOLD_EXCEEDED: 'performance:threshold-exceeded',
    BOTTLENECK_DETECTED: 'performance:bottleneck-detected',
    OPTIMIZATION_APPLIED: 'performance:optimization-applied'
  },
  
  // Configuration events
  CONFIG: {
    CHANGE: 'config:change',
    INTEGRATION_STATUS: 'config:integration-status',
    VALIDATION_RESULT: 'config:validation-result',
    TEMPLATE_APPLIED: 'config:template-applied'
  },
  
  // UI events
  UI: {
    VIEW_CHANGE: 'ui:view-change',
    PERSPECTIVE_CHANGE: 'ui:perspective-change',
    FILTER_CHANGE: 'ui:filter-change',
    SEARCH_QUERY: 'ui:search-query',
    MODAL_OPEN: 'ui:modal-open',
    MODAL_CLOSE: 'ui:modal-close'
  },
  
  // System events
  SYSTEM: {
    READY: 'system:ready',
    ERROR: 'system:error',
    WARNING: 'system:warning',
    SYNC_START: 'system:sync-start',
    SYNC_COMPLETE: 'system:sync-complete',
    CONNECTION_LOST: 'system:connection-lost',
    CONNECTION_RESTORED: 'system:connection-restored'
  }
};
```

### **6.2 State Management**

```javascript
class CompanyCityStateManager {
  constructor() {
    this.state = this.createReactiveState({
      // Navigation state
      currentLevel: 'ecosystem',
      currentPath: {},
      navigationHistory: [],
      breadcrumbs: [],
      
      // Entity state
      selectedEntities: [],
      trackedEntity: null,
      visibleEntities: new Set(),
      
      // View state
      viewMode: 'default',
      perspective: 'business',
      filters: {},
      searchQuery: '',
      showComparison: false,
      comparisonTargets: [],
      
      // Camera state
      camera: { x: 0, y: 0, zoom: 1, rotation: 0 },
      
      // Time state
      timeRange: { start: null, end: null, preset: 'current' },
      isRealTime: true,
      
      // Performance state
      performance: {
        renderTime: 0,
        entityCount: 0,
        memoryUsage: 0,
        fps: 0
      },
      
      // System state
      loading: false,
      error: null,
      connected: true,
      
      // User preferences
      userPreferences: {
        theme: 'dark',
        animations: true,
        notifications: true,
        autoTracking: false
      }
    });
    
    this.stateHistory = [];
    this.maxHistorySize = 50;
    this.subscribers = new Set();
    
    // Middleware functions
    this.middleware = [];
    
    // State validation rules
    this.validators = new Map();
    
    this.setupValidators();
  }

  createReactiveState(initialState) {
    return new Proxy(initialState, {
      set: (target, key, value) => {
        const oldValue = target[key];
        
        // Validate new value
        if (!this.validateStateChange(key, value, oldValue)) {
          console.warn(`Invalid state change for ${key}:`, value);
          return false;
        }
        
        // Apply middleware
        const processedValue = this.applyMiddleware(key, value, oldValue);
        
        // Update state
        target[key] = processedValue;
        
        // Add to history
        this.addToHistory(key, oldValue, processedValue);
        
        // Notify subscribers
        this.notifyStateChange(key, oldValue, processedValue);
        
        return true;
      },
      
      get: (target, key) => {
        // Return deep copy for objects to prevent mutation
        const value = target[key];
        if (typeof value === 'object' && value !== null) {
          return JSON.parse(JSON.stringify(value));
        }
        return value;
      }
    });
  }

  // State change validation
  validateStateChange(key, newValue, oldValue) {
    const validator = this.validators.get(key);
    if (validator) {
      return validator(newValue, oldValue);
    }
    return true; // Default: allow change
  }

  setupValidators() {
    this.validators.set('currentLevel', (value) => {
      const validLevels = ['ecosystem', 'company', 'district', 'building', 'module', 'element'];
      return validLevels.includes(value);
    });
    
    this.validators.set('camera', (value) => {
      return value && 
             typeof value.x === 'number' && 
             typeof value.y === 'number' && 
             typeof value.zoom === 'number' && 
             value.zoom > 0;
    });
    
    this.validators.set('timeRange', (value) => {
      if (!value) return false;
      if (value.start && value.end) {
        return new Date(value.start) <= new Date(value.end);
      }
      return true;
    });
  }

  // Middleware system
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  applyMiddleware(key, value, oldValue) {
    return this.middleware.reduce((processedValue, middleware) => {
      return middleware(key, processedValue, oldValue, this.state);
    }, value);
  }

  // State history management
  addToHistory(key, oldValue, newValue) {
    this.stateHistory.push({
      timestamp: Date.now(),
      key,
      oldValue: this.deepClone(oldValue),
      newValue: this.deepClone(newValue),
      action: this.determineAction(key, oldValue, newValue)
    });
    
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }
  }

  determineAction(key, oldValue, newValue) {
    if (oldValue === null || oldValue === undefined) return 'create';
    if (newValue === null || newValue === undefined) return 'delete';
    return 'update';
  }

  // Navigate to specific state in history
  goToHistoryIndex(index) {
    if (index >= 0 && index < this.stateHistory.length) {
      const targetEntry = this.stateHistory[index];
      
      // Reconstruct state up to that point
      const reconstructedState = this.reconstructStateAtIndex(index);
      
      // Apply reconstructed state
      Object.assign(this.state, reconstructedState);
    }
  }

  reconstructStateAtIndex(targetIndex) {
    const reconstructedState = {};
    
    // Apply changes up to target index
    for (let i = 0; i <= targetIndex; i++) {
      const entry = this.stateHistory[i];
      reconstructedState[entry.key] = entry.newValue;
    }
    
    return reconstructedState;
  }

  // Subscribe to state changes
  subscribe(callback, filter = {}) {
    const subscriber = {
      callback,
      filter,
      id: this.generateSubscriberId()
    };
    
    this.subscribers.add(subscriber);
    
    return () => this.unsubscribe(subscriber.id);
  }

  unsubscribe(subscriberId) {
    for (const subscriber of this.subscribers) {
      if (subscriber.id === subscriberId) {
        this.subscribers.delete(subscriber);
        break;
      }
    }
  }

  notifyStateChange(key, oldValue, newValue) {
    const changeEvent = {
      key,
      oldValue,
      newValue,
      timestamp: Date.now(),
      state: this.getState()
    };
    
    this.subscribers.forEach(subscriber => {
      if (this.matchesFilter(changeEvent, subscriber.filter)) {
        try {
          subscriber.callback(changeEvent);
        } catch (error) {
          console.error('Error in state subscriber:', error);
        }
      }
    });
    
    // Dispatch global state change event
    document.dispatchEvent(new CustomEvent('state-change', {
      detail: changeEvent
    }));
  }

  matchesFilter(changeEvent, filter) {
    if (filter.keys && !filter.keys.includes(changeEvent.key)) {
      return false;
    }
    
    if (filter.actions && !filter.actions.includes(changeEvent.action)) {
      return false;
    }
    
    return true;
  }

  // Navigation methods
  navigate(targetPath, options = {}) {
    const currentPath = this.state.currentPath;
    
    // Add current path to history
    if (options.addToHistory !== false) {
      this.state.navigationHistory = [
        ...this.state.navigationHistory,
        this.deepClone(currentPath)
      ];
    }
    
    // Update current path
    this.state.currentPath = targetPath;
    
    // Update current level
    this.state.currentLevel = this.determineLevel(targetPath);
    
    // Update breadcrumbs
    this.state.breadcrumbs = this.generateBreadcrumbs(targetPath);
    
    // Clear selections if changing contexts significantly
    if (this.isContextChange(currentPath, targetPath)) {
      this.state.selectedEntities = [];
      if (options.clearTracking !== false) {
        this.state.trackedEntity = null;
      }
    }
  }

  determineLevel(path) {
    if (path.element) return 'element';
    if (path.module) return 'module';
    if (path.building) return 'building';
    if (path.district) return 'district';
    if (path.company) return 'company';
    return 'ecosystem';
  }

  generateBreadcrumbs(path) {
    const breadcrumbs = [];
    
    if (path.ecosystem !== undefined) {
      breadcrumbs.push({ level: 'ecosystem', name: 'Ecosystem', path: { ecosystem: path.ecosystem } });
    }
    
    if (path.company) {
      breadcrumbs.push({ 
        level: 'company', 
        name: path.companyName || path.company,
        path: { ecosystem: path.ecosystem, company: path.company }
      });
    }
    
    if (path.district) {
      breadcrumbs.push({
        level: 'district',
        name: path.districtName || path.district,
        path: { 
          ecosystem: path.ecosystem,
          company: path.company,
          district: path.district
        }
      });
    }
    
    if (path.building) {
      breadcrumbs.push({
        level: 'building',
        name: path.buildingName || path.building,
        path: {
          ecosystem: path.ecosystem,
          company: path.company,
          district: path.district,
          building: path.building
        }
      });
    }
    
    if (path.module) {
      breadcrumbs.push({
        level: 'module',
        name: path.moduleName || path.module,
        path: {
          ecosystem: path.ecosystem,
          company: path.company,
          district: path.district,
          building: path.building,
          module: path.module
        }
      });
    }
    
    if (path.element) {
      breadcrumbs.push({
        level: 'element',
        name: path.elementName || path.element,
        path: path
      });
    }
    
    return breadcrumbs;
  }

  isContextChange(oldPath, newPath) {
    // Consider it a context change if company or district changes
    return oldPath.company !== newPath.company || 
           oldPath.district !== newPath.district;
  }

  // Entity management
  selectEntity(entityId, options = {}) {
    if (options.multiple) {
      if (!this.state.selectedEntities.includes(entityId)) {
        this.state.selectedEntities = [...this.state.selectedEntities, entityId];
      }
    } else {
      this.state.selectedEntities = [entityId];
    }
  }

  deselectEntity(entityId) {
    this.state.selectedEntities = this.state.selectedEntities.filter(id => id !== entityId);
  }

  clearSelection() {
    this.state.selectedEntities = [];
  }

  trackEntity(entity) {
    this.state.trackedEntity = entity;
  }

  stopTracking() {
    this.state.trackedEntity = null;
  }

  // Filter management
  setFilter(filterType, value) {
    this.state.filters = {
      ...this.state.filters,
      [filterType]: value
    };
  }

  clearFilters() {
    this.state.filters = {};
  }

  // Camera management
  setCamera(camera) {
    this.state.camera = { ...this.state.camera, ...camera };
  }

  resetCamera() {
    this.state.camera = { x: 0, y: 0, zoom: 1, rotation: 0 };
  }

  // Utility methods
  getState() {
    return this.deepClone(this.state);
  }

  setState(newState) {
    Object.assign(this.state, newState);
  }

  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      for (const key in obj) {
        cloned[key] = this.deepClone(obj[key]);
      }
      return cloned;
    }
  }

  generateSubscriberId() {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Debug helpers
  getStateHistory() {
    return [...this.stateHistory];
  }

  getSubscriberCount() {
    return this.subscribers.size;
  }

  // Cleanup
  destroy() {
    this.subscribers.clear();
    this.stateHistory = [];
    this.middleware = [];
    this.validators.clear();
  }
}

// State middleware examples
const loggingMiddleware = (key, value, oldValue, state) => {
  console.log(`State change: ${key}`, { oldValue, newValue: value });
  return value;
};

const performanceMiddleware = (key, value, oldValue, state) => {
  if (key === 'performance') {
    // Validate performance metrics
    if (value.fps && value.fps < 30) {
      console.warn('Low FPS detected:', value.fps);
    }
    
    if (value.memoryUsage && value.memoryUsage > 100 * 1024 * 1024) {
      console.warn('High memory usage:', value.memoryUsage);
    }
  }
  
  return value;
};

const persistenceMiddleware = (key, value, oldValue, state) => {
  // Persist certain state to localStorage (in real app, not in artifact)
  const persistentKeys = ['userPreferences', 'camera'];
  
  if (persistentKeys.includes(key)) {
    // In real implementation, would save to localStorage
    console.log(`Would persist ${key} to storage`);
  }
  
  return value;
};
```

---

## 📡 **7. REAL-TIME DATA STREAMING**

### **7.1 Data Synchronization**

```javascript
class DataSynchronizer {
  constructor() {
    this.wsManager = new CompanyCityWebSocket();
    this.stateManager = new CompanyCityStateManager();
    this.syncQueue = [];
    this.syncing = false;
    this.syncStrategies = new Map();
    this.conflictResolver = new ConflictResolver();
    
    this.setupSyncStrategies();
    this.setupEventListeners();
  }

  setupSyncStrategies() {
    // Different sync strategies for different data types
    this.syncStrategies.set('entity', new EntitySyncStrategy());
    this.syncStrategies.set('performance', new PerformanceSyncStrategy());
    this.syncStrategies.set('configuration', new ConfigurationSyncStrategy());
    this.syncStrategies.set('navigation', new NavigationSyncStrategy());
  }

  setupEventListeners() {
    this.wsManager.subscribe('entity:update', this.handleEntityUpdate.bind(this));
    this.wsManager.subscribe('entity:move', this.handleEntityMove.bind(this));
    this.wsManager.subscribe('performance:update', this.handlePerformanceUpdate.bind(this));
    this.wsManager.subscribe('config:change', this.handleConfigChange.bind(this));
    this.wsManager.subscribe('flow:entity-enter', this.handleFlowEvent.bind(this));
    this.wsManager.subscribe('flow:entity-exit', this.handleFlowEvent.bind(this));
  }

  // Sync specific navigation path
  async syncPath(path, options = {}) {
    try {
      this.stateManager.setState({ loading: true });
      
      const syncOperation = {
        id: this.generateSyncId(),
        type: 'path-sync',
        path,
        timestamp: Date.now(),
        options
      };
      
      // Add to sync queue
      this.syncQueue.push(syncOperation);
      
      // Start sync if not already syncing
      if (!this.syncing) {
        await this.processSyncQueue();
      }
      
      // Subscribe to real-time updates for this path
      await this.subscribeToPath(path);
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.stateManager.setState({ 
        loading: false, 
        error: `Sync failed: ${error.message}` 
      });
      throw error;
    }
  }

  async processSyncQueue() {
    if (this.syncing) return;
    
    this.syncing = true;
    
    try {
      while (this.syncQueue.length > 0) {
        const operation = this.syncQueue.shift();
        await this.processSyncOperation(operation);
      }
    } finally {
      this.syncing = false;
      this.stateManager.setState({ loading: false });
    }
  }

  async processSyncOperation(operation) {
    const { type, path, options } = operation;
    
    switch (type) {
      case 'path-sync':
        await this.syncPathData(path, options);
        break;
      case 'entity-sync':
        await this.syncEntityData(operation.entityId, options);
        break;
      case 'batch-sync':
        await this.syncBatchData(operation.entities, options);
        break;
    }
  }

  async syncPathData(path, options) {
    const strategy = this.getSyncStrategy(path);
    const data = await strategy.fetchData(path, options);
    
    // Apply conflict resolution if needed
    const resolvedData = await this.conflictResolver.resolve(data, path);
    
    // Update local state
    this.updateLocalState(resolvedData, path);
    
    // Validate data integrity
    this.validateDataIntegrity(resolvedData, path);
  }

  getSyncStrategy(path) {
    const level = this.determineLevel(path);
    return this.syncStrategies.get(level) || this.syncStrategies.get('entity');
  }

  determineLevel(path) {
    if (path.element) return 'entity';
    if (path.module) return 'entity';
    if (path.building) return 'entity';
    if (path.district) return 'entity';
    return 'entity';
  }

  async subscribeToPath(path) {
    const subscriptionId = this.generateSubscriptionId(path);
    
    // Subscribe to relevant event types for this path
    const eventTypes = this.getRelevantEventTypes(path);
    
    for (const eventType of eventTypes) {
      this.wsManager.subscribe(eventType, (event) => {
        this.handleRealtimeUpdate(event, path);
      });
    }
    
    // Send subscription request to server
    this.wsManager.send({
      type: 'subscribe-path',
      subscriptionId,
      path,
      eventTypes,
      timestamp: Date.now()
    });
  }

  getRelevantEventTypes(path) {
    const baseEvents = ['entity:update', 'performance:update'];
    
    if (path.district) {
      baseEvents.push('entity:move', 'flow:entity-enter', 'flow:entity-exit');
    }
    
    if (path.module) {
      baseEvents.push('config:change', 'integration:status');
    }
    
    if (path.element) {
      baseEvents.push('instance:update', 'instance:create', 'instance:delete');
    }
    
    return baseEvents;
  }

  // Real-time event handlers
  handleEntityUpdate(event) {
    const { entityId, updates, path } = event.detail;
    
    // Check if this entity is currently visible
    if (this.isEntityVisible(entityId, path)) {
      this.updateEntityLocally(entityId, updates);
      
      // Trigger visual update
      document.dispatchEvent(new CustomEvent('entity-visual-update', {
        detail: { entityId, updates }
      }));
    }
  }

  handleEntityMove(event) {
    const { entityId, fromPosition, toPosition, path } = event.detail.data;
    
    // Update entity position and trigger animation
    this.updateEntityPosition(entityId, fromPosition, toPosition);
    
    // Dispatch flow animation event
    document.dispatchEvent(new CustomEvent('entity-flow-animation', {
      detail: event.detail
    }));
  }

  handlePerformanceUpdate(event) {
    const { metrics, entityId, level } = event.detail.data;
    
    // Update performance metrics
    this.updatePerformanceMetrics(entityId, metrics, level);
    
    // Check for performance alerts
    this.checkPerformanceAlerts(metrics, entityId);
  }

  handleConfigChange(event) {
    const { entityId, field, newValue, oldValue } = event.detail.data;
    
    // Update configuration locally
    this.updateConfigurationLocally(entityId, field, newValue);
    
    // Trigger validation if needed
    this.validateConfiguration(entityId, field, newValue);
  }

  handleFlowEvent(event) {
    const { entityId, buildingId, eventType } = event.detail.data;
    
    // Update entity flow state
    this.updateEntityFlowState(entityId, buildingId, eventType);
    
    // Update building occupancy
    this.updateBuildingOccupancy(buildingId, eventType);
  }

  handleRealtimeUpdate(event, path) {
    // Generic handler for path-specific updates
    const strategy = this.getSyncStrategy(path);
    strategy.handleRealtimeUpdate(event, path);
  }

  // State update methods
  updateLocalState(data, path) {
    const level = this.determineLevel(path);
    
    switch (level) {
      case 'ecosystem':
        this.updateEcosystemState(data);
        break;
      case 'company':
        this.updateCompanyState(data, path.company);
        break;
      case 'district':
        this.updateDistrictState(data, path);
        break;
      case 'building':
        this.updateBuildingState(data, path);
        break;
      case 'module':
        this.updateModuleState(data, path);
        break;
      case 'element':
        this.updateElementState(data, path);
        break;
    }
  }

  updateEntityLocally(entityId, updates) {
    // Find entity in current state and update
    const currentEntities = this.stateManager.state.visibleEntities;
    
    // Update entity if it exists
    if (currentEntities.has(entityId)) {
      // Dispatch update to relevant components
      document.dispatchEvent(new CustomEvent('entity-local-update', {
        detail: { entityId, updates }
      }));
    }
  }

  updateEntityPosition(entityId, fromPosition, toPosition) {
    // Update entity position in real-time
    document.dispatchEvent(new CustomEvent('entity-position-update', {
      detail: {
        entityId,
        fromPosition,
        toPosition,
        animated: true
      }
    }));
  }

  updatePerformanceMetrics(entityId, metrics, level) {
    // Update performance state
    const currentPerformance = this.stateManager.state.performance;
    
    this.stateManager.setState({
      performance: {
        ...currentPerformance,
        [`${level}_${entityId}`]: metrics
      }
    });
  }

  checkPerformanceAlerts(metrics, entityId) {
    const thresholds = {
      errorRate: 0.05, // 5%
      latency: 1000,   // 1 second
      availability: 0.95 // 95%
    };
    
    const alerts = [];
    
    if (metrics.errorRate > thresholds.errorRate) {
      alerts.push({
        type: 'high_error_rate',
        entityId,
        value: metrics.errorRate,
        threshold: thresholds.errorRate
      });
    }
    
    if (metrics.latency > thresholds.latency) {
      alerts.push({
        type: 'high_latency',
        entityId,
        value: metrics.latency,
        threshold: thresholds.latency
      });
    }
    
    if (metrics.availability < thresholds.availability) {
      alerts.push({
        type: 'low_availability',
        entityId,
        value: metrics.availability,
        threshold: thresholds.availability
      });
    }
    
    // Dispatch alerts
    alerts.forEach(alert => {
      document.dispatchEvent(new CustomEvent('performance-alert', {
        detail: alert
      }));
    });
  }

  // Utility methods
  isEntityVisible(entityId, path) {
    const currentPath = this.stateManager.state.currentPath;
    return this.pathsIntersect(currentPath, path);
  }

  pathsIntersect(path1, path2) {
    // Check if paths have common parent
    const commonKeys = ['ecosystem', 'company', 'district', 'building', 'module'];
    
    for (const key of commonKeys) {
      if (path1[key] && path2[key] && path1[key] === path2[key]) {
        return true;
      }
    }
    
    return false;
  }

  validateDataIntegrity(data, path) {
    // Implement data validation logic
    const validator = this.getDataValidator(path);
    
    if (validator && !validator.validate(data)) {
      console.warn('Data integrity validation failed:', validator.errors);
      
      // Dispatch validation error
      document.dispatchEvent(new CustomEvent('data-validation-error', {
        detail: {
          path,
          errors: validator.errors,
          data
        }
      }));
    }
  }

  getDataValidator(path) {
    // Return appropriate validator based on path
    // Implementation would depend on specific validation requirements
    return null;
  }

  generateSyncId() {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateSubscriptionId(path) {
    const pathString = Object.entries(path)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    return `sub_${btoa(pathString)}_${Date.now()}`;
  }

  // Cleanup
  async disconnect() {
    this.wsManager.disconnect();
    this.syncQueue = [];
    this.syncing = false;
  }

  async reconnect() {
    await this.wsManager.connect();
    
    // Re-sync current path
    const currentPath = this.stateManager.state.currentPath;
    if (Object.keys(currentPath).length > 0) {
      await this.syncPath(currentPath);
    }
  }
}

// Sync strategies for different data types
class EntitySyncStrategy {
  async fetchData(path, options) {
    const level = this.determineLevel(path);
    const endpoint = this.buildEndpoint(level, path);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  buildEndpoint(level, path) {
    const baseUrl = '/api/v1';
    
    switch (level) {
      case 'ecosystem':
        return `${baseUrl}/ecosystem`;
      case 'company':
        return `${baseUrl}/companies/${path.company}`;
      case 'district':
        return `${baseUrl}/districts/${path.district}`;
      case 'building':
        return `${baseUrl}/buildings/${path.building}`;
      case 'module':
        return `${baseUrl}/modules/${path.module}`;
      case 'element':
        return `${baseUrl}/elements/${path.element}`;
      default:
        return `${baseUrl}/entities`;
    }
  }

  determineLevel(path) {
    if (path.element) return 'element';
    if (path.module) return 'module';
    if (path.building) return 'building';
    if (path.district) return 'district';
    if (path.company) return 'company';
    return 'ecosystem';
  }

  getAuthHeaders() {
    // Return authentication headers
    return {};
  }

  handleRealtimeUpdate(event, path) {
    // Handle real-time updates for entities
    console.log('Entity real-time update:', event.type, path);
  }
}

class PerformanceSyncStrategy extends EntitySyncStrategy {
  async fetchData(path, options) {
    const data = await super.fetchData(path, options);
    
    // Also fetch performance metrics
    const performanceEndpoint = this.buildEndpoint(this.determineLevel(path), path) + '/performance';
    
    const perfResponse = await fetch(performanceEndpoint);
    if (perfResponse.ok) {
      data.performance = await perfResponse.json();
    }
    
    return data;
  }

  handleRealtimeUpdate(event, path) {
    if (event.type === 'performance:update') {
      // Handle performance-specific updates
      const { metrics, trend, alerts } = event.detail.data;
      
      // Update performance visualization
      document.dispatchEvent(new CustomEvent('performance-visualization-update', {
        detail: { metrics, trend, alerts, path }
      }));
    }
  }
}

class ConfigurationSyncStrategy extends EntitySyncStrategy {
  async fetchData(path, options) {
    const data = await super.fetchData(path, options);
    
    // Fetch configuration data
    const configEndpoint = this.buildEndpoint(this.determineLevel(path), path) + '/config';
    
    const configResponse = await fetch(configEndpoint);
    if (configResponse.ok) {
      data.configuration = await configResponse.json();
    }
    
    return data;
  }

  handleRealtimeUpdate(event, path) {
    if (event.type === 'config:change') {
      // Handle configuration changes
      const { field, newValue, validationResult } = event.detail.data;
      
      // Update configuration UI
      document.dispatchEvent(new CustomEvent('configuration-update', {
        detail: { field, newValue, validationResult, path }
      }));
    }
  }
}

// Conflict resolution
class ConflictResolver {
  async resolve(incomingData, path) {
    // Get current local data
    const localData = this.getCurrentLocalData(path);
    
    // Check for conflicts
    const conflicts = this.detectConflicts(localData, incomingData);
    
    if (conflicts.length === 0) {
      return incomingData; // No conflicts, use incoming data
    }
    
    // Resolve conflicts based on strategy
    return this.resolveConflicts(localData, incomingData, conflicts);
  }

  detectConflicts(localData, incomingData) {
    const conflicts = [];
    
    // Check timestamp-based conflicts
    if (localData && localData.lastModified && incomingData.lastModified) {
      if (localData.lastModified > incomingData.lastModified) {
        conflicts.push({
          type: 'timestamp',
          field: 'lastModified',
          local: localData.lastModified,
          incoming: incomingData.lastModified
        });
      }
    }
    
    // Check specific field conflicts
    // Implementation would depend on specific conflict detection logic
    
    return conflicts;
  }

  resolveConflicts(localData, incomingData, conflicts) {
    // Default strategy: server wins
    // More sophisticated strategies could be implemented
    
    const resolved = { ...incomingData };
    
    conflicts.forEach(conflict => {
      switch (conflict.type) {
        case 'timestamp':
          // Use the more recent data
          if (conflict.local > conflict.incoming) {
            resolved[conflict.field] = conflict.local;
          }
          break;
        
        case 'field':
          // Could implement field-specific resolution logic
          break;
      }
    });
    
    return resolved;
  }

  getCurrentLocalData(path) {
    // Get current local data for the given path
    // Implementation would depend on how local data is stored
    return null;
  }
}
```

---

## 🔒 **8. SEGURIDAD Y PERFORMANCE**

### **8.1 Security Manager**

```javascript
class SecurityManager {
  constructor() {
    this.permissions = new Set();
    this.rateLimiter = new Map();
    this.sessionManager = new SessionManager();
    this.inputValidator = new InputValidator();
    this.auditLogger = new AuditLogger();
    
    this.setupCSP();
    this.setupSecurityHeaders();
  }

  // Content Security Policy
  setupCSP() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' blob:",
      "worker-src 'self' blob:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "connect-src 'self' ws: wss:",
      "font-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = csp;
      document.head.appendChild(meta);
    }
  }

  setupSecurityHeaders() {
    // These would typically be set by the server, but documented here
    const headers = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
    
    console.log('Security headers should be set:', headers);
  }

  // Input sanitization and validation
  sanitizeInput(input, type = 'text') {
    if (input === null || input === undefined) {
      return '';
    }
    
    if (typeof input !== 'string') {
      input = String(input);
    }

    switch (type) {
      case 'html':
        return this.sanitizeHTML(input);
      
      case 'sql':
        return this.sanitizeSQL(input);
      
      case 'path':
        return this.sanitizePath(input);
      
      case 'id':
        return this.sanitizeId(input);
      
      case 'json':
        return this.sanitizeJSON(input);
      
      case 'url':
        return this.sanitizeURL(input);
        
      default:
        return this.sanitizeText(input);
    }
  }

  sanitizeHTML(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  sanitizeSQL(input) {
    return input.replace(/['";\\]/g, '\\interface PathPoint {
  buildingId: string;
  position: { x: number; y: number };
  timestamp: Date;
  duration: number').replace(/[\x00\x1a]/g, '');
  }

  sanitizePath(input) {
    return input.replace(/[^a-zA-Z0-9\-_\/\.]/g, '').replace(/\.{2,}/g, '.');
  }

  sanitizeId(input) {
    return input.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 100);
  }

  sanitizeJSON(input) {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed); // Re-serialize to ensure valid JSON
    } catch (error) {
      throw new SecurityError('Invalid JSON input');
    }
  }

  sanitizeURL(input) {
    try {
      const url = new URL(input);
      
      // Only allow specific protocols
      const allowedProtocols = ['http:', 'https:', 'mailto:'];
      if (!allowedProtocols.includes(url.protocol)) {
        throw new SecurityError('Invalid URL protocol');
      }
      
      return url.toString();
    } catch (error) {
      throw new SecurityError('Invalid URL format');
    }
  }

  sanitizeText(input) {
    return input
      .replace(/[<>]/g, match => match === '<' ? '&lt;' : '&gt;')
      .replace(/['"]/g, match => match === '"' ? '&quot;' : '&#x27;')
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Rate limiting
  checkRateLimit(endpoint, userId = 'anonymous', maxRequests = 100, windowMs = 60000) {
    const key = `${endpoint}:${userId}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.rateLimiter.has(key)) {
      this.rateLimiter.set(key, []);
    }
    
    const requests = this.rateLimiter.get(key);
    
    // Remove old requests
    while (requests.length > 0 && requests[0] < windowStart) {
      requests.shift();
    }
    
    if (requests.length >= maxRequests) {
      this.auditLogger.logSecurityEvent('rate_limit_exceeded', {
        endpoint,
        userId,
        requestCount: requests.length,
        maxRequests
      });
      
      throw new SecurityError('Rate limit exceeded');
    }
    
    requests.push(now);
    return true;
  }

  // Permission checking
  hasPermission(action, resource, context = {}) {
    const permission = `${action}:${resource}`;
    
    // Check basic permission
    if (this.permissions.has(permission) || this.permissions.has('admin:*')) {
      return true;
    }
    
    // Check context-specific permissions
    if (context.level && this.permissions.has(`${action}:${resource}:${context.level}`)) {
      return true;
    }
    
    // Check ownership-based permissions
    if (context.owner && this.permissions.has(`${action}:${resource}:own`)) {
      const currentUser = this.sessionManager.getCurrentUser();
      return currentUser && currentUser.id === context.owner;
    }
    
    this.auditLogger.logSecurityEvent('permission_denied', {
      action,
      resource,
      context,
      userId: this.sessionManager.getCurrentUser()?.id
    });
    
    return false;
  }

  requirePermission(action, resource, context = {}) {
    if (!this.hasPermission(action, resource, context)) {
      throw new SecurityError(`Permission denied: ${action} on ${resource}`);
    }
  }

  // Session management
  validateSession() {
    return this.sessionManager.isValid();
  }

  refreshSession() {
    return this.sessionManager.refresh();
  }

  // API request security
  async secureApiCall(endpoint, options = {}) {
    // Rate limiting
    this.checkRateLimit(endpoint, this.sessionManager.getCurrentUser()?.id);
    
    // Input validation
    if (options.body) {
      options.body = this.validateApiInput(options.body, endpoint);
    }
    
    // Add security headers
    options.headers = {
      ...options.headers,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    };
    
    // Add authentication
    const authHeaders = this.sessionManager.getAuthHeaders();
    options.headers = { ...options.headers, ...authHeaders };
    
    // Add CSRF protection
    const csrfToken = this.sessionManager.getCSRFToken();
    if (csrfToken) {
      options.headers['X-CSRF-Token'] = csrfToken;
    }
    
    try {
      const response = await fetch(endpoint, options);
      
      // Log API call
      this.auditLogger.logApiCall(endpoint, options.method || 'GET', response.status);
      
      if (!response.ok) {
        throw new SecurityError(`API call failed: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      this.auditLogger.logSecurityEvent('api_call_failed', {
        endpoint,
        error: error.message
      });
      throw error;
    }
  }

  validateApiInput(input, endpoint) {
    // Validate input based on endpoint
    const validator = this.inputValidator.getValidator(endpoint);
    
    if (validator) {
      const result = validator.validate(input);
      if (!result.valid) {
        throw new SecurityError(`Invalid input: ${result.errors.join(', ')}`);
      }
      return result.sanitized;
    }
    
    return input;
  }

  // XSS Protection
  preventXSS(content) {
    // Create a temporary DOM element to safely handle content
    const tempDiv = document.createElement('div');
    tempDiv.textContent = content;
    return tempDiv.innerHTML;
  }

  // CSRF Protection
  generateCSRFToken() {
    const token = this.generateSecureToken(32);
    this.sessionManager.setCSRFToken(token);
    return token;
  }

  validateCSRFToken(token) {
    const storedToken = this.sessionManager.getCSRFToken();
    return storedToken && token === storedToken;
  }

  // Secure token generation
  generateSecureToken(length = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const crypto = window.crypto || window.msCrypto;
    
    if (crypto && crypto.getRandomValues) {
      const values = new Uint8Array(length);
      crypto.getRandomValues(values);
      return Array.from(values, byte => charset[byte % charset.length]).join('');
    }
    
    // Fallback for older browsers
    let token = '';
    for (let i = 0; i < length; i++) {
      token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return token;
  }

  // Security monitoring
  monitorSecurityEvents() {
    // Monitor for suspicious activities
    this.setupSecurityListeners();
    
    // Periodic security checks
    setInterval(() => {
      this.performSecurityCheck();
    }, 60000); // Every minute
  }

  setupSecurityListeners() {
    // Monitor for console access (potential dev tools usage)
    const originalConsole = window.console.log;
    window.console.log = (...args) => {
      this.auditLogger.logSecurityEvent('console_access', { args: args.slice(0, 3) });
      originalConsole.apply(console, args);
    };
    
    // Monitor for suspicious DOM modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          Array.from(mutation.addedNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
              this.auditLogger.logSecurityEvent('script_injection_attempt', {
                src: node.src,
                content: node.textContent?.substring(0, 100)
              });
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  performSecurityCheck() {
    // Check session validity
    if (!this.sessionManager.isValid()) {
      this.auditLogger.logSecurityEvent('invalid_session_detected');
      this.handleSecurityBreach('invalid_session');
    }
    
    // Check for rate limit violations
    const rateLimitViolations = this.checkRateLimitViolations();
    if (rateLimitViolations.length > 0) {
      this.auditLogger.logSecurityEvent('rate_limit_violations', { violations: rateLimitViolations });
    }
    
    // Check memory usage (potential memory attacks)
    if (performance.memory && performance.memory.usedJSHeapSize > 500 * 1024 * 1024) {
      this.auditLogger.logSecurityEvent('high_memory_usage', {
        usage: performance.memory.usedJSHeapSize
      });
    }
  }

  checkRateLimitViolations() {
    const violations = [];
    const now = Date.now();
    
    for (const [key, requests] of this.rateLimiter.entries()) {
      const recentRequests = requests.filter(timestamp => now - timestamp < 60000);
      if (recentRequests.length > 50) { // Threshold for concern
        violations.push({ key, count: recentRequests.length });
      }
    }
    
    return violations;
  }

  handleSecurityBreach(type) {
    console.warn(`Security breach detected: ${type}`);
    
    // Dispatch security event
    document.dispatchEvent(new CustomEvent('security-breach', {
      detail: { type, timestamp: Date.now() }
    }));
    
    // Take appropriate action based on breach type
    switch (type) {
      case 'invalid_session':
        this.sessionManager.logout();
        break;
      case 'xss_attempt':
        // Could disable certain features or require re-authentication
        break;
      case 'csrf_attack':
        // Refresh CSRF token and require re-authentication
        this.generateCSRFToken();
        break;
    }
  }

  // Cleanup
  destroy() {
    this.permissions.clear();
    this.rateLimiter.clear();
    this.sessionManager.destroy();
    this.inputValidator.destroy();
    this.auditLogger.destroy();
  }
}

class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SecurityError';
  }
}

class SessionManager {
  constructor() {
    this.currentUser = null;
    this.sessionToken = null;
    this.csrfToken = null;
    this.sessionExpiry = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isValid() {
    return this.sessionToken && 
           this.sessionExpiry && 
           Date.now() < this.sessionExpiry;
  }

  getAuthHeaders() {
    if (!this.sessionToken) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${this.sessionToken}`
    };
  }

  getCSRFToken() {
    return this.csrfToken;
  }

  setCSRFToken(token) {
    this.csrfToken = token;
  }

  async refresh() {
    // Implementation would refresh the session token
    console.log('Session refresh not implemented');
  }

  logout() {
    this.currentUser = null;
    this.sessionToken = null;
    this.csrfToken = null;
    this.sessionExpiry = null;
    
    // Redirect to login or dispatch logout event
    document.dispatchEvent(new CustomEvent('user-logout'));
  }

  destroy() {
    this.logout();
  }
}

class InputValidator {
  constructor() {
    this.validators = new Map();
    this.setupValidators();
  }

  setupValidators() {
    // Setup endpoint-specific validators
    this.validators.set('/api/v1/search', {
      validate: (input) => {
        const errors = [];
        const sanitized = {};
        
        if (input.q && typeof input.q === 'string') {
          if (input.q.length > 100) {
            errors.push('Search query too long');
          } else {
            sanitized.q = input.q.trim();
          }
        }
        
        return {
          valid: errors.length === 0,
          errors,
          sanitized
        };
      }
    });
  }

  getValidator(endpoint) {
    // Find the most specific validator for the endpoint
    for (const [pattern, validator] of this.validators.entries()) {
      if (endpoint.startsWith(pattern)) {
        return validator;
      }
    }
    return null;
  }

  destroy() {
    this.validators.clear();
  }
}

class AuditLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  logSecurityEvent(type, details = {}) {
    const logEntry = {
      timestamp: Date.now(),
      type: 'security',
      event: type,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.addLog(logEntry);
    
    // Send to server in production
    this.sendToServer(logEntry);
  }

  logApiCall(endpoint, method, status) {
    const logEntry = {
      timestamp: Date.now(),
      type: 'api',
      endpoint,
      method,
      status,
      userAgent: navigator.userAgent
    };
    
    this.addLog(logEntry);
  }

  addLog(entry) {
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  async sendToServer(entry) {
    try {
      // In production, send logs to security monitoring endpoint
      console.log('Security log:', entry);
    } catch (error) {
      console.error('Failed to send security log:', error);
    }
  }

  getLogs(filter = {}) {
    let filtered = this.logs;
    
    if (filter.type) {
      filtered = filtered.filter(log => log.type === filter.type);
    }
    
    if (filter.since) {
      filtered = filtered.filter(log => log.timestamp >= filter.since);
    }
    
    return filtered;
  }

  destroy() {
    this.logs = [];
  }
}
```

### **8.2 Performance Monitor**

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      renderTime: [],
      apiLatency: [],
      memoryUsage: [],
      fps: [],
      entityCount: [],
      cacheHitRate: []
    };
    
    this.thresholds = {
      renderTime: 16, // 60fps = 16ms per frame
      apiLatency: 1000, // 1 second
      memoryUsage: 100 * 1024 * 1024, // 100MB
      fps: 55, // Minimum acceptable FPS
      entityCount: 1000 // Maximum entities before performance degradation
    };
    
    this.observers = {
      performance: null,
      memory: null,
      intersection: null
    };
    
    this.startMonitoring();
  }

  startMonitoring() {
    this.setupPerformanceObserver();
    this.setupMemoryMonitoring();
    this.setupFPSMonitoring();
    this.setupEntityCountMonitoring();
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observers.performance = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.entryType, entry.duration || entry.value);
          
          // Check for performance issues
          this.analyzePerformanceEntry(entry);
        }
      });
      
      // Observe different types of performance entries
      try {
        this.observers.performance.observe({ 
          entryTypes: ['measure', 'navigation', 'paint', 'layout-shift', 'largest-contentful-paint'] 
        });
      } catch (error) {
        console.warn('Some performance entry types not supported:', error);
      }
    }
  }

  setupMemoryMonitoring() {
    if (performance.memory) {
      setInterval(() => {
        const memoryInfo = {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        };
        
        this.recordMetric('memoryUsage', memoryInfo.used);
        this.checkMemoryThresholds(memoryInfo);
      }, 5000); // Every 5 seconds
    }
  }

  setupFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) { // Every second
        const fps = frameCount;
        this.recordMetric('fps', fps);
        this.checkFPSThreshold(fps);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  setupEntityCountMonitoring() {
    // Monitor entity count through custom events
    document.addEventListener('entity-count-change', (event) => {
      const count = event.detail.count;
      this.recordMetric('entityCount', count);
      this.checkEntityCountThreshold(count);
    });
  }

  // Measurement methods
  startMeasurement(name) {
    performance.mark(`${name}-start`);
    return {
      end: () => this.endMeasurement(name)
    };
  }

  endMeasurement(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const entries = performance.getEntriesByName(name);
    const duration = entries[entries.length - 1].duration;
    
    this.recordMetric(name, duration);
    this.checkThreshold(name, duration);
    
    return duration;
  }

  recordMetric(name, value) {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    
    this.metrics[name].push({
      value,
      timestamp: Date.now()
    });
    
    // Keep only last 100 measurements
    if (this.metrics[name].length > 100) {
      this.metrics[name].shift();
    }
  }

  // Threshold checking
  checkThreshold(metric, value) {
    const threshold = this.thresholds[metric];
    
    if (threshold && value > threshold) {
      this.triggerPerformanceWarning(metric, value, threshold);
    }
  }

  checkMemoryThresholds(memoryInfo) {
    const usagePercent = memoryInfo.used / memoryInfo.limit;
    
    if (usagePercent > 0.8) {
      this.triggerPerformanceWarning('memoryUsage', memoryInfo.used, this.thresholds.memoryUsage, {
        severity: 'high',
        usagePercent,
        recommendation: 'Consider clearing caches or reducing entity count'
      });
    } else if (usagePercent > 0.6) {
      this.triggerPerformanceWarning('memoryUsage', memoryInfo.used, this.thresholds.memoryUsage, {
        severity: 'medium',
        usagePercent,
        recommendation: 'Monitor memory usage closely'
      });
    }
  }

  checkFPSThreshold(fps) {
    if (fps < this.thresholds.fps) {
      this.triggerPerformanceWarning('fps', fps, this.thresholds.fps, {
        severity: fps < 30 ? 'high' : 'medium',
        recommendation: 'Consider reducing visual complexity or entity count'
      });
    }
  }

  checkEntityCountThreshold(count) {
    if (count > this.thresholds.entityCount) {
      this.triggerPerformanceWarning('entityCount', count, this.thresholds.entityCount, {
        severity: 'medium',
        recommendation: 'Consider implementing entity culling or pagination'
      });
    }
  }

  triggerPerformanceWarning(metric, value, threshold, context = {}) {
    const warning = {
      metric,
      value,
      threshold,
      timestamp: Date.now(),
      severity: context.severity || 'medium',
      recommendation: context.recommendation || 'Check system performance'
    };
    
    console.warn(`Performance threshold exceeded for ${metric}:`, warning);
    
    // Dispatch performance warning event
    document.dispatchEvent(new CustomEvent('performance-warning', {
      detail: warning
    }));
    
    // Auto-apply optimizations for critical issues
    if (warning.severity === 'high') {
      this.applyAutoOptimizations(metric, warning);
    }
  }

  applyAutoOptimizations(metric, warning) {
    switch (metric) {
      case 'memoryUsage':
        this.clearCaches();
        this.reduceEntityDetail();
        break;
        
      case 'fps':
        this.reduceRenderQuality();
        this.disableNonEssentialAnimations();
        break;
        
      case 'renderTime':
        this.enableLevelOfDetail();
        this.reduceBatchSizes();
        break;
    }
    
    console.log(`Applied auto-optimization for ${metric}`);
  }

  clearCaches() {
    // Clear various caches to free memory
    document.dispatchEvent(new CustomEvent('clear-caches'));
  }

  reduceEntityDetail() {
    // Reduce entity rendering detail
    document.dispatchEvent(new CustomEvent('reduce-entity-detail'));
  }

  reduceRenderQuality() {
    // Reduce overall render quality
    document.dispatchEvent(new CustomEvent('reduce-render-quality'));
  }

  disableNonEssentialAnimations() {
    // Disable non-essential animations
    document.dispatchEvent(new CustomEvent('disable-animations', {
      detail: { essential: false }
    }));
  }

  enableLevelOfDetail() {
    // Enable more aggressive level of detail
    document.dispatchEvent(new CustomEvent('enable-aggressive-lod'));
  }

  reduceBatchSizes() {
    // Reduce rendering batch sizes
    document.dispatchEvent(new CustomEvent('reduce-batch-sizes'));
  }

  // Performance analysis
  analyzePerformanceEntry(entry) {
    switch (entry.entryType) {
      case 'navigation':
        this.analyzeNavigationTiming(entry);
        break;
        
      case 'paint':
        this.analyzePaintTiming(entry);
        break;
        
      case 'layout-shift':
        this.analyzeLayoutShift(entry);
        break;
        
      case 'largest-contentful-paint':
        this.analyzeLCP(entry);
        break;
    }
  }

  analyzeNavigationTiming(entry) {
    const metrics = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      firstByte: entry.responseStart - entry.requestStart,
      domInteractive: entry.domInteractive - entry.navigationStart
    };
    
    // Check for slow loading
    if (metrics.domContentLoaded > 3000) {
      this.triggerPerformanceWarning('domContentLoaded', metrics.domContentLoaded, 3000, {
        recommendation: 'Optimize JavaScript loading and execution'
      });
    }
  }

  analyzePaintTiming(entry) {
    if (entry.name === 'first-contentful-paint' && entry.startTime > 2000) {
      this.triggerPerformanceWarning('firstContentfulPaint', entry.startTime, 2000, {
        recommendation: 'Optimize critical rendering path'
      });
    }
  }

  analyzeLayoutShift(entry) {
    if (entry.value > 0.1) { // CLS threshold
      this.triggerPerformanceWarning('cumulativeLayoutShift', entry.value, 0.1, {
        recommendation: 'Reduce layout shifts by reserving space for dynamic content'
      });
    }
  }

  analyzeLCP(entry) {
    if (entry.startTime > 2500) { // LCP threshold
      this.triggerPerformanceWarning('largestContentfulPaint', entry.startTime, 2500, {
        recommendation: 'Optimize largest contentful paint element'
      });
    }
  }

  // Statistics and reporting
  getMetricStats(metric) {
    const values = this.metrics[metric];
    if (!values || values.length === 0) return null;
    
    const numericValues = values.map(v => v.value).sort((a, b) => a - b);
    
    return {
      count: numericValues.length,
      min: numericValues[0],
      max: numericValues[numericValues.length - 1],
      avg: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
      median: numericValues[Math.floor(numericValues.length / 2)],
      p95: numericValues[Math.floor(numericValues.length * 0.95)],
      p99: numericValues[Math.floor(numericValues.length * 0.99)]
    };
  }

  getPerformanceReport() {
    const report = {
      timestamp: Date.now(),
      metrics: {},
      thresholds: { ...this.thresholds },
      recommendations: this.generateRecommendations()
    };
    
    // Add statistics for each metric
    Object.keys(this.metrics).forEach(metric => {
      report.metrics[metric] = this.getMetricStats(metric);
    });
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Analyze current performance and generate recommendations
    const memoryStats = this.getMetricStats('memoryUsage');
    if (memoryStats && memoryStats.avg > this.thresholds.memoryUsage * 0.7) {
      recommendations.push({
        type: 'memory',
        priority: 'medium',
        message: 'Consider implementing memory optimization strategies',
        actions: ['Clear unused caches', 'Reduce entity count', 'Implement virtual scrolling']
      });
    }
    
    const fpsStats = this.getMetricStats('fps');
    if (fpsStats && fpsStats.avg < this.thresholds.fps) {
      recommendations.push({
        type: 'rendering',
        priority: 'high',
        message: 'Frame rate is below optimal threshold',
        actions: ['Enable level of detail', 'Reduce animation complexity', 'Optimize render batching']
      });
    }
    
    const renderStats = this.getMetricStats('renderTime');
    if (renderStats && renderStats.avg > this.thresholds.renderTime) {
      recommendations.push({
        type: 'rendering',
        priority: 'high',
        message: 'Render time exceeds frame budget',
        actions: ['Implement frustum culling', 'Reduce batch sizes', 'Optimize shaders']
      });
    }
    
    return recommendations;
  }

  // Benchmarking
  async runBenchmark() {
    const benchmarkResults = {
      timestamp: Date.now(),
      tests: {}
    };
    
    // Render performance test
    benchmarkResults.tests.renderPerformance = await this.benchmarkRenderPerformance();
    
    // Memory allocation test
    benchmarkResults.tests.memoryAllocation = await this.benchmarkMemoryAllocation();
    
    // Entity processing test
    benchmarkResults.tests.entityProcessing = await this.benchmarkEntityProcessing();
    
    return benchmarkResults;
  }

  async benchmarkRenderPerformance() {
    const iterations = 100;
    const renderTimes = [];
    
    for (let i = 0; i < iterations; i++) {
      const measurement = this.startMeasurement('benchmark-render');
      
      // Simulate render operation
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          // Simulate complex rendering
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          for (let j = 0; j < 1000; j++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 500, Math.random() * 500, 5, 0, 2 * Math.PI);
            ctx.fill();
          }
          
          const duration = measurement.end();
          renderTimes.push(duration);
          resolve();
        });
      });
    }
    
    return {
      iterations,
      avgTime: renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length,
      minTime: Math.min(...renderTimes),
      maxTime: Math.max(...renderTimes),
      fps: 1000 / (renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length)
    };
  }

  async benchmarkMemoryAllocation() {
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    // Allocate memory
    const data = [];
    for (let i = 0; i < 10000; i++) {
      data.push({
        id: i,
        properties: new Array(100).fill(0).map(() => Math.random()),
        metadata: {
          timestamp: Date.now(),
          type: 'test-entity',
          description: `Test entity ${i} with some description text`
        }
      });
    }
    
    const afterAllocation = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const memoryUsed = afterAllocation - initialMemory;
    
    // Clean up
    data.length = 0;
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    const afterCleanup = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const memoryReclaimed = afterAllocation - afterCleanup;
    
    return {
      initialMemory,
      memoryUsed,
      memoryReclaimed,
      efficiency: memoryReclaimed / memoryUsed
    };
  }

  async benchmarkEntityProcessing() {
    const entityCount = 5000;
    const entities = this.generateTestEntities(entityCount);
    
    const measurement = this.startMeasurement('entity-processing');
    
    // Process entities
    let processedCount = 0;
    entities.forEach(entity => {
      // Simulate entity processing
      entity.processed = true;
      entity.lastUpdate = Date.now();
      entity.computedValue = entity.properties.reduce((sum, val) => sum + val, 0);
      processedCount++;
    });
    
    const duration = measurement.end();
    
    return {
      entityCount,
      processedCount,
      duration,
      entitiesPerSecond: entityCount / (duration / 1000)
    };
  }

  generateTestEntities(count) {
    return new Array(count).fill(0).map((_, i) => ({
      id: `entity-${i}`,
      type: 'test',
      properties: new Array(10).fill(0).map(() => Math.random()),
      position: { x: Math.random() * 1000, y: Math.random() * 1000 },
      metadata: {
        created: Date.now() - Math.random() * 86400000,
        updated: Date.now() - Math.random() * 3600000
      }
    }));
  }

  // Cleanup
  destroy() {
    if (this.observers.performance) {
      this.observers.performance.disconnect();
    }
    
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = [];
    });
  }
}
```

---

## 🧪 **9. TESTING Y DEPLOYMENT**

### **9.1 Testing Framework**

```javascript
// test-setup.js
import { expect } from '@esm-bundle/chai';
import { fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

// Global test utilities
window.testUtils = {
  mockData: {
    company: {
      id: 'coca-cola',
      name: 'Coca Cola',
      metrics: { healthScore: 85, revenue: 1000000 },
      districts: []
    },
    district: {
      id: 'market-district',
      name: 'Market District',
      type: 'market',
      pattern: 'cyclic',
      buildings: []
    },
    building: {
      id: 'consideration-building',
      name: 'Consideration',
      type: 'sales',
      pattern: 'pipeline',
      modules: []
    }
  },

  createMockElement: (tagName, attributes = {}) => {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  },

  waitForEvent: (element, eventName, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Event ${eventName} not fired within ${timeout}ms`));
      }, timeout);

      element.addEventListener(eventName, (event) => {
        clearTimeout(timer);
        resolve(event);
      }, { once: true });
    });
  },

  simulateUserInteraction: (element, action, data = {}) => {
    switch (action) {
      case 'click':
        element.click();
        break;
      case 'hover':
        element.dispatchEvent(new MouseEvent('mouseenter'));
        break;
      case 'input':
        element.value = data.value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        break;
    }
  }
};

// Component Testing
describe('EcosystemView Component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <ecosystem-view
        .companies=${JSON.stringify([window.testUtils.mockData.company])}
        view-mode="market">
      </ecosystem-view>
    `);
  });

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  it('should render canvas element', async () => {
    await element.updateComplete;
    
    const canvas = element.shadowRoot.querySelector('#canvas');
    expect(canvas).to.exist;
    expect(canvas.tagName.toLowerCase()).to.equal('canvas');
  });

  it('should display companies in hexagonal layout', async () => {
    await element.updateComplete;
    
    // Check if companies are rendered
    expect(element.companies).to.have.length(1);
    expect(element.companies[0].name).to.equal('Coca Cola');
  });

  it('should handle view mode changes', async () => {
    element.setAttribute('view-mode', 'performance');
    await element.updateComplete;

    expect(element.viewMode).to.equal('performance');
  });

  it('should emit zoom events on company click', async () => {
    const spy = sinon.spy();
    element.addEventListener('navigation:zoom-in', spy);

    // Simulate company click
    element.handleCompanyClick(window.testUtils.mockData.company);

    expect(spy).to.have.been.calledOnce;
    expect(spy.firstCall.args[0].detail.targetId).to.equal('coca-cola');
  });

  it('should handle canvas interactions', async () => {
    await element.updateComplete;
    
    const canvas = element.shadowRoot.querySelector('#canvas');
    const mouseEvent = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    
    const spy = sinon.spy(element, 'onCanvasClick');
    canvas.dispatchEvent(mouseEvent);
    
    expect(spy).to.have.been.calledOnce;
  });
});

describe('DistrictView Component', () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <district-view
        district-id="market-district"
        pattern-type="cyclic"
        .buildings=${JSON.stringify([window.testUtils.mockData.building])}>
      </district-view>
    `);
  });

  it('should render cyclic pattern correctly', async () => {
    await element.updateComplete;
    
    expect(element.patternType).to.equal('cyclic');
    
    const canvas = element.shadowRoot.querySelector('#canvas');
    expect(canvas).to.exist;
  });

  it('should handle entity animations', async () => {
    await element.updateComplete;
    
    // Start animation system
    element.startEntityAnimation();
    
    expect(element.animationSystem).to.exist;
    expect(element.animationSystem.animationId).to.exist;
  });

  it('should respond to pattern changes', async () => {
    element.setAttribute('pattern-type', 'linear');
    await element.updateComplete;
    
    expect(element.patternType).to.equal('linear');
  });
});

describe('ModuleView Component', () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <module-view
        module-id="demo-module"
        module-type="saas"
        perspective="business">
      </module-view>
    `);
  });

  it('should switch perspectives correctly', async () => {
    await element.updateComplete;
    
    const technicalTab = element.shadowRoot.querySelector('[data-perspective="technical"]');
    technicalTab.click();
    
    await element.updateComplete;
    
    expect(element.perspective).to.equal('technical');
    expect(technicalTab.classList.contains('active')).to.be.true;
  });

  it('should load and display elements', async () => {
    await element.updateComplete;
    
    // Verify elements are loaded
    expect(element.elements).to.be.an('array');
    expect(element.elements.length).to.be.greaterThan(0);
  });
});

// Integration Testing
describe('Navigation Flow', () => {
  let app;
  
  beforeEach(async () => {
    app = await fixture(html`<company-city-app></company-city-app>`);
  });

  it('should navigate from ecosystem to element level', async () => {
    // Start at ecosystem level
    expect(app.stateManager.state.currentLevel).to.equal('ecosystem');
    
    // Navigate to company
    app.stateManager.navigate({
      ecosystem: 'beverages',
      company: 'coca-cola'
    });
    
    await app.updateComplete;
    expect(app.stateManager.state.currentLevel).to.equal('company');
    
    // Navigate to district
    app.stateManager.navigate({
      ecosystem: 'beverages',
      company: 'coca-cola',
      district: 'market'
    });
    
    await app.updateComplete;
    expect(app.stateManager.state.currentLevel).to.equal('district');
  });

  it('should maintain breadcrumb navigation', async () => {
    // Navigate deep
    app.stateManager.navigate({
      ecosystem: 'beverages',
      company: 'coca-cola',
      district: 'market',
      building: 'consideration'
    });
    
    await app.updateComplete;
    
    const breadcrumbs = app.stateManager.state.breadcrumbs;
    expect(breadcrumbs).to.have.length(4);
    expect(breadcrumbs[3].level).to.equal('building');
    expect(breadcrumbs[3].name).to.equal('consideration');
  });

  it('should handle entity tracking', async () => {
    const mockEntity = {
      id: 'lead-12345',
      type: 'lead',
      name: 'Test Lead',
      currentLocation: 'awareness'
    };
    
    app.stateManager.trackEntity(mockEntity);
    
    expect(app.stateManager.state.trackedEntity).to.equal(mockEntity);
  });
});

// Performance Testing
describe('Performance Tests', () => {
  let performanceMonitor;
  
  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
  });

  afterEach(() => {
    performanceMonitor.destroy();
  });

  it('should render 1000+ entities within frame budget', async () => {
    const startTime = performance.now();
    
    // Create large dataset
    const companies = Array.from({ length: 1000 }, (_, i) => ({
      id: `company-${i}`,
      name: `Company ${i}`,
      metrics: { healthScore: Math.random() * 100 }
    }));

    const element = await fixture(html`
      <ecosystem-view .companies=${JSON.stringify(companies)}></ecosystem-view>
    `);

    await element.updateComplete;

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).to.be.lessThan(100); // Less than 100ms for initial render
    
    document.body.removeChild(element);
  });

  it('should maintain 60fps during animations', async () => {
    const element = await fixture(html`
      <district-view 
        pattern-type="cyclic"
        .entities=${JSON.stringify(Array.from({ length: 100 }, (_, i) => ({
          id: `entity-${i}`,
          type: 'lead',
          x: Math.random() * 800,
          y: Math.random() * 600
        })))}>
      </district-view>
    `);

    await element.updateComplete;
    
    // Start animation and measure FPS
    const measurement = performanceMonitor.startMeasurement('animation-test');
    element.startEntityAnimation();
    
    // Let animation run for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const duration = measurement.end();
    const expectedFrames = Math.floor(2000 / 16); // ~60fps for 2 seconds
    
    expect(duration).to.be.lessThan(2100); // Allow some overhead
  });

  it('should handle memory efficiently', async () => {
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    // Create and destroy many components
    const elements = [];
    for (let i = 0; i < 100; i++) {
      const element = await fixture(html`
        <module-view module-id="test-${i}"></module-view>
      `);
      elements.push(element);
    }
    
    // Clean up
    elements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 50MB)
    expect(memoryIncrease).to.be.lessThan(50 * 1024 * 1024);
  });
});

// State Management Testing
describe('State Manager', () => {
  let stateManager;
  
  beforeEach(() => {
    stateManager = new CompanyCityStateManager();
  });

  afterEach(() => {
    stateManager.destroy();
  });

  it('should handle state changes correctly', () => {
    const spy = sinon.spy();
    stateManager.subscribe(spy);
    
    stateManager.state.currentLevel = 'company';
    
    expect(spy).to.have.been.calledOnce;
    expect(spy.firstCall.args[0].key).to.equal('currentLevel');
    expect(spy.firstCall.args[0].newValue).to.equal('company');
  });

  it('should validate state changes', () => {
    expect(() => {
      stateManager.state.currentLevel = 'invalid-level';
    }).to.not.throw();
    
    // Invalid level should be rejected by validator
    expect(stateManager.state.currentLevel).to.not.equal('invalid-level');
  });

  it('should maintain state history', () => {
    stateManager.state.currentLevel = 'company';
    stateManager.state.currentLevel = 'district';
    
    expect(stateManager.stateHistory).to.have.length(2);
    expect(stateManager.stateHistory[0].newValue).to.equal('company');
    expect(stateManager.stateHistory[1].newValue).to.equal('district');
  });

  it('should handle navigation correctly', () => {
    const targetPath = {
      ecosystem: 'beverages',
      company: 'coca-cola',
      district: 'market'
    };
    
    stateManager.navigate(targetPath);
    
    expect(stateManager.state.currentPath).to.deep.equal(targetPath);
    expect(stateManager.state.currentLevel).to.equal('district');
    expect(stateManager.state.breadcrumbs).to.have.length(3);
  });
});

// Security Testing
describe('Security Manager', () => {
  let securityManager;
  
  beforeEach(() => {
    securityManager = new SecurityManager();
  });

  afterEach(() => {
    securityManager.destroy();
  });

  it('should sanitize HTML input correctly', () => {
    const maliciousInput = '<script>alert("xss")</script>Hello';
    const sanitized = securityManager.sanitizeInput(maliciousInput, 'html');
    
    expect(sanitized).to.not.include('<script>');
    expect(sanitized).to.include('Hello');
  });

  it('should validate and sanitize URLs', () => {
    const validUrl = 'https://example.com/path';
    const invalidUrl = 'javascript:alert("xss")';
    
    expect(() => {
      securityManager.sanitizeInput(validUrl, 'url');
    }).to.not.throw();
    
    expect(() => {
      securityManager.sanitizeInput(invalidUrl, 'url');
    }).to.throw();
  });

  it('should enforce rate limiting', () => {
    const endpoint = '/test-endpoint';
    
    // Should allow initial requests
    expect(() => {
      securityManager.checkRateLimit(endpoint, 'user1', 5, 1000);
    }).to.not.throw();
    
    // Should block after limit
    for (let i = 0; i < 5; i++) {
      securityManager.checkRateLimit(endpoint, 'user1', 5, 1000);
    }
    
    expect(() => {
      securityManager.checkRateLimit(endpoint, 'user1', 5, 1000);
    }).to.throw();
  });
});
```

### **9.2 E2E Testing**

```javascript
// e2e-tests.js
import { test, expect } from '@playwright/test';

test.describe('CompanyCity E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('complete user journey through all levels', async ({ page }) => {
    // Start at ecosystem level
    await expect(page.locator('ecosystem-view')).toBeVisible();
    
    // Verify ecosystem view loads correctly
    const canvas = page.locator('ecosystem-view canvas');
    await expect(canvas).toBeVisible();
    
    // Click on CocaCola company
    await page.click('[data-company-id="coca-cola"]');
    
    // Should navigate to company level
    await expect(page.locator('company-view')).toBeVisible();
    await expect(page.locator('[data-testid="breadcrumb"]')).toContainText('CocaCola');
    
    // Verify district cards are displayed
    const districtCards = page.locator('district-card');
    await expect(districtCards).toHaveCount(6);
    
    // Click on Market district
    await page.click('[data-district-id="market"]');
    
    // Should navigate to district level with cyclic pattern
    await expect(page.locator('district-view')).toBeVisible();
    await expect(page.locator('[data-pattern="cyclic"]')).toBeVisible();
    
    // Verify buildings are rendered in cyclic pattern
    const buildingElements = page.locator('.building-hexagon');
    await expect(buildingElements).toHaveCount(6);
    
    // Click on Consideration building
    await page.click('[data-building-id="consideration"]');
    
    // Should navigate to building level with pipeline pattern
    await expect(page.locator('building-view')).toBeVisible();
    await expect(page.locator('[data-pattern="pipeline"]')).toBeVisible();
    
    // Verify modules are displayed
    const moduleCards = page.locator('module-card');
    await expect(moduleCards).toHaveCount(4);
    
    // Click on Demo/Presentation module
    await page.click('[data-module-id="demo-presentation"]');
    
    // Should navigate to module level
    await expect(page.locator('module-view')).toBeVisible();
    
    // Verify perspective tabs
    const perspectiveTabs = page.locator('.perspective-tab');
    await expect(perspectiveTabs).toHaveCount(3);
    
    // Switch to technical perspective
    await page.click('[data-perspective="technical"]');
    await expect(page.locator('[data-perspective="technical"].active')).toBeVisible();
    
    // Click on Demo Environments element
    await page.click('[data-element-id="demo-environments"]');
    
    // Should navigate to element level
    await expect(page.locator('element-view')).toBeVisible();
    
    // Verify instances are listed
    const instances = page.locator('.instance-item');
    await expect(instances.first()).toBeVisible();
    
    // Click on first instance
    await instances.first().click();
    
    // Should show instance details
    await expect(page.locator('.instance-detail')).toBeVisible();
    await expect(page.locator('.detail-title')).toContainText('Enterprise Demo v2.1');
  });

  test('breadcrumb navigation works correctly', async ({ page }) => {
    // Navigate deep into the hierarchy
    await page.click('[data-company-id="coca-cola"]');
    await page.click('[data-district-id="market"]');
    await page.click('[data-building-id="consideration"]');
    await page.click('[data-module-id="demo-presentation"]');
    
    // Check breadcrumb is complete
    const breadcrumb = page.locator('[data-testid="breadcrumb"]');
    await expect(breadcrumb).toContainText('Ecosystem');
    await expect(breadcrumb).toContainText('CocaCola');
    await expect(breadcrumb).toContainText('Market');
    await expect(breadcrumb).toContainText('Consideration');
    await expect(breadcrumb).toContainText('Demo/Presentation');
    
    // Click on Market in breadcrumb to navigate back
    await breadcrumb.locator('text=Market').click();
    
    // Should navigate back to district level
    await expect(page.locator('district-view')).toBeVisible();
    await expect(page.locator('[data-pattern="cyclic"]')).toBeVisible();
    
    // Click on CocaCola in breadcrumb
    await breadcrumb.locator('text=CocaCola').click();
    
    // Should navigate back to company level
    await expect(page.locator('company-view')).toBeVisible();
  });

  test('entity tracking functionality', async ({ page }) => {
    // Navigate to district level where entities are visible
    await page.click('[data-company-id="coca-cola"]');
    await page.click('[data-district-id="market"]');
    
    // Wait for entities to be rendered
    await page.waitForSelector('[data-entity-type="lead"]');
    
    // Click on a lead entity to start tracking
    await page.click('[data-entity-id="lead-12345"]');
    
    // Should show entity tracking panel
    await expect(page.locator('[data-testid="entity-tracker"]')).toBeVisible();
    await expect(page.locator('[data-testid="entity-name"]')).toContainText('Lead #12345');
    
    // Verify journey timeline is shown
    const journeySteps = page.locator('.journey-step');
    await expect(journeySteps.first()).toBeVisible();
    
    // Click on a journey step to navigate
    await journeySteps.first().click();
    
    // Should navigate to the location of that step
    // Implementation would depend on specific journey step data
  });

  test('search functionality works across levels', async ({ page }) => {
    // Open search
    const searchInput = page.locator('[placeholder*="Search"]');
    await searchInput.fill('demo');
    
    // Should show search results
    await expect(page.locator('.search-results')).toBeVisible();
    
    // Verify search results contain relevant items
    const searchItems = page.locator('.search-result');
    await expect(searchItems).toHaveCountGreaterThan(0);
    
    // Click on a search result
    await searchItems.first().click();
    
    // Should navigate to the selected result
    // The exact navigation would depend on the search result clicked
  });

  test('real-time updates work correctly', async ({ page }) => {
    // Navigate to a level where real-time updates are visible
    await page.click('[data-company-id="coca-cola"]');
    await page.click('[data-district-id="market"]');
    
    // Mock WebSocket connection and send update
    await page.evaluate(() => {
      // Simulate real-time entity update
      const mockEvent = new CustomEvent('entity:update', {
        detail: {
          entityId: 'lead-123',
          updates: { status: 'converted', priority: 'high' }
        }
      });
      document.dispatchEvent(mockEvent);
    });
    
    // Verify visual update occurred
    await expect(page.locator('[data-entity-id="lead-123"].status-converted')).toBeVisible();
  });

  test('performance remains good with large datasets', async ({ page }) => {
    // Navigate to ecosystem with many companies
    await page.goto('/?dataset=large');
    
    // Measure load time
    const startTime = Date.now();
    await page.waitForSelector('ecosystem-view canvas');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000); // 5 seconds
    
    // Check FPS during interaction
    await page.click('[data-company-id="coca-cola"]');
    
    // Measure navigation performance
    const navStart = Date.now();
    await page.waitForSelector('company-view');
    const navTime = Date.now() - navStart;
    
    expect(navTime).toBeLessThan(1000); // 1 second
  });

  test('responsive design works on different screen sizes', async ({ page }) => {
    // Test on mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still be functional
    await expect(page.locator('ecosystem-view')).toBeVisible();
    
    // Test navigation still works
    await page.click('[data-company-id="coca-cola"]');
    await expect(page.locator('company-view')).toBeVisible();
    
    // Test on tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Should adapt layout
    await expect(page.locator('company-view')).toBeVisible();
    
    // Test on desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Should use full desktop layout
    await expect(page.locator('company-view')).toBeVisible();
  });

  test('error handling works correctly', async ({ page }) => {
    // Mock API error
    await page.route('/api/v1/companies/*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // Try to navigate to company
    await page.click('[data-company-id="coca-cola"]');
    
    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Failed to load company data');
    
    // Should provide retry option
    await expect(page.locator('.retry-button')).toBeVisible();
  });

  test('accessibility features work correctly', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCountGreaterThan(0);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    
    // Test screen reader support
    const landmarks = page.locator('[role="main"], [role="navigation"], [role="banner"]');
    await expect(landmarks).toHaveCountGreaterThan(0);
  });
});

test.describe('Integration Tests', () => {
  test('data flows correctly between levels', async ({ page }) => {
    await page.goto('/');
    
    // Start tracking an entity at ecosystem level
    await page.evaluate(() => {
      window.testEntity = {
        id: 'test-lead-001',
        type: 'lead',
        path: ['ecosystem', 'coca-cola', 'market', 'awareness']
      };
    });
    
    // Navigate to company level
    await page.click('[data-company-id="coca-cola"]');
    
    // Entity should still be tracked
    const trackedEntity = await page.evaluate(() => window.testEntity);
    expect(trackedEntity.id).toBe('test-lead-001');
    
    // Navigate to district level
    await page.click('[data-district-id="market"]');
    
    // Entity should be visible in the district
    await expect(page.locator('[data-entity-id="test-lead-001"]')).toBeVisible();
  });

  test('configuration changes propagate correctly', async ({ page }) => {
    // Navigate to module level
    await page.click('[data-company-id="coca-cola"]');
    await page.click('[data-district-id="market"]');
    await page.click('[data-building-id="consideration"]');
    await page.click('[data-module-id="demo-presentation"]');
    
    // Navigate to element level
    await page.click('[data-element-id="demo-environments"]');
    
    // Select an instance
    await page.click('.instance-item[data-instance-id="enterprise-demo-v21"]');
    
    // Change a configuration value
    await page.fill('[data-config-key="performance"]', 'high');
    
    // Should trigger validation and update
    await expect(page.locator('.config-validation.success')).toBeVisible();
    
    // Navigate back to module level
    await page.click('[data-testid="breadcrumb"] text=Demo/Presentation');
    
    // Configuration change should be reflected
    await expect(page.locator('.module-status.updated')).toBeVisible();
  });
});
```

### **9.3 Build and Deployment Configuration**

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        worker: resolve(__dirname, 'src/workers/entity-animation-worker.js')
      },
      output: {
        manualChunks: {
          vendor: ['lit'],
          utils: ['src/utils'],
          components: ['src/components'],
          workers: ['src/workers']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  
  worker: {
    format: 'es',
    plugins: []
  },
  
  optimizeDeps: {
    exclude: ['lit', '@lit/reactive-element'],
    include: ['@esm-bundle/chai']
  },
  
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  },
  
  preview: {
    port: 4173,
    host: '0.0.0.0'
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.js']
  }
});
```

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy security headers configuration
COPY security-headers.conf /etc/nginx/conf.d/security-headers.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    types_hash_max_size 2048;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=1r/s;

    server {
        listen       80;
        server_name  localhost;

        root   /usr/share/nginx/html;
        index  index.html index.htm;

        # Security headers
        include /etc/nginx/conf.d/security-headers.conf;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header X-Content-Type-Options nosniff;
        }

        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support
        location /ws/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # SPA fallback
        location / {
            try_files $uri $uri/ /index.html;
            
            # Rate limiting for general requests
            limit_req zone=general burst=10 nodelay;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Security.txt
        location /.well-known/security.txt {
            return 200 "Contact: security@companycity.com\nExpires: 2025-12-31T23:59:59.000Z\n";
            add_header Content-Type text/plain;
        }

        # Deny access to sensitive files
        location ~ /\. {
            deny all;
        }

        # Custom error pages
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }

    # Backend upstream
    upstream backend {
        server backend:8080;
        keepalive 32;
    }
}
```

```nginx
# security-headers.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' blob:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' ws: wss:; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### **9.4 CI/CD Pipeline**

```yaml
# .github/workflows/ci-cd.yml
name: CompanyCity CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: test-results
        path: test-results/
    
    - name: Run security scan
      run: npm audit --audit-level high
    
    - name: Run performance tests
      run: npm run test:performance

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Run build tests
      run: npm run test:build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-artifacts
        path: dist/
    
    - name: Log in to Container Registry
      if: github.event_name != 'pull_request'
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      if: github.event_name != 'pull_request'
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=sha
    
    - name: Build and push Docker image
      if: github.event_name != 'pull_request'
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  security:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Run CodeQL analysis
      uses: github/codeql-action/analyze@v3

  deploy-staging:
    needs: [build, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # Implementation would include actual deployment steps
    
    - name: Run smoke tests
      run: |
        echo "Running smoke tests against staging"
        # Implementation would include smoke test execution

  deploy-production:
    needs: [build, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production environment"
        # Implementation would include actual deployment steps
    
    - name: Run post-deployment tests
      run: |
        echo "Running post-deployment verification"
        # Implementation would include production verification tests
    
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📊 **10. MÉTRICAS Y MONITORING**

### **10.1 Business Metrics Collector**

```javascript
class BusinessMetricsCollector {
  constructor() {
    this.metrics = new Map();
    this.collectors = new Map();
    this.aggregators = new Map();
    this.scheduledJobs = new Map();
    
    this.setupCollectors();
    this.startPeriodicCollection();
  }

  setupCollectors() {
    // Register collectors for different entity types and levels
    this.registerCollector('ecosystem', 'company', new CompanyMetricsCollector());
    this.registerCollector('company', 'district', new DistrictMetricsCollector());
    this.registerCollector('district', 'building', new BuildingMetricsCollector());
    this.registerCollector('building', 'module', new ModuleMetricsCollector());
    this.registerCollector('module', 'element', new ElementMetricsCollector());
    
    // Register aggregators
    this.registerAggregator('flow', new FlowMetricsAggregator());
    this.registerAggregator('performance', new PerformanceMetricsAggregator());
    this.registerAggregator('business', new BusinessMetricsAggregator());
  }

  registerCollector(level, entityType, collector) {
    const key = `${level}:${entityType}`;
    this.collectors.set(key, collector);
  }

  registerAggregator(type, aggregator) {
    this.aggregators.set(type, aggregator);
  }

  startPeriodicCollection() {
    // Collect metrics at different intervals based on type
    this.scheduleCollection('real-time', 5000, ['performance', 'flow']);
    this.scheduleCollection('frequent', 30000, ['operational', 'capacity']);
    this.scheduleCollection('regular', 300000, ['business', 'financial']);
    this.scheduleCollection('daily', 86400000, ['strategic', 'trends']);
  }

  scheduleCollection(schedule, interval, metricTypes) {
    const jobId = setInterval(async () => {
      await this.collectMetricsByTypes(metricTypes);
    }, interval);
    
    this.scheduledJobs.set(schedule, jobId);
  }

  async collectMetricsByTypes(metricTypes) {
    for (const type of metricTypes) {
      try {
        await this.collectMetricsOfType(type);
      } catch (error) {
        console.error(`Failed to collect ${type} metrics:`, error);
      }
    }
  }

  async collectMetricsOfType(type) {
    const relevantCollectors = this.getCollectorsForType(type);
    
    for (const [key, collector] of relevantCollectors) {
      const metrics = await collector.collect(type);
      this.storeMetrics(key, type, metrics);
    }
  }

  getCollectorsForType(type) {
    return new Map([...this.collectors.entries()].filter(([key, collector]) => 
      collector.supportsType(type)
    ));
  }

  storeMetrics(collectorKey, type, metrics) {
    const key = `${collectorKey}:${type}`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metricHistory = this.metrics.get(key);
    metricHistory.push({
      timestamp: Date.now(),
      data: metrics
    });
    
    // Keep only last 1000 entries
    if (metricHistory.length > 1000) {
      metricHistory.shift();
    }
  }

  // Ecosystem level metrics
  async collectEcosystemMetrics(companies) {
    const metrics = {
      totalCompanies: companies.length,
      totalRevenue: companies.reduce((sum, c) => sum + (c.metrics.revenue || 0), 0),
      averageHealthScore: this.calculateAverageHealth(companies),
      marketConcentration: this.calculateMarketConcentration(companies),
      growthTrends: this.calculateGrowthTrends(companies),
      competitivePositioning: this.analyzeCompetitivePositioning(companies),
      marketSegmentation: this.analyzeMarketSegmentation(companies)
    };
    
    return metrics;
  }

  calculateAverageHealth(companies) {
    if (companies.length === 0) return 0;
    
    const totalHealth = companies.reduce((sum, c) => sum + (c.metrics.healthScore || 0), 0);
    return totalHealth / companies.length;
  }

  calculateMarketConcentration(companies) {
    if (companies.length === 0) return 0;
    
    const revenues = companies.map(c => c.metrics.revenue || 0).sort((a, b) => b - a);
    const totalRevenue = revenues.reduce((sum, r) => sum + r, 0);
    
    if (totalRevenue === 0) return 0;
    
    // Calculate Herfindahl-Hirschman Index
    const hhi = revenues.reduce((sum, revenue) => {
      const marketShare = revenue / totalRevenue;
      return sum + (marketShare * marketShare);
    }, 0);
    
    return hhi * 10000; // Convert to standard HHI scale
  }

  calculateGrowthTrends(companies) {
    return companies.map(company => ({
      companyId: company.id,
      growthRate: company.metrics.growthRate || 0,
      trend: this.determineTrend(company.metrics.growthRate),
      projection: this.projectGrowth(company.metrics)
    }));
  }

  determineTrend(growthRate) {
    if (growthRate > 0.1) return 'accelerating';
    if (growthRate > 0.05) return 'growing';
    if (growthRate > -0.05) return 'stable';
    return 'declining';
  }

  projectGrowth(metrics) {
    // Simple linear projection - in reality would use more sophisticated models
    const currentGrowth = metrics.growthRate || 0;
    const volatility = 0.1; // Assume 10% volatility
    
    return {
      nextQuarter: currentGrowth,
      nextYear: currentGrowth * (1 + Math.random() * volatility - volatility/2),
      confidence: this.calculateConfidence(metrics)
    };
  }

  calculateConfidence(metrics) {
    // Calculate confidence based on data quality and historical consistency
    let confidence = 0.5; // Base confidence
    
    if (metrics.revenue && metrics.revenue > 0) confidence += 0.1;
    if (metrics.employees && metrics.employees > 0) confidence += 0.1;
    if (metrics.marketShare && metrics.marketShare > 0) confidence += 0.1;
    if (metrics.healthScore && metrics.healthScore > 50) confidence += 0.2;
    
    return Math.min(confidence, 1.0);
  }

  // District level metrics
  async collectDistrictMetrics(district) {
    const metrics = {
      throughput: await this.calculateThroughput(district.entities),
      cycleTime: await this.calculateAverageCycleTime(district.entities),
      conversionRate: await this.calculateConversionRate(district),
      bottlenecks: await this.identifyBottlenecks(district.buildings),
      entityFlow: await this.analyzeEntityFlow(district.entities),
      efficiency: await this.calculateEfficiency(district),
      capacity: await this.calculateCapacity(district),
      sla: await this.calculateSLA(district)
    };
    
    return metrics;
  }

  async calculateThroughput(entities, timeWindow = 3600000) { // 1 hour
    const now = Date.now();
    const windowStart = now - timeWindow;
    
    const recentEntities = entities.filter(entity => 
      entity.lastUpdated && entity.lastUpdated >= windowStart
    );
    
    const throughputPerHour = recentEntities.length / (timeWindow / 3600000);
    
    return {
      current: throughputPerHour,
      trend: await this.calculateThroughputTrend(entities),
      peak: await this.calculatePeakThroughput(entities),
      efficiency: throughputPerHour / Math.max(entities.length, 1)
    };
  }

  async calculateAverageCycleTime(entities) {
    const completedEntities = entities.filter(entity => 
      entity.completedAt && entity.startedAt
    );
    
    if (completedEntities.length === 0) return { average: 0, median: 0, p95: 0 };
    
    const cycleTimes = completedEntities.map(entity => 
      entity.completedAt - entity.startedAt
    );
    
    cycleTimes.sort((a, b) => a - b);
    
    return {
      average: cycleTimes.reduce((sum, time) => sum + time, 0) / cycleTimes.length,
      median: cycleTimes[Math.floor(cycleTimes.length / 2)],
      p95: cycleTimes[Math.floor(cycleTimes.length * 0.95)],
      count: cycleTimes.length
    };
  }

  async calculateConversionRate(district) {
    const conversionEvents = await this.getConversionEvents(district);
    
    const conversions = conversionEvents.reduce((acc, event) => {
      const stage = event.stage;
      if (!acc[stage]) {
        acc[stage] = { total: 0, converted: 0 };
      }
      
      acc[stage].total++;
      if (event.converted) {
        acc[stage].converted++;
      }
      
      return acc;
    }, {});
    
    const conversionRates = {};
    Object.keys(conversions).forEach(stage => {
      const data = conversions[stage];
      conversionRates[stage] = {
        rate: data.total > 0 ? data.converted / data.total : 0,
        total: data.total,
        converted: data.converted
      };
    });
    
    return conversionRates;
  }

  async identifyBottlenecks(buildings) {
    const bottleneckAnalysis = await Promise.all(
      buildings.map(async building => {
        const metrics = await this.analyzeBuildingPerformance(building);
        
        return {
          buildingId: building.id,
          name: building.name,
          utilizationRate: metrics.currentLoad / metrics.capacity,
          averageWaitTime: metrics.averageWaitTime,
          throughput: metrics.throughput,
          bottleneckScore: this.calculateBottleneckScore(metrics),
          recommendations: this.generateBottleneckRecommendations(metrics)
        };
      })
    );
    
    return bottleneckAnalysis
      .filter(analysis => analysis.bottleneckScore > 0.7)
      .sort((a, b) => b.bottleneckScore - a.bottleneckScore);
  }

  calculateBottleneckScore(metrics) {
    let score = 0;
    
    // High utilization
    if (metrics.currentLoad / metrics.capacity > 0.8) score += 0.3;
    
    // High wait times
    if (metrics.averageWaitTime > metrics.expectedWaitTime * 2) score += 0.3;
    
    // Low throughput
    if (metrics.throughput < metrics.expectedThroughput * 0.7) score += 0.2;
    
    // Error rate
    if (metrics.errorRate > 0.05) score += 0.2;
    
    return score;
  }

  generateBottleneckRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.currentLoad / metrics.capacity > 0.9) {
      recommendations.push({
        type: 'capacity',
        priority: 'high',
        action: 'Increase capacity or add parallel processing',
        impact: 'high'
      });
    }
    
    if (metrics.averageWaitTime > metrics.expectedWaitTime * 3) {
      recommendations.push({
        type: 'flow',
        priority: 'medium',
        action: 'Optimize processing workflow',
        impact: 'medium'
      });
    }
    
    if (metrics.errorRate > 0.1) {
      recommendations.push({
        type: 'quality',
        priority: 'high',
        action: 'Address error sources',
        impact: 'high'
      });
    }
    
    return recommendations;
  }

  // Entity journey analytics
  async analyzeEntityJourney(entityId) {
    const journey = await this.getEntityJourney(entityId);
    
    if (!journey || journey.stages.length === 0) {
      return null;
    }
    
    const analysis = {
      entityId,
      totalDuration: journey.endTime - journey.startTime,
      stagesCompleted: journey.stages.length,
      conversionPoints: journey.stages.filter(s => s.converted).length,
      averageStageTime: 0,
      longestStage: null,
      bottleneckStages: [],
      efficiency: 0,
      recommendations: []
    };
    
    // Calculate stage analytics
    const stageDurations = journey.stages.map(stage => ({
      ...stage,
      duration: stage.endTime - stage.startTime,
      efficiency: stage.expectedDuration ? 
        stage.expectedDuration / (stage.endTime - stage.startTime) : 1
    }));
    
    analysis.averageStageTime = stageDurations.reduce(
      (sum, stage) => sum + stage.duration, 0
    ) / stageDurations.length;
    
    analysis.longestStage = stageDurations.reduce(
      (longest, stage) => stage.duration > longest.duration ? stage : longest
    );
    
    analysis.bottleneckStages = stageDurations.filter(
      stage => stage.duration > stage.expectedDuration * 1.5
    );
    
    analysis.efficiency = stageDurations.reduce(
      (sum, stage) => sum + stage.efficiency, 0
    ) / stageDurations.length;
    
    // Generate recommendations
    analysis.recommendations = this.generateJourneyRecommendations(analysis);
    
    return analysis;
  }

  generateJourneyRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.efficiency < 0.7) {
      recommendations.push({
        type: 'efficiency',
        message: 'Journey efficiency is below optimal',
        actions: ['Review bottleneck stages', 'Optimize longest stage', 'Parallel processing']
      });
    }
    
    if (analysis.bottleneckStages.length > 0) {
      recommendations.push({
        type: 'bottleneck',
        message: `${analysis.bottleneckStages.length} bottleneck stages identified`,
        actions: analysis.bottleneckStages.map(stage => 
          `Optimize ${stage.name} (${Math.round(stage.duration)}ms vs expected ${Math.round(stage.expectedDuration)}ms)`
        )
      });
    }
    
    if (analysis.conversionPoints / analysis.stagesCompleted < 0.5) {
      recommendations.push({
        type: 'conversion',
        message: 'Low conversion rate through journey',
        actions: ['Review conversion triggers', 'Improve stage outcomes', 'Add validation steps']
      });
    }
    
    return recommendations;
  }

  // Real-time metrics aggregation
  getMetricsSnapshot(level, entityId, timeRange = 3600000) {
    const now = Date.now();
    const since = now - timeRange;
    
    const relevantMetrics = [];
    
    for (const [key, metricHistory] of this.metrics.entries()) {
      if (key.includes(level) && key.includes(entityId)) {
        const recentMetrics = metricHistory.filter(
          metric => metric.timestamp >= since
        );
        relevantMetrics.push(...recentMetrics);
      }
    }
    
    return this.aggregateMetrics(relevantMetrics);
  }

  aggregateMetrics(metrics) {
    if (metrics.length === 0) return null;
    
    const aggregated = {
      count: metrics.length,
      timeRange: {
        start: Math.min(...metrics.map(m => m.timestamp)),
        end: Math.max(...metrics.map(m => m.timestamp))
      },
      performance: this.aggregatePerformanceMetrics(metrics),
      business: this.aggregateBusinessMetrics(metrics),
      operational: this.aggregateOperationalMetrics(metrics)
    };
    
    return aggregated;
  }

  aggregatePerformanceMetrics(metrics) {
    const performanceMetrics = metrics
      .filter(m => m.data.performance)
      .map(m => m.data.performance);
    
    if (performanceMetrics.length === 0) return null;
    
    return {
      throughput: {
        avg: this.average(performanceMetrics.map(p => p.throughput)),
        min: Math.min(...performanceMetrics.map(p => p.throughput)),
        max: Math.max(...performanceMetrics.map(p => p.throughput))
      },
      latency: {
        avg: this.average(performanceMetrics.map(p => p.latency)),
        p95: this.percentile(performanceMetrics.map(p => p.latency), 0.95),
        p99: this.percentile(performanceMetrics.map(p => p.latency), 0.99)
      },
      errorRate: {
        avg: this.average(performanceMetrics.map(p => p.errorRate)),
        trend: this.calculateTrend(performanceMetrics.map(p => p.errorRate))
      }
    };
  }

  // Utility methods
  average(values) {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  percentile(values, p) {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.floor(sorted.length * p);
    return sorted[index] || 0;
  }

  calculateTrend(values) {
    if (values.length < 2) return 'stable';
    
    const first = values.slice(0, Math.floor(values.length / 2));
    const second = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = this.average(first);
    const secondAvg = this.average(second);
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  // Cleanup
  destroy() {
    this.scheduledJobs.forEach(jobId => clearInterval(jobId));
    this.scheduledJobs.clear();
    this.metrics.clear();
    this.collectors.clear();
    this.aggregators.clear();
  }
}

// Specialized collectors
class CompanyMetricsCollector {
  supportsType(type) {
    return ['business', 'strategic', 'financial'].includes(type);
  }

  async collect(type) {
    switch (type) {
      case 'business':
        return await this.collectBusinessMetrics();
      case 'strategic':
        return await this.collectStrategicMetrics();
      case 'financial':
        return await this.collectFinancialMetrics();
      default:
        return {};
    }
  }

  async collectBusinessMetrics() {
    return {
      customerAcquisition: await this.getCustomerAcquisitionMetrics(),
      retention: await this.getRetentionMetrics(),
      satisfaction: await this.getSatisfactionMetrics(),
      marketPosition: await this.getMarketPositionMetrics()
    };
  }
}

class DistrictMetricsCollector {
  supportsType(type) {
    return ['operational', 'flow', 'capacity'].includes(type);
  }

  async collect(type) {
    switch (type) {
      case 'operational':
        return await this.collectOperationalMetrics();
      case 'flow':
        return await this.collectFlowMetrics();
      case 'capacity':
        return await this.collectCapacityMetrics();
      default:
        return {};
    }
  }
}

class ModuleMetricsCollector {
  supportsType(type) {
    return ['performance', 'integration', 'configuration'].includes(type);
  }

  async collect(type) {
    switch (type) {
      case 'performance':
        return await this.collectPerformanceMetrics();
      case 'integration':
        return await this.collectIntegrationMetrics();
      case 'configuration':
        return await this.collectConfigurationMetrics();
      default:
        return {};
    }
  }
}
```

### **10.2 Monitoring Dashboard**

```javascript
class MonitoringDashboard {
  constructor() {
    this.metricsCollector = new BusinessMetricsCollector();
    this.performanceMonitor = new PerformanceMonitor();
    this.alertManager = new AlertManager();
    this.dashboards = new Map();
    
    this.setupDashboards();
    this.startMonitoring();
  }

  setupDashboards() {
    this.dashboards.set('overview', new OverviewDashboard());
    this.dashboards.set('performance', new PerformanceDashboard());
    this.dashboards.set('business', new BusinessDashboard());
    this.dashboards.set('technical', new TechnicalDashboard());
    this.dashboards.set('security', new SecurityDashboard());
  }

  startMonitoring() {
    // Update dashboards every 5 seconds
    setInterval(() => {
      this.updateAllDashboards();
    }, 5000);
    
    // Generate reports every hour
    setInterval(() => {
      this.generateHourlyReport();
    }, 3600000);
    
    // Check alerts every 30 seconds
    setInterval(() => {
      this.checkAlerts();
    }, 30000);
  }

  async updateAllDashboards() {
    for (const [name, dashboard] of this.dashboards.entries()) {
      try {
        await dashboard.update();
      } catch (error) {
        console.error(`Failed to update ${name} dashboard:`, error);
      }
    }
  }

  async generateHourlyReport() {
    const report = {
      timestamp: Date.now(),
      period: 'hourly',
      performance: await this.performanceMonitor.getPerformanceReport(),
      business: await this.metricsCollector.getMetricsSnapshot('company', 'all'),
      alerts: this.alertManager.getActiveAlerts(),
      recommendations: await this.generateRecommendations()
    };
    
    // Send report to monitoring service
    await this.sendReport(report);
    
    return report;
  }

  async checkAlerts() {
    const currentMetrics = await this.getCurrentMetrics();
    await this.alertManager.checkAlerts(currentMetrics);
  }

  async getCurrentMetrics() {
    return {
      performance: this.performanceMonitor.getMetrics(),
      business: this.metricsCollector.getMetricsSnapshot('ecosystem', 'all', 300000), // 5 minutes
      system: await this.getSystemMetrics()
    };
  }

  async getSystemMetrics() {
    return {
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null,
      timing: performance.timing ? {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      } : null,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }

  async generateRecommendations() {
    const recommendations = [];
    
    // Performance recommendations
    const perfReport = this.performanceMonitor.getPerformanceReport();
    recommendations.push(...perfReport.recommendations);
    
    // Business recommendations
    const businessMetrics = await this.metricsCollector.getMetricsSnapshot('ecosystem', 'all');
    if (businessMetrics) {
      recommendations.push(...this.generateBusinessRecommendations(businessMetrics));
    }
    
    return recommendations;
  }

  generateBusinessRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.business && metrics.business.conversionRate < 0.1) {
      recommendations.push({
        type: 'business',
        priority: 'high',
        message: 'Low conversion rate detected',
        actions: ['Review customer journey', 'Optimize conversion funnels', 'A/B test improvements']
      });
    }
    
    return recommendations;
  }

  async sendReport(report) {
    try {
      await fetch('/api/v1/monitoring/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
    } catch (error) {
      console.error('Failed to send monitoring report:', error);
    }
  }

  getDashboard(name) {
    return this.dashboards.get(name);
  }

  destroy() {
    this.metricsCollector.destroy();
    this.performanceMonitor.destroy();
    this.alertManager.destroy();
    
    this.dashboards.forEach(dashboard => dashboard.destroy());
    this.dashboards.clear();
  }
}

class AlertManager {
  constructor() {
    this.alerts = new Map();
    this.thresholds = new Map();
    this.handlers = new Map();
    
    this.setupDefaultThresholds();
    this.setupDefaultHandlers();
  }

  setupDefaultThresholds() {
    this.thresholds.set('performance.fps', { min: 55, severity: 'medium' });
    this.thresholds.set('performance.memory', { max: 200 * 1024 * 1024, severity: 'high' });
    this.thresholds.set('performance.renderTime', { max: 16, severity: 'high' });
    this.thresholds.set('business.conversionRate', { min: 0.05, severity: 'medium' });
    this.thresholds.set('system.errorRate', { max: 0.01, severity: 'high' });
  }

  setupDefaultHandlers() {
    this.handlers.set('high', this.handleHighSeverityAlert.bind(this));
    this.handlers.set('medium', this.handleMediumSeverityAlert.bind(this));
    this.handlers.set('low', this.handleLowSeverityAlert.bind(this));
  }

  async checkAlerts(metrics) {
    for (const [metricPath, threshold] of this.thresholds.entries()) {
      const value = this.getMetricValue(metrics, metricPath);
      
      if (this.isThresholdViolated(value, threshold)) {
        await this.triggerAlert(metricPath, value, threshold);
      } else {
        await this.resolveAlert(metricPath);
      }
    }
  }

  getMetricValue(metrics, path) {
    const parts = path.split('.');
    let value = metrics;
    
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return null;
      }
    }
    
    return value;
  }

  isThresholdViolated(value, threshold) {
    if (value === null || value === undefined) return false;
    
    if (threshold.min !== undefined && value < threshold.min) return true;
    if (threshold.max !== undefined && value > threshold.max) return true;
    
    return false;
  }

  async triggerAlert(metricPath, value, threshold) {
    const alertId = `${metricPath}-${Date.now()}`;
    
    const alert = {
      id: alertId,
      metricPath,
      value,
      threshold,
      severity: threshold.severity,
      status: 'active',
      createdAt: Date.now(),
      resolvedAt: null
    };
    
    this.alerts.set(alertId, alert);
    
    // Handle alert based on severity
    const handler = this.handlers.get(threshold.severity);
    if (handler) {
      await handler(alert);
    }
    
    // Dispatch alert event
    document.dispatchEvent(new CustomEvent('alert-triggered', {
      detail: alert
    }));
  }

  async resolveAlert(metricPath) {
    const activeAlerts = [...this.alerts.values()].filter(
      alert => alert.metricPath === metricPath && alert.status === 'active'
    );
    
    for (const alert of activeAlerts) {
      alert.status = 'resolved';
      alert.resolvedAt = Date.now();
      
      document.dispatchEvent(new CustomEvent('alert-resolved', {
        detail: alert
      }));
    }
  }

  handleHighSeverityAlert(alert) {
    console.error('HIGH SEVERITY ALERT:', alert);
    
    // Could integrate with external alerting systems
    this.sendExternalAlert(alert);
    
    // Take immediate action
    this.takeImmediateAction(alert);
  }

  handleMediumSeverityAlert(alert) {
    console.warn('MEDIUM SEVERITY ALERT:', alert);
    
    // Queue for review
    this.queueForReview(alert);
  }

  handleLowSeverityAlert(alert) {
    console.log('LOW SEVERITY ALERT:', alert);
    
    // Log for monitoring
    this.logAlert(alert);
  }

  async sendExternalAlert(alert) {
    // Implementation would integrate with external systems
    // like Slack, PagerDuty, email, etc.
    console.log('Would send external alert:', alert);
  }

  takeImmediateAction(alert) {
    switch (alert.metricPath) {
      case 'performance.memory':
        document.dispatchEvent(new CustomEvent('force-memory-cleanup'));
        break;
      case 'performance.fps':
        document.dispatchEvent(new CustomEvent('reduce-visual-complexity'));
        break;
      case 'system.errorRate':
        document.dispatchEvent(new CustomEvent('enable-fallback-mode'));
        break;
    }
  }

  getActiveAlerts() {
    return [...this.alerts.values()].filter(alert => alert.status === 'active');
  }

  getAlertHistory(timeRange = 86400000) { // 24 hours
    const since = Date.now() - timeRange;
    return [...this.alerts.values()].filter(alert => alert.createdAt >= since);
  }

  destroy() {
    this.alerts.clear();
    this.thresholds.clear();
    this.handlers.clear();
  }
}
```

---

## 🎯 **IMPLEMENTACIÓN Y CONCLUSIÓN**

### **Roadmap de Implementación**

```
📋 FASES DE DESARROLLO

🚀 FASE 1: FOUNDATION (Semanas 1-4)
✅ Configuración del proyecto (Vite + TypeScript)
✅ Arquitectura base de Web Components
✅ Sistema de rendering Canvas/WebGL
✅ Navegación básica (3 niveles)
✅ State management inicial
✅ Framework de testing

🏗️ FASE 2: CORE FEATURES (Semanas 5-8)
✅ Implementación completa de 6 niveles
✅ Todos los patrones de distrito (cyclic, spatial, linear, hub)
✅ Sistema de entity tracking
✅ WebSocket integration
✅ Search functionality
✅ Performance optimization

🎨 FASE 3: ADVANCED FEATURES (Semanas 9-12)
✅ Multi-perspective views
✅ Real-time data streaming
✅ Comparison functionality
✅ Advanced analytics
✅ Integration APIs
✅ Security implementation

🚀 FASE 4: PRODUCTION READY (Semanas 13-16)
✅ Security hardening
✅ Performance tuning
✅ Comprehensive testing
✅ Deployment pipeline
✅ Monitoring system
✅ Documentation completa
```

### **Criterios de Éxito Técnicos**

```
📊 MÉTRICAS DE RENDIMIENTO
✅ Tiempo de carga < 2 segundos (3G)
✅ Transiciones de zoom < 200ms
✅ Soporte 10,000+ entidades sin degradación
✅ 99.9% uptime
✅ Compatibilidad cross-browser (Chrome 90+, Firefox 88+, Safari 14+)

🎯 MÉTRICAS DE EXPERIENCIA DE USUARIO
✅ Time to first insight < 30 segundos
✅ Task completion rate > 90%
✅ User satisfaction score > 4.5/5
✅ Mejora en eficiencia de navegación > 60%

💼 MÉTRICAS DE NEGOCIO
✅ Reducción de context switching 70%
✅ Mejora en identificación de problemas 80%
✅ Aumento en colaboración cross-funcional 50%
✅ Soporte para organizaciones 50-5000+ empleados
```

### **Arquitectura Final**

```
🏗️ COMPONENTES PRINCIPALES
├── 🌐 EcosystemView (Hexagonal isometric)
├── 🏢 CompanyView (6 district grid)
├── 🏙️ DistrictView (4 patterns: cyclic/spatial/linear/hub)
├── 🏢 BuildingView (4 patterns: pipeline/parallel/orchestrator/feedback)
├── 📦 ModuleView (3 perspectives + 4 elements)
└── 🔧 ElementView (Instance management + configuration)

🔄 SISTEMAS DE SOPORTE
├── 📊 State Management (Reactive proxy + history)
├── 🎨 Rendering Engine (Canvas + LOD + batching)
├── 📡 Real-time Data (WebSocket + sync strategies)
├── 🔒 Security Manager (Input validation + CSP + rate limiting)
├── 📈 Performance Monitor (FPS + memory + metrics)
├── 🔍 Search System (Global + filtered + real-time)
├── 📍 Entity Tracking (Journey analysis + visualization)
└── 🚨 Alert System (Thresholds + automated responses)

🗄️ ESTRUCTURA DE DATOS
├── 📋 6 niveles de jerarquía completa
├── 🔗 11,520 caminos de navegación únicos
├── 📊 Métricas comprehensivas (performance + business + operational)
├── 🔄 Real-time synchronization
└── 🗃️ Conflict resolution automático
```

### **Innovaciones Técnicas Clave**

1. **🎨 Rendering Híbrido**: Canvas 2D + WebGL2 con LOD automático
2. **🔄 State Management Reactivo**: Proxy-based con middleware y validación
3. **📡 Data Sync Inteligente**: Estrategias por tipo con resolución de conflictos
4. **🎯 Performance Adaptativo**: Auto-optimization basado en métricas en tiempo real
5. **🔒 Security Multi-Layer**: Input validation + CSP + rate limiting + audit logging
6. **📊 Analytics Contextual**: Métricas específicas por nivel y patrón
7. **🗺️ Navigation Semantic**: 11,520 caminos únicos con contexto preservado

### **Conclusión**

CompanyCity representa una implementación técnica completa y innovadora de visualización empresarial multinivel. La especificación unificada proporciona:

**✅ Arquitectura Escalable**: Web Components modulares con rendering de alto rendimiento
**✅ Experiencia de Usuario Excepcional**: Navegación fluida entre 6 niveles con 4 patrones específicos
**✅ Real-time Capabilities**: Sincronización de datos en tiempo real con conflict resolution
**✅ Security-First**: Implementación comprehensiva de seguridad desde el diseño
**✅ Performance-Optimized**: Monitoring continuo con auto-optimización
**✅ Production-Ready**: Testing completo, CI/CD automatizado, deployment containerizado

La implementación permite a las organizaciones navegar visualmente a través de 11,520 caminos únicos de información empresarial, manteniendo contexto espacial y semántico en cada nivel, desde el ecosistema competitivo hasta las instancias específicas de configuración.

**🎯 Resultado Final**: Una plataforma técnicamente robusta, escalable y lista para producción que transforma fundamentalmente cómo las organizaciones visualizan, navegan y entienden su arquitectura empresarial completa.
