// Camera and Input Management
class Camera {
    constructor() {
        this.rotX = 0;
        this.rotY = 0;
        this.distance = CONFIG.camera.defaultDistance;
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.autoRotate = true;
        this.autoRotateSpeed = 0.0005;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mouse events
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', (e) => this.onMouseUp(e));
        window.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
        window.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: false });

        // Touch events
        window.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
        window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
        window.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: true });

        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.lastMousePos = { x: e.clientX, y: e.clientY };
        this.autoRotate = false;
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.lastMousePos.x;
        const deltaY = e.clientY - this.lastMousePos.y;
        
        this.rotY += deltaX * 0.005;
        this.rotX += deltaY * 0.005;
        this.clampRotation();
        this.lastMousePos = { x: e.clientX, y: e.clientY };
    }

    onMouseUp(e) {
        this.isDragging = false;
    }

    onMouseLeave(e) {
        this.isDragging = false;
    }

    onMouseWheel(e) {
        e.preventDefault();
        this.distance += e.deltaY * 0.001;
        this.distance = Math.max(CONFIG.camera.minDistance, Math.min(CONFIG.camera.maxDistance, this.distance));
    }

    onTouchStart(e) {
        this.isDragging = true;
        this.lastMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.autoRotate = false;
    }

    onTouchMove(e) {
        if (!this.isDragging) return;
        const deltaX = e.touches[0].clientX - this.lastMousePos.x;
        const deltaY = e.touches[0].clientY - this.lastMousePos.y;
        
        this.rotY += deltaX * 0.005;
        this.rotX += deltaY * 0.005;
        this.clampRotation();
        this.lastMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    onTouchEnd(e) {
        this.isDragging = false;
    }

    onKeyDown(e) {
        if (e.key === 'r' || e.key === 'R') {
            this.reset();
        }
    }

    clampRotation() {
        this.rotX = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, this.rotX));
    }

    update(time) {
        if (this.autoRotate) {
            this.rotY += this.autoRotateSpeed;
        }
    }

    reset() {
        this.rotX = 0;
        this.rotY = 0;
        this.distance = CONFIG.camera.defaultDistance;
    }

    getRotation() {
        return { x: this.rotX, y: this.rotY };
    }

    getDistance() {
        return this.distance;
    }

    setAutoRotate(value) {
        this.autoRotate = value;
    }
}