# 🎨 Interactive Shaders - WebGL Raymarching

Una colección interactiva de shaders WebGL utilizando técnicas avanzadas de raymarching y Signed Distance Fields (SDF). Explora visualizaciones 3D en tiempo real directamente desde tu navegador.

![WebGL](https://img.shields.io/badge/WebGL-1.0-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Características

### Shaders Disponibles

- **🌙 Superficie Lunar** - Luna realista con cráteres y montañas usando FBM
- **🌍 Planeta Tierra** - Planeta interactivo con continentes y océanos
- **🚀 Asteroide Espacial** - Asteroide flotante con texturas de impacto
- **🌌 Nebulosa Cósmica** - Nebulosa dinámica con colores vibrantes

### Funcionalidades

✨ **Renderizado Avanzado**
- Raymarching SDF de alta precisión
- Iluminación realista con sombras suaves
- Ruido 3D fractal (FBM - Fractal Brownian Motion)
- Corrección gamma

🎮 **Controles Intuitivos**
- **Arrastrar**: Rotar la vista
- **Rueda del ratón**: Zoom in/out
- **R**: Resetear vista
- **Toque**: Soporta dispositivos móviles

⚙️ **Personalización**
- Auto-rotación activable
- Selector de calidad (50, 100, 150 pasos)
- Mostrar/ocultar información
- Interfaz responsive

## 📋 Requisitos

- Navegador moderno con soporte WebGL 1.0
- JavaScript ES6+
- Resolución mínima recomendada: 1024x768

### Navegadores Soportados

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 🛠️ Instalación

### Método 1: Local

```bash
# Clonar repositorio
git clone https://github.com/interactivshaders/interactive-shaders.git
cd interactive-shaders

# Abrir en navegador (requiere servidor local)
python3 -m http.server 8000
# Visitar: http://localhost:8000
```

### Método 2: GitHub Pages

Visita: [https://interactivshaders.github.io/interactive-shaders](https://interactivshaders.github.io/interactive-shaders)

## 📁 Estructura del Proyecto

```
interactive-shaders/
├── index.html           # Archivo principal HTML
├── css/
│   └── style.css       # Estilos y UI
├── js/
│   ├── config.js       # Configuración global
│   ├── shaders.js      # Definiciones de shaders GLSL
│   ├── camera.js       # Sistema de cámara e input
│   ├── renderer.js     # Renderizador WebGL
│   └── main.js         # Lógica principal de la app
└── README.md           # Este archivo
```

## 🎓 Conceptos Técnicos

### Raymarching

El raymarching es una técnica de renderizado que traza rayos desde la cámara y "camina" hacia adelante hasta encontrar una superficie. Es especialmente útil para geometría implícita definida por SDFs.

```glsl
for(int i = 0; i < maxSteps; i++) {
    p = ro + rd * t;           // Posición actual
    float d = map(p);          // Distancia a la geometría más cercana
    if(d < surfaceDistance) {  // ¿Golpeamos la superficie?
        hit = true;
        break;
    }
    t += d;                    // Avanzar por la distancia
}
```

### Signed Distance Fields (SDF)

Un SDF es una función que retorna la distancia más corta desde un punto a la geometría más cercana. Algunos ejemplos:

```glsl
// Esfera de radio r
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

// Cubo de tamaño b
float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
```

### Fractal Brownian Motion (FBM)

El FBM combina múltiples capas de ruido con diferentes frecuencias para crear texturas detalladas:

```glsl
float fbm(vec3 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 7; i++) {
        f += w * noise(p);
        p *= 2.2;              // Aumentar frecuencia
        w *= 0.5;              // Reducir amplitud
    }
    return f;
}
```

## 🎨 Personalizando Shaders

Para agregar un nuevo shader:

1. **Editar `js/shaders.js`**:
```javascript
SHADERS.miShader = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    
    float map(vec3 p) {
        // Tu SDF aquí
        return length(p) - 1.0;
    }
    
    void main() {
        // Tu shader fragment aquí
        gl_FragColor = vec4(color, 1.0);
    }
`;
```

2. **Agregar a `js/config.js`**:
```javascript
CONFIG.shaders.miShader = {
    title: '🎨 Mi Shader',
    description: 'Descripción de tu shader'
};
```

3. **Agregar botón en `index.html`**:
```html
<button class="shader-btn" data-shader="miShader">🎨 Mi Shader</button>
```

## 📊 Optimización

### Rendimiento

- **Reducir pasos de raymarching**: Usar calidad "Baja" (50 pasos)
- **Simplificar geometría**: Menos detalles en el SDF
- **Optimizar ruido**: Usar menos octavas en FBM
- **Desactivar auto-rotación**: Reduce cálculos innecesarios

### Compatibilidad

- Usar `highp float` en shaders para precisión
- Evitar bucles dinámicos en GLSL
- Testear en múltiples dispositivos

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| WebGL no funciona | Verificar soporte en navegador, actualizar drivers |
| Renderizado lento | Reducir calidad en configuración |
| Pantalla en negro | Verificar consola para errores de shader |
| Controles no responden | Verificar que la ventana esté enfocada |

## 📚 Referencias

- [Inigo Quilez - Raymarching](https://www.iquilezles.org/www/articles/raymarching/raymarching.htm)
- [Shadertoy - Comunidad de Shaders](https://www.shadertoy.com/)
- [The Book of Shaders](https://thebookofshaders.com/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👤 Autor

**Interactive Shaders Team**
- GitHub: [@interactivshaders](https://github.com/interactivshaders)

## 🌟 Agradecimientos

- Inigo Quilez por sus tutoriales de raymarching
- La comunidad de Shadertoy
- Todos los que contribuyen con ideas y feedback

---

⭐ Si este proyecto te fue útil, por favor considera dejar una star! ⭐