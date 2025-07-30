# CompanyCity - 3D Infrastructure Visualization System

CompanyCity es un sistema de visualización 3D que permite navegar a través de la arquitectura empresarial completa usando una metáfora de ciudad. Con 6 niveles de navegación jerárquica, ofrece 11,520 caminos únicos de exploración desde el ecosistema competitivo hasta las instancias específicas de configuración.

## 🎯 Visión General

CompanyCity transforma datos empresariales complejos en una experiencia visual inmersiva donde:
- Las **empresas** son ciudades hexagonales
- Los **departamentos** son distritos con patrones específicos
- Los **procesos** son edificios interconectados
- Los **sistemas** son módulos dentro de edificios
- Las **configuraciones** son elementos individuales

## 🏗️ Arquitectura Híbrida

### Stack Tecnológico
```
70% Clases ES6 (Lógica y Rendering)
30% Web Components Nativos (UI Containers)
```

### Tecnologías Core
- **Frontend**: Vanilla JavaScript ES6+
- **3D Engine**: Three.js
- **UI Components**: Custom Elements API nativo
- **Estado**: Proxy reactivo
- **Comunicación**: WebSocket + REST APIs
- **Build**: Vite + ESBuild

## 📊 Los 6 Niveles de Navegación

### Nivel 0: ECOSYSTEM
- Vista de múltiples empresas competidoras
- Layout hexagonal isométrico
- Métricas de mercado y competencia

### Nivel 1: COMPANY
- 6 distritos universales:
  - 🎯 **Market** - Ciclo comercial completo
  - ⚙️ **Delivery** - Operaciones y entrega
  - 💰 **Finance** - Gestión financiera
  - 👥 **People** - Recursos humanos
  - 💻 **Technology** - Infraestructura IT
  - ⚖️ **Governance** - Cumplimiento y control

### Nivel 2: DISTRICT
- 4 patrones de organización:
  - **Cyclic**: Flujo circular (ej: Customer Journey)
  - **Spatial**: Distribución espacial
  - **Linear**: Pipeline secuencial
  - **Hub**: Modelo hub & spoke

### Nivel 3: BUILDING
- 4 patrones de procesamiento:
  - **Pipeline**: Procesamiento secuencial
  - **Parallel**: Operaciones concurrentes
  - **Orchestrator**: Coordinación central
  - **Feedback**: Sistemas de retroalimentación

### Nivel 4: MODULE
- Componentes específicos del negocio
- Integraciones SaaS/Custom/Legacy
- 3 perspectivas: Business/Technical/Operations

### Nivel 5: ELEMENT
- Instancias individuales
- Configuración detallada
- Historial y métricas específicas

## 🚀 Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/zaste/companycity-hybrid.git
cd companycity-hybrid

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/       # 30% - Web Components UI
│   ├── cc-app.js        # Shell principal
│   ├── cc-navigation.js # Navegación breadcrumb
│   ├── cc-inspector.js  # Panel de detalles
│   └── cc-overlay.js    # HUD métricas
│
├── scenes/          # 70% - Lógica de renderizado
│   ├── EcosystemScene.js
│   ├── CompanyScene.js
│   ├── DistrictScene.js
│   ├── BuildingScene.js
│   ├── ModuleScene.js
│   ├── ElementScene.js
│   └── layouts/     # Patrones de disposición
│
├── core/            # Servicios centrales
│   ├── SceneManager.js     # Three.js
│   ├── StateManager.js     # Estado reactivo
│   ├── Navigation.js       # 11,520 rutas
│   └── DataSync.js         # WebSocket/API
│
└── utils/           # Utilidades
```

## 🎮 Controles de Navegación

- **Click**: Seleccionar entidad
- **Scroll**: Zoom in/out entre niveles
- **Drag**: Rotar cámara
- **Breadcrumb**: Navegación directa a nivel superior
- **ESC**: Cerrar inspector

## 🔧 Características Clave

### Navegación Semántica
- 11,520 caminos únicos de navegación
- Contexto preservado en cada nivel
- Transiciones suaves entre niveles

### Entity Tracking
- Seguimiento de entidades a través de niveles
- Visualización de journey completo
- Métricas en tiempo real

### Performance
- LOD (Level of Detail) automático
- Frustum culling
- Batching de geometrías similares
- Target: 60 FPS con 10,000+ entidades

### Real-time
- WebSocket para actualizaciones
- Sincronización de estado
- Métricas en vivo

## 📋 Patrones de Implementación

### Web Component Mínimo
```javascript
class CCNavigation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>:host { display: block; }</style>
      <nav>${this.breadcrumb}</nav>
    `;
  }
}
customElements.define('cc-navigation', CCNavigation);
```

### Scene Manager
```javascript
class DistrictScene {
  constructor(sceneManager) {
    this.scene = sceneManager;
    this.patterns = {
      cyclic: new CyclicLayout(),
      spatial: new SpatialLayout(),
      linear: new LinearLayout(),
      hub: new HubLayout()
    };
  }
  
  load(districtData) {
    const pattern = this.patterns[districtData.pattern];
    pattern.arrange(districtData.buildings);
  }
}
```

### Estado Reactivo
```javascript
class StateManager extends EventTarget {
  constructor() {
    super();
    this.state = new Proxy({}, {
      set: (target, key, value) => {
        target[key] = value;
        this.dispatchEvent(new CustomEvent('state-change', {
          detail: { key, value }
        }));
        return true;
      }
    });
  }
}
```

## 🎨 Estética Visual

- **Paleta**: Oscura con acentos neón (#8b5cf6 primario)
- **Estilo**: Cyberpunk minimalista
- **Efectos**: Glow, partículas, transiciones suaves
- **Tipografía**: SF Pro Display / System UI

## 📈 Métricas y Analytics

El sistema recopila métricas en 3 categorías:
- **Performance**: FPS, latencia, throughput
- **Business**: Conversión, retención, ROI
- **Operational**: Capacidad, eficiencia, SLA

## 🧪 Testing

```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 🚀 Deployment

El proyecto está configurado para:
- Build optimizado con Vite
- Code splitting automático
- Tree shaking
- Minificación

## 📚 Documentación Adicional

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Decisiones arquitectónicas
- [PATTERNS.md](docs/PATTERNS.md) - Patrones de visualización
- [API.md](docs/API.md) - Referencia de APIs
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) - Guía de contribución

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Reconocimientos

- Three.js por el motor 3D
- Inspiración en visualizaciones de SimCity y Tron
- Conceptos de Domain-Driven Design para la estructura

---

**CompanyCity** - Visualizando la complejidad empresarial como nunca antes.