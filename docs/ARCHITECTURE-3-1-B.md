# **CompanyCity: Documento de Referencia Definitivo**

## **Tabla de Contenidos**

1. [Visión y Concepto](#1-visión-y-concepto)
2. [Arquitectura de Navegación Completa](#2-arquitectura-de-navegación-completa)
3. [Descripción Detallada de Cada Nivel](#3-descripción-detallada-de-cada-nivel)
4. [Sistema de Transiciones](#4-sistema-de-transiciones)
5. [Tipos de Explorer y Sus Navegaciones](#5-tipos-de-explorer-y-sus-navegaciones)
6. [Metáforas Visuales y Diseño](#6-metáforas-visuales-y-diseño)
7. [Casos de Uso por Rol](#7-casos-de-uso-por-rol)
8. [Reglas de Implementación](#8-reglas-de-implementación)
9. [Anti-Patrones y Qué Evitar](#9-anti-patrones-y-qué-evitar)
10. [Decisiones de Diseño y Rationale](#10-decisiones-de-diseño-y-rationale)
11. [Glosario Técnico](#11-glosario-técnico)
12. [FAQ y Troubleshooting Conceptual](#12-faq-y-troubleshooting-conceptual)

---

## **1. Visión y Concepto**

### **1.1 Definición Core**

CompanyCity es una plataforma de visualización espacial navegable que representa organizaciones como ciudades digitales dentro de un contexto económico más amplio. Permite navegación continua desde vistas macro globales hasta detalles operativos microscópicos, manteniendo coherencia metafórica y utilidad práctica.

### **1.2 Principio Fundamental: Zoom Contextual Bidireccional**

```
CONTEXTO EXTERNO                   TU EMPRESA                    DETALLE INTERNO
←────────────────────────────────────┼────────────────────────────────────────→
-3    -2    -1    0                  +1                    +8    +9   +10   +11
PLANET→CONTINENT→REGION→ECOSYSTEM    CITY    EXPLORER→ELEMENT→DETAIL→ACTION
```

### **1.3 Valor Propuesto**

- **Contexto Completo**: Desde mercado global hasta tarea individual
- **Navegación Intuitiva**: Como Google Maps para empresas
- **Multi-Audiencia**: Misma herramienta, diferentes profundidades
- **Tiempo Real**: Datos vivos, no snapshots estáticos
- **Accionable**: No solo visualiza, permite actuar

### **1.4 Filosofía de Diseño**

1. **Familiaridad sobre Innovación**: Usa metáforas que todos conocen
2. **Profundidad sobre Amplitud**: Mejor hacer zoom que tener mil vistas
3. **Contexto sobre Detalle**: Siempre sabes dónde estás
4. **Acción sobre Observación**: Cada vista permite hacer algo

---

## **2. Arquitectura de Navegación Completa**

### **2.1 Estructura de 17 Niveles**

```
NIVEL   NOMBRE          TIPO        DESCRIPCIÓN
-3      PLANET          Contexto    Economía global, mega-tendencias
-2      CONTINENT       Contexto    Industria/sector completo
-1      REGION          Contexto    Mercado directo, competidores
 0      ECOSYSTEM       Frontera    Tu empresa + partners + integraciones
+1      CITY            Interno     Empresa completa vista como ciudad
+2      DISTRICT        Interno     Departamento (Finance, Sales, etc.)
+3      ZONE            Interno     Área funcional dentro del departamento
+4      BUILDING        Interno     Proceso empresarial completo
+5      FLOOR/LOBBY     Interno     Componentes del building
+6      CONTROL CENTER  Interno     Centro de monitoreo
+7      SCREEN          Interno     Dashboard principal
+8      PANEL           Portal      Widget que actúa como portal
------- TRANSICIÓN DIMENSIONAL -------
+9      EXPLORER        Técnico     Vista especializada según tipo
+10     ELEMENT         Técnico     Componente dentro del explorer
+11     DETAIL          Técnico     Información específica
+12     ACTION          Técnico     Comando ejecutable
```

### **2.2 Rutas de Navegación**

```
A. RUTA ESTRATÉGICA (Zoom Out)
   CITY → ECOSYSTEM → REGION → CONTINENT → PLANET

B. RUTA OPERATIVA (Zoom In)
   CITY → DISTRICT → ZONE → BUILDING → FLOOR → CONTROL → SCREEN → PANEL

C. RUTA TÉCNICA (Post-Transición)
   PANEL → [TRANSICIÓN] → EXPLORER → ELEMENT → DETAIL → ACTION

D. RUTA DIRECTA (Saltos)
   Cualquier nivel → Cualquier nivel (via breadcrumb o búsqueda)
```

---

## **3. Descripción Detallada de Cada Nivel**

### **Nivel -3: PLANET**

**Concepto**: Vista de economía global y mega-tendencias
**Visualización**: Globo o mapa mundial con regiones económicas
**Elementos**:
- Bloques económicos (Americas, EMEA, APAC)
- Indicadores macro (GDP, growth, crisis)
- Flujos comerciales globales

**Información Mostrada**:
- Tendencias económicas globales
- Eventos geopolíticos relevantes
- Movimientos de mercados principales
- Indicadores de riesgo sistémico

**Interacciones**:
- Click en continente → Zoom a CONTINENT
- Hover → Preview de métricas regionales
- Timeline → Ver evolución histórica

**Ejemplo Práctico**:
```
Veo: Mapa global con heat map económico
- Asia-Pacífico: +5.2% growth (verde brillante)
- Europa: +0.8% growth (amarillo)
- Americas: +2.1% growth (verde suave)
- Alerta: Supply chain disruption en Suez
```

### **Nivel -2: CONTINENT**

**Concepto**: Tu industria/sector en contexto
**Visualización**: Vista de industria como continente con países-segmentos
**Elementos**:
- Segmentos de mercado como "países"
- Líderes de mercado como "capitales"
- Tendencias sectoriales

**Información Mostrada**:
- Market share por segmento
- Crecimiento sectorial
- Innovaciones disruptivas
- Regulaciones emergentes

**Interacciones**:
- Click en segmento → Zoom a REGION
- Compare mode → Ver evolución vs competidores
- Filter → Por tamaño, crecimiento, geografía

**Ejemplo Práctico**:
```
Industria: Cloud Computing
- Enterprise Cloud (45% del continente)
- SMB Cloud (30% del continente)
- Startup Cloud (25% del continente)
Capital dominante: AWS (33% market share)
```

### **Nivel -1: REGION**

**Concepto**: Tu mercado directo y competidores
**Visualización**: Región con ciudades (empresas) de diferentes tamaños
**Elementos**:
- Tu ciudad (empresa) highlighted
- Ciudades competidoras
- Rutas comerciales (flujos de clientes)
- Territorios (segmentos de clientes)

**Información Mostrada**:
- Posición competitiva relativa
- Flujos de clientes entre empresas
- Barreras de entrada/salida
- Alianzas y rivalidades

**Interacciones**:
- Click en ciudad → Ver preview de competidor
- Click en tu ciudad → Zoom a CITY
- Analyze → Comparativa competitiva
- Track → Movimientos de clientes

**Ejemplo Práctico**:
```
Region: CRM Market USA
- Salesforce City (metrópolis dominante)
- HubSpot City (ciudad en crecimiento)
- TU CIUDAD (tamaño medio, nicho especializado)
- 15 ciudades menores
Flujos: 500 clientes/mes migrando entre ciudades
```

### **Nivel 0: ECOSYSTEM**

**Concepto**: Frontera entre tu empresa y el mundo exterior
**Visualización**: Área metropolitana con tu ciudad al centro
**Elementos**:
- Tu ciudad (empresa) al centro
- Ciudades satélite (partners)
- Infraestructura compartida (integraciones)
- Zonas industriales (proveedores)

**Información Mostrada**:
- Red de partners activos
- Volumen de transacciones
- Dependencias críticas
- Health de integraciones

**Interacciones**:
- Click en partner → Ver detalles de relación
- Click en tu ciudad → Zoom a CITY
- Monitor → Estado de integraciones
- Manage → Configurar conexiones

**Ejemplo Práctico**:
```
Tu Ecosystem:
- Centro: AcmeCorp City
- Norte: AWS Infrastructure (crítico)
- Sur: Stripe Payments (crítico)
- Este: Salesforce CRM (importante)
- Oeste: Google Workspace (standard)
- 47 conexiones menores activas
```

### **Nivel +1: CITY**

**Concepto**: Vista completa de tu empresa
**Visualización**: Ciudad isométrica con districts hexagonales
**Elementos**:
- Districts (departamentos) como hexágonos
- Actividad (partículas de datos fluyendo)
- Skyline (performance indicators)
- Clima (health general)

**Información Mostrada**:
- Health por departamento
- Flujos principales de trabajo
- KPIs empresa-wide
- Alertas y issues críticos

**Interacciones**:
- Click en district → Zoom a DISTRICT
- Overview mode → Métricas consolidadas
- Flow view → Ver rutas de datos
- Alert center → Issues actuales

**Ejemplo Práctico**:
```
AcmeCorp City:
- Finance District (verde, saludable)
- Sales District (amarillo, algunos issues)
- Operations District (verde)
- IT District (rojo, incidente activo)
- HR District (verde)
Actividad: 12,450 transacciones/hora
```

### **Nivel +2: DISTRICT**

**Concepto**: Un departamento principal
**Visualización**: Hexágono expandido mostrando zones internas
**Elementos**:
- Zones (sub-áreas) como plataformas
- Conexiones entre zones
- Métricas departamentales
- Recursos asignados

**Información Mostrada**:
- Estructura organizacional
- Procesos principales
- Budget y recursos
- Performance vs objetivos

**Interacciones**:
- Click en zone → Zoom a ZONE
- Team view → Ver personas
- Process view → Ver workflows
- Budget view → Ver financiero

**Ejemplo Práctico**:
```
Sales District contiene:
- Inbound Sales Zone (450 leads/día)
- Outbound Sales Zone (200 calls/día)
- Partner Sales Zone (50 deals activos)
- Customer Success Zone (NPS: 72)
Budget: $4.5M/año, 87 personas
```

### **Nivel +3: ZONE**

**Concepto**: Área funcional específica
**Visualización**: Plataforma con buildings (procesos)
**Elementos**:
- Buildings representando procesos
- Calles (flujos de datos)
- Plazas (puntos de coordinación)
- Señalización (métricas)

**Información Mostrada**:
- Procesos en esta área
- Interconexiones
- Bottlenecks
- Efficiency metrics

**Interacciones**:
- Click en building → Zoom a BUILDING
- Traffic view → Ver flujos
- Optimize → Sugerir mejoras
- Compare → Con otras zones

**Ejemplo Práctico**:
```
Inbound Sales Zone:
- Lead Capture Building (input: 450/día)
- Lead Qualification Building (processing: 89%)
- Lead Distribution Building (output: 402/día)
- Lead Nurture Building (parked: 2,100)
Efficiency: 89%, Bottleneck: Qualification
```

### **Nivel +4: BUILDING**

**Concepto**: Proceso empresarial completo
**Visualización**: Edificio 3D con múltiples niveles
**Elementos**:
- Rooftop (conexiones externas)
- Floors 1-N (etapas del proceso)
- Lobby (entrada/navegación)
- Basement (control center)

**Información Mostrada**:
- Estructura del proceso
- Estado por etapa
- Recursos asignados
- SLAs y compliance

**Interacciones**:
- Enter building → Ir a LOBBY
- X-ray view → Ver todos los floors
- Monitor → Dashboard específico
- Configure → Ajustar proceso

**Ejemplo Práctico**:
```
Lead Qualification Building:
- Rooftop: APIs (Clearbit, LinkedIn)
- Floor 3: Scoring (ML modelo v2.1)
- Floor 2: Enrichment (agregando data)
- Floor 1: Validation (formato y duplicados)
- Lobby: Reception/routing
- Basement: Control center
Status: 89% capacity, 12ms latencia promedio
```

### **Nivel +5: FLOOR/LOBBY**

**Concepto**: Componentes navegables del building

**5.1 LOBBY**
**Visualización**: Espacio de entrada con directorio
**Elementos**:
- Reception desk
- Directorio de floors
- Elevadores/escaleras
- Pantallas de información

**Información**: Overview del building, navegación
**Interacciones**: Elegir floor, ir a control center

**5.2 FLOOR**
**Visualización**: Nivel específico del proceso
**Elementos**:
- Workstations activas
- Flujo de trabajo visible
- Indicadores de estado
- Conexiones a otros floors

**Información**: Detalles de esta etapa
**Interacciones**: Inspeccionar trabajo, ver métricas

**5.3 ROOFTOP**
**Visualización**: Antenas e infraestructura de conexión
**Elementos**:
- APIs antenas
- Webhook dishes
- Integration towers
- Monitoring radar

**Información**: Conexiones externas, integraciones
**Interacciones**: Configurar APIs, ver tráfico

### **Nivel +6: CONTROL CENTER**

**Concepto**: Centro de monitoreo del building
**Visualización**: Sala de control en basement
**Elementos**:
- Wall of screens
- Control panels
- Alert systems
- Operator stations

**Información Mostrada**:
- Estado completo del building
- Métricas en tiempo real
- Históricos y tendencias
- Predicciones y alertas

**Interacciones**:
- Approach screen → Ver SCREEN
- Change view → Diferentes dashboards
- Acknowledge → Gestionar alertas
- Drill down → Investigar issues

**Ejemplo Práctico**:
```
Lead Qualification Control Center:
- Screen 1: Flow general (450 in, 402 out)
- Screen 2: Performance por floor
- Screen 3: Alertas activas (2 warnings)
- Screen 4: Predictive (capacidad en 2h: 97%)
```

### **Nivel +7: SCREEN**

**Concepto**: Dashboard principal con panels
**Visualización**: Pantalla dividida en grid de panels
**Elementos**:
- Multiple panels (widgets)
- Layout configurable
- Real-time updates
- Interactive controls

**Información Mostrada**:
- Vista consolidada según contexto
- Métricas clave
- Visualizaciones
- Controles rápidos

**Interacciones**:
- Click panel → Expandir/explorar
- Drag → Reorganizar layout
- Configure → Cambiar data sources
- Share → Exportar vista

**Ejemplo Práctico**:
```
Screen Layout (3x3):
┌─────────────┬──────────────┬─────────────┐
│ Process     │ Performance  │ Alerts      │
│ Flow        │ Metrics      │ (2 active)  │
├─────────────┼──────────────┼─────────────┤
│ Lead        │ Conversion   │ SLA         │
│ Sources     │ Funnel       │ Status      │
├─────────────┼──────────────┼─────────────┤
│ Team        │ Forecast     │ Actions     │
│ Activity    │ vs Actual    │ Log         │
└─────────────┴──────────────┴─────────────┘
```

### **Nivel +8: PANEL**

**Concepto**: Widget específico que actúa como portal
**Visualización**: Mini-visualización dentro del dashboard
**Elementos**:
- Visualization preview
- Key metrics
- Interaction hints
- Expand button

**Información Mostrada**:
- Vista resumida del aspecto específico
- Métricas principales
- Tendencia/estado
- Call-to-action

**Interacciones**:
- Hover → Ver más detalle
- Click → Expandir a pantalla completa
- Configure → Cambiar parámetros
- Export → Guardar como imagen/data

**Tipos de Panels**:
1. Process Flow Panel
2. Metrics Grid Panel
3. Network Architecture Panel
4. Organization Chart Panel
5. Timeline History Panel
6. Geographic Map Panel
7. Financial Flow Panel
8. Alert List Panel
9. Kanban Board Panel
10. Custom Analytics Panel

### **TRANSICIÓN DIMENSIONAL**

**Concepto**: El panel se expande, la metáfora urbana se desvanece
**Visualización**: 
```
1. Click en panel
2. Panel empieza a crecer
3. Bordes del panel brillan
4. Ciudad en background hace fade out
5. Panel llena toda la pantalla
6. Mensaje: "Entering [Type] Explorer..."
7. Nueva vista aparece (Explorer)
```

**Duración**: 1.2 segundos
**Reversible**: ESC o botón para volver

### **Nivel +9: EXPLORER**

**Concepto**: Mundo navegable especializado según tipo
**Tipos Disponibles**:

**9.1 PROCESS EXPLORER**
- Navegación: Stage → Step → Action → Instance
- Visualización: Flujo secuencial, swimlanes
- Uso: Entender y optimizar procesos

**9.2 HIERARCHY EXPLORER**
- Navegación: Parent → Child → Leaf
- Visualización: Árbol expandible, organigramas
- Uso: Estructuras organizacionales

**9.3 NETWORK EXPLORER**
- Navegación: Node → Connections → Paths
- Visualización: Grafo force-directed
- Uso: Sistemas distribuidos, dependencias

**9.4 METRICS EXPLORER**
- Navegación: Category → KPI → Breakdown
- Visualización: Dashboards, charts
- Uso: Análisis de performance

**9.5 TIMELINE EXPLORER**
- Navegación: Period → Event → Detail
- Visualización: Línea temporal, Gantt
- Uso: Históricos, planificación

**9.6 MAP EXPLORER**
- Navegación: Region → Location → Point
- Visualización: Mapas geográficos
- Uso: Distribución territorial

### **Nivel +10: ELEMENT**

**Concepto**: Componente específico dentro del explorer
**Ejemplos por Explorer**:
- Process: Una etapa específica
- Hierarchy: Un rol/persona
- Network: Un nodo/servicio
- Metrics: Un KPI específico
- Timeline: Un evento
- Map: Una ubicación

**Información Mostrada**:
- Detalles del elemento
- Relaciones inmediatas
- Métricas específicas
- Estado actual
- Histórico reciente

**Interacciones**:
- Inspect → Ver más detalle
- Connect → Ver relaciones
- History → Ver evolución
- Actions → Menú contextual

### **Nivel +11: DETAIL**

**Concepto**: Información granular del elemento
**Visualización**: Panel lateral o modal con tabs
**Tabs Típicos**:
- Overview (resumen)
- Metrics (números)
- History (timeline)
- Relationships (conexiones)
- Configuration (settings)
- Actions (comandos)

**Información Mostrada**:
- Todos los atributos
- Valores actuales e históricos
- Documentación
- Logs relevantes
- Opciones disponibles

### **Nivel +12: ACTION**

**Concepto**: Comando ejecutable
**Tipos de Acciones**:
- View (solo lectura)
- Update (modificar valores)
- Execute (correr proceso)
- Create (nuevo elemento)
- Delete (eliminar)
- Connect (establecer relación)

**Confirmaciones**:
- Bajo impacto: Ejecución directa
- Medio impacto: Confirmación simple
- Alto impacto: Doble confirmación + reason

---

## **4. Sistema de Transiciones**

### **4.1 Tipos de Transiciones**

**Zoom Continuo**
- Entre niveles adyacentes
- Suave, animado
- Mantiene contexto

**Salto Directo**
- Entre niveles no adyacentes
- Via breadcrumb o search
- Animación rápida

**Transición Dimensional**
- De metáfora urbana a técnica
- Solo en PANEL → EXPLORER
- Cambio de paradigma visual

### **4.2 Reglas de Transición**

1. **Siempre mostrar de dónde vienes**
2. **Animación proporcional a distancia**
3. **Mantener elemento focused durante zoom**
4. **Permitir cancelar mid-transition**
5. **Breadcrumb actualiza inmediatamente**

---

## **5. Tipos de Explorer y Sus Navegaciones**

### **5.1 PROCESS EXPLORER**

**Estructura de Navegación**:
```
PROCESS MAP
└── STAGE (etapas principales)
    └── STEP (pasos dentro de etapa)
        └── ACTION (acciones específicas)
            └── INSTANCE (ejecución actual)
```

**Visualización**: Flujo izquierda-derecha o arriba-abajo
**Elementos Visuales**:
- Rectángulos para stages
- Flechas para flujo
- Colores para estado
- Números para volumen

**Casos de Uso**:
- Sales pipeline
- Manufacturing process
- Approval workflows
- Customer journeys

### **5.2 HIERARCHY EXPLORER**

**Estructura de Navegación**:
```
ROOT
└── BRANCH (nivel 1)
    └── BRANCH (nivel 2)
        └── LEAF (elemento final)
```

**Visualización**: Árbol expandible o radial
**Elementos Visuales**:
- Nodos conectados
- Líneas parent-child
- Expand/collapse controls
- Level indicators

**Casos de Uso**:
- Organization charts
- Category taxonomies
- Cost center structure
- Product hierarchies

### **5.3 NETWORK EXPLORER**

**Estructura de Navegación**:
```
NETWORK VIEW
└── NODE (elemento)
    └── CONNECTIONS (relaciones)
        └── PATH (ruta específica)
            └── DETAILS (información de ruta)
```

**Visualización**: Force-directed graph
**Elementos Visuales**:
- Círculos para nodos
- Líneas para conexiones
- Grosor = tráfico
- Color = tipo/estado

**Casos de Uso**:
- System architecture
- Communication flows
- Dependency mapping
- Social networks

### **5.4 METRICS EXPLORER**

**Estructura de Navegación**:
```
DASHBOARD
└── CATEGORY (grupo de métricas)
    └── KPI (métrica específica)
        └── BREAKDOWN (dimensiones)
            └── DETAIL (dato atómico)
```

**Visualización**: Charts y gauges
**Elementos Visuales**:
- Line/bar/pie charts
- Gauge indicators
- Sparklines
- Heat maps

**Casos de Uso**:
- Performance dashboards
- Financial reporting
- SLA monitoring
- Capacity planning

### **5.5 TIMELINE EXPLORER**

**Estructura de Navegación**:
```
TIMELINE
└── PERIOD (año/mes/día)
    └── EVENT (acontecimiento)
        └── PARTICIPANTS (involucrados)
            └── ARTIFACTS (documentos/data)
```

**Visualización**: Línea temporal horizontal
**Elementos Visuales**:
- Eje temporal
- Event markers
- Duration bars
- Milestone flags

**Casos de Uso**:
- Project planning
- Audit trails
- Change history
- Future roadmaps

### **5.6 MAP EXPLORER**

**Estructura de Navegación**:
```
WORLD/COUNTRY
└── REGION
    └── CITY/AREA
        └── LOCATION
            └── POINT OF INTEREST
```

**Visualización**: Mapa geográfico
**Elementos Visuales**:
- Base map
- Markers/pins
- Heat overlays
- Route lines

**Casos de Uso**:
- Store locations
- Delivery routes
- Customer distribution
- Regional performance

---

## **6. Metáforas Visuales y Diseño**

### **6.1 Paleta de Colores**

**Colores Primarios**:
```css
--primary-bg: #0a0a0f;      /* Deep space black */
--secondary-bg: #14141f;    /* Midnight blue */
--accent-success: #00ff88;  /* Neon mint */
--accent-info: #00aaff;     /* Electric blue */
--accent-warning: #ff6b00;  /* Amber alert */
--accent-danger: #ff0055;   /* Neon red */
--accent-special: #ff00aa;  /* Cyber magenta */
--neutral: #8a8aa0;         /* Silver gray */
```

**Uso por Estado**:
- Verde (#00ff88): Óptimo, saludable
- Azul (#00aaff): Información, neutral
- Amarillo (#ff6b00): Advertencia, atención
- Rojo (#ff0055): Error, crítico
- Magenta (#ff00aa): Especial, AI/ML

### **6.2 Tipografía**

```css
--font-primary: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
--font-display: 'SF Pro Display', sans-serif;

/* Tamaños */
--text-xs: 11px;   /* Labels, metadata */
--text-sm: 13px;   /* Body text */
--text-md: 16px;   /* Subtitles */
--text-lg: 20px;   /* Titles */
--text-xl: 24px;   /* Headers */
```

### **6.3 Animaciones y Transiciones**

**Duraciones Estándar**:
- Instant: 0ms (data updates)
- Fast: 150ms (hovers, small changes)
- Normal: 300ms (panel opens, navigation)
- Slow: 600ms (level transitions)
- Dramatic: 1200ms (dimensional transition)

**Curvas de Animación**:
```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### **6.4 Efectos Visuales**

**Glows y Sombras**:
- Nodos activos: `box-shadow: 0 0 20px [color]`
- Elementos hover: `transform: scale(1.05)`
- Seleccionados: Doble borde + glow

**Partículas y Flujos**:
- Velocidad: Variable según carga
- Trails: 10-20% opacity
- Colores: Según tipo de dato

### **6.5 Principios de UI**

1. **Densidad de Información**
   - Más zoom = más detalle
   - Menos zoom = más contexto
   - Siempre info relevante al nivel

2. **Jerarquía Visual**
   - Tamaño indica importancia
   - Color indica estado
   - Animación indica actividad

3. **Affordances**
   - Clickeable: Cursor pointer + hover
   - Draggable: Cursor grab
   - Expandible: Ícono + hint

---

## **7. Casos de Uso por Rol**

### **7.1 CEO/Executive**

**Navegación Típica**:
```
REGION (competencia) → CITY (empresa) → Key Districts → Salir
```

**Preguntas que Responde**:
- ¿Cómo estamos vs competencia?
- ¿Qué departamento tiene problemas?
- ¿Cuáles son las tendencias macro?

**Features Clave**:
- Vista comparativa regional
- KPIs consolidados en City
- Alertas ejecutivas
- Reporting automatizado

### **7.2 VP/Director**

**Navegación Típica**:
```
CITY → DISTRICT (propio) → ZONES → BUILDINGS → Control Centers
```

**Preguntas que Responde**:
- ¿Cómo está mi departamento?
- ¿Dónde están los bottlenecks?
- ¿Cómo optimizar procesos?

**Features Clave**:
- District deep-dive
- Process optimization
- Resource allocation
- Team performance

### **7.3 Manager**

**Navegación Típica**:
```
DISTRICT → ZONE → BUILDING → FLOORS → CONTROL → SCREEN → PANELS
```

**Preguntas que Responde**:
- ¿Estado de mis procesos?
- ¿Qué tareas están pendientes?
- ¿Cómo está el equipo?

**Features Clave**:
- Building management
- Floor-level detail
- Real-time monitoring
- Quick actions

### **7.4 Analyst**

**Navegación Típica**:
```
Directo a PANELS → EXPLORERS → Deep dive en data
```

**Preguntas que Responde**:
- ¿Qué dicen los datos?
- ¿Cuáles son las tendencias?
- ¿Dónde investigar?

**Features Clave**:
- Advanced explorers
- Data export
- Custom queries
- Correlation analysis

### **7.5 Operator/Technical**

**Navegación Típica**:
```
BUILDING → CONTROL CENTER → SCREEN → Network Panel → NETWORK EXPLORER
```

**Preguntas que Responde**:
- ¿Qué está fallando?
- ¿Dónde está el problema?
- ¿Cómo lo arreglo?

**Features Clave**:
- System architecture view
- Real-time logs
- Direct actions
- Incident management

---

## **8. Reglas de Implementación**

### **8.1 Arquitectura Técnica**

**Frontend Stack**:
```javascript
- Framework: React/Vue/Angular (componentizado)
- 3D Engine: Three.js para vistas urbanas
- 2D Graphics: D3.js/Canvas para explorers
- State Management: Redux/Vuex para navegación
- Real-time: WebSockets para data en vivo
```

**Estructura de Componentes**:
```
<CompanyCity>
  <NavigationController>
    <LevelRenderer>
      <CityView />
      <DistrictView />
      <BuildingView />
      <ExplorerView type={currentType} />
    </LevelRenderer>
  </NavigationController>
  <UILayer>
    <Breadcrumb />
    <Controls />
    <Inspector />
  </UILayer>
</CompanyCity>
```

### **8.2 Data Architecture**

**Hierarchical Data Model**:
```json
{
  "company": {
    "id": "acme-corp",
    "level": 1,
    "districts": [
      {
        "id": "sales",
        "level": 2,
        "zones": [
          {
            "id": "inbound",
            "level": 3,
            "buildings": []
          }
        ]
      }
    ]
  }
}
```

**Real-time Updates**:
```javascript
// WebSocket eventos
{
  "type": "metric_update",
  "level": 4,
  "id": "lead-qualification",
  "metric": "throughput",
  "value": 450,
  "timestamp": "2024-01-10T10:00:00Z"
}
```

### **8.3 Performance Guidelines**

**Level of Detail (LOD)**:
- Nivel -3 a -1: Máximo 100 elementos
- Nivel 0 a 2: Máximo 500 elementos
- Nivel 3 a 5: Máximo 1000 elementos
- Nivel 6+: Sin límite (virtualización)

**Optimizaciones**:
```javascript
// Culling
if (!isInViewport(element)) return null;

// LOD
if (zoomLevel < 0.5) return <SimplifiedVersion />;
if (zoomLevel > 2) return <DetailedVersion />;

// Instancing
if (count > 100) use THREE.InstancedMesh;
```

### **8.4 Responsive Design**

**Breakpoints**:
```css
/* Mobile: Simplificado, sin 3D */
@media (max-width: 768px) {
  .city-view { display: 2d-simplified; }
}

/* Tablet: 3D con controles táctiles */
@media (max-width: 1024px) {
  .controls { display: touch-optimized; }
}

/* Desktop: Experiencia completa */
@media (min-width: 1025px) {
  .city-view { display: full-3d; }
}
```

### **8.5 Accessibility**

**WCAG AA Compliance**:
```html
<!-- Navegación por teclado -->
<div role="application" 
     aria-label="Company City Navigation"
     tabindex="0">
  
  <!-- Elementos interactivos -->
  <button aria-label="Zoom to Sales District"
          aria-describedby="sales-metrics">
    Sales District
  </button>
  
  <!-- Live regions -->
  <div aria-live="polite" aria-atomic="true">
    {currentLevelDescription}
  </div>
</div>
```

**Keyboard Navigation**:
- Tab: Siguiente elemento
- Shift+Tab: Element anterior
- Enter/Space: Activar
- Arrows: Navegar en nivel
- +/-: Zoom in/out
- Esc: Nivel superior

---

## **9. Anti-Patrones y Qué Evitar**

### **9.1 NO Hacer**

**❌ Gamificación**
- No puntos o achievements
- No avatares o personajes
- No elementos de "diversión"
- Es una herramienta profesional

**❌ Literalización Excesiva**
- Buildings no necesitan ventanas
- No autos en las calles
- No árboles o decoración
- Abstracción > Realismo

**❌ Sobrecarga Visual**
- No más de 7 colores principales
- No más de 3 tipos de animación simultánea
- No efectos sin propósito
- Claridad > Espectáculo

**❌ Navegación Forzada**
- No obligar rutas específicas
- No bloquear niveles
- No "tutoriales" invasivos
- Flexibilidad > Control

### **9.2 Trampas Comunes**

**Trampa 1: Feature Creep**
```
Problema: Agregar explorers para todo
Solución: Solo los 12 core, resto via plugins
```

**Trampa 2: Metáfora Rota**
```
Problema: Mezclar paradigmas visuales
Solución: Urbano hasta Panel, Técnico después
```

**Trampa 3: Performance**
```
Problema: Intentar mostrar todo siempre
Solución: LOD agresivo, culling, virtualización
```

**Trampa 4: Complejidad de Navegación**
```
Problema: Usuarios perdidos en niveles
Solución: Breadcrumb claro, search omnipresente
```

---

## **10. Decisiones de Diseño y Rationale**

### **10.1 ¿Por qué Ciudad?**

**Decisión**: Usar metáfora urbana vs otras opciones

**Rationale**:
- Universal: Todos entienden ciudades
- Escalable: De casa a metrópolis
- Navegable: Calles y direcciones
- Contextual: Ciudades existen en regiones

**Alternativas Consideradas**:
- Organismo (muy abstracto)
- Máquina (muy mecánico)  
- Red (pierde jerarquía)
- Galaxia (sin referentes)

### **10.2 ¿Por qué Zoom Bidireccional?**

**Decisión**: Permitir zoom out a contexto y zoom in a detalle

**Rationale**:
- Contexto importa tanto como detalle
- Diferentes roles necesitan diferentes vistas
- Natural como Google Maps
- Evita aplicaciones separadas

### **10.3 ¿Por qué Transición en Panel?**

**Decisión**: Panel como portal entre paradigmas

**Rationale**:
- Widget es concepto familiar
- Justifica cambio de metáfora
- Permite múltiples "mundos"
- Reversible fácilmente

### **10.4 ¿Por qué 17 Niveles?**

**Decisión**: Estructura de -3 a +12

**Rationale**:
- Cubre de global a atómico
- Permite flexibilidad
- No todos usan todos
- Mejor exceso que falta

---

## **11. Glosario Técnico**

**Building**: Representación visual de un proceso empresarial completo

**City**: Metáfora visual para la empresa completa

**Control Center**: Punto de monitoreo centralizado dentro de un building

**District**: Representación de un departamento o división principal

**Ecosystem**: Frontera entre empresa y entidades externas

**Explorer**: Vista especializada post-transición para navegación técnica

**Floor**: Etapa o componente funcional dentro de un building

**Panel**: Widget en dashboard que puede expandirse a explorer

**Screen**: Dashboard principal en control center

**Transición Dimensional**: Cambio de metáfora urbana a técnica

**Zone**: Agrupación funcional de buildings relacionados

**Zoom Contextual**: Navegación que mantiene contexto mientras cambia detalle

---

## **12. FAQ y Troubleshooting Conceptual**

### **P1: ¿Todos los buildings necesitan floors?**
**R**: No. Buildings simples pueden ser monolíticos. Floors se usan cuando el proceso tiene etapas claramente diferenciadas.

### **P2: ¿Puedo saltar directamente a un explorer?**
**R**: Sí, via deep-links o bookmarks. La transición dimensional es visual, no un requisito de navegación.

### **P3: ¿Qué pasa si mi empresa no tiene departamentos claros?**
**R**: Districts pueden representar cualquier agrupación lógica: proyectos, productos, equipos, geografías.

### **P4: ¿Cómo manejo empresas muy grandes (1000+ procesos)?**
**R**: 
- Usa Zones obligatoriamente para agrupar
- Implementa search agresivo
- Permite vistas filtradas
- Considera múltiples "ciudades" (subsidiarias)

### **P5: ¿Puedo personalizar los tipos de explorer?**
**R**: Los 12 core cubren 99% de casos. Para casos especiales, crea variantes de los existentes antes que nuevos tipos.

### **P6: ¿Qué hago si un proceso cruza múltiples districts?**
**R**: 
- Opción A: Ponlo en district dominante con conexiones visuales
- Opción B: Créalo en Zone compartida entre districts
- Opción C: Ponlo en "Shared Services" district

### **P7: ¿Cómo represento subsidiarias o multi-empresa?**
**R**: 
- Cada subsidiaria es una City
- Nivel -1 (Region) muestra todas
- Holding es un meta-nivel opcional
- Compartir servicios via Ecosystem

### **P8: ¿Qué si necesito más de 17 niveles?**
**R**: Revisa si realmente necesitas granularidad extra o si estás sobre-modelando. 99% de casos caben en 17 niveles.

### **P9: ¿Cómo manejo vistas temporales?**
**R**: Timeline Explorer + time slider en cualquier nivel. No necesitas niveles extra para tiempo.

### **P10: ¿Mobile es prioritario?**
**R**: CompanyCity está diseñado desktop-first. Mobile debe simplificar a 2D y navegación por lista, manteniendo la misma estructura de datos.

---

## **Conclusión**

CompanyCity es un sistema completo de visualización empresarial que balancea metáfora familiar con utilidad práctica. Los 17 niveles proveen profundidad desde contexto global hasta acción específica, mientras la transición dimensional permite cambiar de navegación espacial a exploración técnica según necesidad.

La clave del éxito está en:
1. Mantener la metáfora consistente
2. Respetar los paradigmas de navegación
3. Optimizar para el caso de uso, no la tecnología
4. Permitir flexibilidad sin sacrificar claridad

Este documento contiene todo lo necesario para implementar CompanyCity sin ambigüedades ni decisiones pendientes.

**Versión**: 1.0 Final
**Fecha**: Enero 2025
**Estado**: Completo y listo para implementación
