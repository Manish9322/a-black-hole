import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {
  BLACK_HOLE_FRAGMENT_SHADER,
  BLACK_HOLE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
} from './shaders';

export interface BlackHoleController {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  dispose: () => void;
}

export interface BlackHoleSceneOptions {
  container: HTMLElement;
  reducedMotion: boolean;
  onFirstInteract?: () => void;
  onContextLost?: () => void;
  onContextRestored?: () => void;
}

const MIN_DISTANCE = 3.2;
const MAX_DISTANCE = 20.0;
const INITIAL_CAMERA_POS = new THREE.Vector3(0.70, 0, 10.73);

// Pre-allocated math helpers for zero-GC animation loop
const _invProj = new THREE.Matrix4();
const _currentSpherical = new THREE.Spherical();
const _targetSpherical = new THREE.Spherical();
const _origin = new THREE.Vector3(0, 0, 0);

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

function computeResponsiveFov(width: number, height: number): number {
  const aspect = width / Math.max(height, 1);
  const baseVerticalFov = 44;
  if (aspect >= 1) return baseVerticalFov;
  const clampedAspect = Math.max(aspect, 0.56);
  const halfRad = THREE.MathUtils.degToRad(baseVerticalFov * 0.5);
  const adjustedHalfRad = Math.atan(Math.tan(halfRad) / Math.pow(clampedAspect, 0.65));
  return THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(adjustedHalfRad * 2), 44, 64);
}

function createDiskParticles(
  diskMatrix: THREE.Matrix3,
  pixelRatio: number,
  motionScale: number,
): THREE.Points {
  const count = 1050;
  const positions = new Float32Array(count * 3);
  const radii = new Float32Array(count);
  const angles = new Float32Array(count);
  const heights = new Float32Array(count);
  const speeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const cCreamWhite = new THREE.Color(0xfff5e3);
  const cWarmPeach = new THREE.Color(0xe69464);
  const cCopper = new THREE.Color(0xa35930);
  const cDarkAmber = new THREE.Color(0x38180d);
  const tempColor = new THREE.Color();

  // Deterministic pseudo-random helper for consistent, gap-free filament distribution
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Complement the continuous warped volumetric plasma with subtle outer-disk dust motes
  const ringTracks = 18;
  const streamCount = Math.floor(count * 0.86);
  const perTrack = Math.ceil(streamCount / ringTracks);

  for (let i = 0; i < count; i++) {
    const isOuterWisp = i >= streamCount;
    let r: number;
    let angle: number;
    let thickness: number;

    if (!isOuterWisp) {
      const trackIdx = Math.floor(i / perTrack);
      const posInTrack = i % perTrack;
      const trackT = trackIdx / (ringTracks - 1);
      // Expanded outer disk band (r = 3.4..12.4) complementing warped volumetric plasma
      const baseR = 3.4 + Math.pow(trackT, 1.06) * 9.0;
      r = baseR + (rand() - 0.5) * 0.34;
      const baseAngle = ((posInTrack + rand() * 0.75) / perTrack) * Math.PI * 2;
      angle = baseAngle + trackIdx * 0.47;
      // Follow broader volumetric disk thickness H(r)
      const localH = Math.min(0.052 * Math.pow(r / 1.86, 0.88), 0.25);
      thickness = (rand() - 0.5) * localH * 1.65;
    } else {
      // Sparse atmospheric dust wisps drifting around outer envelope
      r = 4.8 + Math.pow(rand(), 0.95) * 7.8;
      angle = rand() * Math.PI * 2;
      thickness = (rand() - 0.5) * 0.28;
    }

    // Keplerian angular velocity scaling (Omega ~ r^-1.5) matched to calm visual pacing
    const speed = (0.13 / Math.pow(Math.max(r * 0.45, 0.6), 1.5)) * (0.94 + rand() * 0.12);

    radii[i] = r;
    angles[i] = angle;
    heights[i] = thickness;
    speeds[i] = speed;
    sizes[i] = isOuterWisp ? 0.9 + rand() * 0.65 : 1.0 + rand() * 0.78;

    const rNorm = THREE.MathUtils.clamp((r - 3.35) / 9.2, 0, 1);
    if (rNorm < 0.18) {
      tempColor.copy(cCreamWhite).lerp(cWarmPeach, rNorm / 0.18);
    } else if (rNorm < 0.62) {
      tempColor.copy(cWarmPeach).lerp(cCopper, (rNorm - 0.18) / 0.44);
    } else {
      tempColor.copy(cCopper).lerp(cDarkAmber, (rNorm - 0.62) / 0.38);
    }

    const brightness = isOuterWisp ? 0.48 + rand() * 0.22 : 0.62 + rand() * 0.28;
    colors[i * 3] = tempColor.r * brightness;
    colors[i * 3 + 1] = tempColor.g * brightness;
    colors[i * 3 + 2] = tempColor.b * brightness;

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = thickness;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1));
  geometry.setAttribute('aHeight', new THREE.BufferAttribute(heights, 1));
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 20);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: {value: 0},
      uMotionScale: {value: motionScale},
      uPixelRatio: {value: pixelRatio},
      uCameraPos: {value: new THREE.Vector3().copy(INITIAL_CAMERA_POS)},
      uDiskMatrix: {value: diskMatrix},
    },
    vertexShader: PARTICLE_VERTEX_SHADER,
    fragmentShader: PARTICLE_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 2;
  return points;
}

export function createBlackHoleScene(options: BlackHoleSceneOptions): BlackHoleController {
  const {container, reducedMotion, onFirstInteract, onContextLost, onContextRestored} = options;

  const isSoftwareGl = detectSoftwareWebGL();
  let basePixelRatio = isSoftwareGl ? 0.65 : Math.min(window.devicePixelRatio || 1, 1.5);
  let currentPixelRatio = basePixelRatio;
  const motionScale = reducedMotion ? 0.18 : 1.0;

  const width = Math.max(container.clientWidth, 1);
  const height = Math.max(container.clientHeight, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020203);

  const camera = new THREE.PerspectiveCamera(
    computeResponsiveFov(width, height),
    width / height,
    0.1,
    100,
  );
  camera.position.copy(INITIAL_CAMERA_POS);
  camera.lookAt(_origin);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setPixelRatio(currentPixelRatio);
  renderer.setSize(width, height);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.touchAction = 'none';
  container.appendChild(renderer.domElement);

  // Tilted local disk orientation so the broad accretion disk sweeps diagonally across the viewport
  const diskEuler = new THREE.Euler(0.16, 0.0, 0.24, 'XYZ');
  const diskQuat = new THREE.Quaternion().setFromEuler(diskEuler);
  const diskMatrix4 = new THREE.Matrix4().makeRotationFromQuaternion(diskQuat);
  const diskMatrix3 = new THREE.Matrix3().setFromMatrix4(diskMatrix4);
  const invDiskMatrix3 = diskMatrix3.clone().invert();

  // Fullscreen ray-marched relativistic black hole quad
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  const blackHoleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: {value: 0},
      uMotionScale: {value: motionScale},
      uCameraPos: {value: camera.position.clone()},
      uInvProj: {value: camera.projectionMatrixInverse.clone()},
      uCameraWorldMatrix: {value: camera.matrixWorld.clone()},
      uDiskMatrix: {value: diskMatrix3},
      uInvDiskMatrix: {value: invDiskMatrix3},
    },
    vertexShader: BLACK_HOLE_VERTEX_SHADER,
    fragmentShader: BLACK_HOLE_FRAGMENT_SHADER,
    depthWrite: false,
    depthTest: false,
  });

  const blackHoleMesh = new THREE.Mesh(quadGeometry, blackHoleMaterial);
  blackHoleMesh.frustumCulled = false;
  blackHoleMesh.renderOrder = 1;
  scene.add(blackHoleMesh);

  // Orbiting 3D atmospheric dust particles
  const particles = createDiskParticles(diskMatrix3, currentPixelRatio, motionScale);
  const particleMaterial = particles.material as THREE.ShaderMaterial;
  scene.add(particles);

  // Pre-warm shaders on GPU
  if (!isSoftwareGl) {
    renderer.compile(scene, camera);
  }

  // Smooth 360-degree interactive OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(_origin);
  controls.enablePan = false;
  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.rotateSpeed = 0.70;
  controls.zoomSpeed = 0.85;
  controls.minDistance = MIN_DISTANCE;
  controls.maxDistance = MAX_DISTANCE;
  controls.minPolarAngle = 0.08;
  controls.maxPolarAngle = Math.PI - 0.08;
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_ROTATE,
  };
  controls.update();

  // Transition state for smooth damped zoom buttons & reset view
  let hasNotifiedInteract = false;
  let goalDistance: number | null = null;
  let isResetting = false;
  let isInteracting = false;
  const initialSpherical = new THREE.Spherical().setFromVector3(INITIAL_CAMERA_POS);

  const notifyInteract = () => {
    if (!hasNotifiedInteract) {
      hasNotifiedInteract = true;
      onFirstInteract?.();
    }
  };

  const handleControlsStart = () => {
    goalDistance = null;
    isResetting = false;
    isInteracting = true;
    notifyInteract();
  };

  const handleControlsEnd = () => {
    isInteracting = false;
  };

  const handleWheel = () => {
    goalDistance = null;
    isResetting = false;
    notifyInteract();
  };

  controls.addEventListener('start', handleControlsStart);
  controls.addEventListener('end', handleControlsEnd);
  renderer.domElement.addEventListener('wheel', handleWheel, {passive: true});

  const handleContextLost = (e: Event) => {
    e.preventDefault();
    onContextLost?.();
  };

  const handleContextRestored = () => {
    onContextRestored?.();
  };

  renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
  renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

  const applyPixelRatio = (nextRatio: number) => {
    if (Math.abs(nextRatio - currentPixelRatio) < 0.04) return;
    currentPixelRatio = nextRatio;
    renderer.setPixelRatio(nextRatio);
    particleMaterial.uniforms.uPixelRatio.value = nextRatio;
  };

  const handleResize = () => {
    const nextW = Math.max(container.clientWidth, 1);
    const nextH = Math.max(container.clientHeight, 1);
    basePixelRatio = isSoftwareGl ? 0.65 : Math.min(window.devicePixelRatio || 1, 1.5);
    currentPixelRatio = Math.min(currentPixelRatio, basePixelRatio);

    camera.fov = computeResponsiveFov(nextW, nextH);
    camera.aspect = nextW / nextH;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(currentPixelRatio);
    renderer.setSize(nextW, nextH);
    particleMaterial.uniforms.uPixelRatio.value = currentPixelRatio;
  };

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(container);
  window.addEventListener('resize', handleResize);

  // Frame loop with adaptive resolution & non-blocking software-WebGL afterDraw pacing
  let frameId = 0;
  let disposed = false;
  const clock = new THREE.Clock();
  let emaFrameMs = 16.6;
  let lastFrameTime = performance.now();
  let lastScaleChangeTime = lastFrameTime;

  function afterDraw(cb: () => void) {
    const gl = renderer.getContext() as WebGL2RenderingContext;
    if (!gl || typeof gl.fenceSync !== 'function') {
      frameId = window.setTimeout(cb, 32);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
      if (state === gl.UNSIGNALED) {
        frameId = window.setTimeout(poll, 8);
      } else {
        if (sync) gl.deleteSync(sync);
        frameId = window.setTimeout(cb, 32);
      }
    };
    frameId = window.setTimeout(poll, 8);
  }

  function tick() {
    if (disposed) return;

    const now = performance.now();
    const frameDtMs = now - lastFrameTime;
    lastFrameTime = now;
    if (frameDtMs > 0 && frameDtMs < 400) {
      emaFrameMs = emaFrameMs * 0.85 + frameDtMs * 0.15;
    }

    const minRatio = isSoftwareGl ? 0.5 : 0.75;
    if (now - lastScaleChangeTime > 320) {
      if (emaFrameMs > 26 && currentPixelRatio > minRatio + 0.03) {
        const nextRatio = Math.max(minRatio, Number((currentPixelRatio - 0.15).toFixed(2)));
        applyPixelRatio(nextRatio);
        lastScaleChangeTime = now;
      } else if (isInteracting && emaFrameMs > 19 && currentPixelRatio > 1.0) {
        applyPixelRatio(1.0);
        lastScaleChangeTime = now;
      } else if (!isInteracting && emaFrameMs < 18 && currentPixelRatio < basePixelRatio) {
        const nextRatio = Math.min(basePixelRatio, Number((currentPixelRatio + 0.15).toFixed(2)));
        applyPixelRatio(nextRatio);
        lastScaleChangeTime = now;
      }
    }

    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsed = clock.elapsedTime;

    if (isResetting) {
      _currentSpherical.setFromVector3(camera.position);
      _targetSpherical.copy(initialSpherical);

      // Shortest angular path around azimuth
      let dTheta = _targetSpherical.theta - _currentSpherical.theta;
      while (dTheta > Math.PI) dTheta -= Math.PI * 2;
      while (dTheta < -Math.PI) dTheta += Math.PI * 2;

      const lambda = 4.2;
      _currentSpherical.radius = THREE.MathUtils.damp(
        _currentSpherical.radius,
        _targetSpherical.radius,
        lambda,
        delta,
      );
      _currentSpherical.phi = THREE.MathUtils.damp(
        _currentSpherical.phi,
        _targetSpherical.phi,
        lambda,
        delta,
      );
      _currentSpherical.theta += dTheta * (1 - Math.exp(-lambda * delta));

      camera.position.setFromSpherical(_currentSpherical);
      camera.lookAt(_origin);

      const radiusErr = Math.abs(_currentSpherical.radius - _targetSpherical.radius);
      const phiErr = Math.abs(_currentSpherical.phi - _targetSpherical.phi);
      const thetaErr = Math.abs(dTheta);
      if (radiusErr < 0.01 && phiErr < 0.002 && thetaErr < 0.002) {
        camera.position.copy(INITIAL_CAMERA_POS);
        camera.lookAt(_origin);
        isResetting = false;
      }
    } else if (goalDistance !== null) {
      _currentSpherical.setFromVector3(camera.position);
      _currentSpherical.radius = THREE.MathUtils.damp(
        _currentSpherical.radius,
        goalDistance,
        6.0,
        delta,
      );
      camera.position.setFromSpherical(_currentSpherical);
      if (Math.abs(_currentSpherical.radius - goalDistance) < 0.015) {
        _currentSpherical.radius = goalDistance;
        camera.position.setFromSpherical(_currentSpherical);
        goalDistance = null;
      }
    }

    controls.update();
    camera.updateMatrixWorld();

    _invProj.copy(camera.projectionMatrix).invert();

    blackHoleMaterial.uniforms.uTime.value = elapsed;
    blackHoleMaterial.uniforms.uCameraPos.value.copy(camera.position);
    blackHoleMaterial.uniforms.uInvProj.value.copy(_invProj);
    blackHoleMaterial.uniforms.uCameraWorldMatrix.value.copy(camera.matrixWorld);

    particleMaterial.uniforms.uTime.value = elapsed;
    particleMaterial.uniforms.uCameraPos.value.copy(camera.position);

    renderer.render(scene, camera);

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }
  }

  tick();

  return {
    zoomIn: () => {
      notifyInteract();
      isResetting = false;
      const base = goalDistance ?? camera.position.length();
      goalDistance = THREE.MathUtils.clamp(base * 0.8, MIN_DISTANCE, MAX_DISTANCE);
    },
    zoomOut: () => {
      notifyInteract();
      isResetting = false;
      const base = goalDistance ?? camera.position.length();
      goalDistance = THREE.MathUtils.clamp(base * 1.25, MIN_DISTANCE, MAX_DISTANCE);
    },
    resetView: () => {
      notifyInteract();
      goalDistance = null;
      isResetting = true;
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', handleControlsStart);
      controls.removeEventListener('end', handleControlsEnd);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.dispose();
      quadGeometry.dispose();
      blackHoleMaterial.dispose();
      particles.geometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
