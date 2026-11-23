export const BLACK_HOLE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const BLACK_HOLE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uMotionScale;
  uniform vec3 uCameraPos;
  uniform mat4 uInvProj;
  uniform mat4 uCameraWorldMatrix;
  uniform mat3 uDiskMatrix;
  uniform mat3 uInvDiskMatrix;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float hash13(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
  }

  float valueNoise3(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash13(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash13(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);

    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);

    return mix(nxy0, nxy1, f.z);
  }

  float fbm3(vec3 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      v += amp * valueNoise3(p);
      p = p * 2.04 + vec3(13.1, 7.7, 19.3);
      amp *= 0.5;
    }
    return v;
  }

  vec2 fbm2Dual(vec3 p) {
    float n1 = valueNoise3(p);
    float n2 = valueNoise3(p * 2.08 + vec3(13.1, 7.7, 19.3));
    return vec2(n1 * 0.667 + n2 * 0.333, n2);
  }

  vec3 acesFilm(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }

  vec3 starLayer(vec3 dir, float scale, float densityThreshold, float brightness) {
    vec3 p = dir * scale;
    vec3 id = floor(p);
    vec3 f = fract(p) - 0.5;
    vec3 rnd = hash33(id);
    float spawn = step(densityThreshold, rnd.x);
    vec3 offset = (rnd - 0.5) * 0.62;
    float dist = length(f - offset);
    float core = smoothstep(0.10, 0.0, dist);
    float twinkle = 0.94 + 0.06 * sin(uTime * uMotionScale * (0.14 + rnd.y * 0.25) + rnd.z * 6.2831);

    vec3 warmStar = vec3(1.0, 0.91, 0.85);
    vec3 coolStar = vec3(0.84, 0.87, 0.96);
    vec3 tint = mix(warmStar, coolStar, rnd.z);

    return tint * core * core * spawn * brightness * (0.35 + 0.65 * rnd.y) * twinkle;
  }

  vec3 sampleBackground(vec3 worldDir) {
    vec3 bg = vec3(0.0038, 0.0032, 0.0046);
    bg += starLayer(worldDir, 88.0, 0.968, 0.68);
    bg += starLayer(worldDir, 156.0, 0.976, 0.40);
    return bg;
  }

  vec4 sampleAccretionDisk(vec3 hitPos, vec3 rayDir, float camDistToHit, float pathLength) {
    float r = length(hitPos.xz);
    float innerEdge = smoothstep(1.90, 2.34, r);
    float outerEdge = 1.0 - smoothstep(5.3, 8.6, r);
    float nearFade = smoothstep(0.85, 2.1, camDistToHit);
    float radialEnv = innerEdge * outerEdge * nearFade;

    if (radialEnv <= 0.001) {
      return vec4(0.0);
    }

    float theta = atan(hitPos.z, hitPos.x);
    float tFlow = uTime * uMotionScale;

    // Calm, fluid Keplerian angular rotation
    float keplerOmega = 0.17 / pow(max(r * 0.44, 0.52), 1.24);
    float rotAngle = theta + tFlow * keplerOmega;

    vec2 circle = vec2(cos(rotAngle), sin(rotAngle));
    float spiralAngle = rotAngle + 1.65 * log(max(r, 1.0));
    vec2 spiralCircle = vec2(cos(spiralAngle), sin(spiralAngle));

    float coarseNoise = fbm3(vec3(r * 1.10 - tFlow * 0.004, circle * 1.50));
    float fineNoise = fbm3(vec3(r * 3.6 + coarseNoise * 0.85, spiralCircle * 2.10));

    // Distance-attenuated fine concentric orbital filaments
    float detailFilter = 1.0 - smoothstep(10.0, 22.0, pathLength);
    float waveA = 0.5 + 0.5 * sin(r * 9.0 + coarseNoise * 3.1 + fineNoise * 2.0);
    float waveB = 0.5 + 0.5 * sin(r * 17.0 + fineNoise * 2.5 + 0.9);
    float fineFilaments = mix(0.68, pow(waveA, 1.25) * 0.62 + pow(waveB, 1.6) * 0.42, 0.50 + 0.35 * detailFilter);

    // Continuous base density prevents broken gaps across the foreground sweep and lensed arches
    float continuity = mix(0.84, 1.10, coarseNoise) * mix(0.86, 1.16, fineNoise);
    float structure = continuity * mix(0.80, 1.18, fineFilaments);

    float rNorm = clamp((r - 1.92) / 6.6, 0.0, 1.0);

    vec3 colWhiteRose = vec3(1.00, 0.94, 0.90);
    vec3 colRoseGold  = vec3(0.86, 0.61, 0.49);
    vec3 colBronze    = vec3(0.56, 0.35, 0.23);
    vec3 colDeepBrown = vec3(0.19, 0.09, 0.065);
    vec3 colMutedViolet = vec3(0.28, 0.16, 0.24);

    vec3 baseCol = mix(colWhiteRose, colRoseGold, smoothstep(0.0, 0.18, rNorm));
    baseCol = mix(baseCol, colBronze, smoothstep(0.14, 0.55, rNorm));
    vec3 outerCol = mix(colDeepBrown, colMutedViolet, smoothstep(0.32, 0.78, coarseNoise));
    baseCol = mix(baseCol, outerCol, smoothstep(0.46, 0.96, rNorm));

    // Delicate inner luminous rim and thin orbital thread highlights
    float rimOffset = (r - 2.34) / 0.38;
    float innerRim = exp(-(rimOffset * rimOffset));
    float thinThread = smoothstep(0.66, 0.98, waveB) * detailFilter * (1.0 - smoothstep(0.18, 0.86, rNorm));
    baseCol += colWhiteRose * innerRim * 0.50;
    baseCol += colRoseGold * thinThread * 0.28;

    // Gentle relativistic Doppler asymmetry without darkening receding wing into a gap
    vec3 tangent = normalize(vec3(-hitPos.z, 0.0, hitPos.x));
    float doppler = dot(tangent, -rayDir);
    float beaming = mix(0.88, 1.18, 0.5 + 0.5 * doppler);
    vec3 dopplerTint = mix(vec3(0.93, 0.85, 0.89), vec3(1.04, 0.99, 0.96), 0.5 + 0.5 * doppler);

    float intensity = (0.74 + 0.96 * exp(-rNorm * 1.75)) * structure * beaming;
    vec3 finalCol = baseCol * dopplerTint * intensity;

    // Smooth continuous opacity connects foreground arc seamlessly with upper/lower arches
    float alpha = clamp(radialEnv * mix(0.68, 0.96, fineFilaments) * 0.82, 0.0, 0.90);
    return vec4(finalCol, alpha);
  }

  vec4 sampleSurroundingPlasma(vec3 p, float rDisk, float camDistToPt, float tFlow) {
    float scaleH = 0.26 + 0.075 * rDisk;
    float yNorm = p.y / scaleH;
    float vertMask = exp(-(yNorm * yNorm));
    float innerMask = smoothstep(1.56, 2.75, rDisk);
    float outerMask = 1.0 - smoothstep(5.6, 10.2, rDisk);
    float nearFade = smoothstep(0.9, 2.4, camDistToPt);
    float envelope = vertMask * innerMask * outerMask * nearFade;

    if (envelope <= 0.002) {
      return vec4(0.0);
    }

    float theta = atan(p.z, p.x);
    float rScaled = max(rDisk * 0.44, 0.52);
    float omega = 0.11 / (rScaled * sqrt(sqrt(rScaled)));
    float swirlAngle = theta + tFlow * omega + 1.85 * log(max(rDisk, 1.0));

    vec3 noiseCoord = vec3(
      cos(swirlAngle) * 1.35 + rDisk * 0.44,
      p.y * 1.35,
      sin(swirlAngle) * 1.35 + rDisk * 0.44
    );

    vec2 turb = fbm2Dual(noiseCoord * 1.12 - vec3(tFlow * 0.01, 0.0, 0.0));
    float turbCoarse = turb.x;
    float turbFine = turb.y;
    float wisp = smoothstep(0.28, 0.84, turbCoarse * 0.65 + turbFine * 0.35);

    float rNorm = clamp((rDisk - 1.56) / 8.3, 0.0, 1.0);

    vec3 colCream = vec3(1.00, 0.94, 0.84);
    vec3 colWhiteGold = vec3(0.97, 0.82, 0.62);
    vec3 colPeachCopper = vec3(0.84, 0.52, 0.34);
    vec3 colBronze = vec3(0.56, 0.33, 0.20);
    vec3 colDarkAmber = vec3(0.22, 0.085, 0.042);
    vec3 colRedBrown = vec3(0.12, 0.042, 0.028);

    vec3 brightCol = mix(colCream, colWhiteGold, smoothstep(0.0, 0.25, rNorm));
    brightCol = mix(brightCol, colPeachCopper, smoothstep(0.20, 0.58, rNorm));
    brightCol = mix(brightCol, colBronze, smoothstep(0.50, 0.90, rNorm));

    vec3 darkCol = mix(colDarkAmber, colRedBrown, smoothstep(0.25, 0.85, rNorm));
    vec3 plasmaCol = mix(darkCol, brightCol, smoothstep(0.20, 0.78, turbCoarse));

    float emission = (0.38 + 0.85 * wisp) * mix(1.12, 0.55, rNorm);
    float alpha = envelope * (0.28 + 0.72 * wisp);
    return vec4(plasmaCol * emission, alpha);
  }

  void main() {
    vec2 ndc = vUv * 2.0 - 1.0;
    vec4 viewRay = uInvProj * vec4(ndc, -1.0, 1.0);
    viewRay.xyz /= viewRay.w;
    vec3 worldDir = normalize((uCameraWorldMatrix * vec4(viewRay.xyz, 0.0)).xyz);

    vec3 localCam = uInvDiskMatrix * uCameraPos;
    vec3 ro = localCam;
    vec3 rd = normalize(uInvDiskMatrix * worldDir);

    const float R_SIM = 13.5;
    const float RS = 1.0;

    // Fast analytic skip to simulation sphere boundary
    float camDist = length(ro);
    float pathLength = 0.0;
    if (camDist > R_SIM) {
      float b = dot(ro, rd);
      float c = dot(ro, ro) - R_SIM * R_SIM;
      float disc = b * b - c;
      if (disc < 0.0) {
        vec3 col = acesFilm(sampleBackground(worldDir));
        col = pow(max(col, vec3(1e-5)), vec3(1.0 / 2.2));
        col += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
        gl_FragColor = vec4(col, 1.0);
        return;
      }
      float tEntry = -b - sqrt(disc);
      if (tEntry < 0.0 && b > 0.0) {
        vec3 col = acesFilm(sampleBackground(worldDir));
        col = pow(max(col, vec3(1e-5)), vec3(1.0 / 2.2));
        col += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
        gl_FragColor = vec4(col, 1.0);
        return;
      }
      if (tEntry > 0.0) {
        ro += rd * tEntry;
        pathLength += tEntry;
      }
    }

    vec3 pos = ro;
    vec3 vel = rd;
    vec3 L = cross(pos, vel);
    float h2 = dot(L, L);

    // Analytic weak-field bypass for rays passing well outside the disk (8.6) & plasma (10.2)
    if (h2 > 132.0) {
      vec3 perpInward = cross(L, vel);
      float camFactor = 1.0 + clamp(-dot(pos, vel) / max(length(pos), 1.0), -1.0, 1.0);
      vec3 lensedLocalDir = normalize(vel + perpInward * (1.5 * RS * camFactor / h2));
      vec3 finalWorldDir = normalize(uDiskMatrix * lensedLocalDir);
      vec3 col = acesFilm(sampleBackground(finalWorldDir) * 1.08);
      col = pow(max(col, vec3(1e-5)), vec3(1.0 / 2.2));
      col += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
      gl_FragColor = vec4(col, 1.0);
      return;
    }

    vec3 accumColor = vec3(0.0);
    float transmittance = 1.0;
    float frontTransmittance = 1.0;
    bool captured = false;
    float minR = length(pos);
    float tFlow = uTime * uMotionScale;
    bool samplePlasmaStep = true;

    for (int i = 0; i < 116; i++) {
      float r = length(pos);

      if (r < 1.02 * RS) {
        captured = true;
        break;
      }
      if (r > 11.2 && dot(pos, vel) > 0.0) {
        break;
      }

      float planeProx = smoothstep(0.0, 1.35, abs(pos.y));
      float baseDt = r > 4.2
        ? clamp(0.165 * r, 0.14, 0.72)
        : clamp(0.050 * r, 0.022, 0.175);
      float dt = baseDt * mix(0.68, 1.0, planeProx);

      float invR5 = 1.0 / (r * r * r * r * r);
      vec3 a1 = -1.5 * RS * h2 * pos * invR5;
      vec3 midPos = pos + vel * (0.5 * dt);
      float rMid = max(length(midPos), 0.25);
      float invRMid5 = 1.0 / (rMid * rMid * rMid * rMid * rMid);
      vec3 a2 = -1.5 * RS * h2 * midPos * invRMid5;

      vec3 nextPos = pos + normalize(vel + a1 * (0.5 * dt)) * dt;
      vec3 nextVel = normalize(vel + a2 * dt);

      // Continuous segment minimum radius prevents quantized stepping on photon outline
      vec3 seg = nextPos - pos;
      float segLen2 = max(dot(seg, seg), 1e-8);
      float tClosest = clamp(-dot(pos, seg) / segLen2, 0.0, 1.0);
      minR = min(minR, length(pos + seg * tClosest));

      pathLength += dt;
      bool isForegroundApproach = dot(pos, vel) < 0.0;

      // Exact equatorial plane crossing check (protected accretion rings)
      if ((pos.y > 0.0 && nextPos.y <= 0.0) || (pos.y < 0.0 && nextPos.y >= 0.0)) {
        float frac = abs(pos.y) / max(abs(pos.y - nextPos.y), 1e-6);
        vec3 hit = mix(pos, nextPos, frac);
        float camToHitDist = length(hit - localCam);
        vec4 disk = sampleAccretionDisk(hit, nextVel, camToHitDist, pathLength);
        if (disk.a > 0.001) {
          accumColor += transmittance * disk.rgb * disk.a;
          transmittance *= (1.0 - disk.a);
          if (isForegroundApproach) {
            frontTransmittance *= (1.0 - disk.a);
          }
          if (transmittance < 0.02) {
            break;
          }
        }
      }

      // Organic volumetric plasma atmosphere sampled on alternating steps with tight vertical culling
      samplePlasmaStep = !samplePlasmaStep;
      if (samplePlasmaStep) {
        float r3dNext = length(nextPos);
        float rDisk = length(nextPos.xz);
        if (r3dNext > 1.56 && rDisk > 1.56 && rDisk < 10.2 && abs(nextPos.y) < (0.68 + 0.19 * rDisk)) {
          float camToPtDist = length(nextPos - localCam);
          vec4 plasma = sampleSurroundingPlasma(nextPos, rDisk, camToPtDist, tFlow);
          if (plasma.a > 0.001) {
            float pAlpha = min(plasma.a * dt * 0.176, 0.45);
            accumColor += transmittance * plasma.rgb * pAlpha;
            transmittance *= (1.0 - pAlpha * 0.42);
            if (isForegroundApproach) {
              frontTransmittance *= (1.0 - pAlpha * 0.42);
            }
          }
        }
      }

      pos = nextPos;
      vel = nextVel;
    }

    // Thin, delicate luminous photon ring outline around the event horizon shadow
    if (!captured) {
      float ringDist = abs(minR - 1.53);
      float sharpOutline = exp(-ringDist * ringDist * 220.0) * 0.56;
      float softHalo = exp(-max(minR - 1.50, 0.0) * 6.8) * 0.16;
      vec3 outlineColor = mix(vec3(0.84, 0.58, 0.46), vec3(1.0, 0.94, 0.90), exp(-ringDist * 18.0));
      float outlineAtten = mix(frontTransmittance, transmittance, 0.25);
      accumColor += outlineAtten * outlineColor * (sharpOutline + softHalo);

      // Restrained, localized cool cyan-blue atmospheric accents along selected inner-edge regions
      vec3 shadowDir = normalize(uDiskMatrix * vel);
      float edgeAz = atan(shadowDir.y, shadowDir.x);
      float secA = max(0.0, cos(edgeAz - 2.35));
      float secB = max(0.0, cos(edgeAz + 0.85));
      float localCyanMask = (secA * secA * secA + secB * secB * secB * secB * 0.65)
                          * smoothstep(1.94, 1.52, minR);
      float edgeBand = (minR - 1.56) / 0.12;
      float innerCyan = exp(-(edgeBand * edgeBand)) * localCyanMask * 0.36;
      vec3 coolCyan = mix(vec3(0.16, 0.46, 0.68), vec3(0.46, 0.78, 0.92), exp(-ringDist * 20.0));
      accumColor += outlineAtten * coolCyan * innerCyan;

      // Gravitationally lensed background stars
      vec3 finalWorldDir = normalize(uDiskMatrix * vel);
      accumColor += transmittance * sampleBackground(finalWorldDir);

      // Subtle global atmospheric halo outside the captured event horizon shadow
      float haloR = clamp(1.0 - minR / 8.5, 0.0, 1.0);
      accumColor += vec3(0.04, 0.022, 0.020) * (haloR * haloR * haloR) * transmittance * 0.38;
    }

    vec3 mapped = acesFilm(accumColor * 1.08);
    mapped = pow(max(mapped, vec3(1e-5)), vec3(1.0 / 2.2));
    mapped += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;

    gl_FragColor = vec4(mapped, 1.0);
  }
`;

export const PARTICLE_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  attribute float aRadius;
  attribute float aAngle;
  attribute float aHeight;
  attribute float aSpeed;
  attribute float aSize;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uMotionScale;
  uniform float uPixelRatio;
  uniform vec3 uCameraPos;
  uniform mat3 uDiskMatrix;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float tFlow = uTime * uMotionScale;
    float angle = aAngle + tFlow * aSpeed;
    vec3 localPos = vec3(
      cos(angle) * aRadius,
      aHeight + sin(angle * 2.0 + aRadius * 1.3) * 0.014,
      sin(angle) * aRadius
    );
    vec3 worldPos = uDiskMatrix * localPos;

    // Gravitational lensing deflection & shadow occlusion for particles behind the black hole
    vec3 camToParticle = worldPos - uCameraPos;
    float particleDist = length(camToParticle);
    vec3 rayDir = camToParticle / max(particleDist, 1e-4);
    float centerProj = dot(-uCameraPos, rayDir);

    float shadowOcclusion = 1.0;
    vec3 lensedWorldPos = worldPos;

    if (centerProj > 0.0 && particleDist > centerProj) {
      vec3 closestToCenter = uCameraPos + rayDir * centerProj;
      float impact = length(closestToCenter);
      float behindFactor = smoothstep(0.0, 2.5, particleDist - centerProj);

      // Strictly mask particles inside the event horizon capture cone (impact < 1.56)
      // and gently bend outer rays into the upper & lower lensed arches
      float shadowMask = smoothstep(1.52, 1.84, impact);
      if (impact >= 1.48 && impact < 4.4) {
        vec3 radialOut = closestToCenter / max(impact, 1e-4);
        float bendStrength = (0.58 / max(impact - 1.05, 0.42)) * behindFactor * (1.0 - smoothstep(2.6, 4.4, impact));
        lensedWorldPos += radialOut * bendStrength * 0.80;
      }

      float lensedImpact = length(cross(-uCameraPos, normalize(lensedWorldPos - uCameraPos)));
      shadowOcclusion = shadowMask * smoothstep(1.62, 1.94, lensedImpact);
    }

    vec4 mvPosition = viewMatrix * vec4(lensedWorldPos, 1.0);
    float distCam = max(-mvPosition.z, 0.5);

    // Smooth near-camera & far-distance fade so particles remain visible across the ring without clipping
    float distFade = smoothstep(1.2, 2.7, distCam) * smoothstep(28.0, 14.0, distCam);

    // Strictly constrain particle visibility to the accretion ring band (outside dark central gap)
    float radialFade = smoothstep(2.14, 2.48, aRadius) * (1.0 - smoothstep(6.3, 8.1, aRadius));

    vColor = aColor;
    vAlpha = shadowOcclusion * distFade * radialFade * 0.92;

    // Smaller, refined circular points with crisp visibility
    float perspectiveScale = clamp(11.0 / distCam, 0.95, 1.75);
    gl_PointSize = clamp(aSize * perspectiveScale, 1.9, 3.6) * uPixelRatio;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c) * 2.0;
    if (r > 1.0 || vAlpha <= 0.004) discard;

    // Tiny, crisp, round circular particle with concentrated bright core and soft anti-aliased rim
    float circle = smoothstep(1.0, 0.12, r);
    float core = mix(circle * circle, 1.0, smoothstep(0.55, 0.0, r) * 0.72);
    gl_FragColor = vec4(vColor, core * vAlpha);
  }
`;
