// WebGL Renderer
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl');
        this.currentShader = 'luna';
        this.programs = {};
        this.startTime = Date.now();
        
        if (!this.gl) {
            alert('WebGL no está soportado en tu navegador');
            throw new Error('WebGL not supported');
        }

        this.initializeBuffers();
        this.compileAllShaders();
    }

    initializeBuffers() {
        const gl = this.gl;
        
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }

    createShaderProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource);
        
        if (!vertexShader || !fragmentShader) return null;

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return null;
        }

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return program;
    }

    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    compileAllShaders() {
        const vertexSource = SHADERS.vertexShader;
        
        for (const [name, fragmentSource] of Object.entries(SHADERS)) {
            if (name === 'vertexShader') continue;
            
            const program = this.createShaderProgram(vertexSource, fragmentSource);
            if (program) {
                this.programs[name] = {
                    program: program,
                    locations: {
                        position: this.gl.getAttribLocation(program, 'aVertexPosition'),
                        resolution: this.gl.getUniformLocation(program, 'u_resolution'),
                        time: this.gl.getUniformLocation(program, 'u_time'),
                        mouse: this.gl.getUniformLocation(program, 'u_mouse')
                    }
                };
            }
        }
    }

    setShader(shaderName) {
        if (this.programs[shaderName]) {
            this.currentShader = shaderName;
            return true;
        }
        return false;
    }

    render(camera, time) {
        const gl = this.gl;
        const programData = this.programs[this.currentShader];
        
        if (!programData) return;

        const program = programData.program;
        const locations = programData.locations;

        // Update canvas size if needed
        if (this.canvas.width !== window.innerWidth || this.canvas.height !== window.innerHeight) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }

        gl.useProgram(program);

        // Set up position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(locations.position);
        gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);

        // Set uniforms
        gl.uniform2f(locations.resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(locations.time, time * 0.001);
        
        const rotation = camera.getRotation();
        gl.uniform2f(locations.mouse, rotation.x, rotation.y);

        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    getCurrentShader() {
        return this.currentShader;
    }
}