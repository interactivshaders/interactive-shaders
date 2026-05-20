// Main Application
class App {
    constructor() {
        this.canvas = document.getElementById('glcanvas');
        this.renderer = new Renderer(this.canvas);
        this.camera = new Camera();
        
        this.fpsCounter = 0;
        this.frameCount = 0;
        this.lastTime = 0;
        
        this.setupUI();
        this.startRenderLoop();
    }

    setupUI() {
        // Shader selector buttons
        const shaderBtns = document.querySelectorAll('.shader-btn');
        shaderBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.onShaderSelect(e));
        });

        // Auto-rotate checkbox
        const autoRotateCheckbox = document.getElementById('auto-rotate');
        autoRotateCheckbox.addEventListener('change', (e) => {
            this.camera.setAutoRotate(e.target.checked);
        });

        // Show info checkbox
        const showInfoCheckbox = document.getElementById('show-info');
        showInfoCheckbox.addEventListener('change', (e) => {
            const infoPanel = document.getElementById('info');
            if (e.target.checked) {
                infoPanel.classList.remove('hidden');
            } else {
                infoPanel.classList.add('hidden');
            }
        });

        // Quality selector
        const qualitySelect = document.getElementById('quality');
        qualitySelect.addEventListener('change', (e) => {
            const qualityValue = e.target.value;
            CONFIG.raymarching.maxSteps = CONFIG.quality[qualityValue];
        });
    }

    onShaderSelect(e) {
        const shaderName = e.target.dataset.shader;
        
        if (this.renderer.setShader(shaderName)) {
            // Update active button
            document.querySelectorAll('.shader-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');

            // Update info panel
            const shaderConfig = CONFIG.shaders[shaderName];
            document.getElementById('shader-title').textContent = shaderConfig.title;
            document.getElementById('shader-description').textContent = shaderConfig.description;

            // Reset camera
            this.camera.reset();
        }
    }

    startRenderLoop() {
        const render = (time) => {
            // Update FPS
            this.frameCount++;
            if (time - this.lastTime >= 1000) {
                document.getElementById('fps').textContent = this.frameCount;
                this.frameCount = 0;
                this.lastTime = time;
            }

            // Update camera
            this.camera.update(time);

            // Render
            this.renderer.render(this.camera, time);

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});