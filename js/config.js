// Global Configuration
const CONFIG = {
    camera: {
        defaultDistance: 3.8,
        minDistance: 2.0,
        maxDistance: 8.0,
    },
    
    raymarching: {
        maxSteps: 100,
        surfaceDistance: 0.002,
        maxDistance: 10.0,
    },

    quality: {
        low: 50,
        medium: 100,
        high: 150,
    },

    shaders: {
        luna: {
            title: '🌙 Superficie Lunar',
            description: 'Luna realista con cráteres usando FBM (Fractal Brownian Motion) y raymarching SDF.'
        },
        tierra: {
            title: '🌍 Planeta Tierra',
            description: 'Planeta Tierra interactivo con continentes y océanos renderizados en tiempo real.'
        },
        espacio: {
            title: '🚀 Asteroide Espacial',
            description: 'Asteroide flotante con texturas complejas de impacto y cráteres.'
        },
        nebula: {
            title: '🌌 Nebulosa Cósmica',
            description: 'Nebulosa dinámica con colores vibrantes y animación fluida.'
        }
    }
};