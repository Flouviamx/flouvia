// FluidShader.ts
// A high-performance WebGL fluid shader that uses a single OffscreenCanvas context
// and distributes the output to multiple canvases using ImageBitmapRenderingContext.

const vs = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fs = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_mouse_vel;
  uniform vec3 u_color;
  uniform vec3 u_bg;
  uniform float u_grain;
  uniform float u_intensity;
  uniform float u_interactive;

  // Simplex noise function
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Matriz de rotación basada en la Proporción Áurea para reducir artefactos axiales en el ruido
  const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

  // Fractional Brownian Motion (FBM) de alta calidad
  float fbm( vec2 p ) {
      float f = 0.0;
      float a = 0.5;
      for(int i = 0; i < 5; i++) {
          f += a * snoise(p);
          p = m * p * 2.0;
          a *= 0.5;
      }
      return f;
  }

  // Iterative Domain Warping: El ruido deforma el espacio para evaluar más ruido
  float pattern(in vec2 p, out vec2 q, out vec2 r, float t) {
      q.x = fbm( p + vec2(0.0,0.0) + 0.1 * t );
      q.y = fbm( p + vec2(5.2,1.3) - 0.1 * t );

      r.x = fbm( p + 2.0*q + vec2(1.7,9.2) + 0.15*t );
      r.y = fbm( p + 2.0*q + vec2(8.3,2.8) - 0.12*t );

      return fbm( p + 2.5*r + 0.05 * t );
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 st_a = st * aspect;
    
    // ── Mouse Physics Minimalista ──
    vec2 mouse_a = (u_mouse / u_resolution.xy) * aspect;
    vec2 vel_a = (u_mouse_vel / u_resolution.xy) * aspect;
    
    vec2 dir = st_a - mouse_a;
    float len = length(dir);
    vec2 nd = len > 0.0 ? dir / len : vec2(0.0);
    
    // Interacción microscópica, apenas perceptible
    float dragRadius = smoothstep(1.0, 0.0, len);
    vec2 drag = vel_a * dragRadius * 0.05;
    float push = smoothstep(0.9, 0.0, len) * 0.005;
    
    vec2 interaction = (nd * push - drag) * u_interactive;
    
    // Escala grande para colores suaves y difusos
    vec2 uv = st_a * 0.5 - interaction;
    float t = u_time * 0.08; // Movimiento muy lento y elegante
    
    // ── Gradiente Líquido Suave ──
    vec2 q, r;
    float h = pattern(uv, q, r, t);
    
    // Mezcla aterciopelada entre el color de fondo y el u_color
    float flow = smoothstep(0.2, 0.8, h);
    
    // Añadimos sutileza usando los sub-patrones para variar el tono suavemente
    float nuance = smoothstep(0.1, 0.9, r.y);
    float finalMix = mix(flow, nuance, 0.4);
    
    vec3 fluidColor = mix(u_bg, u_color, finalMix * u_intensity);
    
    // Grano sutil para textura premium
    float grain = (fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453) - 0.5) * u_grain;
    
    gl_FragColor = vec4(fluidColor + grain, 1.0);
  }
`;

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : [0, 0, 0];
}

export function initFluidShaders() {
  if (typeof OffscreenCanvas === 'undefined') return;

  const targets = document.querySelectorAll<HTMLElement>('.fluid-target');
  if (targets.length === 0) return;

  const offscreen = new OffscreenCanvas(300, 300);
  const gl = offscreen.getContext('webgl');
  if (!gl) return;

  const compileShader = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const vertexShaderObj = compileShader(gl.VERTEX_SHADER, vs);
  const fragmentShaderObj = compileShader(gl.FRAGMENT_SHADER, fs);
  
  const program = gl.createProgram();
  if (!program || !vertexShaderObj || !fragmentShaderObj) return;
  
  gl.attachShader(program, vertexShaderObj);
  gl.attachShader(program, fragmentShaderObj);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positions = new Float32Array([
    -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1,
  ]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  
  const posAttr = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');
  const uMouseVel = gl.getUniformLocation(program, 'u_mouse_vel');
  const uColor = gl.getUniformLocation(program, 'u_color');
  const uBg = gl.getUniformLocation(program, 'u_bg');
  const uGrain = gl.getUniformLocation(program, 'u_grain');
  const uIntensity = gl.getUniformLocation(program, 'u_intensity');
  const uInteractive = gl.getUniformLocation(program, 'u_interactive');

  let globalMouseX = -1000;
  let globalMouseY = -1000;
  let smoothMouseX = -1000;
  let smoothMouseY = -1000;
  let lastSmoothMouseX = -1000;
  let lastSmoothMouseY = -1000;
  
  window.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
  }, { passive: true });

  const cards: { ctx: ImageBitmapRenderingContext, color: number[], bg: number[], el: HTMLElement, width: number, height: number, grain: number, intensity: number, interactive: number }[] = [];
  
  targets.forEach((target) => {
    const colorHex = target.dataset.shaderColor || '#ffffff';
    const bgHex = target.dataset.bgColor || '#0a192f';
    const hasNoGrain = target.hasAttribute('data-no-grain');
    const intensityRaw = target.dataset.shaderIntensity;
    const intensity = intensityRaw ? parseFloat(intensityRaw) : 0.18;
    const grain = hasNoGrain ? 0.0 : 0.04;
    const isInteractive = target.hasAttribute('data-interactive');
    const interactive = isInteractive ? 1.0 : 0.0;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    
    target.insertBefore(canvas, target.firstChild);
    
    if (getComputedStyle(target).position === 'static') {
        target.style.position = 'relative';
    }
    
    const ctx = canvas.getContext('bitmaprenderer');
    if (ctx) {
      cards.push({
        ctx,
        color: hexToRgb(colorHex),
        bg: hexToRgb(bgHex),
        el: target,
        width: 0,
        height: 0,
        grain,
        intensity,
        interactive
      });
    }
  });

  const startTime = Date.now();
  let animationFrame: number;

  const render = () => {
    animationFrame = requestAnimationFrame(render);
    const time = (Date.now() - startTime) * 0.001;
    gl.uniform1f(uTime, time);

    // Lerp suave para que el mouse se deslice como agua y cálculo de inercia
    const lerpFactor = 0.06;
    lastSmoothMouseX = smoothMouseX;
    lastSmoothMouseY = smoothMouseY;
    smoothMouseX += (globalMouseX - smoothMouseX) * lerpFactor;
    smoothMouseY += (globalMouseY - smoothMouseY) * lerpFactor;
    
    const mouseVelX = smoothMouseX - lastSmoothMouseX;
    const mouseVelY = smoothMouseY - lastSmoothMouseY;

    cards.forEach(card => {
      const rect = card.el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
        return;
      }

      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);

      if (w !== card.width || h !== card.height) {
        card.width = w;
        card.height = h;
        card.el.querySelector('canvas')!.width = w;
        card.el.querySelector('canvas')!.height = h;
      }

      if (w === 0 || h === 0) return;

      if (offscreen.width !== w || offscreen.height !== h) {
        offscreen.width = w;
        offscreen.height = h;
        gl.viewport(0, 0, w, h);
      }

      // Calculate local mouse position (y is inverted in WebGL) — uses lerped coords
      const localMouseX = (smoothMouseX - rect.left) * dpr;
      const localMouseY = (rect.height - (smoothMouseY - rect.top)) * dpr;
      const localVelX = mouseVelX * dpr;
      const localVelY = -mouseVelY * dpr; // Invert Y for velocity too

      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, localMouseX, localMouseY);
      gl.uniform2f(uMouseVel, localVelX, localVelY);
      gl.uniform3f(uColor, card.color[0], card.color[1], card.color[2]);
      gl.uniform3f(uBg, card.bg[0], card.bg[1], card.bg[2]);
      gl.uniform1f(uGrain, card.grain);
      gl.uniform1f(uIntensity, card.intensity);
      gl.uniform1f(uInteractive, card.interactive);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      const bitmap = offscreen.transferToImageBitmap();
      card.ctx.transferFromImageBitmap(bitmap);
    });
  };

  render();

  return () => cancelAnimationFrame(animationFrame);
}
