# **CompanyCity: Documento Maestro de Arquitectura y Diseño**

## **Tabla de Contenidos**

1. [Visión y Concepto](#visión-y-concepto)
2. [Arquitectura de Navegación](#arquitectura-de-navegación)
3. [Jerarquía Completa](#jerarquía-completa)
4. [Principios de Diseño](#principios-de-diseño)
5. [Metáforas y Representaciones](#metáforas-y-representaciones)
6. [Explorers Post-Transición](#explorers-post-transición)
7. [Casos de Uso Detallados](#casos-de-uso-detallados)
8. [Implementación Técnica](#implementación-técnica)
9. [Reglas y Anti-Patrones](#reglas-y-anti-patrones)
10. [Guías de Navegación](#guías-de-navegación)
11. [Decisiones de Diseño](#decisiones-de-diseño)
12. [Apéndices](#apéndices)

---

## **1. Visión y Concepto**

### **1.1 ¿Qué es CompanyCity?**

CompanyCity es un sistema de visualización y navegación empresarial que transforma la complejidad organizacional en un espacio digital explorable. Utiliza la metáfora urbana como lenguaje visual universal para representar todos los aspectos de una empresa, desde su contexto de mercado hasta el detalle más granular de ejecución.

### **1.2 Propósito Central**

Hacer que la complejidad organizacional sea **instantáneamente visible, comprensible y navegable** para todos los stakeholders, desde el CEO hasta el ingeniero, desde el analista financiero hasta el manager de operaciones.

### **1.3 Concepto Fundamental: Zoom Contextual Bidireccional**

CompanyCity no es una jerarquía vertical tradicional. Es un sistema de **zoom radial** donde:
- **Zoom OUT** revela contexto externo (mercado, industria, economía)
- **Zoom IN** revela detalle interno (departamentos, procesos, tareas)
- **Nivel 0** (Ecosystem) es la frontera entre tu empresa y el mundo

### **1.4 Paradigma de Navegación**

Como Google Maps aplicado a la empresa:
- Puedes ver el "planeta" completo (economía global)
- Puedes hacer zoom hasta el "escritorio" (tarea específica)
- La navegación es fluida, intuitiva y siempre contextual
- Cada nivel de zoom muestra información relevante a esa escala

---

## **2. Arquitectura de Navegación**

### **2.1 Estructura de Zoom**

```
CONTEXTO EXTERNO          TU EMPRESA          DETALLE INTERNO
←─────────────────────────────┼─────────────────────────────→
-3    -2    -1    |     0     |    +1    +2    +3 ... +11

AFUERA                    FRONTERA                    ADENTRO
Telescopio                Posición                  Microscopio
```

### **2.2 Navegación No-Lineal**

La navegación NO es estrictamente secuencial. Los usuarios pueden:
- Saltar niveles cuando tiene sentido
- Tomar múltiples rutas hacia el mismo destino
- Usar atajos contextuales
- Navegar lateralmente dentro del mismo nivel

### **2.3 Rutas de Navegación Principales**

**Ruta Estratégica** (Zoom Out):
```
CITY → ECOSYSTEM → REGION → CONTINENT → PLANET
```

**Ruta Operacional** (Zoom In):
```
CITY → DISTRICT → ZONE → BUILDING → FLOOR → SCREEN → PANEL → EXPLORER
```

**Ruta de Control** (Directo a monitoreo):
```
BUILDING → LOBBY → CONTROL CENTER → SCREEN → PANEL → EXPLORER
```

---

## **3. Jerarquía Completa**

### **3.1 Niveles de Contexto Externo (Zoom Out)**

#### **Nivel -3: PLANET**
- **Qué es**: Economía global, todos los mercados
- **Visualización**: Globo con regiones económicas iluminadas
- **Información mostrada**:
  - Tendencias macroeconómicas
  - Flujos de capital globales
  - Indicadores por región
- **Usuarios principales**: Board, Investors, Strategy
- **Frecuencia de uso**: Trimestral/Anual

#### **Nivel -2: CONTINENT** 
- **Qué es**: Tu industria completa
- **Visualización**: Mapa de sectores industriales
- **Información mostrada**:
  - Tamaño total del mercado
  - Crecimiento del sector
  - Regulaciones principales
  - Tendencias tecnológicas
- **Usuarios principales**: C-Suite, Strategy
- **Frecuencia de uso**: Mensual

#### **Nivel -1: REGION**
- **Qué es**: Tu mercado directo y competidores
- **Visualización**: Ciudades (empresas) en la región
- **Información mostrada**:
  - Competidores directos (otras ciudades)
  - Tamaños relativos (market share)
  - Flujos de clientes entre ciudades
  - Nuevos entrantes
- **Usuarios principales**: Sales, Marketing, Product
- **Frecuencia de uso**: Semanal

#### **Nivel 0: ECOSYSTEM**
- **Qué es**: Límites de tu ciudad - conexiones externas
- **Visualización**: Perímetro de la ciudad con conexiones
- **Información mostrada**:
  - Partners estratégicos
  - Proveedores principales
  - Canales de distribución
  - APIs e integraciones
  - Clientes enterprise
- **Usuarios principales**: Partnerships, Business Dev, Tech
- **Frecuencia de uso**: Diaria
- **Nota especial**: Este es el punto de transición interno/externo

### **3.2 Niveles de Detalle Interno (Zoom In)**

#### **Nivel +1: CITY**
- **Qué es**: Vista completa de tu empresa
- **Visualización**: Ciudad isométrica con districts hexagonales
- **Información mostrada**:
  - Todos los departamentos (districts)
  - Flujos principales de trabajo (tráfico)
  - Health general (colores)
  - Métricas empresa (revenue, headcount)
- **Usuarios principales**: Todos
- **Frecuencia de uso**: Diaria - punto de entrada principal
- **Interacción**: Click en district para navegar

#### **Nivel +2: DISTRICT**
- **Qué es**: Un departamento principal
- **Visualización**: Hexágono expandido mostrando zones
- **Tipos de districts**:
  - Sales District
  - Finance District
  - HR District
  - Operations District
  - Technology District
  - Marketing District
- **Información mostrada**:
  - KPIs departamentales
  - Headcount y estructura
  - Budget y gastos
  - Projects principales
- **Usuarios principales**: Department heads, Managers
- **Frecuencia de uso**: Diaria

#### **Nivel +3: ZONE**
- **Qué es**: Área funcional dentro del departamento
- **Visualización**: Plataforma con buildings
- **Ejemplos por district**:
  - Sales: Inbound Zone, Outbound Zone, Partner Zone
  - Finance: Accounting Zone, Treasury Zone, Tax Zone
  - HR: Talent Zone, Compensation Zone, Culture Zone
- **Información mostrada**:
  - Procesos del área
  - Team allocation
  - Performance metrics
  - Interdependencias
- **Usuarios principales**: Team leads, Specialists
- **Frecuencia de uso**: Diaria

#### **Nivel +4: BUILDING**
- **Qué es**: Proceso empresarial completo
- **Visualización**: Estructura 3D con múltiples niveles
- **Estructura estándar**:
  ```
  ROOFTOP    - Conexiones externas (APIs, webhooks)
  FLOOR 3    - Módulo proceso 3
  FLOOR 2    - Módulo proceso 2  
  FLOOR 1    - Módulo proceso 1
  LOBBY      - Entrada y navegación
  BASEMENT   - Control Center
  ```
- **Ejemplos de buildings**:
  - Lead Management Building
  - Invoice Processing Building
  - Hiring Process Building
  - Content Production Building
- **Información mostrada**:
  - Process health por floor
  - Throughput general
  - Bottlenecks visibles
  - SLA compliance
- **Usuarios principales**: Process owners, Analysts
- **Frecuencia de uso**: Diaria

#### **Nivel +4.1: ROOFTOP**
- **Qué es**: Infraestructura de conexiones externas
- **Visualización**: Antenas, satélites, helipuerto
- **Elementos**:
  - API Antennas (REST endpoints)
  - Webhook Dishes (event listeners)
  - Integration Towers (Salesforce, SAP)
  - Data Satellites (real-time feeds)
- **Información mostrada**:
  - API health y uptime
  - Webhook activity
  - Integration status
  - Data flow rates
- **Usuarios principales**: Integration team, DevOps

#### **Nivel +4.2: FLOOR**
- **Qué es**: Módulo autónomo del proceso
- **Visualización**: Planta con flujo de trabajo visible
- **Ejemplos en Lead Management Building**:
  - Floor 1: Attraction (generación)
  - Floor 2: Capture (formularios)
  - Floor 3: Qualification (scoring)
  - Floor 4: Distribution (routing)
- **Información mostrada**:
  - Entidades procesándose
  - Queue sizes
  - Processing time
  - Error rates
- **Usuarios principales**: Operations, Team members
- **Nota**: NO son espacios físicos con gente

#### **Nivel +4.3: LOBBY**
- **Qué es**: Punto de entrada y navegación del building
- **Visualización**: Recepción con directorio y elevadores
- **Elementos**:
  - Building directory
  - Status monitors
  - Elevators a floors
  - Escaleras a Control Center
- **Función**: Hub de navegación y overview
- **Usuarios principales**: Todos los visitantes del building

#### **Nivel +4.4: CONTROL CENTER (Basement)**
- **Qué es**: Centro de monitoreo del building
- **Visualización**: Sala con wall of screens
- **Elementos**:
  - Main monitoring screen
  - Alert panels
  - Performance dashboards
  - Control stations
- **Información mostrada**:
  - Building overview completo
  - Todos los floors simultáneamente
  - Tendencias y patrones
  - Alertas consolidadas
- **Usuarios principales**: Process managers, Operations

#### **Nivel +5: CONTROL ROOM**
- **Qué es**: Estación específica dentro del Control Center
- **Visualización**: Puesto de control con pantallas
- **Función**: Punto de acceso a screens específicos
- **Transición**: De espacio físico a interfaz digital

#### **Nivel +6: SCREEN**
- **Qué es**: Dashboard principal con capacidad de zoom
- **Visualización**: Grid de panels (widgets)
- **Características**:
  - Zoom semántico (building → floor → workstation)
  - Múltiples panels disponibles
  - Layouts configurables
  - Real-time updates
- **Tipos de screens**:
  - Building Overview Screen
  - Floor Detail Screen  
  - Workstation Screen
- **Información mostrada**: Depende del nivel de zoom
- **Usuarios principales**: Todos según contexto

#### **Nivel +7: PANEL**
- **Qué es**: Widget específico en el screen
- **Visualización**: Mini-visualización del dominio
- **Tipos de panels disponibles**:
  - Process Flow Panel
  - Architecture Panel
  - Organization Panel
  - Financial Panel
  - Metrics Panel
  - Timeline Panel
  - Alerts Panel
  - Y muchos más...
- **Función crítica**: PORTAL a vista especializada
- **Interacción**: Click para expandir
- **Transición**: "Entering [X] Explorer..."

### **3.3 TRANSICIÓN: El Momento Clave**

La transición ocurre cuando un PANEL se expande:
1. El panel seleccionado crece hasta llenar la pantalla
2. Mensaje: "Entering [Type] Explorer..."
3. La metáfora urbana se desvanece
4. Aparece la vista especializada (Explorer)
5. Ahora navegas con paradigmas propios del dominio

### **3.4 Niveles Post-Transición**

#### **Nivel +8: EXPLORER**
- **Qué es**: Vista especializada según el tipo de panel
- **Tipos disponibles**: 12 tipos diferentes (ver sección 5)
- **Paradigma**: Propio de cada explorer
- **Navegación**: Específica al dominio

#### **Nivel +9: ELEMENT**
- **Qué es**: Componente específico dentro del explorer
- **Ejemplos**:
  - En Process Explorer: Una etapa
  - En Network Explorer: Un nodo
  - En Hierarchy Explorer: Un nivel
- **Información mostrada**: Detalles del elemento

#### **Nivel +10: DETAIL**
- **Qué es**: Información granular del elemento
- **Visualización**: Panels de datos, forms, métricas
- **Información mostrada**: Todos los atributos
- **Acciones disponibles**: Según contexto

#### **Nivel +11: ACTION**
- **Qué es**: Ejecución o configuración específica
- **Ejemplos**:
  - Reasignar tarea
  - Cambiar configuración
  - Aprobar/Rechazar
  - Escalar issue
- **Resultado**: Cambio real en el sistema

---

## **4. Principios de Diseño**

### **4.1 Principios Fundamentales**

#### **4.1.1 Zoom Contextual Bidireccional**
- La navegación es radial, no jerárquica vertical
- Zoom out = más contexto, zoom in = más detalle
- Nivel 0 es la frontera empresa-mundo

#### **4.1.2 Metáfora Consistente hasta la Transición**
- Mantener metáfora urbana hasta nivel +7
- Transición justificada y explícita
- Post-transición: paradigmas apropiados al dominio

#### **4.1.3 Información Adaptativa por Nivel**
- Cada nivel muestra datos relevantes a esa escala
- Complejidad visual inversa a cantidad de elementos
- 1 elemento = máximo detalle, 100 elementos = máxima abstracción

#### **4.1.4 Multi-audiencia por Diseño**
- El nivel determina la visualización, no el usuario
- Un CEO viendo 1 servicio quiere datos, no metáforas
- Un ingeniero viendo 200 servicios prefiere la ciudad

#### **4.1.5 Navegación No-lineal**
- Múltiples rutas al mismo destino
- Atajos contextuales permitidos
- No forzar caminos únicos

### **4.2 Principios Visuales**

#### **4.2.1 Paleta de Colores**
```
Fondos:
- Deep Space Black: #0a0a0f (fondo principal)
- Midnight Blue: #14141f (elementos secundarios)

Estados:
- Success Green: #00ff88 (operacional, saludable)
- Process Blue: #00aaff (procesando, neutral)
- Alert Magenta: #ff00aa (atención requerida)
- Warning Orange: #ff6b00 (warning, caution)
- Error Red: #ff0055 (crítico, falla)
- Neutral Gray: #8a8aa0 (inactivo, disabled)

Acentos:
- Purple Glow: #8b5cf6 (elementos interactivos)
- White: #ffffff (texto principal)
```

#### **4.2.2 Tipografía**
```
Headers: Inter/SF Pro Display, 600 weight
Body: Inter/SF Pro Text, 400 weight  
Data: JetBrains Mono/SF Mono
Sizes: 
- Details: 12px
- Body: 14px
- Subsection: 16px
- Section: 20px
```

#### **4.2.3 Animación y Motion**
```
Entity movement: 60fps smooth bezier curves
UI transitions: 200-300ms cubic-bezier(0.4, 0, 0.2, 1)
Data updates: 150ms fade-in
Hover states: Scale 1.05 with 100ms transition
Loading states: Pulse animation at 1Hz
```

#### **4.2.4 Densidad de Información**
- Niveles altos (city): Baja densidad, máxima claridad
- Niveles medios: Balance información/visualización
- Niveles bajos (detail): Alta densidad, máxima información

### **4.3 Principios de Interacción**

#### **4.3.1 Feedback Inmediato**
- Hover effects en todos los elementos interactivos
- Click feedback visual y auditivo (opcional)
- Loading states para operaciones asíncronas

#### **4.3.2 Navegación Predecible**
- Click = navegar hacia adentro
- Right-click = menú contextual
- Drag = pan/move
- Scroll = zoom
- ESC = nivel anterior

#### **4.3.3 Contexto Persistente**
- Breadcrumbs siempre visibles
- Indicador de zoom level
- Mini-mapa opcional
- Coordenadas de ubicación

---

## **5. Metáforas y Representaciones**

### **5.1 Metáfora Urbana (Niveles -3 a +7)**

#### **5.1.1 ¿Por qué Ciudad?**
- Universal: Todos entienden ciudades
- Escalable: De planeta a edificio
- Intuitiva: Navegación natural
- Rica: Permite múltiples conceptos

#### **5.1.2 Elementos Urbanos y su Significado**

**Ciudad = Empresa**
- Tamaño = Revenue o empleados
- Actividad = Transacciones/día
- Crecimiento = Expansión visible

**District = Departamento**
- Hexágonos = Modularidad
- Colores = Identidad funcional
- Conexiones = Colaboración

**Building = Proceso**
- Altura = Complejidad
- Floors = Etapas
- Actividad = Throughput

**Tráfico = Flujo de Trabajo**
- Partículas = Tareas/datos
- Velocidad = Eficiencia
- Congestión = Bottlenecks

#### **5.1.3 Elementos NO Literales**
- NO personas caminando
- NO vehículos
- NO clima
- NO día/noche
- Solo abstracciones funcionales

### **5.2 Transición de Metáforas**

#### **5.2.1 El Panel como Portal**
- Panel muestra preview del mundo interior
- Click = "entrar" a ese mundo
- Transición suave y justificada
- Usuario entiende el cambio de contexto

#### **5.2.2 Mensaje de Transición**
```
"Entering Process Explorer..."
"Entering Network Architecture..."
"Entering Organization View..."
```

### **5.3 Metáforas Post-Transición**

Cada Explorer usa su propia metáfora apropiada:
- Process: Flujo de río/pipeline
- Network: Constelación conectada
- Hierarchy: Árbol/organigrama
- Timeline: Línea temporal
- Metrics: Tablero de instrumentos

---

## **6. Explorers Post-Transición**

### **6.1 Los 12 Tipos de Explorer**

#### **6.1.1 PROCESS EXPLORER**
- **Paradigma**: Flujo secuencial
- **Visualización**: Pipeline con etapas
- **Navegación**: Stage → Step → Action → Instance
- **Casos de uso**: 
  - Sales pipeline
  - Manufacturing process
  - Approval workflows
  - Customer journey
- **Interacciones**:
  - Seguir entidad individual
  - Ver bottlenecks
  - Analizar tiempos
  - Optimizar rutas

#### **6.1.2 HIERARCHY EXPLORER**
- **Paradigma**: Árbol jerárquico
- **Visualización**: Organigrama expandible
- **Navegación**: Parent → Children → Grandchildren
- **Casos de uso**:
  - Organization structure
  - Cost center hierarchy
  - Product categorization
  - Territory management
- **Interacciones**:
  - Expandir/colapsar
  - Ver reporting lines
  - Analizar spans
  - Reorganizar

#### **6.1.3 NETWORK EXPLORER**
- **Paradigma**: Grafo interconectado
- **Visualización**: Nodos y conexiones
- **Navegación**: Node → Connections → Paths
- **Casos de uso**:
  - System architecture
  - Communication flows
  - Dependency mapping
  - Social networks
- **Interacciones**:
  - Explorar conexiones
  - Encontrar rutas
  - Identificar clusters
  - Analizar impacto

#### **6.1.4 MAP EXPLORER**
- **Paradigma**: Geográfico espacial
- **Visualización**: Mapa interactivo
- **Navegación**: Region → Area → Location → Point
- **Casos de uso**:
  - Office locations
  - Customer distribution
  - Delivery routes
  - Market coverage
- **Interacciones**:
  - Zoom geográfico
  - Filtros por región
  - Heat maps
  - Rutas óptimas

#### **6.1.5 TIMELINE EXPLORER**
- **Paradigma**: Temporal cronológico
- **Visualización**: Línea de tiempo
- **Navegación**: Period → Event → Detail → Change
- **Casos de uso**:
  - Project timelines
  - Audit trails
  - Change history
  - Planning calendars
- **Interacciones**:
  - Navegar tiempo
  - Comparar períodos
  - Ver tendencias
  - Proyectar futuro

#### **6.1.6 METRICS EXPLORER**
- **Paradigma**: Multidimensional analítico
- **Visualización**: Dashboards y gráficos
- **Navegación**: Category → Metric → Breakdown → Detail
- **Casos de uso**:
  - KPI monitoring
  - Financial analysis
  - Performance tracking
  - SLA compliance
- **Interacciones**:
  - Drill-down/up
  - Comparar métricas
  - Establecer alertas
  - Exportar datos

#### **6.1.7 INVENTORY EXPLORER**
- **Paradigma**: Catálogo searchable
- **Visualización**: Grid/lista con filtros
- **Navegación**: Search → Filter → Item → Properties
- **Casos de uso**:
  - Product catalog
  - Asset registry
  - Document library
  - Resource pool
- **Interacciones**:
  - Búsqueda avanzada
  - Filtros múltiples
  - Comparación
  - Bulk actions

#### **6.1.8 MATRIX EXPLORER**
- **Paradigma**: Bidimensional relacional
- **Visualización**: Tabla cruzada
- **Navegación**: Row × Column → Cell → Detail
- **Casos de uso**:
  - RACI matrices
  - Skill matrices
  - Compatibility tables
  - Price comparisons
- **Interacciones**:
  - Pivotear ejes
  - Filtrar dimensiones
  - Aggregaciones
  - Export/import

#### **6.1.9 KANBAN EXPLORER**
- **Paradigma**: Estados y transiciones
- **Visualización**: Columnas con cards
- **Navegación**: Column → Card → Detail → Actions
- **Casos de uso**:
  - Task boards
  - Order tracking
  - Support tickets
  - Content pipeline
- **Interacciones**:
  - Drag & drop
  - Cambiar estados
  - Asignar trabajo
  - Establecer límites

#### **6.1.10 FORM EXPLORER**
- **Paradigma**: Entrada estructurada
- **Visualización**: Formularios y wizards
- **Navegación**: Section → Field Group → Field → Validation
- **Casos de uso**:
  - Data entry
  - Configuration
  - Onboarding
  - Surveys
- **Interacciones**:
  - Completar campos
  - Validación real-time
  - Guardar progreso
  - Submit/approve

#### **6.1.11 REPORT EXPLORER**
- **Paradigma**: Documento estructurado
- **Visualización**: Layouts de reporte
- **Navegación**: Section → Subsection → Detail → Data
- **Casos de uso**:
  - Monthly reports
  - Compliance docs
  - Proposals
  - Analysis papers
- **Interacciones**:
  - Navegar secciones
  - Expandir detalles
  - Comentar
  - Generar/exportar

#### **6.1.12 ALERT EXPLORER**
- **Paradigma**: Prioridad y urgencia
- **Visualización**: Lista priorizada
- **Navegación**: Severity → Alert → Detail → Resolution
- **Casos de uso**:
  - System monitoring
  - Compliance violations
  - Anomaly detection
  - Escalations
- **Interacciones**:
  - Acknowledge
  - Investigate
  - Resolver
  - Escalar

### **6.2 Selección de Explorer**

El tipo de Explorer NO depende del departamento sino del TIPO DE DATO:
- Sales puede usar Process Explorer (pipeline) y Metrics Explorer (quotas)
- IT puede usar Network Explorer (systems) y Kanban Explorer (tickets)
- Finance puede usar Timeline Explorer (close) y Matrix Explorer (budgets)

---

## **7. Casos de Uso Detallados**

### **7.1 Caso: Análisis Estratégico de Mercado**

**Usuario**: CEO
**Objetivo**: Entender posición competitiva

```
1. START: CITY (+1)
   - Ve empresa saludable pero crecimiento lento

2. ZOOM OUT → REGION (-1)
   - Ve 5 competidores, 2 creciendo rápido
   - Uno está "robando" flujo de clientes

3. ZOOM OUT → CONTINENT (-2)
   - Ve que toda la industria está creciendo 15%
   - Su empresa solo crece 5%

4. CLICK en competidor de rápido crecimiento
   - Ve su ciudad: tienen un district nuevo (AI)

5. VUELVE a su CITY (+1)
   - Decide crear nuevo AI District

RESULTADO: Decisión estratégica informada
```

### **7.2 Caso: Troubleshooting Operacional**

**Usuario**: Operations Manager
**Objetivo**: Resolver cuello de botella en ventas

```
1. START: CITY (+1)
   - Sales District está amarillo (warning)

2. CLICK → SALES DISTRICT (+2)
   - Inbound Zone está rojo

3. CLICK → INBOUND ZONE (+3)
   - Lead Processing Building congestionado

4. CLICK → LEAD PROCESSING BUILDING (+4)
   - Entra al building

5. NAV → LOBBY → CONTROL CENTER
   - Ve Floor 2 (Validation) al 95% capacity

6. CLICK → SCREEN (+6)
   - Dashboard muestra 500 leads esperando

7. CLICK → Process Flow PANEL (+7)
   - Expande panel

8. TRANSITION → PROCESS EXPLORER (+8)
   - Ve que Validation Stage tiene solo 1 validador activo

9. CLICK → Validation Stage (+9)
   - 3 validadores asignados, 2 ausentes

10. CLICK → Validator List (+10)
    - Ve asignaciones específicas

11. ACTION → Reasignar validadores (+11)
    - Redistribuye carga a validadores activos

RESULTADO: Bottleneck resuelto en 10 minutos
```

### **7.3 Caso: Auditoría de Integraciones**

**Usuario**: Enterprise Architect
**Objetivo**: Mapear todas las conexiones externas

```
1. START: ECOSYSTEM (0)
   - Ve todos los partners y proveedores

2. FILTER: "Payment Providers"
   - Ve Stripe, PayPal, Square conectados

3. CLICK en conexión con Stripe
   - Lleva a Payment Building

4. NAV → ROOFTOP
   - Ve API antenna de Stripe
   - Status: 99.9% uptime
   - Volume: 10k transactions/day

5. CLICK → API Detail Screen
   - Ve endpoints utilizados

6. CLICK → Network Architecture Panel

7. TRANSITION → NETWORK EXPLORER
   - Ve todos los servicios internos usando Stripe

8. ANALYSIS: 15 servicios dependen de Stripe
   - 3 no tienen fallback

9. ACTION: Crear plan de redundancia

RESULTADO: Vulnerabilidad identificada y plan creado
```

### **7.4 Caso: Planificación de Capacidad**

**Usuario**: Finance Director
**Objetivo**: Proyectar costos para Q4

```
1. START: CITY (+1)
   - Vista general de actividad

2. NAV → FINANCE DISTRICT (+2)
   - Ve zonas de costo

3. NAV → OPERATIONS COST ZONE (+3)
   - Ve buildings de gasto

4. CLICK → INFRASTRUCTURE BUILDING (+4)

5. NAV → CONTROL CENTER → SCREEN

6. CLICK → Metrics Panel

7. TRANSITION → METRICS EXPLORER
   - Ve tendencias de costo por mes

8. TIME SLIDER: Últimos 12 meses
   - Crecimiento 8% mensual

9. PROJECTION: Siguiente 3 meses
   - Necesitará $450K adicionales

10. EXPORT: Datos para presentación

RESULTADO: Presupuesto Q4 justificado con datos
```

---

## **8. Implementación Técnica**

### **8.1 Arquitectura del Sistema**

```javascript
// Arquitectura modular de CompanyCity
const CompanyCity = {
  // Core
  engine: {
    renderer: ThreeJSRenderer,
    navigation: NavigationController,
    state: StateManager,
    data: DataConnector
  },
  
  // Niveles
  levels: {
    external: [-3, -2, -1, 0],  // Planet a Ecosystem
    urban: [1, 2, 3, 4, 5, 6, 7], // City a Panel
    explorer: [8, 9, 10, 11]      // Explorer a Action
  },
  
  // Visualizadores
  visualizers: {
    urban: UrbanVisualizer,      // -3 a +7
    transition: TransitionManager, // +7 a +8
    explorers: {                  // +8 a +11
      process: ProcessExplorer,
      network: NetworkExplorer,
      hierarchy: HierarchyExplorer,
      // ... etc
    }
  }
};
```

### **8.2 Estado Global**

```javascript
const GlobalState = {
  // Posición actual
  navigation: {
    currentLevel: 1,        // +1 (City)
    currentEntity: 'company-abc',
    currentView: 'urban',
    history: [],           // Para back/forward
    bookmarks: []          // Ubicaciones guardadas
  },
  
  // Configuración visual
  display: {
    theme: 'dark',
    quality: 'high',       // high/medium/low
    particlesEnabled: true,
    labelsVisible: false,
    language: 'es'
  },
  
  // Datos
  data: {
    cache: Map(),          // Datos cargados
    subscriptions: Set(),  // Real-time feeds
    filters: Map()         // Filtros activos
  },
  
  // Usuario
  user: {
    role: 'manager',
    permissions: Set(),
    preferences: Map()
  }
};
```

### **8.3 Sistema de Navegación**

```javascript
class NavigationController {
  // Navegación por zoom
  zoom(direction) {
    if (direction === 'in' && this.canZoomIn()) {
      this.currentLevel++;
      this.loadLevel();
    } else if (direction === 'out' && this.canZoomOut()) {
      this.currentLevel--;
      this.loadLevel();
    }
  }
  
  // Navegación por click
  navigateTo(entity) {
    this.history.push(this.currentLocation);
    this.currentEntity = entity;
    this.loadEntity();
  }
  
  // Transición a Explorer
  enterExplorer(panelType) {
    this.transition.start(panelType);
    this.currentView = 'explorer';
    this.loadExplorer(panelType);
  }
}
```

### **8.4 Renderizado Adaptativo**

```javascript
class AdaptiveRenderer {
  render(level, entityCount) {
    // Complejidad visual inversa a elementos
    const complexity = this.calculateComplexity(entityCount);
    
    if (level <= 7) {
      // Metáfora urbana
      this.urbanRenderer.render({
        lod: complexity.lod,
        particles: complexity.particles,
        shadows: complexity.shadows
      });
    } else {
      // Explorer específico
      const explorerType = this.state.currentExplorer;
      this.explorers[explorerType].render();
    }
  }
  
  calculateComplexity(count) {
    if (count < 10) {
      return { lod: 'high', particles: true, shadows: true };
    } else if (count < 50) {
      return { lod: 'medium', particles: true, shadows: false };
    } else {
      return { lod: 'low', particles: false, shadows: false };
    }
  }
}
```

### **8.5 Conexión de Datos**

```javascript
class DataConnector {
  constructor(config) {
    this.sources = new Map();
    this.realtime = config.realtime || false;
    this.polling = config.polling || 5000; // 5 seconds
  }
  
  // Registrar fuente de datos
  registerSource(name, connector) {
    this.sources.set(name, connector);
  }
  
  // Obtener datos para nivel
  async getDataForLevel(level, entity) {
    const source = this.getSourceForLevel(level);
    const data = await source.fetch(entity);
    
    // Cache y transform
    this.cache.set(`${level}:${entity}`, data);
    return this.transform(data, level);
  }
  
  // Real-time updates
  subscribeToUpdates(level, entity, callback) {
    if (this.realtime) {
      const subscription = this.sources
        .get(level)
        .subscribe(entity, callback);
      this.subscriptions.add(subscription);
    }
  }
}
```

### **8.6 Configuración de Explorers**

```javascript
// Ejemplo: Process Explorer
class ProcessExplorer {
  constructor() {
    this.layout = 'horizontal-flow';
    this.nodeTypes = ['stage', 'decision', 'action'];
    this.connectionTypes = ['sequential', 'conditional', 'parallel'];
  }
  
  render(processData) {
    // Crear stages
    const stages = processData.stages.map(stage => 
      this.createStage(stage)
    );
    
    // Crear conexiones
    const connections = processData.flows.map(flow =>
      this.createConnection(flow)
    );
    
    // Layout automático
    this.layoutEngine.arrange(stages, connections);
    
    // Animar flujos
    this.animateFlows(processData.currentItems);
  }
  
  // Navegación interna
  navigateToStage(stageId) {
    this.focusOn(stageId);
    this.loadStageDetails(stageId);
  }
}
```

### **8.7 Performance y Optimización**

```javascript
const PerformanceConfig = {
  // Límites de renderizado
  maxParticles: 1000,
  maxBuildings: 200,
  maxConnections: 500,
  
  // Level of Detail (LOD)
  lodDistances: {
    high: 100,
    medium: 300,
    low: 1000
  },
  
  // Culling
  frustumCulling: true,
  occlusionCulling: true,
  
  // Batching
  instancedMeshes: true,
  geometryMerging: true,
  
  // Updates
  updateFrequency: {
    particles: 60,    // 60 fps
    metrics: 1,       // 1 fps
    structures: 0.1   // cada 10 segundos
  }
};
```

---

## **9. Reglas y Anti-Patrones**

### **9.1 Reglas Fundamentales**

#### **9.1.1 La Regla del Zoom Semántico**
- Cada nivel de zoom cambia la REPRESENTACIÓN, no solo el tamaño
- De abstracto (ciudad) a concreto (datos)
- De metafórico a literal

#### **9.1.2 La Regla de Complejidad Inversa**
- 1 elemento = mostrar todos los detalles
- 10 elementos = balance de información
- 100 elementos = máxima simplificación visual

#### **9.1.3 La Regla de Audiencia por Nivel**
- El nivel determina la visualización
- No hay "modo CEO" o "modo ingeniero"
- La misma persona usa diferentes niveles según necesidad

#### **9.1.4 La Regla de Navegación Natural**
- Si tiene sentido en el mundo real, tiene sentido en CompanyCity
- No forzar metáforas donde no encajan
- Permitir atajos cuando son lógicos

#### **9.1.5 La Regla de Transición Explícita**
- Cambios de paradigma deben ser anunciados
- Usuario siempre sabe dónde está
- Transiciones suaves y justificadas

### **9.2 Anti-Patrones a Evitar**

#### **9.2.1 ❌ NO Elementos de Juego**
- NO avatares o personajes
- NO puntos o achievements
- NO mecánicas de gameplay
- Es una herramienta profesional

#### **9.2.2 ❌ NO Literalidad Excesiva**
- NO personas caminando
- NO clima o día/noche
- NO vehículos o tráfico real
- Solo abstracciones funcionales

#### **9.2.3 ❌ NO Jerarquías Forzadas**
- NO hacer todo secuencial
- NO prohibir saltos de nivel
- NO un solo camino correcto

#### **9.2.4 ❌ NO Metáforas Mezcladas**
- NO cambiar de metáfora sin transición
- NO mezclar paradigmas en el mismo nivel
- NO confundir al usuario

#### **9.2.5 ❌ NO Complejidad Innecesaria**
- NO más de 12-15 niveles totales
- NO elementos decorativos sin función
- NO información irrelevante

#### **9.2.6 ❌ NO Sesgo Departamental**
- NO asumir que todos son IT
- NO usar jerga técnica en niveles altos
- NO favorecer un departamento

#### **9.2.7 ❌ NO Navegación Opaca**
- NO esconder la ubicación actual
- NO transiciones sin aviso
- NO pérdida de contexto

### **9.3 Patrones Recomendados**

#### **9.3.1 ✅ SÍ Feedback Constante**
- Mostrar siempre dónde estás
- Indicar qué puedes hacer
- Confirmar acciones realizadas

#### **9.3.2 ✅ SÍ Consistencia Visual**
- Mismo significado de colores
- Mismas interacciones
- Mismas animaciones

#### **9.3.3 ✅ SÍ Datos Reales**
- Conectar a sistemas reales
- Mostrar métricas actuales
- Permitir acciones reales

#### **9.3.4 ✅ SÍ Personalización**
- Permitir filtros
- Guardar vistas favoritas
- Configurar dashboards

#### **9.3.5 ✅ SÍ Accesibilidad**
- Soporte para keyboard
- Alto contraste opcional
- Screen readers
- Múltiples idiomas

---

## **10. Guías de Navegación**

### **10.1 Navegación por Rol**

#### **10.1.1 Ejecutivos (C-Suite)**
```
Flujo típico:
1. CITY → Vista general diaria
2. REGION → Análisis competitivo semanal
3. DISTRICT → Review departamental
4. METRICS EXPLORER → KPIs específicos

Atajos recomendados:
- Bookmark: City view con KPIs
- Bookmark: Region competitive view
- Alerts: Solo críticos
```

#### **10.1.2 Managers**
```
Flujo típico:
1. DISTRICT → Su departamento
2. ZONE → Su área específica
3. BUILDING → Procesos que gestiona
4. CONTROL CENTER → Monitoreo diario
5. EXPLORER → Según necesidad

Atajos recomendados:
- Direct to Control Center
- Saved filters por equipo
- Panel shortcuts
```

#### **10.1.3 Operaciones**
```
Flujo típico:
1. BUILDING → Proceso asignado
2. CONTROL CENTER → Status
3. SCREEN → Anomalías
4. PROCESS EXPLORER → Investigar
5. ACTION → Resolver

Atajos recomendados:
- Direct to alerts
- Quick access panels
- Favorite explorers
```

#### **10.1.4 Técnicos/IT**
```
Flujo típico:
1. ECOSYSTEM → Integraciones
2. BUILDING → Servicio específico
3. ROOFTOP → APIs
4. NETWORK EXPLORER → Arquitectura
5. DETAIL → Configuración

Atajos recomendados:
- Skip urban levels
- Direct to explorers
- Technical panels only
```

### **10.2 Navegación por Tarea**

#### **10.2.1 Investigar un Problema**
```
1. Empezar donde se reportó el problema
2. Zoom out para ver contexto
3. Zoom in para encontrar causa
4. Navegar lateralmente para verificar
5. Tomar acción correctiva
```

#### **10.2.2 Análisis Estratégico**
```
1. Empezar en REGION o CONTINENT
2. Comparar con competidores
3. Zoom in a áreas específicas
4. Identificar diferencias
5. Documentar insights
```

#### **10.2.3 Monitoreo Rutinario**
```
1. Empezar en vista guardada
2. Revisar alerts
3. Check metrics vs targets
4. Investigar anomalías
5. Actualizar status
```

#### **10.2.4 Presentación a Stakeholders**
```
1. Empezar con contexto (CITY o REGION)
2. Zoom gradual al punto específico
3. Mostrar data en explorer
4. Volver a contexto
5. Guardar recorrido
```

### **10.3 Atajos y Optimizaciones**

#### **10.3.1 Atajos de Teclado**
```
ESC         - Nivel anterior
SPACE       - Pausa animaciones
1-9         - Niveles directos
/           - Búsqueda rápida
B           - Bookmarks
H           - Home (City)
R           - Region view
E           - Ecosystem view
?           - Ayuda contextual
```

#### **10.3.2 Comandos de Búsqueda**
```
@building   - Buscar buildings
#process    - Buscar procesos
$metric     - Buscar métricas
%person     - Buscar personas
&system     - Buscar sistemas
```

#### **10.3.3 Filtros Rápidos**
```
:red        - Solo elementos críticos
:yellow     - Solo warnings
:active     - Solo elementos activos
:mine       - Solo mis responsabilidades
:recent     - Cambios recientes
```

---

## **11. Decisiones de Diseño**

### **11.1 Decisiones Fundamentales**

#### **11.1.1 ¿Por qué Zoom Bidireccional?**
**Decisión**: Permitir zoom tanto hacia afuera como hacia adentro
**Razón**: Las empresas no existen en aislamiento
**Beneficio**: Contexto completo para decisiones
**Trade-off**: Mayor complejidad inicial

#### **11.1.2 ¿Por qué Metáfora Urbana?**
**Decisión**: Usar ciudad como metáfora base
**Razón**: Universal, intuitiva, escalable
**Beneficio**: Curva de aprendizaje mínima
**Trade-off**: Puede parecer "juego" si no se cuida

#### **11.1.3 ¿Por qué Transición en Panel?**
**Decisión**: Panel se expande para cambiar de paradigma
**Razón**: Transición natural y justificada
**Beneficio**: Usuario entiende el cambio
**Trade-off**: Limita a expansión de panels

#### **11.1.4 ¿Por qué 12 Explorers?**
**Decisión**: Tener 12 tipos diferentes de explorer
**Razón**: Cubrir todos los casos de uso empresariales
**Beneficio**: Flexibilidad total
**Trade-off**: Más desarrollo y mantenimiento

### **11.2 Decisiones de Implementación**

#### **11.2.1 Control Center en Basement**
**Decisión**: Poner el centro de control abajo
**Razón**: Metáfora de bunker de operaciones
**Alternativa considerada**: Penthouse
**Resultado**: Más coherente con realidad

#### **11.2.2 ZONE Siempre Presente**
**Decisión**: Siempre tener nivel Zone, no opcional
**Razón**: Evitar confusión de navegación
**Alternativa considerada**: Block opcional
**Resultado**: Jerarquía consistente

#### **11.2.3 Floors como Módulos**
**Decisión**: Floors representan módulos de proceso, no espacios físicos
**Razón**: Empresas son distribuidas
**Alternativa considerada**: Floors con oficinas
**Resultado**: Más honesto y flexible

#### **11.2.4 Screen con Zoom Propio**
**Decisión**: Screen puede hacer zoom semántico
**Razón**: Evitar navegación excesiva
**Alternativa considerada**: Más niveles físicos
**Resultado**: Más eficiente

### **11.3 Decisiones Diferidas**

Estas decisiones se toman por implementación:

1. **Número exacto de niveles externos** (2-4)
2. **Tipos de panels disponibles** por contexto
3. **Explorers incluidos** en versión 1
4. **Profundidad máxima** de navegación
5. **Personalización** permitida

---

## **12. Apéndices**

### **12.1 Glosario de Términos**

**Building**: Proceso empresarial completo representado como edificio
**City**: Representación visual de toda la empresa
**District**: Departamento o división principal
**Explorer**: Vista especializada post-transición
**Floor**: Módulo o etapa dentro de un proceso
**Panel**: Widget en un dashboard que puede expandirse
**Transition**: Cambio de metáfora urbana a vista especializada
**Zone**: Agrupación funcional dentro de un district

### **12.2 Mapeo Departamento-Visualización**

| Departamento | Buildings Comunes | Explorers Principales |
|--------------|-------------------|----------------------|
| Sales | Lead Mgmt, Pipeline, Accounts | Process, Metrics, Map |
| Finance | AR, AP, Tax, Treasury | Timeline, Matrix, Metrics |
| HR | Hiring, Onboarding, Performance | Process, Hierarchy, Form |
| IT | Infrastructure, Apps, Security | Network, Alert, Inventory |
| Operations | Supply Chain, Logistics, Quality | Process, Map, Kanban |
| Marketing | Campaigns, Content, Brand | Timeline, Kanban, Metrics |

### **12.3 Métricas Clave por Nivel**

| Nivel | Métricas Típicas | Frecuencia Update |
|-------|------------------|-------------------|
| Planet | GDP, Market Size | Quarterly |
| Continent | Industry Growth | Monthly |
| Region | Market Share | Weekly |
| Ecosystem | Partner Status | Daily |
| City | Revenue, Headcount | Real-time |
| District | Dept KPIs | Hourly |
| Building | Process Metrics | Real-time |
| Explorer | Specific to Type | Real-time |

### **12.4 Checklist de Implementación**

#### **Fase 1: MVP**
- [ ] City view básico
- [ ] 3-5 Districts
- [ ] 10-15 Buildings
- [ ] Control Center básico
- [ ] 3 Explorers (Process, Network, Metrics)
- [ ] Navegación básica
- [ ] Mock data

#### **Fase 2: Expansión**
- [ ] Ecosystem view
- [ ] Todos los Explorers
- [ ] Real-time data
- [ ] Personalización
- [ ] Búsqueda avanzada
- [ ] Bookmarks
- [ ] Colaboración

#### **Fase 3: Avanzado**
- [ ] Region/Continent views
- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Mobile version
- [ ] VR/AR support
- [ ] API pública
- [ ] Marketplace de plugins

### **12.5 Referencias y Recursos**

**Inspiración Visual**:
- SimCity (estructura urbana)
- Google Maps (navegación)
- Bloomberg Terminal (densidad de información)
- Minority Report (interfaces futuristas)

**Tecnologías Recomendadas**:
- Three.js (3D rendering)
- D3.js (data visualization)
- React (UI framework)
- WebGL (performance)
- WebSockets (real-time)

**Principios de Diseño**:
- Information Architecture (Rosenfeld & Morville)
- Visual Display of Quantitative Information (Tufte)
- Designing Interfaces (Tidwell)
- Don't Make Me Think (Krug)

---

## **Conclusión**

CompanyCity representa un nuevo paradigma en la visualización y navegación de información empresarial. Al combinar la intuición de las metáforas urbanas con la potencia de las visualizaciones de datos modernas, crea un espacio donde la complejidad se vuelve comprensible y la información se vuelve accionable.

Este documento contiene todo lo necesario para entender, diseñar e implementar CompanyCity. Es un sistema vivo que evolucionará con las necesidades de sus usuarios, pero los principios fundamentales aquí establecidos garantizan que esa evolución será coherente y valuable.

La visión es clara: hacer que cada empresa pueda ver, entender y optimizar su funcionamiento como nunca antes. No es solo una herramienta de visualización, es una nueva forma de pensar sobre las organizaciones.

**CompanyCity: Donde la complejidad se vuelve claridad.**

---

*Documento versión 1.0 - Completo y autocontenido*
