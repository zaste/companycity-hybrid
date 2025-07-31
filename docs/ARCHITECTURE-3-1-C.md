# **CompanyCity: Documento Maestro de Referencia Completa**

## **Tabla de Contenidos**

1. [Visión y Concepto](#1-visión-y-concepto)
2. [Arquitectura de Navegación Completa](#2-arquitectura-de-navegación-completa)
3. [Descripción Detallada por Nivel](#3-descripción-detallada-por-nivel)
4. [Tipos de Explorer y Sus Jerarquías](#4-tipos-de-explorer-y-sus-jerarquías)
5. [Metáforas Visuales y Representación](#5-metáforas-visuales-y-representación)
6. [Casos de Uso por Departamento](#6-casos-de-uso-por-departamento)
7. [Flujos de Navegación Completos](#7-flujos-de-navegación-completos)
8. [Principios de Diseño e Implementación](#8-principios-de-diseño-e-implementación)
9. [Configuración por Industria](#9-configuración-por-industria)
10. [Anti-Patrones y Qué Evitar](#10-anti-patrones-y-qué-evitar)
11. [Decisiones de Implementación](#11-decisiones-de-implementación)
12. [Glosario de Términos](#12-glosario-de-términos)

---

## **1. Visión y Concepto**

### **1.1 Definición**
CompanyCity es una plataforma de visualización espacial que representa la empresa como una ciudad navegable dentro de un contexto más amplio, permitiendo zoom contextual bidireccional desde la economía global hasta el detalle operativo más específico.

### **1.2 Propósito**
- **Hacer visible lo invisible**: Transformar la complejidad organizacional en un espacio explorable
- **Unificar perspectivas**: Una herramienta para todos los niveles organizacionales
- **Contextualizar decisiones**: Ver siempre el impacto interno y externo
- **Acelerar comprensión**: Reducir tiempo de análisis mediante navegación intuitiva

### **1.3 Principio Core: Zoom Contextual**
```
CONTEXTO EXTERNO ←──────────[TU EMPRESA]──────────→ DETALLE INTERNO
     (Zoom Out)                                         (Zoom In)
```

La empresa (City) es el punto cero desde el cual puedes:
- **Zoom Out**: Ver contexto de mercado, industria, economía global
- **Zoom In**: Explorar departamentos, procesos, operaciones, datos

### **1.4 Valor Diferencial**
1. **Bidireccionalidad**: No solo miras "hacia abajo" sino también "hacia afuera"
2. **Metáfora consistente**: Ciudad desde nivel -3 hasta +7, luego transición lógica
3. **Multi-audiencia**: CEO y Developer usan la misma herramienta
4. **Tiempo real**: Datos vivos, no reportes estáticos
5. **Accionable**: No solo visualiza, permite intervenir

---

## **2. Arquitectura de Navegación Completa**

### **2.1 Jerarquía Total: 17 Niveles**

```
NIVEL   NOMBRE          METÁFORA              REPRESENTA
-3      PLANET          Planeta               Economía global
-2      CONTINENT       Continente            Industria/Sector
-1      REGION          Región                Mercado/Competencia
 0      ECOSYSTEM       Área metropolitana    Empresa + Partners
+1      CITY            Ciudad                Empresa completa
+2      DISTRICT        Distrito              Departamento
+3      ZONE            Zona                  Área funcional
+4      BUILDING        Edificio              Proceso empresarial
+5      FLOOR/LOBBY     Piso/Vestíbulo       Etapa/Control
+6      SCREEN          Pantalla              Dashboard
+7      PANEL           Panel                 Widget específico
────────────────── TRANSICIÓN DIMENSIONAL ──────────────────
+8      EXPLORER        Mundo digital         Vista especializada
+9      ELEMENT         Elemento              Componente específico
+10     PROPERTY        Propiedad             Atributo/Métrica
+11     VALUE           Valor                 Dato específico
+12     ACTION          Acción                Comando ejecutable
```

### **2.2 Estructura de Building (Detalle)**
```
BUILDING
├── ROOFTOP         [Conexiones externas: APIs, webhooks]
├── FLOOR 3         [Etapa proceso 3]
├── FLOOR 2         [Etapa proceso 2]
├── FLOOR 1         [Etapa proceso 1]
├── LOBBY           [Entrada y directorio]
└── FLOOR 0         [Control Center - basement]
```

### **2.3 Puntos de Decisión de Navegación**

#### **Desde CITY**
- Click en district → Zoom a DISTRICT
- Scroll out → Vista ECOSYSTEM
- Botón "Market View" → Salta a REGION

#### **Desde BUILDING**
- Entrar → Apareces en LOBBY
- Desde LOBBY:
  - Elevator → Cualquier FLOOR
  - Escaleras abajo → CONTROL CENTER
  - Info desk → Ver resumen sin entrar

#### **Desde PANEL**
- Click → Expande a fullscreen
- Transición → "Entering [Type] Explorer..."
- Navegación → Según tipo de explorer

---

## **3. Descripción Detallada por Nivel**

### **Nivel -3: PLANET (Economía Global)**

**Metáfora Visual**: Planeta con continentes económicos
**Qué representa**: Contexto económico mundial
**Elementos visibles**:
- Continentes = Grandes bloques económicos (Americas, EMEA, APAC)
- Brillo = Actividad económica
- Conexiones = Flujos comerciales principales
- Clima = Tendencias (crecimiento, recesión)

**Información mostrada**:
- GDP por región
- Índices económicos principales
- Flujos de comercio internacional
- Eventos macroeconómicos

**Navegación**:
- Click en continente → Zoom a CONTINENT
- Hover → Preview de métricas regionales
- Timeline → Ver evolución histórica

**Casos de uso**:
- Planificación expansión internacional
- Análisis impacto eventos globales
- Benchmarking entre regiones

### **Nivel -2: CONTINENT (Industria)**

**Metáfora Visual**: Continente con países/sectores
**Qué representa**: Tu industria completa
**Elementos visibles**:
- Países = Subsectores de la industria
- Ciudades principales = Empresas líderes
- Infraestructura = Regulaciones, estándares
- Fronteras = Barreras de entrada

**Información mostrada**:
- Tamaño de mercado por subsector
- Players principales y cuota
- Tendencias tecnológicas/regulatorias
- Innovaciones disruptivas

**Navegación**:
- Click en región → Zoom a REGION
- Filter → Ver solo competidores directos
- Compare → Análisis lado a lado

### **Nivel -1: REGION (Mercado)**

**Metáfora Visual**: Región con múltiples ciudades
**Qué representa**: Tu mercado directo y competidores
**Elementos visibles**:
- Ciudades = Empresas competidoras
- Tamaño ciudad = Revenue/Market cap
- Distancia = Similitud de modelo de negocio
- Carreteras = Flujos de clientes/talento

**Información mostrada**:
- Posicionamiento competitivo
- Movimientos estratégicos recientes
- Ganancia/pérdida de clientes
- Cambios de talento entre empresas

**Navegación**:
- Click en tu ciudad → Zoom a CITY
- Click en competidor → Vista limitada pública
- Overlay → Mostrar diferentes métricas

### **Nivel 0: ECOSYSTEM (Frontera)**

**Metáfora Visual**: Área metropolitana extendida
**Qué representa**: Tu empresa y todas sus conexiones externas
**Elementos visibles**:
- Ciudad central = Tu empresa
- Ciudades satélite = Partners principales
- Zonas industriales = Proveedores
- Aeropuertos/puertos = Puntos de integración
- Suburbs = Clientes principales

**Información mostrada**:
- Salud de relaciones con partners
- Volumen de transacciones con cada entidad
- Dependencias críticas
- SLAs y cumplimiento

**Navegación**:
- Click en ciudad central → Zoom a CITY
- Click en partner → Vista relación
- Filter → Por tipo de relación

### **Nivel +1: CITY (Empresa)**

**Metáfora Visual**: Ciudad isométrica 3D
**Qué representa**: Toda tu empresa
**Elementos visibles**:
- Districts hexagonales = Departamentos
- Actividad = Partículas de datos fluyendo
- Altura districts = Tamaño/importancia
- Color = Salud/Estado (verde/amarillo/rojo)
- Puentes = Comunicación interdepartamental

**Información mostrada**:
- Métricas globales empresa
- Revenue por departamento
- Headcount y distribución
- Flujos principales de trabajo
- Alertas críticas

**Navegación**:
- Click en district → Zoom a DISTRICT
- Drag → Rotar vista isométrica
- Tab → Cambiar overlay de datos
- Breadcrumb → Saltar a cualquier nivel

### **Nivel +2: DISTRICT (Departamento)**

**Metáfora Visual**: Distrito expandido con zones
**Qué representa**: Un departamento completo
**Elementos visibles**:
- Zones = Subdivisiones funcionales
- Plazas = Puntos de reunión/coordinación
- Tráfico = Intensidad de actividad
- Edificios prominentes = Procesos críticos

**Información mostrada**:
- KPIs departamentales
- Budget y gasto actual
- Proyectos en curso
- Equipos y líderes
- Dependencias con otros districts

**Navegación**:
- Click en zone → Zoom a ZONE
- Right-click → Menú contextual
- Hover → Preview de métricas

### **Nivel +3: ZONE (Área Funcional)**

**Metáfora Visual**: Zona con múltiples buildings
**Qué representa**: Conjunto de procesos relacionados
**Elementos visibles**:
- Buildings = Procesos específicos
- Calles = Flujos entre procesos
- Parking = Queues/Buffers
- Parks = Recursos compartidos

**Información mostrada**:
- Throughput por proceso
- Bottlenecks identificados
- Utilización de recursos
- Tiempos de ciclo
- Quality metrics

**Navegación**:
- Click en building → Zoom a BUILDING
- Path mode → Seguir un flujo
- Compare → Ver múltiples buildings

### **Nivel +4: BUILDING (Proceso)**

**Metáfora Visual**: Edificio 3D con múltiples pisos
**Qué representa**: Un proceso empresarial completo
**Elementos visibles**:
- Rooftop = Conexiones externas (APIs)
- Floors = Etapas del proceso
- Lobby = Entrada/Control acceso
- Basement = Control center
- Windows = Status por área
- Actividad = Luces, movimiento

**Información mostrada**:
- Estado general del proceso
- Métricas por etapa
- Recursos asignados
- Issues actuales
- Historial reciente

**Navegación**:
- Click para entrar → LOBBY
- Hover en floor → Preview
- Emergency exit → Salir rápido

### **Nivel +5: FLOOR/LOBBY (Navegación Interna)**

#### **LOBBY**
**Metáfora Visual**: Vestíbulo de edificio moderno
**Qué representa**: Punto de entrada y navegación del building
**Elementos visibles**:
- Directory = Lista de floors
- Elevator = Acceso a floors
- Reception = Información general
- Escaleras = Acceso a basement
- Pantallas = Status displays

**Información mostrada**:
- Resumen estado building
- Alertas por floor
- Guía rápida
- Métricas principales

#### **FLOOR**
**Metáfora Visual**: Planta de oficina/operación
**Qué representa**: Una etapa específica del proceso
**Elementos visibles**:
- Work areas = Funciones activas
- Meeting rooms = Puntos de decisión
- Equipment = Sistemas en uso
- People indicators = Carga de trabajo

**Información mostrada**:
- Métricas de la etapa
- Items en proceso
- Tiempo promedio
- Tasa de error
- Recursos utilizados

**Navegación**:
- Walk through → Explorar
- Click en área → Ver detalles
- Emergency button → Escalar issue

### **Nivel +5.5: CONTROL CENTER**

**Metáfora Visual**: Centro de comando tipo NASA
**Qué representa**: Monitoreo central del building
**Elementos visibles**:
- Main screen = Vista general
- Workstations = Monitores especializados
- Alert panels = Issues actuales
- Communication hub = Coordinación

**Información mostrada**:
- Dashboard completo building
- Todas las métricas en tiempo real
- Históricos y tendencias
- Predictive analytics
- Control actions disponibles

**Navegación**:
- Approach screen → SCREEN level
- Switch monitors → Diferentes vistas
- Command console → Ejecutar acciones

### **Nivel +6: SCREEN (Dashboard)**

**Metáfora Visual**: Pantalla de control con grid de panels
**Qué representa**: Vista de información organizada
**Layout típico**:
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Process Flow    │ Metrics Grid    │ Alerts (12)     │
│ [Workflow]      │ [KPIs]          │ [Issues]        │
├─────────────────┼─────────────────┼─────────────────┤
│ Architecture    │ Timeline        │ People View     │
│ [Systems]       │ [History]       │ [Org]           │
├─────────────────┼─────────────────┼─────────────────┤
│ Financial       │ Geographic      │ Dependencies    │
│ [Money]         │ [Location]      │ [Relations]     │
└─────────────────┴─────────────────┴─────────────────┘
```

**Información mostrada**:
- Resúmenes por categoría
- Sparklines y mini-charts
- Contadores real-time
- Alertas prioritizadas

**Navegación**:
- Click en panel → Expandir
- Drag → Reorganizar panels
- Settings → Personalizar vista

### **Nivel +7: PANEL (Widget)**

**Metáfora Visual**: Panel/widget individual iluminado
**Qué representa**: Vista focalizada pre-expansión
**Tipos principales**:
1. Process Flow - Muestra flujo
2. Metrics Grid - Muestra números
3. Architecture - Muestra sistemas
4. Timeline - Muestra historia
5. People - Muestra organización
6. Financial - Muestra dinero

**Información mostrada**:
- Vista miniatura del contenido
- Indicador de actualización
- Preview interactivo
- Quick actions

**Navegación**:
- Click → Expandir a explorer
- Hover → Tooltip detallado
- Right-click → Opciones

### **TRANSICIÓN DIMENSIONAL**

**Qué sucede**:
1. Panel seleccionado pulsa y brilla
2. Se expande hasta llenar pantalla
3. Mensaje: "Entering [Type] Explorer..."
4. Vista urbana se desvanece (fade out)
5. Vista digital emerge (fade in)
6. Navegación cambia a modo explorer

**Justificación narrativa**:
"Entramos al mundo digital interno del sistema, dejando atrás la representación espacial para una vista nativa de los datos"

### **Nivel +8: EXPLORER (Vista Especializada)**

**Ya no es metáfora urbana - es visualización directa de datos**

Los 12 tipos de Explorer disponibles:
1. **PROCESS EXPLORER** - Flujos de trabajo
2. **ARCHITECTURE EXPLORER** - Sistemas técnicos
3. **HIERARCHY EXPLORER** - Estructuras organizacionales
4. **NETWORK EXPLORER** - Relaciones many-to-many
5. **METRICS EXPLORER** - KPIs y mediciones
6. **TIMELINE EXPLORER** - Vista temporal
7. **MAP EXPLORER** - Distribución geográfica
8. **INVENTORY EXPLORER** - Catálogos y recursos
9. **MATRIX EXPLORER** - Comparaciones 2D
10. **KANBAN EXPLORER** - Estados y transiciones
11. **FORM EXPLORER** - Entrada de datos
12. **ALERT EXPLORER** - Issues y excepciones

### **Niveles +9 a +12: Navegación Específica por Explorer**

Cada explorer tiene su propia jerarquía. Ver sección 4 para detalle completo.

---

## **4. Tipos de Explorer y Sus Jerarquías**

### **4.1 PROCESS EXPLORER**

**Propósito**: Visualizar y navegar flujos de trabajo secuenciales

**Jerarquía**:
```
+8  PROCESS MAP     Mapa completo del proceso
+9  STAGE           Etapa principal (ej: "Qualification")
+10 STEP            Paso específico (ej: "Score Lead")
+11 EXECUTION       Instancia ejecutándose
+12 ACTION          Intervenir en la ejecución
```

**Visualización**:
- Nodos conectados por flechas
- Grosor = volumen de flujo
- Color = estado (verde/amarillo/rojo)
- Animación = items moviéndose

**Interacciones**:
- Click en stage → Zoom a detalle
- Hover → Ver métricas del nodo
- Drag → Reorganizar vista
- Right-click → Acciones contextuales

**Casos de uso por departamento**:
- **Sales**: Pipeline desde lead hasta cierre
- **Finance**: Flujo de aprobación de gastos
- **HR**: Proceso de contratación
- **IT**: CI/CD pipeline
- **Operations**: Cadena de suministro

### **4.2 ARCHITECTURE EXPLORER**

**Propósito**: Visualizar sistemas técnicos y sus conexiones

**Jerarquía**:
```
+8  SYSTEM MAP      Vista de todos los sistemas
+9  SERVICE         Servicio específico
+10 COMPONENT       Componente del servicio
+11 INSTANCE        Instancia desplegada
+12 CONFIGURATION   Parámetros y settings
```

**Visualización**:
- Boxes and lines diagram
- Tamaño = importancia/recursos
- Color = tecnología/estado
- Líneas = dependencias/flujo datos

**Interacciones**:
- Click → Drill down
- Shift+click → Comparar
- Filter → Por tecnología/estado
- Trace → Seguir request

**Métricas mostradas**:
- Latencia entre servicios
- Throughput
- Error rates
- Resource utilization

### **4.3 HIERARCHY EXPLORER**

**Propósito**: Navegar estructuras de árbol organizacional

**Jerarquía**:
```
+8  ORG TREE        Organigrama completo
+9  DIVISION        División organizacional
+10 TEAM            Equipo específico
+11 ROLE            Rol individual
+12 PERMISSIONS     Accesos y responsabilidades
```

**Visualización**:
- Tree layout (vertical u horizontal)
- Fotos en nodos (opcional)
- Líneas sólidas = reporte directo
- Líneas punteadas = reporte matricial

**Interacciones**:
- Expand/collapse branches
- Search by name/role
- Filter by location/function
- Export chart

**Información adicional**:
- Headcount por rama
- Budget allocation
- Open positions
- Tenure/turnover

### **4.4 NETWORK EXPLORER**

**Propósito**: Visualizar relaciones many-to-many complejas

**Jerarquía**:
```
+8  NETWORK MAP     Red completa
+9  CLUSTER         Grupo de nodos relacionados
+10 NODE            Nodo individual
+11 CONNECTION      Relación específica
+12 PROPERTIES      Atributos de la relación
```

**Visualización**:
- Force-directed graph
- Node size = importancia
- Edge thickness = intensidad relación
- Color coding por categoría

**Algoritmos disponibles**:
- Force-directed layout
- Hierarchical layout
- Circular layout
- Custom positioning

**Casos de uso**:
- Análisis de influencia social
- Dependencias entre sistemas
- Flujos de comunicación
- Risk propagation

### **4.5 METRICS EXPLORER**

**Propósito**: Dashboards analíticos interactivos

**Jerarquía**:
```
+8  DASHBOARD       Vista de KPIs principales
+9  CATEGORY        Categoría de métricas
+10 METRIC          Métrica específica
+11 BREAKDOWN       Desglose dimensional
+12 DATAPOINT       Valor individual
```

**Tipos de visualización**:
- Gauges para KPIs únicos
- Line charts para tendencias
- Bar charts para comparaciones
- Heatmaps para matrices
- Sparklines para resúmenes

**Interacciones**:
- Drill-down en cualquier métrica
- Time range selector
- Compare periods
- Export data
- Set alerts

**Features avanzados**:
- Anomaly detection
- Predictive trends
- What-if scenarios
- Correlation analysis

### **4.6 TIMELINE EXPLORER**

**Propósito**: Navegación temporal de eventos

**Jerarquía**:
```
+8  TIMELINE        Vista temporal completa
+9  PERIOD          Período específico
+10 EVENT           Evento individual
+11 DETAILS         Detalles del evento
+12 AUDIT           Trail completo
```

**Visualización**:
- Línea de tiempo horizontal
- Eventos como puntos/barras
- Swim lanes por categoría
- Zoom temporal fluido

**Controles**:
- Play/pause animation
- Speed control
- Jump to date
- Filter by type
- Compare timelines

### **4.7 MAP EXPLORER**

**Propósito**: Visualización geográfica

**Jerarquía**:
```
+8  WORLD MAP       Vista global
+9  REGION          Región específica
+10 LOCATION        Ubicación exacta
+11 ASSET           Asset en ubicación
+12 STATUS          Estado del asset
```

**Capas disponibles**:
- Mapa base (streets/satellite)
- Heatmaps de actividad
- Rutas y tráfico
- Geofences
- Weather overlay

**Casos de uso**:
- Distribución de oficinas
- Tracking de envíos
- Análisis de ventas por región
- Planificación de rutas

### **4.8 INVENTORY EXPLORER**

**Propósito**: Navegación de catálogos y recursos

**Jerarquía**:
```
+8  CATALOG         Catálogo completo
+9  CATEGORY        Categoría de items
+10 ITEM            Item específico
+11 VARIANT         Variante del item
+12 STOCK           Disponibilidad
```

**Visualización**:
- Grid view con thumbnails
- List view con detalles
- Filters sidebar
- Quick search

**Features**:
- Multi-faceted search
- Bulk operations
- Import/export
- Barcode scanning
- Image recognition

### **4.9 MATRIX EXPLORER**

**Propósito**: Análisis bidimensional

**Jerarquía**:
```
+8  MATRIX          Matriz completa
+9  DIMENSION_X     Categoría eje X
+10 DIMENSION_Y     Categoría eje Y
+11 INTERSECTION    Celda específica
+12 CALCULATION     Valor calculado
```

**Tipos comunes**:
- RACI (Responsible, Accountable...)
- Skills matrix
- Risk matrix (probability × impact)
- Competitive analysis
- Price comparison

**Interacciones**:
- Click cell para detalles
- Drag para reordenar
- Heat coloring
- Export to Excel

### **4.10 KANBAN EXPLORER**

**Propósito**: Gestión visual de estados

**Jerarquía**:
```
+8  BOARD           Board completo
+9  COLUMN          Estado/fase
+10 CARD            Item individual
+11 CHECKLIST       Tareas del card
+12 ACTIVITY        Historial
```

**Features Kanban**:
- Drag & drop cards
- WIP limits
- Swimlanes
- Card aging
- Cycle time

**Automatizaciones**:
- Auto-move rules
- Due date warnings
- Assignment rules
- Notifications

### **4.11 FORM EXPLORER**

**Propósito**: Entrada estructurada de datos

**Jerarquía**:
```
+8  FORM            Formulario completo
+9  SECTION         Sección temática
+10 FIELD_GROUP     Grupo de campos
+11 FIELD           Campo individual
+12 VALIDATION      Reglas y ayuda
```

**Tipos de campos**:
- Text/Number/Date
- Dropdowns
- Multi-select
- File upload
- Signature
- Conditional fields

**Features**:
- Auto-save
- Progress indicator
- Field validation
- Conditional logic
- Pre-fill from data

### **4.12 ALERT EXPLORER**

**Propósito**: Gestión de excepciones e issues

**Jerarquía**:
```
+8  ALERT_CENTER    Todos los alerts
+9  SEVERITY        Nivel (Critical/Warning/Info)
+10 ALERT_TYPE      Categoría de alerta
+11 INCIDENT        Alerta específica
+12 RESOLUTION      Acciones disponibles
```

**Visualización**:
- Lista priorizada
- Timeline de eventos
- Impact diagram
- Resolution tracker

**Features**:
- Auto-escalation
- Assignment rules
- SLA tracking
- Root cause analysis
- Post-mortem templates

---

## **5. Metáforas Visuales y Representación**

### **5.1 Paleta de Colores**

#### **Colores Base**
```css
--background-primary: #0a0a0f;    /* Negro espacial */
--background-secondary: #14141f;   /* Azul medianoche */
--surface-primary: #1a1a2e;        /* Superficie elevada */
--surface-secondary: #2a2a3e;      /* Superficie elevada + */
```

#### **Colores de Estado**
```css
--status-optimal: #00ff88;         /* Verde neón - Todo bien */
--status-warning: #ffaa00;         /* Naranja - Atención */
--status-critical: #ff0055;        /* Rojo neón - Crítico */
--status-info: #00aaff;            /* Azul eléctrico - Info */
```

#### **Colores por Departamento**
```css
--dept-sales: #00ff88;             /* Verde - Crecimiento */
--dept-finance: #ffaa00;           /* Naranja - Dinero */
--dept-hr: #ff00aa;                /* Magenta - Personas */
--dept-it: #00aaff;                /* Azul - Tecnología */
--dept-operations: #8b5cf6;        /* Púrpura - Procesos */
--dept-marketing: #ff6b00;         /* Naranja brillante */
```

### **5.2 Tratamiento Visual por Nivel**

#### **Niveles Negativos (-3 a 0)**
- Iluminación: Más tenue, atmosférica
- Detalle: Menor, más abstracto
- Movimiento: Lento, majestuoso
- Efectos: Neblina, profundidad de campo

#### **Niveles Ciudad (1 a 4)**
- Iluminación: Brillante, clara
- Detalle: Alto, arquitectónico
- Movimiento: Dinámico, partículas
- Efectos: Sombras, reflejos, glow

#### **Niveles Internos (5 a 7)**
- Iluminación: Focalizada, dramática
- Detalle: Máximo, fotorrealista
- Movimiento: Rápido, preciso
- Efectos: Materiales PBR, oclusión

#### **Niveles Digitales (8+)**
- Iluminación: Flat, sin sombras
- Detalle: Esquemático, funcional
- Movimiento: Instantáneo, snappy
- Efectos: Transiciones suaves

### **5.3 Elementos Visuales Recurrentes**

#### **Partículas de Datos**
- Representan: Flujo de información/trabajo
- Visual: Orbes brillantes con trails
- Comportamiento: Siguen rutas predefinidas
- Velocidad: Indica carga del sistema

#### **Conexiones**
- Nivel Ciudad: Puentes elevados, túneles
- Nivel Digital: Líneas con dirección
- Grosor: Volumen de tráfico
- Animación: Pulso según actividad

#### **Indicadores de Estado**
- Halos de color alrededor de elementos
- Intensidad de brillo
- Velocidad de animación
- Iconografía contextual

### **5.4 Principios de Animación**

1. **Ease-in-out** para todas las transiciones
2. **60 FPS** objetivo en navegación
3. **Parallax** en niveles ciudad
4. **Morphing** suave entre niveles
5. **Loading progresivo** para performance

### **5.5 Responsive Design**

#### **Desktop (1920x1080+)**
- Vista completa con todos los detalles
- Controles hover disponibles
- Multi-panel layouts
- Navegación con mouse/trackpad

#### **Tablet (768-1920px)**
- Simplificación automática de geometría
- Touch-first interactions
- Panels en full-screen
- Gestos para navegación

#### **Mobile (< 768px)**
- Vista portrait optimizada
- Navegación por cards
- Drill-down secuencial
- Botones grandes

---

## **6. Casos de Uso por Departamento**

### **6.1 Sales Department**

#### **Vista Macro (City Level)**
CEO de Ventas observa:
- District brillando en verde (buen quarter)
- Flujo alto de partículas desde Marketing
- Conexión débil con Customer Success

#### **Proceso Principal: Lead to Cash**
```
BUILDING: Lead Management
├── Rooftop: Salesforce API, Formularios Web
├── Floor 4: Closing & Contracts
├── Floor 3: Negotiation  
├── Floor 2: Qualification
├── Floor 1: Lead Capture
└── Floor 0: Sales Analytics Center
```

#### **Explorers Más Usados**
1. **PROCESS**: Pipeline de ventas
2. **METRICS**: Dashboards de performance
3. **TIMELINE**: Evolución de deals
4. **HIERARCHY**: Estructura equipo ventas

#### **Métricas Clave Visualizadas**
- Conversion rate por etapa
- Velocidad del pipeline
- Deal size promedio
- Forecast accuracy
- Activity metrics

#### **Alertas Típicas**
- Deals estancados > 30 días
- Caída en conversion rate
- Grandes deals at risk
- Territorio sub-performando

### **6.2 Finance Department**

#### **Vista Macro**
CFO observa:
- District con brillo constante (estabilidad)
- Conexiones fuertes a todos los otros districts
- Actividad pico en fin de mes

#### **Proceso Principal: Order to Cash**
```
BUILDING: Billing & Collections
├── Rooftop: Banking APIs, Payment gateways
├── Floor 4: Collections
├── Floor 3: Payment Processing
├── Floor 2: Invoice Generation
├── Floor 1: Order Validation
└── Floor 0: Financial Control Center
```

#### **Explorers Más Usados**
1. **FINANCIAL**: Flujos de dinero
2. **PROCESS**: Aprobaciones
3. **MATRIX**: Cost centers vs budgets
4. **ALERT**: Compliance issues

#### **Métricas Clave**
- DSO (Days Sales Outstanding)
- Cash flow forecast
- Budget variance
- Gross margin by product
- OPEX trends

### **6.3 HR Department**

#### **Vista Macro**
CHRO observa:
- District más pequeño pero central
- Conexiones a TODOS los otros districts
- Pulso constante (actividad 24/7)

#### **Proceso Principal: Hire to Retire**
```
BUILDING: Talent Acquisition
├── Rooftop: LinkedIn, Job boards, ATS APIs
├── Floor 4: Onboarding
├── Floor 3: Offer & Negotiation
├── Floor 2: Interview Process
├── Floor 1: Sourcing & Screening
└── Floor 0: People Analytics Center
```

#### **Explorers Más Usados**
1. **HIERARCHY**: Org chart real-time
2. **PROCESS**: Hiring pipeline
3. **METRICS**: People analytics
4. **MAP**: Global workforce

#### **Métricas Clave**
- Time to hire
- Retention rate
- eNPS scores
- Training completion
- Diversity metrics

### **6.4 IT Department**

#### **Vista Macro**
CTO observa:
- District con más conexiones internas
- Brillo azul tecnológico
- Actividad 24/7 constante

#### **Proceso Principal: Code to Production**
```
BUILDING: DevOps Pipeline
├── Rooftop: GitHub, AWS, Monitoring APIs
├── Floor 4: Production Deployment
├── Floor 3: Testing & QA
├── Floor 2: Build & Integration
├── Floor 1: Development
└── Floor 0: NOC (Network Operations)
```

#### **Explorers Más Usados**
1. **ARCHITECTURE**: System diagrams
2. **ALERT**: Incident management
3. **METRICS**: Performance monitoring
4. **NETWORK**: Dependencies

#### **Métricas Clave**
- Uptime/SLA compliance
- Deploy frequency
- MTTR (Mean Time To Repair)
- Tech debt ratio
- Security vulnerabilities

### **6.5 Operations Department**

#### **Vista Macro**
COO observa:
- District más grande en footprint
- Múltiples zones especializadas
- Flujo constante con externos

#### **Proceso Principal: Supply Chain**
```
BUILDING: Inventory Management
├── Rooftop: Supplier APIs, Logistics partners
├── Floor 4: Distribution
├── Floor 3: Warehousing
├── Floor 2: Production Planning
├── Floor 1: Procurement
└── Floor 0: Operations Command Center
```

#### **Explorers Más Usados**
1. **PROCESS**: End-to-end supply chain
2. **MAP**: Distribution network
3. **INVENTORY**: Stock levels
4. **KANBAN**: Production board

#### **Métricas Clave**
- Inventory turnover
- Order fulfillment rate
- Production efficiency
- Delivery performance
- Quality metrics

### **6.6 Marketing Department**

#### **Vista Macro**
CMO observa:
- District más colorido y dinámico
- Conexiones fuertes con Sales y Product
- Actividad variable (campaigns)

#### **Proceso Principal: Campaign to Customer**
```
BUILDING: Campaign Management
├── Rooftop: Social APIs, Ad platforms, Analytics
├── Floor 4: Analysis & Optimization
├── Floor 3: Execution & Monitoring
├── Floor 2: Content Creation
├── Floor 1: Planning & Strategy
└── Floor 0: Marketing Analytics Hub
```

#### **Explorers Más Usados**
1. **TIMELINE**: Campaign calendar
2. **METRICS**: Marketing analytics
3. **PROCESS**: Content workflow
4. **MAP**: Market coverage

#### **Métricas Clave**
- CAC (Customer Acquisition Cost)
- Marketing qualified leads
- Brand awareness metrics
- Content engagement
- ROI by channel

---

## **7. Flujos de Navegación Completos**

### **7.1 Flujo Ejecutivo: "¿Por qué cayeron las ventas?"**

```
1. PLANET VIEW
   CEO nota: Economía global estable
   
2. CONTINENT VIEW  
   CEO nota: Industria creciendo 5%
   
3. REGION VIEW
   CEO nota: Competidores también crecen
   Conclusión: No es problema de mercado
   
4. CITY VIEW
   CEO nota: Sales District en amarillo
   Click → Sales District
   
5. DISTRICT VIEW
   CEO nota: New Business Zone en rojo
   Click → New Business Zone
   
6. ZONE VIEW
   CEO nota: Lead Management Building con poco flujo
   Click → Enter building
   
7. BUILDING → LOBBY
   Lobby muestra: Floor 2 (Lead Qualification) en rojo
   CEO → Control Center
   
8. CONTROL CENTER → SCREEN
   Dashboard muestra: Conversion rate cayó 50%
   Click → Process Flow Panel
   
9. PANEL expande → PROCESS EXPLORER
   Proceso muestra: Bottleneck en "Initial Qualification"
   Click → Initial Qualification stage
   
10. STAGE DETAIL
    Muestra: Nuevo sistema implementado hace 2 semanas
    Scoring muy estricto, rechaza 90% leads
    
11. ACTION
    CEO: "Ajustar parámetros del scoring"
    [Execute Action] → Scoring ajustado
    
12. RESULTADO
    Flujo se normaliza en tiempo real
    CEO navega back a City view
    Sales District vuelve a verde
```

### **7.2 Flujo Operacional: "Configurar nuevo producto"**

```
1. CITY VIEW
   Product Manager: Click en Operations District
   
2. DISTRICT → Product Zone
   
3. ZONE → Product Configuration Building
   
4. BUILDING → LOBBY → Floor 3 (Configuration)
   
5. FLOOR 3
   PM encuentra: Configuration Workstation
   Click → Approach screen
   
6. SCREEN
   Muestra: Product catalog dashboard
   Click → "New Product" panel
   
7. PANEL → FORM EXPLORER
   
8. FORM: New Product Setup
   - Section 1: Basic Info
   - Section 2: Pricing
   - Section 3: Features
   - Section 4: Integration
   
9. Complete form → Submit
   
10. PROCESS EXPLORER (auto-abre)
    Muestra: Approval workflow iniciado
    PM puede trackear progreso
```

### **7.3 Flujo Análisis: "Comparar performance regional"**

```
1. REGION VIEW
   Analyst observa: Múltiples ciudades (empresas)
   Activa: Overlay "Market Share"
   
2. Zoom a ECOSYSTEM
   Compara: Tamaño relativo vs competidores
   Nota: Somos #3 en la región
   
3. Enter CITY
   Analyst: Filtro por "Revenue Generation"
   
4. CITY VIEW con heat map
   Identifica: Sales y Product son los más fuertes
   Marketing underperforming
   
5. Click → Marketing District
   
6. DISTRICT → Digital Marketing Zone
   
7. ZONE → Campaign Building → Control Center
   
8. SCREEN → Geographic Panel
   
9. MAP EXPLORER
   Mapa muestra: Performance por región
   - APAC: Excelente
   - EMEA: Bueno  
   - Americas: Pobre
   
10. Drill into Americas
    Descubre: Messaging no resuena
    Competidor local domina
    
11. INSIGHT
    Necesitamos estrategia localizada
    Analyst genera reporte
```

### **7.4 Flujo Crisis: "Sistema caído"**

```
1. Cualquier nivel → ALERT NOTIFICATION
   "Critical: Payment System Down"
   Click → Go to incident
   
2. Auto-navegación a:
   IT District → Infrastructure Zone
   → Payment Systems Building
   
3. BUILDING está ROJO pulsante
   Enter → Directo a Control Center
   
4. CONTROL CENTER
   Todas las pantallas muestran alerts
   Main screen → System Architecture
   
5. ARCHITECTURE EXPLORER
   Muestra: Database connection perdida
   3 servicios afectados en cascada
   
6. Click en Database Node
   Status: Connection timeout
   Last successful: 10:23 AM
   
7. ACTIONS disponibles:
   - Restart connection
   - Failover to backup
   - Scale horizontally
   
8. Execute: Failover to backup
   
9. REAL-TIME actualización:
   - Services reconectando
   - Building amarillo → verde
   - Alerts clearing
   
10. Post-mortem automático iniciado
    Timeline Explorer abre
    Registra todos los eventos
```

---

## **8. Principios de Diseño e Implementación**

### **8.1 Principios Core**

#### **1. Zoom Semántico, No Solo Visual**
- Cada nivel muestra información DIFERENTE
- No es solo acercar/alejar
- Contexto determina contenido

#### **2. Información Sobre Decoración**
- Cada elemento visual porta data
- Sin elementos puramente estéticos
- Belleza emerge de la función

#### **3. Tiempo Real Sobre Snapshots**
- Datos vivos siempre que sea posible
- Animaciones reflejan actividad actual
- History disponible on-demand

#### **4. Acción Sobre Observación**
- Cada vista permite intervención
- No solo dashboards pasivos
- Cambios se reflejan inmediatamente

#### **5. Contexto Preservado**
- Siempre sabes dónde estás
- Breadcrumb persistente
- Preview antes de navegar

### **8.2 Arquitectura Técnica**

#### **Frontend Stack**
```javascript
// Core
- TypeScript 5.0+
- React 18+ (componentes)
- Three.js (3D rendering)
- D3.js (visualizaciones 2D)

// State Management  
- Zustand (estado global)
- React Query (server state)
- Immer (immutabilidad)

// Rendering
- React Three Fiber (React + Three.js)
- Drei (helpers 3D)
- Framer Motion (transiciones)

// UI Framework
- Tailwind CSS (styling)
- Radix UI (componentes base)
- Floating UI (tooltips)
```

#### **Backend Requirements**
```javascript
// APIs necesarias
- REST para configuración
- WebSocket para real-time
- GraphQL para queries complejas
- Server-Sent Events para updates

// Data Sources
- Time series DB (métricas)
- Graph DB (relaciones)
- Document DB (configuración)
- Cache layer (Redis)
```

#### **Performance Targets**
- First paint: < 1s
- Interactive: < 3s
- 60 FPS navegación
- 30 FPS minimum
- Level load: < 500ms

### **8.3 Componente Base**

```typescript
interface CityLevel {
  id: string;
  level: number; // -3 to +12
  type: 'spatial' | 'digital';
  metadata: {
    name: string;
    description: string;
    parentLevel?: number;
    childLevels?: number[];
  };
  
  // Visual
  render: () => React.ReactNode;
  transitions: {
    in: TransitionConfig;
    out: TransitionConfig;
  };
  
  // Data
  dataSource: DataSource;
  refreshInterval?: number;
  
  // Interaction
  navigation: NavigationConfig;
  actions: Action[];
  
  // State
  state: LevelState;
  filters: Filter[];
  overlays: Overlay[];
}
```

### **8.4 Sistema de Plugins**

```typescript
interface CityPlugin {
  id: string;
  name: string;
  version: string;
  
  // Extensiones
  levels?: LevelExtension[];
  explorers?: ExplorerType[];
  visualizations?: Visualization[];
  dataSources?: DataSource[];
  
  // Hooks
  onInstall?: () => void;
  onUninstall?: () => void;
  onNavigate?: (from: Level, to: Level) => void;
  
  // Configuración
  config?: PluginConfig;
  permissions?: Permission[];
}

// Ejemplo: Plugin de Compliance
const compliancePlugin: CityPlugin = {
  id: 'compliance-monitor',
  name: 'Compliance Monitor',
  version: '1.0.0',
  
  explorers: [{
    type: 'COMPLIANCE_EXPLORER',
    hierarchy: [
      'Regulations',
      'Policies', 
      'Violations',
      'Remediations'
    ]
  }],
  
  visualizations: [{
    type: 'risk-matrix',
    component: RiskMatrixViz
  }],
  
  overlays: [{
    id: 'compliance-heat',
    apply: (level) => level.type === 'spatial'
  }]
};
```

### **8.5 Temas y Personalización**

```typescript
interface CityTheme {
  id: string;
  name: string;
  
  // Colores
  palette: {
    primary: ColorScale;
    status: StatusColors;
    departments: DepartmentColors;
    backgrounds: BackgroundColors;
  };
  
  // Visuales
  lighting: LightingConfig;
  materials: MaterialSet;
  particles: ParticleConfig;
  
  // Animación
  transitions: TransitionSet;
  easings: EasingFunctions;
  durations: DurationMap;
  
  // Sonido (opcional)
  sounds?: SoundMap;
}

// Temas predefinidos
const themes = {
  'midnight': MidnightTheme,      // Default oscuro
  'daylight': DaylightTheme,      // Alto contraste
  'neon': NeonCityTheme,          // Cyberpunk
  'minimal': MinimalTheme,        // Reducido
  'accessible': A11yTheme         // Accesibilidad
};
```

### **8.6 Sistema de Permisos**

```typescript
interface CityPermissions {
  // Navegación
  navigation: {
    maxLevel: number;        // Cuán profundo puede ir
    restrictedLevels: number[]; // Niveles bloqueados
    departments: string[];    // Departments accesibles
  };
  
  // Datos
  data: {
    realtime: boolean;       // Ve datos en tiempo real
    historical: boolean;     // Acceso a históricos
    sensitive: boolean;      // Datos sensibles
    export: boolean;         // Puede exportar
  };
  
  // Acciones
  actions: {
    execute: string[];       // IDs de acciones permitidas
    configure: boolean;      // Cambiar configuración
    alert: boolean;          // Gestionar alertas
  };
  
  // Vistas
  views: {
    explorers: string[];     // Explorers disponibles
    overlays: string[];      // Overlays permitidos
    customDashboards: boolean;
  };
}
```

---

## **9. Configuración por Industria**

### **9.1 Retail**

#### **Adaptaciones Específicas**
- **ZONE**: "Store Districts" en lugar de áreas funcionales
- **BUILDING**: Tiendas físicas con floors reales
- **Inventory Explorer**: Crítico, con SKU tracking
- **Map Explorer**: Fundamental para distribución

#### **Métricas Especiales**
- Sales per square foot
- Inventory turnover by location
- Customer foot traffic
- Conversion by store

#### **Buildings Únicos**
```
BUILDING: Flagship Store
├── Rooftop: Almacén/Recepción
├── Floor 3: Administración
├── Floor 2: Ventas Especializadas  
├── Floor 1: Ventas General
├── Ground: Entrada/Checkout
└── Basement: Stock/Backoffice
```

### **9.2 Manufacturing**

#### **Adaptaciones**
- **CITY**: Incluye plantas físicas
- **DISTRICT**: Líneas de producción
- **Process Explorer**: Crítico para workflows
- **Kanban Explorer**: Control de producción

#### **Métricas Especiales**
- OEE (Overall Equipment Effectiveness)
- Defect rates by line
- Throughput variance
- Maintenance schedules

#### **Buildings Únicos**
```
BUILDING: Assembly Line A
├── Rooftop: Material Reception
├── Floor 4: Quality Control
├── Floor 3: Assembly
├── Floor 2: Sub-assembly
├── Floor 1: Parts Preparation
└── Floor 0: Maintenance Center
```

### **9.3 Healthcare**

#### **Adaptaciones**
- **DISTRICT**: Departamentos clínicos
- **Compliance**: HIPAA overlays
- **Timeline**: Patient journey critical
- **Alert Explorer**: Vital signs monitoring

#### **Métricas Especiales**
- Patient wait times
- Bed occupancy
- Treatment outcomes
- Staff utilization

#### **Buildings Únicos**
```
BUILDING: Emergency Department
├── Rooftop: Helipad
├── Floor 3: Operating Rooms
├── Floor 2: Treatment Bays
├── Floor 1: Triage
├── Ground: Reception
└── Basement: Imaging/Labs
```

### **9.4 Financial Services**

#### **Adaptaciones**
- **Security**: Enhanced encryption views
- **Compliance**: Regulatory overlay prominent
- **Financial Flow**: Primary explorer
- **Risk Matrix**: Essential view

#### **Métricas Especiales**
- Transaction volumes
- Risk exposure
- Compliance scores
- Fraud detection rates

### **9.5 SaaS/Technology**

#### **Adaptaciones**
- **Architecture Explorer**: Primary view
- **Metrics**: APM integration
- **Alert Explorer**: Incident management
- **Multi-tenant**: Customer overlay

#### **Métricas Especiales**
- API latency
- Error rates
- Customer churn
- Feature adoption

---

## **10. Anti-Patrones y Qué Evitar**

### **10.1 NO Hacer**

#### **❌ No Gamificar**
- Sin puntos o achievements
- Sin avatares o personajes
- Sin elementos de "diversión"
- Es una herramienta profesional

#### **❌ No Sobre-Metaforizar**
- No forzar analogías urbanas donde no encajan
- No crear "calles" sin propósito
- No agregar "tráfico" decorativo
- La función define la forma

#### **❌ No Decorar**
- Cada elemento debe portar información
- Sin edificios "de relleno"
- Sin animaciones gratuitas
- La belleza emerge de los datos

#### **❌ No Simular**
- No es SimCity empresarial
- No hay "ciudadanos"
- No hay clima sin significado
- No hay día/noche sin propósito

#### **❌ No Complicar Navegación**
- No más de 2 clicks para cualquier vista
- No menús nested profundos
- No modales sobre modales
- Siempre mostrar dónde estás

### **10.2 Errores Comunes**

#### **1. Sesgo IT**
**Error**: Asumir que todos entienden arquitectura de sistemas
**Solución**: Múltiples explorers para diferentes audiencias

#### **2. Información Overload**
**Error**: Mostrar todos los datos posibles
**Solución**: Revelación progresiva según zoom

#### **3. Metáfora Rígida**
**Error**: Forzar todo en la metáfora ciudad
**Solución**: Transición a vistas nativas cuando apropiado

#### **4. Performance Afterthought**
**Error**: Agregar optimización al final
**Solución**: LOD y lazy loading desde el diseño

#### **5. One Size Fits All**
**Error**: Misma vista para CEO y developer
**Solución**: Contexto y permisos personalizados

### **10.3 Señales de Mal Diseño**

1. **Usuario pregunta "¿Qué representa esto?"**
   - Metáfora no es intuitiva
   - Falta labeling claro

2. **Usuario se pierde frecuentemente**
   - Navegación no es clara
   - Falta breadcrumb o contexto

3. **Usuario no encuentra acciones**
   - Controles muy escondidos
   - Falta affordance visual

4. **Usuario espera mucho**
   - Performance no optimizada
   - Loading states pobres

5. **Usuario no vuelve**
   - No aporta valor real
   - Es más bonito que útil

---

## **11. Decisiones de Implementación**

### **11.1 Roadmap Sugerido**

#### **Phase 1: MVP (3 meses)**
```
Niveles: 1-4 (City → Building)
Explorers: Process, Metrics
Datos: Mock + básico real-time
Usuarios: 10-50 pilot
```

#### **Phase 2: Expansión (3 meses)**
```
Niveles: -1 a 7 (Region → Panel)
Explorers: +Architecture, +Hierarchy
Datos: Full real-time
Usuarios: Toda la empresa
```

#### **Phase 3: Completo (6 meses)**
```
Niveles: Todos (-3 a +12)
Explorers: Todos los tipos
Datos: + Predictive, + Historical
Usuarios: + Partners, + Clientes
```

### **11.2 Decisiones Técnicas Clave**

#### **Rendering Engine**
**Decisión**: Three.js + React Three Fiber
**Razón**: 
- Mejor ecosistema React
- Comunidad activa
- Performance probada
- Documentación extensa

**Alternativas consideradas**:
- Babylon.js: Más pesado
- Unity WebGL: Overkill
- Custom WebGL: Muy costoso

#### **State Management**
**Decisión**: Zustand + React Query
**Razón**:
- Lightweight
- TypeScript friendly
- DevTools excelentes
- Separación server/client state

#### **Data Fetching**
**Decisión**: GraphQL + WebSocket híbrido
**Razón**:
- GraphQL para queries complejas
- WebSocket para real-time
- Flexibilidad máxima

#### **Styling**
**Decisión**: Tailwind + CSS-in-JS para 3D
**Razón**:
- Tailwind para UI rápida
- CSS-in-JS para componentes 3D
- Consistency fácil

### **11.3 Trade-offs Aceptados**

1. **Performance vs Fidelidad**
   - Elegimos 60fps sobre detalles ultra
   - LOD agresivo en zoom out
   - Culling inteligente

2. **Realismo vs Claridad**
   - Metáfora clara > realismo perfecto
   - Colores vibrantes > paleta realista
   - Contraste alto > sutileza

3. **Features vs Usabilidad**
   - Menos features bien hechas
   - Profundidad sobre amplitud
   - Calidad sobre cantidad

4. **Flexibilidad vs Convención**
   - Configuración con defaults sanos
   - Personalización sin complejidad
   - Convención sobre configuración

### **11.4 Métricas de Éxito**

#### **Técnicas**
- Time to first meaningful paint < 2s
- Frame rate ≥ 30fps (60fps target)
- Memory usage < 500MB
- Load time por nivel < 500ms

#### **Usuario**
- Time to insight < 30s
- Acciones por sesión > 10
- Retorno diario > 60%
- NPS > 50

#### **Negocio**
- Reducción decision time 40%
- Aumento detección issues 60%
- ROI positivo en 6 meses
- Adopción cross-departamento > 80%

---

## **12. Glosario de Términos**

### **A-C**

**Action**: Comando ejecutable en el nivel más profundo

**Architecture Explorer**: Vista especializada para sistemas técnicos

**Block**: Agrupación funcional dentro de un Zone (nivel opcional)

**Breadcrumb**: Navegación que muestra la ruta actual

**Building**: Representación de un proceso empresarial completo

**City**: Metáfora visual para la empresa completa (nivel +1)

**Continent**: Representación de industria/sector (nivel -2)

**Control Center**: Centro de monitoreo en basement del building

### **D-F**

**Dashboard**: Pantalla con múltiples panels en el Screen level

**Department**: División organizacional, visualizada como District

**District**: Hexágono que representa un departamento

**Ecosystem**: Frontera entre empresa y mundo externo (nivel 0)

**Element**: Componente individual dentro de un Explorer

**Explorer**: Vista especializada post-transición dimensional

**Floor**: Etapa o capa funcional dentro de un Building

### **G-L**

**Hierarchy Explorer**: Vista para estructuras organizacionales

**Kanban Explorer**: Vista para gestión visual de estados

**Level**: Cada paso en la jerarquía de navegación (-3 a +12)

**Lobby**: Entrada del building con navegación a floors

**LOD (Level of Detail)**: Simplificación visual según distancia

### **M-P**

**Map Explorer**: Vista para distribución geográfica

**Metrics Explorer**: Vista para KPIs y analytics

**Network Explorer**: Vista para relaciones many-to-many

**Overlay**: Capa de información adicional sobre vista base

**Panel**: Widget en dashboard que puede expandirse

**Planet**: Economía global (nivel -3)

**Process Explorer**: Vista para flujos de trabajo

### **Q-T**

**Region**: Mercado con competidores (nivel -1)

**Rooftop**: Parte superior del building con conexiones externas

**Screen**: Dashboard principal en control center

**Timeline Explorer**: Vista para navegación temporal

**Transition**: Cambio de metáfora urbana a digital

### **U-Z**

**Widget**: Componente individual del dashboard

**Zone**: Área funcional dentro de un District

**Zoom Contextual**: Navegación que revela diferente información por nivel

**Zoom In**: Navegación hacia mayor detalle (positivo)

**Zoom Out**: Navegación hacia mayor contexto (negativo)

---

## **Conclusión**

CompanyCity representa un nuevo paradigma en la visualización empresarial: la empresa como espacio navegable, no como reporte estático. La metáfora urbana provee intuición; la transición digital provee precisión. El zoom contextual conecta estrategia con operación.

Este documento constituye la referencia completa para entender, diseñar, implementar y evolucionar CompanyCity. La arquitectura es extensible, la metáfora es flexible, y el valor es inmediato.

El futuro de la comprensión empresarial es espacial, contextual y accionable. CompanyCity es ese futuro, hoy.

---

*Documento Maestro CompanyCity v1.0*
*Última actualización: [Fecha actual]*
*Total: ~50,000 palabras*
