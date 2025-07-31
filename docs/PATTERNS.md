# CompanyCity Layout Patterns (PTES DE ADAPATAR A ARCHITECTURE3.MD) O LA 2

## Visión General

Cada nivel en CompanyCity tiene patrones específicos de organización que determinan cómo se disponen y conectan los elementos. Estos patrones no son solo estéticos - representan flujos de trabajo y relaciones reales del negocio.

## 🏙️ District Patterns (Nivel 2)

### 1. Cyclic Pattern 🔄

**Uso típico**: Market District  
**Descripción**: Los edificios forman un ciclo continuo donde las entidades fluyen de uno a otro y eventualmente regresan al inicio.

```javascript
// Ejemplo: Customer Journey Cycle
const marketCycle = [
  'Awareness',      // Marketing campaigns
  'Interest',       // Lead generation
  'Consideration',  // Sales engagement
  'Purchase',       // Transaction
  'Retention',      // Customer success
  'Advocacy'        // Referrals → back to Awareness
];
```

**Características visuales**:
- Disposición circular/hexagonal
- Flechas conectando cada edificio al siguiente
- Partículas fluyendo en círculo
- Color gradient mostrando progresión

**Métricas clave**:
- Conversion rate entre etapas
- Tiempo de ciclo completo
- Puntos de abandono

### 2. Spatial Pattern 🌐

**Uso típico**: Technology District  
**Descripción**: Edificios distribuidos espacialmente sin orden secuencial estricto. Cada uno opera independientemente pero comparte recursos.

```javascript
// Ejemplo: Infrastructure Services
const techSpatial = {
  buildings: [
    { name: 'Compute Cluster', position: 'north' },
    { name: 'Storage Array', position: 'south' },
    { name: 'Network Hub', position: 'east' },
    { name: 'Security Center', position: 'west' },
    { name: 'Monitoring', position: 'center' }
  ],
  connections: 'mesh' // Todos conectados con todos
};
```

**Características visuales**:
- Grid o distribución orgánica
- Conexiones tipo mesh network
- Indicadores de carga/capacidad
- Heat map de actividad

**Métricas clave**:
- Utilización por zona
- Latencia entre nodos
- Distribución de carga

### 3. Linear Pattern ➡️

**Uso típico**: Delivery District  
**Descripción**: Pipeline secuencial donde las entidades progresan de manera lineal de inicio a fin.

```javascript
// Ejemplo: Order Fulfillment Pipeline
const deliveryPipeline = [
  'Order Receipt',
  'Inventory Check',
  'Picking',
  'Packing',
  'Shipping',
  'Delivery'
];
```

**Características visuales**:
- Línea recta o curva suave
- Flechas unidireccionales
- Progress bars en cada etapa
- Bottleneck indicators

**Métricas clave**:
- Throughput por hora
- Tiempo en cada etapa
- Queue lengths
- Bottlenecks

### 4. Hub Pattern 🌟

**Uso típico**: Finance District  
**Descripción**: Un edificio central coordina y procesa requests de edificios satélite.

```javascript
// Ejemplo: Financial Processing Hub
const financeHub = {
  central: 'Transaction Processor',
  satellites: [
    'Payment Gateway',
    'Risk Assessment',
    'Compliance Check',
    'Reporting Engine',
    'Audit Trail'
  ]
};
```

**Características visuales**:
- Edificio central más grande
- Satélites en círculo alrededor
- Flujos bidireccionales
- Pulso desde el centro

**Métricas clave**:
- Hub utilization
- Response time
- Queue depth
- Satellite availability

## 🏢 Building Patterns (Nivel 3)

### 1. Pipeline Pattern ⚡

**Descripción**: Módulos procesando en secuencia estricta.

```javascript
// Ejemplo: Lead Qualification Pipeline
const qualificationPipeline = {
  stages: [
    'Data Enrichment',
    'Score Calculation',
    'Threshold Check',
    'Route Assignment'
  ],
  flow: 'sequential'
};
```

**Visualización**:
- Módulos en línea
- Data packets moviéndose entre stages
- Progress indicators
- Bottleneck warnings

### 2. Parallel Pattern 📊

**Descripción**: Múltiples módulos procesando simultáneamente.

```javascript
// Ejemplo: Report Generation
const parallelProcessing = {
  modules: [
    'Sales Analytics',
    'Marketing Analytics',
    'Financial Analytics',
    'Operations Analytics'
  ],
  coordinator: 'Report Aggregator'
};
```

**Visualización**:
- Módulos lado a lado
- Procesamiento simultáneo visible
- Load balancing indicators
- Completion sync points

### 3. Orchestrator Pattern 🎼

**Descripción**: Un módulo central coordina el trabajo de módulos worker.

```javascript
// Ejemplo: API Gateway Orchestration
const orchestration = {
  orchestrator: 'API Gateway',
  workers: [
    'Auth Service',
    'Data Service',
    'Business Logic',
    'Cache Service'
  ],
  pattern: 'request-response'
};
```

**Visualización**:
- Orchestrator en el centro
- Workers alrededor
- Request routing visible
- Response aggregation

### 4. Feedback Pattern 🔄

**Descripción**: Sistema con loops de retroalimentación.

```javascript
// Ejemplo: ML Training Loop
const feedbackLoop = {
  modules: [
    'Data Collector',
    'Model Trainer',
    'Predictor',
    'Performance Monitor'
  ],
  feedback: 'Performance Monitor → Data Collector'
};
```

**Visualización**:
- Conexión circular
- Feedback metrics visibles
- Iteration counter
- Convergence indicators

## 📦 Module Patterns (Nivel 4)

### 1. Control Panel Pattern 🎛️

**Uso**: Interfaces de configuración y control

```javascript
const controlPanel = {
  sections: [
    'Configuration',
    'Monitoring',
    'Actions',
    'Alerts'
  ],
  layout: 'dashboard'
};
```

### 2. Inventory Pattern 📋

**Uso**: Gestión de múltiples instancias

```javascript
const inventory = {
  view: 'list|grid|table',
  actions: ['create', 'update', 'delete', 'clone'],
  filters: ['status', 'type', 'owner']
};
```

### 3. Dashboard Pattern 📊

**Uso**: Visualización de métricas

```javascript
const dashboard = {
  widgets: [
    'MetricsChart',
    'StatusIndicator',
    'ActivityFeed',
    'PerformanceGauge'
  ],
  refresh: 'real-time'
};
```

### 4. Stream Pattern 🌊

**Uso**: Datos en tiempo real

```javascript
const streamView = {
  display: 'timeline|log|graph',
  buffer: 1000, // últimos 1000 eventos
  filters: ['severity', 'source', 'type']
};
```

## 🎨 Implementación Visual

### Colores por Pattern

```javascript
const patternColors = {
  // Districts
  cyclic: '#00ff88',   // Verde - crecimiento continuo
  spatial: '#00aaff',  // Azul - distribución
  linear: '#ff6b00',   // Naranja - progreso
  hub: '#ff00aa',      // Magenta - centralización
  
  // Buildings
  pipeline: '#ffaa00', // Amarillo - flujo
  parallel: '#00ffaa', // Cyan - concurrencia
  orchestrator: '#aa00ff', // Púrpura - coordinación
  feedback: '#ff0066'  // Rosa - iteración
};
```

### Animaciones por Pattern

```javascript
// Cyclic: Rotación continua
animate.cyclic = (time) => {
  const angle = time * 0.001;
  particles.forEach(p => {
    p.angle += angle;
    p.position = circularPosition(p.angle);
  });
};

// Linear: Movimiento unidireccional
animate.linear = (time) => {
  particles.forEach(p => {
    p.position.x += p.speed;
    if (p.position.x > endpoint) {
      p.position.x = startpoint;
    }
  });
};

// Hub: Pulso desde el centro
animate.hub = (time) => {
  const pulse = Math.sin(time * 0.002) * 0.5 + 0.5;
  hub.scale = 1 + pulse * 0.1;
  satellites.forEach(s => {
    s.opacity = 0.5 + pulse * 0.5;
  });
};
```

## 📊 Métricas por Pattern

### District Level Metrics

| Pattern | Primary Metric | Secondary Metrics |
|---------|---------------|-------------------|
| Cyclic | Conversion Rate | Cycle Time, Drop-off Points |
| Spatial | Utilization | Load Balance, Latency |
| Linear | Throughput | Queue Length, Bottlenecks |
| Hub | Response Time | Queue Depth, Availability |

### Building Level Metrics

| Pattern | Primary Metric | Secondary Metrics |
|---------|---------------|-------------------|
| Pipeline | Stage Time | Total Time, Bottlenecks |
| Parallel | Completion Time | Resource Usage, Sync Delay |
| Orchestrator | Coordination Overhead | Worker Utilization |
| Feedback | Convergence Rate | Iterations, Accuracy |

## 🔧 Configuración de Patterns

```javascript
// Configurar un distrito con pattern específico
const marketDistrict = {
  id: 'market-district',
  name: 'Market',
  pattern: 'cyclic',
  config: {
    radius: 100,
    nodeCount: 6,
    flowSpeed: 0.5,
    particleDensity: 20
  }
};

// Configurar un building con pattern
const leadProcessing = {
  id: 'lead-processing',
  name: 'Lead Processing',
  pattern: 'pipeline',
  config: {
    stages: 4,
    queueSize: 100,
    processingTime: 500 // ms
  }
};
```

## 🎯 Best Practices

1. **Elegir el pattern correcto**:
   - Cyclic: Para procesos que se repiten
   - Spatial: Para servicios independientes
   - Linear: Para workflows secuenciales
   - Hub: Para coordinación central

2. **Optimización visual**:
   - No más de 8 nodos en cyclic
   - Máximo 12 nodos en spatial
   - Linear mejor con 4-6 stages
   - Hub con 5-7 satélites

3. **Performance**:
   - Limitar partículas por pattern
   - LOD para patterns complejos
   - Batch rendering por tipo

4. **UX Considerations**:
   - Indicadores claros de dirección
   - Estados visibles (active/idle/error)
   - Transiciones suaves entre patterns

---

Los patterns son la clave para entender y navegar CompanyCity eficientemente. Cada uno cuenta una historia sobre cómo fluye el trabajo en esa parte de la organización.
