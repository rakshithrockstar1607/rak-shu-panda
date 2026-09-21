import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AtmosphereSceneProps {
  isAction: boolean;
  mousePos: { x: number; y: number }; // normalized -1 to 1
}

export const AtmosphereScene: React.FC<AtmosphereSceneProps> = ({ isAction, mousePos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isActionRef = useRef(isAction);

  useEffect(() => {
    isActionRef.current = isAction;
  }, [isAction]);

  useEffect(() => {
    mouseRef.current.targetX = mousePos.x;
    mouseRef.current.targetY = mousePos.y;
  }, [mousePos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // Completely transparent background
    container.appendChild(renderer.domElement);

    // Glowing Chi Orbs & Golden Embers System (Rendered ON TOP of video - Visible, Gentle & Ethereal)
    const particleCount = 68;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount * 3);
    const randomSeeds = new Float32Array(particleCount);

    // Warm Chinese Chi palette: luminous gold, warm amber, soft champagne, lantern glow
    const palette = [
      new THREE.Color('#ffd54f'), // Bright Golden Chi
      new THREE.Color('#ffca28'), // Warm Amber Gold
      new THREE.Color('#ffe082'), // Soft Champagne Gold
      new THREE.Color('#ffb300'), // Warm Lantern Ember
      new THREE.Color('#fff9c4'), // Luminous Chi Light
    ];

    for (let i = 0; i < particleCount; i++) {
      // Spread evenly across viewport
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 28;
      // Z range: floating around and in front of the panda
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 + 3.5;

      // Gentle varied scales (soft glowing motes & orbs)
      scales[i] = Math.random() * 0.8 + 0.7;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      speeds[i * 3] = (Math.random() - 0.5) * 0.0025; // Gentle horizontal drift
      speeds[i * 3 + 1] = Math.random() * 0.0055 + 0.0035; // Gentle, tranquil upward rise
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.002; // Depth drift

      randomSeeds[i] = Math.random() * 100.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('seed', new THREE.BufferAttribute(randomSeeds, 1));

    // Custom Shader Material: Visible, soft, luminous glowing Chi orbs
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uActionIntensity: { value: 0 },
        uMouseWorld: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float scale;
        attribute vec3 color;
        attribute float seed;
        uniform float uTime;
        uniform float uActionIntensity;
        uniform vec2 uMouseWorld;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec3 pos = position;

          // Gentle harmonic organic sway
          float wave = sin(uTime * 0.75 + seed + pos.y * 0.25);
          pos.x += wave * (0.35 + uActionIntensity * 0.2);
          pos.z += cos(uTime * 0.6 + seed * 0.4) * 0.25;

          // Gentle cursor interaction / subtle deflection
          vec2 dMouse = pos.xy - uMouseWorld;
          float dist = length(dMouse);
          if (dist < 6.0 && dist > 0.001) {
            float push = (1.0 - dist / 6.0) * 0.35;
            pos.xy += (dMouse / dist) * push;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          // Optimal size: clearly visible soft glowing orbs without harshness
          gl_PointSize = scale * (280.0 / -mvPosition.z) * (1.0 + uActionIntensity * 0.25);
          gl_Position = projectionMatrix * mvPosition;

          // Gentle, peaceful twinkle
          float twinkle = 0.75 + 0.25 * sin(uTime * 1.8 + seed * 2.0);
          vAlpha = twinkle;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uActionIntensity;

        void main() {
          // Circular coordinate with radial soft falloff
          vec2 uv = gl_PointCoord - vec2(0.5);
          float dist = length(uv);
          if (dist > 0.5) discard;

          // Soft luminous core with gentle feathering outwards
          float core = 1.0 - smoothstep(0.0, 0.22, dist);
          float halo = 1.0 - smoothstep(0.06, 0.5, dist);
          float glow = halo * 0.55 + core * 0.45;
          glow = pow(glow, 1.15);

          // Center has luminous warmth, halo is rich golden amber
          vec3 brightCenter = vec3(1.0, 0.98, 0.88);
          vec3 finalColor = mix(vColor, brightCenter, core * 0.65);

          // Clearly visible yet gentle and subtle
          float finalAlpha = glow * vAlpha * (0.58 + uActionIntensity * 0.22);

          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let actionFactor = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse position lerping
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Mouse position projected in world space for particle interaction
      particleMaterial.uniforms.uMouseWorld.value.set(mouse.x * 16, mouse.y * 10);

      // Smooth camera parallax
      camera.position.x = mouse.x * 1.8;
      camera.position.y = mouse.y * 1.2;
      camera.lookAt(0, 0, 0);

      // Smooth action intensity transition
      const targetAction = isActionRef.current ? 1.0 : 0.0;
      actionFactor += (targetAction - actionFactor) * 0.04;

      particleMaterial.uniforms.uTime.value = elapsedTime;
      particleMaterial.uniforms.uActionIntensity.value = actionFactor;

      // Particle physics update
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const speedMultiplier = isActionRef.current ? 1.3 : 1.0;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += speeds[i * 3 + 1] * speedMultiplier; // Rise Y
        posArray[i * 3] += speeds[i * 3] * speedMultiplier; // Drift X

        // Reset if floated above ceiling
        if (posArray[i * 3 + 1] > 18) {
          posArray[i * 3 + 1] = -18;
          posArray[i * 3] = (Math.random() - 0.5) * 44;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 14 + 2.0;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
    />
  );
};
