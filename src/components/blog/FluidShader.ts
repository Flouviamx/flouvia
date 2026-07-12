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
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_color;
  uniform vec3 u_bg;

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

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // Ruido muy lento y a gran escala (minimalista y sobrio)
    vec2 pos = vec2(st * 1.2);
    float n1 = snoise(pos + u_time * 0.04);
    float n2 = snoise(pos + vec2(n1) - u_time * 0.06);
    
    // Mezcla de colores ultra sutil
    float flow = smoothstep(-0.5, 1.0, n2);
    
    // El fondo es casi enteramente oscuro, con un toque del color de la categoría
    vec3 fluidColor = mix(u_bg, u_color, flow * 0.12);
    
    // Grano fino estilo cristal esmerilado para darle textura premium (centrado en 0 para verse en fondos blancos)
    float grain = (fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453) - 0.5) * 0.04;
    
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
  const uColor = gl.getUniformLocation(program, 'u_color');
  const uBg = gl.getUniformLocation(program, 'u_bg');

  let globalMouseX = -1000;
  let globalMouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
  }, { passive: true });

  const cards: { ctx: ImageBitmapRenderingContext, color: number[], bg: number[], el: HTMLElement, width: number, height: number }[] = [];
  
  targets.forEach((target) => {
    const colorHex = target.dataset.shaderColor || '#ffffff';
    const bgHex = target.dataset.bgColor || '#0a192f';
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
        height: 0
      });
    }
  });

  const startTime = Date.now();
  let animationFrame: number;

  const render = () => {
    animationFrame = requestAnimationFrame(render);
    const time = (Date.now() - startTime) * 0.001;
    gl.uniform1f(uTime, time);

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

      // Calculate local mouse position (y is inverted in WebGL)
      const localMouseX = (globalMouseX - rect.left) * dpr;
      const localMouseY = (rect.height - (globalMouseY - rect.top)) * dpr;

      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, localMouseX, localMouseY);
      gl.uniform3f(uColor, card.color[0], card.color[1], card.color[2]);
      gl.uniform3f(uBg, card.bg[0], card.bg[1], card.bg[2]);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      const bitmap = offscreen.transferToImageBitmap();
      card.ctx.transferFromImageBitmap(bitmap);
    });
  };

  render();

  return () => cancelAnimationFrame(animationFrame);
}
