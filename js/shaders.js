// Shader Definitions
const SHADERS = {
    vertexShader: `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `,

    luna: `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;

        mat2 rot(float a) {
            float s = sin(a), c = cos(a);
            return mat2(c, -s, s, c);
        }

        float hash(float n) { return fract(sin(n) * 1e4); }
        float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
        
        float noise(vec3 x) {
            const vec3 step = vec3(110, 241, 171);
            vec3 i = floor(x);
            vec3 f = fract(x);
            float n = dot(i, step);
            vec3 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                       mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
        }

        float fbm(vec3 p) {
            float f = 0.0;
            float w = 0.5;
            for (int i = 0; i < 7; i++) {
                f += w * noise(p);
                p *= 2.2;
                w *= 0.5;
            }
            return f;
        }

        float craterNoise(vec3 p) {
            float n = fbm(p * 2.0);
            return pow(abs(n * 2.0 - 1.0), 1.5);
        }

        float map(vec3 p) {
            float d = length(p) - 1.5;
            float mountains = fbm(p * 2.5) * 0.25;
            float microDetail = fbm(p * 15.0) * 0.02;
            float cratersBig = craterNoise(p * 1.5) * 0.2;
            float cratersSmall = craterNoise(p * 4.0) * 0.05;
            
            d -= mountains;
            d -= microDetail;
            d += cratersBig;
            d += cratersSmall;
            
            return d * 0.6;
        }

        vec3 calcNormal(vec3 p) {
            vec2 e = vec2(0.005, 0.0);
            return normalize(vec3(
                map(p + e.xyy) - map(p - e.xyy),
                map(p + e.yxy) - map(p - e.yxy),
                map(p + e.yyx) - map(p - e.yyx)
            ));
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            uv = uv * 2.0 - 1.0;
            uv.x *= u_resolution.x / u_resolution.y;

            vec3 ro = vec3(0.0, 0.0, -3.8);
            ro.yz *= rot(-u_mouse.x);
            ro.xz *= rot(-u_mouse.y);

            vec3 ta = vec3(0.0, 0.0, 0.0);
            vec3 cw = normalize(ta - ro);
            vec3 cu = normalize(cross(cw, vec3(0.0, 1.0, 0.0)));
            vec3 cv = cross(cu, cw);
            vec3 rd = normalize(uv.x * cu + uv.y * cv + 1.2 * cw);

            float t = 0.0;
            float max_t = 10.0;
            vec3 p;
            bool hit = false;
            
            for(int i = 0; i < 150; i++) {
                p = ro + rd * t;
                float d = map(p);
                if(d < 0.002) {
                    hit = true;
                    break;
                }
                if(t > max_t) break;
                t += d;
            }

            vec3 bg = vec3(0.01, 0.01, 0.02) * (1.0 - length(uv) * 0.4);
            vec3 col = bg;

            if(hit) {
                vec3 n = calcNormal(p);
                vec3 lightDir = normalize(vec3(cos(u_time * 0.2), 0.5, sin(u_time * 0.2)));
                float diff = max(dot(n, lightDir), 0.0);
                
                float shadow = 1.0;
                float sh_t = 0.05;
                for(int i = 0; i < 30; i++) {
                    float h = map(p + lightDir * sh_t);
                    if(h < 0.001) { shadow = 0.05; break; }
                    shadow = min(shadow, 6.0 * h / sh_t);
                    sh_t += h;
                    if(sh_t > 2.5) break;
                }
                diff *= shadow;

                float materialNoise = fbm(p * 6.0);
                vec3 albedo = mix(vec3(0.3, 0.3, 0.32), vec3(0.7, 0.7, 0.7), materialNoise);
                float amb = 0.02;
                
                col = albedo * (diff + amb);
            }

            gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0);
        }
    `,

    tierra: `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;

        mat2 rot(float a) {
            float s = sin(a), c = cos(a);
            return mat2(c, -s, s, c);
        }

        float hash(float n) { return fract(sin(n) * 1e4); }
        
        float noise(vec3 x) {
            const vec3 step = vec3(110, 241, 171);
            vec3 i = floor(x);
            vec3 f = fract(x);
            float n = dot(i, step);
            vec3 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                       mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
        }

        float fbm(vec3 p) {
            float f = 0.0;
            float w = 0.5;
            for (int i = 0; i < 6; i++) {
                f += w * noise(p);
                p *= 2.2;
                w *= 0.5;
            }
            return f;
        }

        float map(vec3 p) {
            float d = length(p) - 1.5;
            float terrain = fbm(p * 3.0) * 0.2;
            d -= terrain * 0.5;
            return d;
        }

        vec3 calcNormal(vec3 p) {
            vec2 e = vec2(0.005, 0.0);
            return normalize(vec3(
                map(p + e.xyy) - map(p - e.xyy),
                map(p + e.yxy) - map(p - e.yxy),
                map(p + e.yyx) - map(p - e.yyx)
            ));
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            uv = uv * 2.0 - 1.0;
            uv.x *= u_resolution.x / u_resolution.y;

            vec3 ro = vec3(0.0, 0.0, -3.8);
            ro.yz *= rot(-u_mouse.x);
            ro.xz *= rot(-u_mouse.y);

            vec3 ta = vec3(0.0, 0.0, 0.0);
            vec3 cw = normalize(ta - ro);
            vec3 cu = normalize(cross(cw, vec3(0.0, 1.0, 0.0)));
            vec3 cv = cross(cu, cw);
            vec3 rd = normalize(uv.x * cu + uv.y * cv + 1.2 * cw);

            float t = 0.0;
            vec3 p;
            bool hit = false;
            
            for(int i = 0; i < 100; i++) {
                p = ro + rd * t;
                float d = map(p);
                if(d < 0.002) {
                    hit = true;
                    break;
                }
                if(t > 10.0) break;
                t += d;
            }

            vec3 bg = vec3(0.01, 0.02, 0.05);
            vec3 col = bg;

            if(hit) {
                vec3 n = calcNormal(p);
                vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
                float diff = max(dot(n, lightDir), 0.0);
                
                float terrain = fbm(p * 3.0);
                vec3 landColor = mix(vec3(0.2, 0.6, 0.3), vec3(0.8, 0.7, 0.2), terrain);
                vec3 oceanColor = vec3(0.1, 0.3, 0.8);
                
                vec3 albedo = mix(oceanColor, landColor, smoothstep(0.3, 0.5, terrain));
                
                col = albedo * (diff + 0.3);
            }

            gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0);
        }
    `,

    espacio: `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;

        mat2 rot(float a) {
            float s = sin(a), c = cos(a);
            return mat2(c, -s, s, c);
        }

        float hash(float n) { return fract(sin(n) * 1e4); }
        
        float noise(vec3 x) {
            const vec3 step = vec3(110, 241, 171);
            vec3 i = floor(x);
            vec3 f = fract(x);
            float n = dot(i, step);
            vec3 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                       mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
        }

        float fbm(vec3 p) {
            float f = 0.0;
            float w = 0.5;
            for (int i = 0; i < 5; i++) {
                f += w * noise(p);
                p *= 2.2;
                w *= 0.5;
            }
            return f;
        }

        float map(vec3 p) {
            float d = length(p) - 1.2;
            float bumps = fbm(p * 5.0) * 0.3;
            d += bumps;
            return d;
        }

        vec3 calcNormal(vec3 p) {
            vec2 e = vec2(0.005, 0.0);
            return normalize(vec3(
                map(p + e.xyy) - map(p - e.xyy),
                map(p + e.yxy) - map(p - e.yxy),
                map(p + e.yyx) - map(p - e.yyx)
            ));
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            uv = uv * 2.0 - 1.0;
            uv.x *= u_resolution.x / u_resolution.y;

            vec3 ro = vec3(0.0, 0.0, -3.8);
            ro.yz *= rot(-u_mouse.x);
            ro.xz *= rot(-u_mouse.y);

            vec3 cw = normalize(-ro);
            vec3 cu = normalize(cross(cw, vec3(0.0, 1.0, 0.0)));
            vec3 cv = cross(cu, cw);
            vec3 rd = normalize(uv.x * cu + uv.y * cv + 1.2 * cw);

            float t = 0.0;
            vec3 p;
            bool hit = false;
            
            for(int i = 0; i < 100; i++) {
                p = ro + rd * t;
                float d = map(p);
                if(d < 0.002) {
                    hit = true;
                    break;
                }
                if(t > 10.0) break;
                t += d;
            }

            vec3 bg = vec3(0.001, 0.001, 0.002);
            vec3 col = bg + vec3(0.5, 0.3, 0.1) * 0.1 * sin(length(uv) * 3.0 + u_time);

            if(hit) {
                vec3 n = calcNormal(p);
                vec3 lightDir = normalize(vec3(1.0, 2.0, -1.0));
                float diff = max(dot(n, lightDir), 0.0);
                
                vec3 albedo = mix(vec3(0.6, 0.5, 0.4), vec3(0.3, 0.2, 0.1), fbm(p * 4.0));
                col = albedo * diff + vec3(0.1, 0.05, 0.02);
            }

            gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0);
        }
    `,

    nebula: `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;

        float hash(float n) { return fract(sin(n) * 1e4); }
        
        float noise(vec3 x) {
            const vec3 step = vec3(110, 241, 171);
            vec3 i = floor(x);
            vec3 f = fract(x);
            float n = dot(i, step);
            vec3 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                       mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
        }

        float fbm(vec3 p) {
            float f = 0.0;
            float w = 0.5;
            for (int i = 0; i < 6; i++) {
                f += w * noise(p + u_time * 0.05);
                p *= 2.2;
                w *= 0.5;
            }
            return f;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            vec2 center = uv * 2.0 - 1.0;
            center.x *= u_resolution.x / u_resolution.y;

            vec3 p = vec3(center * 2.0, u_time * 0.1);
            
            float n1 = fbm(p);
            float n2 = fbm(p + vec3(10.0, 20.0, 30.0));
            float n3 = fbm(p + vec3(-10.0, -20.0, 10.0));
            
            vec3 col = vec3(0.0);
            col += vec3(1.0, 0.3, 0.5) * n1 * 0.8;
            col += vec3(0.3, 1.0, 0.5) * n2 * 0.6;
            col += vec3(0.3, 0.5, 1.0) * n3 * 0.4;
            
            col *= smoothstep(2.0, 0.0, length(center));

            gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0);
        }
    `
};