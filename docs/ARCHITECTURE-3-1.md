# **CompanyCity: Documento Maestro de Arquitectura y Diseño**

## **Tabla de Contenidos**

1. [Visión y Concepto](#1-visión-y-concepto)
2. [Arquitectura de Navegación Completa](#2-arquitectura-de-navegación-completa)
3. [Detalle de Cada Nivel](#3-detalle-de-cada-nivel)
4. [Sistema de Transiciones](#4-sistema-de-transiciones)
5. [Tipos de Explorer](#5-tipos-de-explorer)
6. [Metáforas Visuales](#6-metáforas-visuales)
7. [Casos de Uso Detallados](#7-casos-de-uso-detallados)
8. [Principios de Diseño](#8-principios-de-diseño)
9. [Implementación Técnica](#9-implementación-técnica)
10. [Configuración por Industria](#10-configuración-por-industria)
11. [Anti-Patrones](#11-anti-patrones)
12. [Decisiones de Diseño](#12-decisiones-de-diseño)
13. [Glosario](#13-glosario)
14. [FAQ](#14-faq)

---

## **1. Visión y Concepto**

### **1.1 Qué es CompanyCity**

CompanyCity es una plataforma de visualización empresarial que representa organizaciones como ciudades digitales navegables, permitiendo a usuarios explorar desde el contexto global del mercado hasta el detalle operativo más granular a través de una metáfora espacial coherente.

### **1.2 Problema que Resuelve**

Las empresas modernas son sistemas complejos con miles de procesos interconectados. Las herramientas actuales:
- Muestran vistas aisladas sin contexto
- Requieren múltiples plataformas para diferentes niveles
- No comunican efectivamente entre audiencias técnicas y ejecutivas
- Fallan en mostrar relaciones y dependencias

CompanyCity unifica todo en una experiencia navegable intuitiva.

### **1.3 Principio Core: Zoom Contextual Bidireccional**

```
CONTEXTO EXTERNO                                           DETALLE INTERNO
←───────────────────────────────────────────────────────────────────────→
Planeta → Continente → Región → CIUDAD → Distrito → Building → Operación
```

La empresa (CITY) es el punto cero desde el cual puedes:
- **Zoom Out**: Ver contexto de mercado, industria, economía global
- **Zoom In**: Navegar departamentos, procesos, hasta acciones específicas

### **1.4 Propuesta de Valor**

1. **Unificación**: Una plataforma para todos los niveles organizacionales
2. **Intuición**: Metáfora urbana que todos entienden inmediatamente
3. **Contexto**: Siempre sabes dónde estás y cómo se relaciona con todo
4. **Acción**: De la visualización a la ejecución en el mismo sistema
5. **Escalabilidad**: Funciona para startups de 10 personas o corporaciones de 100,000

---

## **2. Arquitectura de Navegación Completa**

### **2.1 Jerarquía de 17 Niveles**

```
NIVEL   NOMBRE          TIPO        DESCRIPCIÓN
-3      PLANET          Contexto    Economía global, múltiples industrias
-2      CONTINENT       Contexto    Industria/sector específico
-1      REGION          Contexto    Mercado directo, competidores
 0      ECOSYSTEM       Frontera    Tu empresa + partners + integraciones
+1      CITY            Interno     Vista completa de tu empresa
+2      DISTRICT        Interno     Departamento principal
+3      ZONE            Interno     Área funcional del departamento
+4      BUILDING        Interno     Proceso empresarial completo
+5      CONTROL CENTER  Interno     Centro de monitoreo del building
+6      SCREEN          Interno     Dashboard principal
+7      PANEL           Interno     Widget específico en dashboard
────────────────────── TRANSICIÓN DIMENSIONAL ──────────────────────
+8      EXPLORER        Digital     Vista especializada según panel
+9      ELEMENT         Digital     Componente dentro del explorer
+10     DETAIL          Digital     Información del elemento
+11     ACTION          Digital     Comando ejecutable
```

### **2.2 Rutas de Navegación**

```
A. RUTA ESTRATÉGICA (Zoom Out)
   CITY → REGION → CONTINENT → PLANET
   
B. RUTA OPERATIVA (Zoom In)
   CITY → DISTRICT → ZONE → BUILDING → CONTROL → SCREEN → PANEL → EXPLORER
   
C. RUTA DIRECTA (Saltos)
   Cualquier nivel → Cualquier nivel (vía breadcrumb o búsqueda)
```

---

## **3. Detalle de Cada Nivel**

### **Nivel -3: PLANET**

**Qué es**: Vista de economía global
**Metáfora**: Planeta con continentes económicos
**Elementos visuales**:
- Continentes = Grandes bloques económicos (Americas, EMEA, APAC)
- Océanos = Barreras comerciales
- Corrientes = Flujos de capital
- Clima = Condiciones económicas

**Información mostrada**:
- GDP por región
- Tendencias macro-económicas
- Flujos de comercio internacional
- Indicadores económicos globales

**Interacciones**:
- Click en continente → Zoom a CONTINENT
- Hover → Preview de métricas regionales
- Timeline → Ver evolución histórica

**Caso de uso**: CEO preparando expansión global

---

### **Nivel -2: CONTINENT**

**Qué es**: Vista de industria/sector
**Metáfora**: Continente con países como sectores
**Elementos visuales**:
- Países = Subsectores de industria
- Ciudades principales = Empresas líderes
- Infraestructura = Cadenas de suministro
- Fronteras = Barreras regulatorias

**Información mostrada**:
- Tamaño de mercado por sector
- Crecimiento anual
- Principales players
- Regulaciones clave

**Interacciones**:
- Click en región → Zoom a REGION
- Comparar subsectores
- Ver tendencias industriales

**Caso de uso**: VP Strategy analizando oportunidades de mercado

---

### **Nivel -1: REGION**

**Qué es**: Mercado directo y competencia
**Metáfora**: Región con múltiples ciudades
**Elementos visuales**:
- Ciudades = Empresas competidoras
- Tamaño = Market share
- Brillo = Crecimiento
- Conexiones = Partnerships

**Información mostrada**:
- Market share por empresa
- Tasas de crecimiento
- Movimientos competitivos
- Alianzas estratégicas

**Interacciones**:
- Click en ciudad → Ver detalles públicos
- Comparar métricas
- Analizar posicionamiento

**Caso de uso**: CMO planificando estrategia competitiva

---

### **Nivel 0: ECOSYSTEM**

**Qué es**: Frontera entre tu empresa y el mundo
**Metáfora**: Área metropolitana extendida
**Elementos visuales**:
- Centro = Tu ciudad (empresa)
- Suburbios = Partners cercanos
- Zonas industriales = Proveedores
- Aeropuertos = APIs públicas
- Carreteras = Integraciones

**Información mostrada**:
- Mapa de partners
- Volumen de transacciones
- Dependencias críticas
- Estado de integraciones

**Interacciones**:
- Click en partner → Ver detalles de relación
- Gestionar integraciones
- Monitorear SLAs

**Caso de uso**: COO revisando cadena de suministro digital

---

### **Nivel +1: CITY**

**Qué es**: Vista completa de tu empresa
**Metáfora**: Ciudad vista desde arriba
**Elementos visuales**:
- Hexágonos flotantes = Districts (departamentos)
- Tamaño = Headcount o presupuesto
- Altura = Performance
- Color = Estado (verde/amarillo/rojo)
- Partículas = Flujo de trabajo entre districts

**Información mostrada**:
- KPIs por departamento
- Flujos interdepartamentales
- Estado general de salud
- Alertas críticas

**Interacciones**:
- Click en district → Zoom in
- Drag para rotar vista
- Filtros por métricas
- Vista temporal

**Caso de uso**: CEO en daily dashboard review

---

### **Nivel +2: DISTRICT**

**Qué es**: Departamento principal
**Metáfora**: Distrito urbano expandido
**Elementos visuales**:
- Plataforma hexagonal principal
- Zones = Subdivisiones del departamento
- Puentes = Conexiones con otros districts
- Actividad = Partículas y pulsos

**Información mostrada**:
- Organigrama del departamento
- Presupuesto y gastos
- Proyectos activos
- Métricas departamentales

**Interacciones**:
- Click en zone → Navegar
- Ver recursos asignados
- Monitorear proyectos
- Acceder a reportes

**Caso de uso**: VP Finance revisando sus divisiones

---

### **Nivel +3: ZONE**

**Qué es**: División funcional del departamento
**Metáfora**: Zona o campus de buildings
**Elementos visuales**:
- Plataforma con múltiples buildings
- Buildings = Procesos principales
- Calles = Flujos de datos
- Plazas = Puntos de integración

**Información mostrada**:
- Procesos de la división
- Interconexiones
- Cuellos de botella
- Eficiencia general

**Interacciones**:
- Click en building → Explorar proceso
- Reconfigurar flujos
- Identificar optimizaciones
- Comparar procesos

**Caso de uso**: Director optimizando su área

---

### **Nivel +4: BUILDING**

**Qué es**: Proceso empresarial completo
**Metáfora**: Edificio con múltiples pisos
**Elementos visuales**:
```
BUILDING Structure:
├── ROOFTOP    [APIs, webhooks, conexiones externas]
├── FLOOR 3    [Etapa 3 del proceso]
├── FLOOR 2    [Etapa 2 del proceso]
├── FLOOR 1    [Etapa 1 del proceso]
├── LOBBY      [Entrada y directorio]
└── BASEMENT   [Control Center]
```

**Información mostrada**:
- Estado por etapa (floor)
- Flujo vertical de trabajo
- Integraciones externas (rooftop)
- Centro de control (basement)

**Interacciones**:
- Entrar al building → Apareces en LOBBY
- Elevator a cualquier floor
- Acceder a control center
- Ver conexiones externas

**Caso de uso**: Process Owner monitoreando su proceso

---

### **Nivel +4.5: LOBBY**

**Qué es**: Punto de entrada al building
**Metáfora**: Lobby de edificio corporativo
**Elementos visuales**:
- Directorio de floors
- Elevator banks
- Reception desk con info screens
- Escaleras a basement (Control Center)

**Información mostrada**:
- Estado de cada floor
- Alertas del building
- Métricas generales
- Guía de navegación

**Interacciones**:
- Elegir floor vía elevator
- Ir a Control Center
- Ver información general
- Acceso rápido a problemas

**Caso de uso**: Llegada inicial para diagnóstico

---

### **Nivel +5: CONTROL CENTER**

**Qué es**: Centro de monitoreo del building
**Metáfora**: Sala de control en basement
**Elementos visuales**:
- Múltiples pantallas
- Consolas de operación
- Mapa del building
- Indicadores en tiempo real

**Información mostrada**:
- Vista consolidada del proceso
- Métricas en tiempo real
- Alertas y excepciones
- Estado de cada floor

**Interacciones**:
- Acercarse a screen principal
- Cambiar vistas
- Acceder a controles
- Iniciar acciones

**Caso de uso**: Supervisor monitoreando operación

---

### **Nivel +6: SCREEN**

**Qué es**: Dashboard principal en control center
**Metáfora**: Pantalla grande con grid de panels
**Elementos visuales**:
```
┌─────────────┬──────────────┬─────────────┐
│ Process     │ Performance  │ Alerts      │
│ Flow        │ Metrics      │             │
├─────────────┼──────────────┼─────────────┤
│ Network     │ Financial    │ Timeline    │
│ View        │ Dashboard    │             │
├─────────────┼──────────────┼─────────────┤
│ People      │ Capacity     │ Reports     │
│ Org         │ Planning     │             │
└─────────────┴──────────────┴─────────────┘
```

**Información mostrada**:
- Múltiples vistas simultáneas
- KPIs principales
- Alertas consolidadas
- Vistas especializadas

**Interacciones**:
- Click en panel → Expandir
- Reorganizar layout
- Cambiar contenido de panels
- Filtros globales

**Caso de uso**: Vista integral del proceso

---

### **Nivel +7: PANEL**

**Qué es**: Widget específico en el dashboard
**Metáfora**: Panel interactivo que puede expandirse
**Tipos de panels**:
1. Process Flow Panel
2. Network Architecture Panel
3. Organization Chart Panel
4. Financial Metrics Panel
5. Timeline History Panel
6. Geographic Distribution Panel
7. Performance KPIs Panel
8. Alerts & Issues Panel

**Información mostrada**:
- Vista miniaturizada del explorer
- Métricas clave
- Preview interactivo
- Botón de expansión

**Interacciones**:
- Hover → Preview ampliado
- Click → Expandir a pantalla completa
- Configurar → Cambiar parámetros
- Refresh → Actualizar datos

**Caso de uso**: Punto de entrada a análisis profundo

---

### **TRANSICIÓN DIMENSIONAL**

**Qué pasa**: El panel seleccionado se expande hasta ocupar toda la pantalla
**Animación**:
1. Panel se ilumina
2. Otros panels se desvanecen
3. Panel crece suavemente
4. Fondo urbano se disuelve
5. Aparece mensaje: "Entering [Type] Explorer..."
6. Nueva vista se materializa

**Duración**: 1.2 segundos
**Propósito**: Cambio claro de contexto de navegación urbana a exploración digital

---

### **Nivel +8: EXPLORER**

**Qué es**: Vista especializada según el panel elegido
**Tipos disponibles**:

#### **8.1 PROCESS EXPLORER**
- Muestra flujo de proceso completo
- Navegación: Stage → Step → Task → Instance
- Visualización: Diagrama de flujo interactivo

#### **8.2 NETWORK EXPLORER**
- Muestra arquitectura de sistemas
- Navegación: System → Service → Component → Config
- Visualización: Grafo de nodos conectados

#### **8.3 ORGANIZATION EXPLORER**
- Muestra estructura de personas
- Navegación: Division → Team → Role → Person
- Visualización: Organigrama expandible

#### **8.4 FINANCIAL EXPLORER**
- Muestra flujos de dinero
- Navegación: Statement → Account → Transaction → Detail
- Visualización: Sankey diagrams y tablas

#### **8.5 TIMELINE EXPLORER**
- Muestra evolución temporal
- Navegación: Period → Event → Change → Impact
- Visualización: Timeline interactivo

#### **8.6 METRICS EXPLORER**
- Muestra KPIs y métricas
- Navegación: Category → Metric → Breakdown → Datapoint
- Visualización: Dashboards analíticos

**Caso de uso**: Análisis profundo especializado

---

### **Nivel +9: ELEMENT**

**Qué es**: Componente específico dentro del explorer
**Ejemplos por explorer**:
- Process: Una etapa específica del proceso
- Network: Un servicio o sistema
- Organization: Un equipo o rol
- Financial: Una cuenta o categoría
- Timeline: Un evento específico
- Metrics: Un KPI particular

**Información mostrada**:
- Detalles del elemento
- Conexiones directas
- Métricas propias
- Estado actual
- Histórico reciente

**Interacciones**:
- Click → Ver más detalle
- Acciones contextuales
- Comparar con similares
- Ver dependencias

**Caso de uso**: Foco en componente problemático

---

### **Nivel +10: DETAIL**

**Qué es**: Información granular del elemento
**Visualización**: Panel lateral o modal con tabs
**Tabs típicos**:
- Overview: Resumen ejecutivo
- Metrics: Datos y gráficos
- History: Cambios y eventos
- Connections: Relaciones
- Configuration: Settings
- Actions: Comandos disponibles

**Información mostrada**:
- Datos completos
- Configuración actual
- Logs relevantes
- Documentación
- Ownership

**Interacciones**:
- Editar configuración
- Ver logs completos
- Exportar datos
- Iniciar acciones

**Caso de uso**: Debugging o configuración

---

### **Nivel +11: ACTION**

**Qué es**: Comando ejecutable
**Tipos de acciones**:
- Operativas: Start, Stop, Restart
- Configuración: Update, Rollback
- Escalación: Notify, Escalate
- Análisis: Generate Report, Export
- Correctivas: Fix, Patch, Resolve

**Visualización**: 
- Modal de confirmación
- Formulario de parámetros
- Preview de impacto
- Botón de ejecución

**Proceso**:
1. Seleccionar acción
2. Configurar parámetros
3. Revisar impacto
4. Confirmar ejecución
5. Ver resultado

**Caso de uso**: Resolución de problemas

---

## **4. Sistema de Transiciones**

### **4.1 Tipos de Transición**

#### **Zoom Continuo**
- Entre niveles adyacentes de la misma metáfora
- Suave, mantiene contexto
- 500ms duración
- Ejemplo: CITY → DISTRICT

#### **Jump Cut**
- Saltos de múltiples niveles
- Rápido, directo
- 300ms duración
- Ejemplo: CITY → BUILDING (vía búsqueda)

#### **Portal Transition**
- Cambio de metáfora (urbana → digital)
- Elaborada, marca cambio de contexto
- 1200ms duración
- Ejemplo: PANEL → EXPLORER

#### **Lateral Slide**
- Entre elementos del mismo nivel
- Horizontal, mantiene altitud
- 400ms duración
- Ejemplo: DISTRICT A → DISTRICT B

### **4.2 Preservación de Contexto**

- **Breadcrumb**: Siempre visible, clickeable
- **Mini-map**: Opcional, muestra posición
- **Preview on hover**: Antes de navegar
- **Historial**: Botones back/forward
- **Bookmarks**: Guardar vistas frecuentes

---

## **5. Tipos de Explorer**

### **5.1 PROCESS EXPLORER**

**Propósito**: Visualizar y optimizar flujos de trabajo
**Metáfora visual**: Diagrama de flujo 3D navegable
**Elementos**:
- Stages: Cajas principales del proceso
- Steps: Subdivisiones de stages
- Decisiones: Diamantes de bifurcación
- Conectores: Flechas de flujo
- Entidades: Partículas fluyendo

**Navegación**:
```
PROCESS MAP (nivel 8)
└── STAGE (nivel 9)
    └── STEP (nivel 10)
        └── INSTANCE (nivel 11)
```

**Métricas mostradas**:
- Throughput por stage
- Tiempo promedio por step
- Tasa de error
- Cuellos de botella
- SLA compliance

**Acciones disponibles**:
- Reconfigurar flujo
- Ajustar reglas
- Escalar recursos
- Redirigir excepciones
- Pausar/reanudar proceso

---

### **5.2 NETWORK EXPLORER**

**Propósito**: Visualizar arquitectura técnica
**Metáfora visual**: Grafo de red 3D
**Elementos**:
- Nodes: Servicios/sistemas
- Edges: Conexiones/dependencias
- Clusters: Agrupaciones lógicas
- Tráfico: Partículas en edges
- Estado: Colores y pulsos

**Navegación**:
```
SYSTEM MAP (nivel 8)
└── SERVICE (nivel 9)
    └── COMPONENT (nivel 10)
        └── CONFIGURATION (nivel 11)
```

**Métricas mostradas**:
- Latencia entre nodos
- Throughput de conexiones
- Error rates
- Dependencias críticas
- Versiones deployadas

**Acciones disponibles**:
- Deploy nueva versión
- Escalar horizontal/vertical
- Activar/desactivar servicio
- Cambiar routing
- Ver logs

---

### **5.3 ORGANIZATION EXPLORER**

**Propósito**: Navegar estructura humana
**Metáfora visual**: Organigrama 3D expandible
**Elementos**:
- Divisiones: Contenedores principales
- Teams: Grupos dentro de divisiones
- Roles: Posiciones definidas
- Personas: Individuos asignados
- Vacantes: Posiciones abiertas

**Navegación**:
```
ORG CHART (nivel 8)
└── DIVISION (nivel 9)
    └── TEAM (nivel 10)
        └── PERSON (nivel 11)
```

**Métricas mostradas**:
- Headcount por área
- Utilización
- Performance ratings
- Tenure promedio
- Skills matrix

**Acciones disponibles**:
- Reorganizar estructura
- Asignar personas
- Crear vacantes
- Contactar individuo
- Ver reportes

---

### **5.4 FINANCIAL EXPLORER**

**Propósito**: Analizar flujos monetarios
**Metáfora visual**: Sankey diagram multinivel
**Elementos**:
- Fuentes: Origen de fondos
- Flujos: Movimiento de dinero
- Destinos: Uso de fondos
- Nodos: Puntos de transformación
- Métricas: Valores y porcentajes

**Navegación**:
```
FINANCIAL OVERVIEW (nivel 8)
└── STATEMENT (nivel 9)
    └── ACCOUNT (nivel 10)
        └── TRANSACTION (nivel 11)
```

**Métricas mostradas**:
- Revenue streams
- Cost centers
- Profit margins
- Cash flow
- Budget vs actual

**Acciones disponibles**:
- Drill down en cuentas
- Ajustar presupuestos
- Aprobar transacciones
- Generar reportes
- Exportar data

---

### **5.5 TIMELINE EXPLORER**

**Propósito**: Analizar evolución temporal
**Metáfora visual**: Timeline 3D navegable
**Elementos**:
- Períodos: Segmentos de tiempo
- Eventos: Puntos en timeline
- Cambios: Transiciones marcadas
- Tendencias: Líneas de evolución
- Hitos: Markers importantes

**Navegación**:
```
TIMELINE VIEW (nivel 8)
└── PERIOD (nivel 9)
    └── EVENT (nivel 10)
        └── CHANGE DETAIL (nivel 11)
```

**Métricas mostradas**:
- Tendencias temporales
- Frecuencia de eventos
- Duración de períodos
- Impacto de cambios
- Proyecciones

**Acciones disponibles**:
- Cambiar escala temporal
- Comparar períodos
- Analizar tendencias
- Exportar historia
- Crear proyecciones

---

### **5.6 METRICS EXPLORER**

**Propósito**: Dashboard analítico profundo
**Metáfora visual**: Grid de visualizaciones
**Elementos**:
- Gráficos: Líneas, barras, pie
- Gauges: Indicadores circulares
- Tablas: Datos tabulares
- Heatmaps: Matrices de color
- Scorecards: KPIs destacados

**Navegación**:
```
METRICS DASHBOARD (nivel 8)
└── CATEGORY (nivel 9)
    └── METRIC (nivel 10)
        └── DATA POINT (nivel 11)
```

**Métricas mostradas**:
- KPIs por categoría
- Comparativas
- Correlaciones
- Distribuciones
- Anomalías

**Acciones disponibles**:
- Filtrar datos
- Cambiar períodos
- Exportar visuales
- Crear alertas
- Compartir dashboard

---

### **5.7 MAP EXPLORER**

**Propósito**: Visualización geográfica
**Metáfora visual**: Mapa interactivo 3D
**Elementos**:
- Regiones: Áreas geográficas
- Puntos: Ubicaciones específicas
- Rutas: Conexiones físicas
- Calor: Densidad de actividad
- Clusters: Agrupaciones

**Navegación**:
```
WORLD MAP (nivel 8)
└── REGION (nivel 9)
    └── LOCATION (nivel 10)
        └── SITE DETAIL (nivel 11)
```

**Métricas mostradas**:
- Distribución geográfica
- Densidad por región
- Rutas de distribución
- Tiempo de respuesta
- Cobertura de servicio

**Acciones disponibles**:
- Zoom a región
- Ver rutas óptimas
- Analizar cobertura
- Planificar expansión
- Optimizar distribución

---

### **5.8 INVENTORY EXPLORER**

**Propósito**: Gestión de catálogos y recursos
**Metáfora visual**: Grid 3D filtrable
**Elementos**:
- Categorías: Agrupaciones lógicas
- Items: Elementos individuales
- Atributos: Propiedades
- Stock: Cantidades
- Estados: Disponibilidad

**Navegación**:
```
CATALOG VIEW (nivel 8)
└── CATEGORY (nivel 9)
    └── ITEM (nivel 10)
        └── SKU DETAIL (nivel 11)
```

**Métricas mostradas**:
- Stock levels
- Turnover rate
- Valor inventory
- Aging
- Disponibilidad

**Acciones disponibles**:
- Buscar items
- Filtrar por atributos
- Ajustar cantidades
- Crear órdenes
- Transferir stock

---

### **5.9 KANBAN EXPLORER**

**Propósito**: Gestión visual de tareas
**Metáfora visual**: Board con columnas 3D
**Elementos**:
- Columnas: Estados del proceso
- Cards: Tareas/items
- Swimlanes: Categorías
- WIP limits: Límites visuales
- Avatars: Asignaciones

**Navegación**:
```
BOARD VIEW (nivel 8)
└── COLUMN (nivel 9)
    └── CARD (nivel 10)
        └── TASK DETAIL (nivel 11)
```

**Métricas mostradas**:
- WIP por columna
- Cycle time
- Lead time
- Blockers
- Throughput

**Acciones disponibles**:
- Mover cards
- Asignar personas
- Cambiar prioridad
- Resolver blockers
- Archivar completados

---

### **5.10 FORM EXPLORER**

**Propósito**: Entrada y configuración de datos
**Metáfora visual**: Formulario multi-sección
**Elementos**:
- Tabs: Secciones principales
- Fieldsets: Grupos de campos
- Fields: Inputs individuales
- Validaciones: Reglas visuales
- Progress: Completitud

**Navegación**:
```
FORM VIEW (nivel 8)
└── SECTION (nivel 9)
    └── FIELD GROUP (nivel 10)
        └── FIELD DETAIL (nivel 11)
```

**Métricas mostradas**:
- Completitud
- Errores de validación
- Campos requeridos
- Dependencias
- Historial de cambios

**Acciones disponibles**:
- Llenar campos
- Validar datos
- Guardar borrador
- Enviar formulario
- Ver historial

---

### **5.11 REPORT EXPLORER**

**Propósito**: Documentación estructurada
**Metáfora visual**: Documento navegable
**Elementos**:
- Secciones: Capítulos principales
- Subsecciones: Temas específicos
- Contenido: Texto, tablas, gráficos
- Referencias: Links y citas
- Anexos: Material adicional

**Navegación**:
```
REPORT VIEW (nivel 8)
└── CHAPTER (nivel 9)
    └── SECTION (nivel 10)
        └── PARAGRAPH (nivel 11)
```

**Métricas mostradas**:
- Longitud
- Última actualización
- Autores
- Versión
- Estado revisión

**Acciones disponibles**:
- Navegar contenido
- Buscar texto
- Exportar PDF
- Compartir link
- Editar secciones

---

### **5.12 ALERT EXPLORER**

**Propósito**: Gestión de notificaciones
**Metáfora visual**: Centro de comandos
**Elementos**:
- Severidades: Critical, Warning, Info
- Categorías: Tipos de alerta
- Timeline: Orden temporal
- Clusters: Agrupaciones
- Estado: Nueva, vista, resuelta

**Navegación**:
```
ALERT CENTER (nivel 8)
└── CATEGORY (nivel 9)
    └── ALERT (nivel 10)
        └── INCIDENT DETAIL (nivel 11)
```

**Métricas mostradas**:
- Alertas por severidad
- Tiempo de respuesta
- Tasa de resolución
- Recurrencia
- Impacto

**Acciones disponibles**:
- Acknowledge alert
- Asignar responsable
- Escalar issue
- Resolver alerta
- Configurar reglas

---

## **6. Metáforas Visuales**

### **6.1 Paleta de Colores**

#### **Colores Primarios**
```css
--primary-bg: #0a0a0f;        /* Fondo base negro profundo */
--secondary-bg: #14141f;       /* Fondo secundario */
--tertiary-bg: #1a1a2e;        /* Fondo terciario */

--accent-success: #00ff88;     /* Verde neón - positivo */
--accent-info: #00aaff;        /* Azul eléctrico - información */
--accent-warning: #ff6b00;     /* Naranja - advertencia */
--accent-danger: #ff0055;      /* Rojo neón - peligro */
--accent-special: #8b5cf6;     /* Púrpura - especial/transición */

--text-primary: #ffffff;       /* Texto principal */
--text-secondary: #8a8aa0;     /* Texto secundario */
--text-muted: #4a4a5e;         /* Texto deshabilitado */
```

#### **Colores por Estado**
- Verde (#00ff88): Operacional, saludable, dentro de límites
- Amarillo (#ffaa00): Advertencia, cerca de límites, atención
- Rojo (#ff0055): Crítico, falla, acción inmediata
- Azul (#00aaff): Información, neutral, en proceso
- Púrpura (#8b5cf6): Transición, portal, especial
- Gris (#8a8aa0): Inactivo, pausado, sin datos

### **6.2 Tipografía**

```css
--font-primary: -apple-system, 'Inter', 'SF Pro Display', sans-serif;
--font-mono: 'SF Mono', 'JetBrains Mono', 'Monaco', monospace;

/* Tamaños */
--text-xs: 11px;     /* Labels, metadata */
--text-sm: 13px;     /* Body text */
--text-base: 15px;   /* Default */
--text-lg: 18px;     /* Subtitles */
--text-xl: 24px;     /* Titles */
--text-2xl: 32px;    /* Headers */
```

### **6.3 Elementos Visuales**

#### **Buildings (Metáfora Urbana)**
- Forma base: Prisma rectangular
- Material: Semi-transparente con bordes luminosos
- Altura: Proporcional a importancia/volumen
- Textura: Gradiente vertical suave
- Efectos: Glow sutil, sombras proyectadas

#### **Hexágonos (Districts/Zones)**
- Forma: Hexágono regular
- Borde: 2px luminoso color district
- Relleno: 10% opacidad del color
- Efecto: Pulso suave en hover
- Elevación: Sombra sutil

#### **Partículas (Data Flow)**
- Forma: Esfera pequeña (2-5px radio)
- Color: Según tipo de dato
- Trail: Estela semi-transparente
- Velocidad: Variable según carga
- Glow: Efecto bloom sutil

#### **Conexiones**
- Urbanas: Calles/puentes con tráfico
- Técnicas: Líneas bezier con gradiente
- Grosor: Proporcional a volumen
- Animación: Pulso direccional
- Transparencia: 30-70% según distancia

### **6.4 Animaciones**

```javascript
// Tiempos estándar
const animations = {
  instant: 0,
  fast: 200,      // Hovers, estados
  normal: 400,    // Transiciones UI
  slow: 600,      // Navegación nivel
  portal: 1200    // Cambio de metáfora
};

// Curvas de animación
const easings = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};
```

### **6.5 Efectos Especiales**

#### **Fog/Atmósfera**
- Niveles urbanos: Niebla sutil para profundidad
- Distancia: 100-500 unidades
- Color: Ligeramente azulado (#0a0a1a)
- Densidad: Aumenta con distancia

#### **Iluminación**
- Ambient: 40% gris neutro
- Directional: Sol/luna según hora
- Point lights: En buildings activos
- Emissive: Elementos interactivos

#### **Post-processing**
- Bloom: Elementos luminosos
- Vignette: Sutil en bordes
- Chromatic aberration: Mínima
- Anti-aliasing: FXAA/TAA

---

## **7. Casos de Uso Detallados**

### **7.1 CEO: Review Matutino**

**Contexto**: CEO inicia su día revisando estado global
**Tiempo**: 5-10 minutos
**Ruta de navegación**:

1. **CITY** (30 segundos)
   - Vista general de la empresa
   - Identifica districts en amarillo/rojo
   - Nota: Sales y Operations con problemas

2. **REGION** (1 minuto) - Zoom out
   - Compara con competencia
   - Nota: Competidor ganando market share

3. **CITY → SALES DISTRICT** (2 minutos)
   - Revenue 15% bajo forecast
   - Pipeline conversion degradándose
   - Click en "Pipeline Management Zone"

4. **ZONE → BUILDING** (2 minutos)
   - Lead Qualification Building en rojo
   - Entra al Control Center
   - Ve bottleneck en scoring

5. **SCREEN → PANEL → PROCESS EXPLORER** (3 minutos)
   - Expande Process Flow panel
   - Identifica: Nuevo scoring model muy estricto
   - Ve 40% rechazos vs 20% histórico

6. **ACTION** (30 segundos)
   - Ajusta threshold temporalmente
   - Agenda reunión con Sales VP
   - Crea alerta para monitoring

**Resultado**: Problema identificado y mitigado en <10 minutos

---

### **7.2 Operations Manager: Incident Response**

**Contexto**: Alerta crítica a las 3 AM
**Tiempo**: 15-20 minutos para resolver
**Ruta de navegación**:

1. **Notificación → CITY** (30 segundos)
   - Link directo desde alerta
   - Operations District en rojo
   - Multiple buildings afectados

2. **DISTRICT → Order Processing Zone** (1 minuto)
   - 3 buildings down
   - Fulfillment Building crítico
   - Entra directo a Control Center

3. **CONTROL CENTER → SCREEN** (2 minutos)
   - Alert panel muestra cascada de fallos
   - Network panel indica service down
   - Click en Network Explorer

4. **NETWORK EXPLORER** (5 minutos)
   - Payment Gateway node en rojo
   - 0 transactions/sec (normal: 1000/sec)
   - Dependencies: 15 services afectados
   - Drill down a Payment Gateway

5. **ELEMENT DETAIL** (3 minutos)
   - Error: "Certificate expired"
   - Last update: 365 days ago
   - Impact: $50K/minute perdidos

6. **ACTION → Fix** (5 minutos)
   - Accede a configuration
   - Renueva certificado
   - Restart service
   - Verifica recuperación

7. **Verificación** (3 minutos)
   - Services recuperándose en cascada
   - Transactions fluyendo
   - Notifica equipo
   - Documenta incident

**Resultado**: Downtime total 18 minutos vs 2+ horas tradicional

---

### **7.3 HR Director: Reorganización**

**Contexto**: Fusión de dos departamentos
**Tiempo**: 2 horas de planificación
**Ruta de navegación**:

1. **CITY → HR DISTRICT** (5 minutos)
   - Vista actual de estructura
   - 2 zones a fusionar
   - Total: 150 personas

2. **ZONE comparison** (15 minutos)
   - Customer Service Zone: 80 personas
   - Technical Support Zone: 70 personas
   - Overlap identificado: 20 roles

3. **BUILDING analysis** (20 minutos)
   - Procesos duplicados identificados
   - Ticket Management en ambos
   - Knowledge Base separadas

4. **PANEL → ORG EXPLORER** (30 minutos)
   - Expande Organization panel
   - Mapea skills matrix
   - Identifica gaps y redundancias
   - Simula nueva estructura

5. **What-if modeling** (45 minutos)
   - Crea nueva "Unified Support Zone"
   - Reassigna personas
   - Optimiza spans of control
   - Calcula savings: $2M/año

6. **Export y presentación** (20 minutos)
   - Genera reporte visual
   - Crea timeline de transición
   - Exporta para board meeting

**Resultado**: Plan completo con visuales en 2 horas

---

### **7.4 Developer: Debugging Producción**

**Contexto**: API lenta reportada por usuarios
**Tiempo**: 30 minutos para identificar y fix
**Ruta de navegación**:

1. **Search → "User API Building"** (30 segundos)
   - Búsqueda directa
   - Salta niveles intermedios
   - Llega al building

2. **ROOFTOP inspection** (2 minutos)
   - Ve conexiones externas
   - API endpoint "/users" hot
   - 5000 req/sec (normal: 1000)

3. **CONTROL CENTER** (3 minutos)
   - Performance panel en amarillo
   - Latency: 2000ms (normal: 200ms)
   - Click en Network Explorer

4. **NETWORK EXPLORER** (5 minutos)
   - User Service → Database bottleneck
   - Database CPU al 95%
   - Query analysis necesario

5. **Drill to Database** (10 minutos)
   - Top query: SELECT sin índice
   - Introducido en deploy de ayer
   - Afecta 80% de requests

6. **ACTION → Optimize** (8 minutos)
   - Crea índice temporal
   - Performance mejora inmediatamente
   - Crea ticket para fix permanente

7. **Verificación** (2 minutos)
   - Latency vuelve a 200ms
   - CPU baja a 40%
   - Notifica equipo

**Resultado**: Issue identificado y mitigado rápidamente

---

### **7.5 CFO: Budget Planning**

**Contexto**: Planificación presupuestal Q4
**Tiempo**: 3 horas sesión de trabajo
**Ruta de navegación**:

1. **CITY view** (10 minutos)
   - Screenshot estado actual
   - Nota districts por tamaño (budget)
   - Identifica oportunidades

2. **CONTINENT view** (20 minutos)
   - Zoom out para contexto industria
   - Benchmark spending vs competencia
   - Identifica gaps de inversión

3. **District by district review** (60 minutos)
   - Finance: -5% (eficiencias)
   - Sales: +15% (expansión)
   - Tech: +20% (modernización)
   - HR: +10% (hiring)
   - Operations: flat

4. **PANEL → FINANCIAL EXPLORER** (40 minutos)
   - Deep dive en cada district
   - Análisis línea por línea
   - Identificación de savings
   - Reallocation opportunities

5. **Scenario modeling** (40 minutos)
   - Crea 3 escenarios
   - Conservative: +5% total
   - Moderate: +10% total
   - Aggressive: +15% total
   - Simula impacto por district

6. **Final compilation** (30 minutos)
   - Selecciona scenario moderate
   - Ajustes finos por building
   - Genera reportes
   - Prepara presentación board

**Resultado**: Budget completo con justificación visual

---

## **8. Principios de Diseño**

### **8.1 Principios Core**

#### **1. Contexto Siempre Visible**
- Usuario siempre sabe dónde está
- Puede ver de dónde viene
- Entiende a dónde puede ir
- Breadcrumb permanente

#### **2. Zoom Semántico**
- No es solo cambio de tamaño
- Cada nivel muestra información diferente
- Detalles aparecen/desaparecen según relevancia
- Transiciones suaves y significativas

#### **3. Acción Directa**
- De la visualización a la ejecución
- Sin cambiar de herramienta
- Confirmaciones contextuales
- Feedback inmediato

#### **4. Performance First**
- 60 FPS target en desktop
- 30 FPS mínimo en mobile
- Carga progresiva de datos
- LOD (Level of Detail) automático

#### **5. Accesibilidad Universal**
- WCAG AA compliance
- Navegación por teclado
- Screen reader compatible
- Modo alto contraste

### **8.2 Principios de Interfaz**

#### **Densidad de Información**
```
Nivel Alto (Ciudad)    → Baja densidad, máxima abstracción
Nivel Medio (Building) → Media densidad, balance
Nivel Bajo (Explorer)  → Alta densidad, máximo detalle
```

#### **Jerarquía Visual**
1. **Tamaño**: Elementos importantes más grandes
2. **Color**: Estados críticos en colores vibrantes
3. **Posición**: Información clave arriba-izquierda
4. **Contraste**: Elementos activos alto contraste
5. **Movimiento**: Atención a elementos animados

#### **Consistencia**
- Mismos colores = mismos significados
- Mismas acciones = mismos gestos
- Misma información = misma posición
- Patrones repetibles y predecibles

### **8.3 Principios de Navegación**

#### **Navegación Natural**
- Como Google Maps: familiar e intuitivo
- Drag para pan, scroll para zoom
- Click para seleccionar, doble-click para entrar
- Right-click para contexto

#### **Múltiples Caminos**
- Navegación jerárquica (nivel por nivel)
- Búsqueda directa (saltar a cualquier punto)
- Bookmarks (lugares frecuentes)
- Historia (back/forward)
- Mini-mapa (vista general)

#### **Velocidad Variable**
- Navegación lenta para exploración
- Navegación rápida para usuarios expertos
- Atajos de teclado para power users
- Acceso directo desde notificaciones

### **8.4 Principios de Datos**

#### **Real-time vs Cached**
```javascript
const dataStrategy = {
  realtime: ['alerts', 'criticalMetrics', 'activeFlows'],
  nearRealtime: ['performance', 'capacity'],  // 5-30 segundos
  cached: ['organization', 'architecture'],     // 5-30 minutos
  static: ['buildings', 'districts']           // Cambios poco frecuentes
};
```

#### **Progressive Loading**
1. Estructura básica (instantáneo)
2. Datos principales (1-2 segundos)
3. Datos secundarios (2-5 segundos)
4. Históricos/detalles (on demand)

#### **Fallback Graceful**
- Si no hay datos: mostrar estructura
- Si hay error: mostrar último conocido
- Si hay timeout: mostrar parcial
- Siempre comunicar estado

---

## **9. Implementación Técnica**

### **9.1 Stack Tecnológico**

#### **Frontend Core**
```javascript
{
  "rendering": "Three.js + WebGL",
  "ui": "React 18+",
  "state": "Redux Toolkit / Zustand",
  "routing": "React Router v6",
  "styling": "CSS Modules + Tailwind",
  "animations": "Framer Motion + Three.js",
  "charts": "D3.js + Recharts"
}
```

#### **Performance**
```javascript
{
  "bundling": "Vite / Webpack 5",
  "codeSpitting": "Dynamic imports",
  "compression": "Brotli + Gzip",
  "caching": "Service Workers + CDN",
  "optimization": "Tree shaking + Minification"
}
```

#### **Data Layer**
```javascript
{
  "realtime": "WebSockets / Server-Sent Events",
  "api": "GraphQL + REST fallback",
  "cache": "IndexedDB + Memory",
  "sync": "Background Sync API"
}
```

### **9.2 Arquitectura de Componentes**

```
src/
├── core/
│   ├── engine/          # Three.js rendering engine
│   ├── navigation/      # Zoom, pan, niveles
│   ├── state/          # Global state management
│   └── data/           # Data fetching y cache
├── levels/
│   ├── city/           # Componentes nivel ciudad
│   ├── district/       # Componentes nivel distrito
│   ├── building/       # Componentes nivel building
│   └── explorers/      # Todos los explorers
├── components/
│   ├── ui/            # Componentes UI reutilizables
│   ├── visualizations/# Gráficos y visuales
│   └── controls/      # Controles de navegación
└── utils/
    ├── animations/    # Funciones de animación
    ├── calculations/  # Lógica de negocio
    └── helpers/       # Utilidades generales
```

### **9.3 Modelo de Datos**

```typescript
interface CityModel {
  id: string;
  name: string;
  type: 'city';
  metrics: Metrics;
  districts: District[];
  position: Vector3;
  metadata: {
    company: string;
    industry: string;
    size: 'startup' | 'smb' | 'enterprise';
    created: Date;
    modified: Date;
  };
}

interface District {
  id: string;
  name: string;
  type: 'district';
  parent: string; // city id
  zones: Zone[];
  metrics: Metrics;
  position: Vector3;
  color: string;
  size: number;
}

interface Building {
  id: string;
  name: string;
  type: 'building';
  parent: string; // zone id
  floors: Floor[];
  rooftop: Rooftop;
  basement: ControlCenter;
  metrics: Metrics;
  position: Vector3;
  height: number;
}

interface Metrics {
  health: 'green' | 'yellow' | 'red';
  kpis: KPI[];
  alerts: Alert[];
  timestamp: Date;
}
```

### **9.4 Sistema de Eventos**

```javascript
// Event bus para comunicación entre componentes
class CityEventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
}

// Eventos principales
const events = {
  // Navegación
  'navigation:levelChanged': { from: Level, to: Level },
  'navigation:zoom': { level: number },
  'navigation:pan': { x: number, y: number },
  
  // Interacción
  'element:hover': { element: Element },
  'element:click': { element: Element },
  'element:rightClick': { element: Element },
  
  // Datos
  'data:updated': { element: Element, data: any },
  'data:error': { error: Error },
  
  // Sistema
  'system:loading': { state: boolean },
  'system:error': { error: Error }
};
```

### **9.5 Optimizaciones**

#### **Level of Detail (LOD)**
```javascript
class LODSystem {
  calculateLOD(object, camera) {
    const distance = object.position.distanceTo(camera.position);
    
    if (distance < 50) return 'high';
    if (distance < 150) return 'medium';
    if (distance < 300) return 'low';
    return 'billboard'; // Sólo un plano con textura
  }
  
  applyLOD(object, lod) {
    switch(lod) {
      case 'high':
        object.geometry = highDetailGeometry;
        object.material = highDetailMaterial;
        break;
      case 'medium':
        object.geometry = mediumDetailGeometry;
        object.material = simpleMaterial;
        break;
      case 'low':
        object.geometry = lowDetailGeometry;
        object.material = simpleMaterial;
        break;
      case 'billboard':
        object.geometry = planeGeometry;
        object.material = billboardMaterial;
        break;
    }
  }
}
```

#### **Culling y Batching**
```javascript
// Frustum culling automático
renderer.setScissorTest(true);

// Instanced rendering para elementos repetidos
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  count
);

// Batching de geometrías similares
const geometries = buildings.map(b => b.geometry);
const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
```

#### **Texture Atlas**
```javascript
// Todas las texturas de UI en un atlas
const textureAtlas = new THREE.TextureLoader().load('ui-atlas.png');
const buildingMaterial = new THREE.MeshPhongMaterial({
  map: textureAtlas,
  alphaMap: textureAtlas
});

// UV mapping para cada tipo de building
const uvOffsets = {
  'office': { x: 0, y: 0, w: 0.25, h: 0.25 },
  'factory': { x: 0.25, y: 0, w: 0.25, h: 0.25 },
  'warehouse': { x: 0.5, y: 0, w: 0.25, h: 0.25 }
};
```

### **9.6 Sistema de Plugins**

```javascript
// Arquitectura extensible para industrias específicas
class CompanyCityPlugin {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.customExplorers = [];
    this.customVisuals = [];
    this.customMetrics = [];
  }
  
  registerExplorer(explorer) {
    this.customExplorers.push(explorer);
  }
  
  registerVisual(visual) {
    this.customVisuals.push(visual);
  }
  
  registerMetric(metric) {
    this.customMetrics.push(metric);
  }
  
  install(cityInstance) {
    // Inyectar funcionalidad custom
    cityInstance.explorers.push(...this.customExplorers);
    cityInstance.visuals.push(...this.customVisuals);
    cityInstance.metrics.push(...this.customMetrics);
  }
}

// Ejemplo: Plugin para Healthcare
const healthcarePlugin = new CompanyCityPlugin('Healthcare', '1.0.0');

healthcarePlugin.registerExplorer({
  name: 'Patient Flow Explorer',
  icon: 'hospital',
  navigate: (from, to) => { /* lógica específica */ }
});

healthcarePlugin.registerVisual({
  name: 'Bed Occupancy Heatmap',
  render: (data) => { /* visualización específica */ }
});
```

---

## **10. Configuración por Industria**

### **10.1 Retail**

#### **Districts Específicos**
- Store Operations (tiendas físicas)
- E-commerce (online)
- Supply Chain (cadena de suministro)
- Customer Service (servicio)
- Marketing (mercadeo)

#### **Buildings Especiales**
- Store Building: Muestra layout de tienda
- Inventory Building: Visualiza stock en tiempo real
- Fulfillment Building: Proceso de órdenes
- Returns Building: Gestión de devoluciones

#### **Métricas Clave**
- Sales per square foot
- Inventory turnover
- Conversion rate
- Average transaction value
- Customer lifetime value

#### **Explorers Adicionales**
- Store Layout Explorer: Vista 3D de tienda
- Product Catalog Explorer: Navegación por SKUs
- Customer Journey Explorer: Ruta de compra

### **10.2 Healthcare**

#### **Districts Específicos**
- Clinical Operations
- Patient Services  
- Medical Records
- Billing & Insurance
- Facilities

#### **Buildings Especiales**
- Emergency Building: Flujo de urgencias
- Surgery Building: Programación quirófanos
- Admission Building: Proceso de ingreso
- Laboratory Building: Flujo de muestras

#### **Métricas Clave**
- Patient wait time
- Bed occupancy rate
- Lab turnaround time
- Patient satisfaction
- Clinical outcomes

#### **Explorers Adicionales**
- Patient Flow Explorer
- Bed Management Explorer
- Clinical Pathway Explorer

### **10.3 Manufacturing**

#### **Districts Específicos**
- Production Floor
- Quality Control
- Supply Chain
- Maintenance
- Shipping

#### **Buildings Especiales**
- Assembly Building: Líneas de producción
- QC Building: Proceso de calidad
- Warehouse Building: Gestión de almacén
- Maintenance Building: Mantenimiento preventivo

#### **Métricas Clave**
- OEE (Overall Equipment Effectiveness)
- Defect rate
- Throughput
- Downtime
- Inventory turns

#### **Explorers Adicionales**
- Production Line Explorer
- Quality Inspector Explorer
- Equipment Status Explorer

### **10.4 Financial Services**

#### **Districts Específicos**
- Retail Banking
- Investment Banking
- Risk Management
- Compliance
- Trading

#### **Buildings Especiales**
- Trading Floor Building: Operaciones en vivo
- Risk Assessment Building: Análisis de riesgo
- Compliance Building: Monitoreo regulatorio
- Loan Processing Building: Flujo de créditos

#### **Métricas Clave**
- Assets under management
- Trading volume
- Risk exposure
- Compliance violations
- Customer acquisition cost

#### **Explorers Adicionales**
- Trading Floor Explorer
- Risk Dashboard Explorer
- Regulatory Compliance Explorer

### **10.5 Technology/SaaS**

#### **Districts Específicos**
- Engineering
- Product
- Customer Success
- Infrastructure
- Security

#### **Buildings Especiales**
- CI/CD Building: Pipeline de desarrollo
- Infrastructure Building: Estado de servidores
- Security Building: Monitoreo de amenazas
- Customer Success Building: Health scores

#### **Métricas Clave**
- Uptime/SLA
- Deploy frequency
- Customer churn
- ARR/MRR
- Bug escape rate

#### **Explorers Adicionales**
- Code Pipeline Explorer
- Infrastructure Map Explorer
- Security Threat Explorer

---

## **11. Anti-Patrones**

### **11.1 Lo que NO debe ser CompanyCity**

#### **❌ NO es un Videojuego**
- Sin avatares o personajes
- Sin puntos o achievements
- Sin elementos de "diversión"
- Sin simulación de vida urbana

**Por qué**: Es una herramienta profesional, no entretenimiento

#### **❌ NO es SimCity Empresarial**
- Sin clima o día/noche decorativo
- Sin tráfico de vehículos
- Sin ciudadanos caminando
- Sin construcción/destrucción

**Por qué**: La metáfora urbana es para navegación, no simulación

#### **❌ NO es un Gemelo Digital Literal**
- No representa espacios físicos reales
- No es un modelo 3D de oficinas
- No muestra escritorios o personas
- No replica arquitectura real

**Por qué**: Es una abstracción conceptual, no una réplica

#### **❌ NO es un Dashboard Gigante**
- No todo son gráficos y números
- Mantiene contexto espacial
- Preserva jerarquía navegable
- No es solo visualización de datos

**Por qué**: El valor está en la navegación contextual

### **11.2 Errores Comunes de Implementación**

#### **Sobre-literalización de Metáforas**
```
MALO:  Building con 47 pisos porque el proceso tiene 47 pasos
BUENO: Building con 4-5 floors agrupando pasos lógicamente
```

#### **Exceso de Animación**
```
MALO:  Todo moviéndose constantemente sin propósito
BUENO: Animación solo cuando comunica información
```

#### **Navegación Forzada**
```
MALO:  Obligar a pasar por todos los niveles siempre
BUENO: Permitir saltos directos cuando tiene sentido
```

#### **Densidad Inadecuada**
```
MALO:  500 buildings en una vista sin organización
BUENO: Agrupar en zones, mostrar detalles progresivamente
```

#### **Metáforas Mezcladas**
```
MALO:  Buildings flotando en el espacio sin ground
BUENO: Consistencia visual en cada nivel
```

### **11.3 Trampas de UX**

#### **Desorientación**
- Problema: Usuario no sabe dónde está
- Solución: Breadcrumb siempre visible
- Solución: Mini-mapa opcional
- Solución: Transiciones que preservan contexto

#### **Sobrecarga Cognitiva**
- Problema: Demasiada información simultánea
- Solución: Progressive disclosure
- Solución: Filtros y búsqueda
- Solución: Modos de visualización

#### **Navegación Lenta**
- Problema: Muchos clicks para tareas comunes
- Solución: Búsqueda directa
- Solución: Bookmarks/favoritos
- Solución: Accesos directos contextuales

#### **Pérdida de Contexto**
- Problema: Al hacer zoom se pierde big picture
- Solución: Picture-in-picture opcional
- Solución: Breadcrumb interactivo
- Solución: Vista previa en hover

---

## **12. Decisiones de Diseño**

### **12.1 Decisiones Fundamentales Tomadas**

#### **Zoom Bidireccional vs Jerarquía Tradicional**
**Decisión**: Zoom bidireccional con nivel 0 como punto central
**Rationale**: 
- Permite análisis de contexto externo
- Mantiene empresa como foco central
- Navegación más natural tipo mapas
**Alternativa rechazada**: Jerarquía top-down tradicional

#### **Metáfora Híbrida vs Pura**
**Decisión**: Híbrida (urbana + técnica con transición)
**Rationale**:
- Urbana perfecta para navegación
- Técnica necesaria para operación
- Transición clara comunica cambio
**Alternativa rechazada**: Una sola metáfora forzada

#### **Control Center en Basement vs Penthouse**
**Decisión**: Basement (Floor 0)
**Rationale**:
- Metáfora de bunker de operaciones
- Separado de operación diaria
- Acceso a toda la infraestructura
**Alternativa rechazada**: Penthouse ejecutivo

#### **Panel como Portal vs Nueva Navegación**
**Decisión**: Panel se expande como portal
**Rationale**:
- Transición natural y entendible
- Preserva
