'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

/* -------------------------------------------------------------------------- */
/*  Postures du personnage (une par chapitre de l'histoire)                    */
/* -------------------------------------------------------------------------- */

interface Pose {
  x: number;
  y: number;
  rotY: number;
  torsoX: number;
  torsoZ: number;
  headX: number;
  headY: number;
  headZ: number;
  lShX: number;
  lShZ: number;
  lElX: number;
  rShX: number;
  rShZ: number;
  rElX: number;
  lHipX: number;
  lKneeX: number;
  rHipX: number;
  rKneeX: number;
  phone: number;
  mood: number; // -1 triste, +1 heureux
  worry: number; // 0 serein, 1 inquiet
  house: number; // -1 problème, +1 sous contrôle
  wave: number;
  bounce: number;
}

const REST: Pose = {
  x: 0, y: 0, rotY: 0,
  torsoX: 0, torsoZ: 0,
  headX: 0, headY: 0, headZ: 0,
  lShX: 0, lShZ: 0.14, lElX: -0.22,
  rShX: 0, rShZ: -0.14, rElX: -0.22,
  lHipX: 0, lKneeX: 0, rHipX: 0, rKneeX: 0,
  phone: 0, mood: 0.4, worry: 0, house: 0, wave: 0, bounce: 0,
};

const pose = (p: Partial<Pose>): Pose => ({ ...REST, ...p });

const POSES: Pose[] = [
  // 0. Paris : posture signature (main sur le bouton de veste, sourire confiant, présente sa villa)
  pose({
    x: -1.35,
    rotY: 0.34,
    headY: 0.14,
    headX: -0.04,
    lShX: -0.42,
    lShZ: 0.48,
    lElX: -1.35,
    rShX: 0.12,
    rShZ: -0.34,
    rElX: -0.62,
    mood: 0.95,
    house: 0.75,
  }),
  // 1. Le loyer n'arrive pas : regard inquiet sur le téléphone
  pose({
    x: 1.35,
    rotY: -0.25,
    headX: 0.36,
    headZ: 0.08,
    rShX: -0.55,
    rShZ: 0.18,
    rElX: -1.85,
    lShZ: 0.12,
    lElX: -0.28,
    phone: 1,
    mood: -0.35,
    worry: 0.6,
    house: -0.35,
  }),
  // 2. Mauvaises surprises : mains sur la tête
  pose({
    x: -1.25,
    rotY: 0.15,
    y: -0.04,
    torsoX: 0.22,
    headX: 0.28,
    lShX: -2.55,
    lShZ: -0.35,
    lElX: -2.0,
    rShX: -2.55,
    rShZ: 0.35,
    rElX: -2.0,
    lHipX: -0.15,
    rHipX: -0.15,
    lKneeX: 0.3,
    rKneeX: 0.3,
    mood: -0.9,
    worry: 1,
    house: -1,
  }),
  // 3. Le doute : accroupi, il serre ses genoux
  pose({
    x: 1.25,
    rotY: -0.35,
    y: -0.62,
    torsoX: 0.62,
    headX: 0.44,
    lHipX: -1.88,
    rHipX: -1.88,
    lKneeX: 2.28,
    rKneeX: 2.28,
    lShX: -1.1,
    lShZ: -0.25,
    lElX: -1.1,
    rShX: -1.1,
    rShZ: 0.25,
    rElX: -1.1,
    mood: -1,
    worry: 0.92,
    house: -1,
  }),
  // 4. Découverte de Naforo : il ouvre son espace et consulte son téléphone avec soulagement
  pose({
    x: -1.25,
    rotY: 0.25,
    torsoX: 0.06,
    headX: 0.26,
    rShX: -0.6,
    rShZ: 0.2,
    rElX: -1.8,
    lShX: -0.45,
    lShZ: -0.18,
    lElX: -1.55,
    phone: 1,
    mood: 0.75,
    worry: 0,
    house: 0.55,
  }),
  // 5. Aujourd'hui : bras levés, soulagement et contrôle total
  pose({
    x: 1.25,
    rotY: -0.2,
    headX: -0.12,
    lShZ: 2.48,
    lElX: -0.28,
    rShZ: -2.48,
    rElX: -0.28,
    mood: 1,
    house: 1,
    bounce: 1,
  }),
  // 6. Votre tour : il salue le visiteur avec un grand sourire
  pose({
    x: 1.35,
    rotY: -0.15,
    headY: -0.08,
    rShZ: -2.25,
    rShX: -0.2,
    rElX: -0.5,
    lShX: -0.35,
    lShZ: 0.42,
    lElX: -1.2,
    mood: 1,
    house: 1,
    wave: 1,
  }),
];

export const STORY_CHAPTER_COUNT = POSES.length;

const KEYS = Object.keys(REST) as (keyof Pose)[];

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function samplePose(progress: number, out: Pose) {
  const n = POSES.length;
  const f = Math.min(Math.max(progress, 0), 0.99999) * n;
  const i = Math.floor(f);
  const a = POSES[i];
  const b = POSES[Math.min(i + 1, n - 1)];
  const k = smoothstep(0.55, 1, f - i);
  for (const key of KEYS) out[key] = a[key] + (b[key] - a[key]) * k;
}

/* -------------------------------------------------------------------------- */
/*  Matériaux & couleurs                                                       */
/* -------------------------------------------------------------------------- */

const BAD = new THREE.Color('#ff6b57');
const GOOD = new THREE.Color('#3ddc97');
const WARM = new THREE.Color('#ffd27a');

function useMaterials() {
  return useMemo(
    () => ({
      // Personnage Koffi (référence : costume gris anthracite, chemise blanche, cravate rose rayée, lunettes noires)
      skin: new THREE.MeshStandardMaterial({ color: '#73442a', roughness: 0.44, metalness: 0.03 }),
      skinLip: new THREE.MeshStandardMaterial({ color: '#5c3320', roughness: 0.4 }),
      suit: new THREE.MeshStandardMaterial({ color: '#525964', roughness: 0.56, metalness: 0.1 }),
      suitDark: new THREE.MeshStandardMaterial({ color: '#3f454e', roughness: 0.62, metalness: 0.1 }),
      shirt: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.48 }),
      tie: new THREE.MeshStandardMaterial({ color: '#d89ca4', roughness: 0.42, metalness: 0.06 }),
      tieStripe: new THREE.MeshStandardMaterial({ color: '#f3d8dc', roughness: 0.38 }),
      belt: new THREE.MeshStandardMaterial({ color: '#16181b', roughness: 0.35, metalness: 0.25 }),
      buckle: new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.18, metalness: 0.88 }),
      shoe: new THREE.MeshStandardMaterial({ color: '#3b2318', roughness: 0.32, metalness: 0.15 }),
      sole: new THREE.MeshStandardMaterial({ color: '#18120f', roughness: 0.78 }),
      hair: new THREE.MeshStandardMaterial({ color: '#141211', roughness: 0.82 }),
      sclera: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2 }),
      iris: new THREE.MeshStandardMaterial({ color: '#1a100a', roughness: 0.12 }),
      catchlight: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
      teeth: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.22 }),
      glassesFrame: new THREE.MeshStandardMaterial({ color: '#101216', roughness: 0.22, metalness: 0.4 }),
      glassesLens: new THREE.MeshStandardMaterial({
        color: '#e0f2fe',
        transparent: true,
        opacity: 0.15,
        roughness: 0.04,
        metalness: 0.25,
      }),
      dark: new THREE.MeshStandardMaterial({ color: '#1c110d', roughness: 0.38 }),
      phone: new THREE.MeshStandardMaterial({ color: '#0d0d10', roughness: 0.25, metalness: 0.55 }),
      screen: new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#3ddc97', emissiveIntensity: 1.4 }),

      // Villa contemporaine Abidjan / Cocody
      facadeLight: new THREE.MeshStandardMaterial({ color: '#e6dfd3', roughness: 0.84 }),
      facadeStone: new THREE.MeshStandardMaterial({ color: '#c8bfb0', roughness: 0.88 }),
      trimDark: new THREE.MeshStandardMaterial({ color: '#1d2624', roughness: 0.52, metalness: 0.22 }),
      woodSlat: new THREE.MeshStandardMaterial({ color: '#784e30', roughness: 0.7 }),
      glassRailing: new THREE.MeshStandardMaterial({
        color: '#88c0b4',
        transparent: true,
        opacity: 0.38,
        roughness: 0.1,
        metalness: 0.3,
      }),
      foliage: new THREE.MeshStandardMaterial({ color: '#1d5c45', roughness: 0.78 }),
      windows: new THREE.MeshStandardMaterial({
        color: '#111615',
        emissive: '#ffd27a',
        emissiveIntensity: 1.15,
        roughness: 0.15,
        metalness: 0.25,
      }),
    }),
    []
  );
}

function useShadowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(0,0,0,0.58)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.2)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

/* -------------------------------------------------------------------------- */
/*  Personnage & Villa contemporaine                                           */
/* -------------------------------------------------------------------------- */

function Character({ progress }: { progress: MotionValue<number> }) {
  const m = useMaterials();
  const shadowTex = useShadowTexture();

  const root = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const browL = useRef<THREE.Mesh>(null);
  const browR = useRef<THREE.Mesh>(null);
  const eyelidL = useRef<THREE.Mesh>(null);
  const eyelidR = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const smileTeeth = useRef<THREE.Mesh>(null);
  const lSh = useRef<THREE.Group>(null);
  const lEl = useRef<THREE.Group>(null);
  const rSh = useRef<THREE.Group>(null);
  const rEl = useRef<THREE.Group>(null);
  const lHip = useRef<THREE.Group>(null);
  const lKnee = useRef<THREE.Group>(null);
  const rHip = useRef<THREE.Group>(null);
  const rKnee = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const house = useRef<THREE.Group>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const houseLight = useRef<THREE.PointLight>(null);

  const target = useMemo<Pose>(() => ({ ...REST }), []);
  const cur = useMemo<Pose>(() => ({ ...POSES[0] }), []);
  const motionState = useRef({ walk: 0, phase: 0, prevX: POSES[0].x, facing: POSES[0].rotY });
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    samplePose(progress.get(), target);

    const aPose = 1 - Math.exp(-6 * dt);
    const aMove = 1 - Math.exp(-2.4 * dt);
    for (const key of KEYS) {
      const a = key === 'x' ? aMove : aPose;
      cur[key] += (target[key] - cur[key]) * a;
    }

    const ms = motionState.current;
    const vx = (cur.x - ms.prevX) / Math.max(dt, 1e-4);
    ms.prevX = cur.x;
    const walkTarget = Math.min(1, Math.abs(vx) / 0.8);
    ms.walk += (walkTarget - ms.walk) * (1 - Math.exp(-8 * dt));
    const walk = ms.walk;
    ms.phase += dt * 9 * (0.35 + walk);
    const swing = Math.sin(ms.phase) * walk;

    const facingTarget = walk > 0.05 ? cur.rotY * (1 - walk) + Math.sign(vx) * 1.3 * walk : cur.rotY;
    ms.facing += (facingTarget - ms.facing) * (1 - Math.exp(-7 * dt));

    const vw = state.viewport.width;
    const narrow = vw < 4.4;
    const xScale = narrow ? 0.22 : Math.min(1, vw / 7.2);
    const scale = narrow ? 0.78 : 1;

    if (root.current) {
      root.current.position.x = narrow ? 0.34 : cur.x * xScale;
      root.current.position.y = narrow ? 0.56 : 0;
      root.current.rotation.y = ms.facing;
      root.current.scale.setScalar(scale);
    }

    const breathe = Math.sin(t * 1.8);
    const bob = Math.abs(Math.sin(ms.phase)) * 0.035 * walk;
    const jump = Math.abs(Math.sin(t * 4.6)) * 0.065 * cur.bounce;

    hips.current?.position.set(0, 0.95 + cur.y + bob + jump, 0);
    torso.current?.rotation.set(cur.torsoX + breathe * 0.01, 0, cur.torsoZ + swing * 0.03);
    chest.current?.scale.set(1.22, 1 + breathe * 0.012, 0.76);
    head.current?.rotation.set(cur.headX + breathe * 0.015, cur.headY, cur.headZ);

    const waveOsc = Math.sin(t * 7) * cur.wave;
    lSh.current?.rotation.set(cur.lShX + swing * 0.5, 0, cur.lShZ);
    lEl.current?.rotation.set(cur.lElX - Math.max(0, swing) * 0.3, 0, 0);
    rSh.current?.rotation.set(cur.rShX - swing * 0.5 * (1 - cur.phone), 0, cur.rShZ + waveOsc * 0.12);
    rEl.current?.rotation.set(cur.rElX - Math.max(0, -swing) * 0.3 * (1 - cur.phone) + waveOsc * 0.35, 0, 0);

    lHip.current?.rotation.set(cur.lHipX - swing * 0.6, 0, 0);
    rHip.current?.rotation.set(cur.rHipX + swing * 0.6, 0, 0);
    lKnee.current?.rotation.set(cur.lKneeX + Math.max(0, Math.sin(ms.phase)) * 0.9 * walk, 0, 0);
    rKnee.current?.rotation.set(cur.rKneeX + Math.max(0, -Math.sin(ms.phase)) * 0.9 * walk, 0, 0);

    // Clignement naturel des paupières toutes les ~4.2 secondes
    const blinkCycle = t % 4.2;
    const blink = blinkCycle > 4.04 ? Math.sin(((blinkCycle - 4.04) / 0.16) * Math.PI) : 0;
    if (eyelidL.current && eyelidR.current) {
      const lidScaleY = 0.18 + blink * 0.85 + cur.worry * 0.15;
      eyelidL.current.scale.y = lidScaleY;
      eyelidR.current.scale.y = lidScaleY;
    }

    if (browL.current && browR.current) {
      browL.current.rotation.z = -0.36 * cur.worry + (cur.mood > 0.5 ? 0.06 : 0);
      browR.current.rotation.z = 0.36 * cur.worry - (cur.mood > 0.5 ? 0.06 : 0);
      browL.current.position.y = 0.258 + cur.worry * 0.01 + (cur.mood > 0.5 ? 0.006 : 0);
      browR.current.position.y = 0.258 + cur.worry * 0.01 + (cur.mood > 0.5 ? 0.006 : 0);
    }

    if (mouth.current) {
      const mag = 0.32 + 0.68 * Math.min(1, Math.abs(cur.mood));
      mouth.current.scale.set(1 + Math.max(0, cur.mood) * 0.15, cur.mood >= 0 ? -mag : mag, 1);
    }
    if (smileTeeth.current) {
      const showTeeth = cur.mood > 0.35;
      smileTeeth.current.visible = showTeeth;
      if (showTeeth) {
        smileTeeth.current.scale.set(1, Math.min(1, (cur.mood - 0.3) * 1.4), 1);
      }
    }

    if (phone.current) {
      phone.current.visible = cur.phone > 0.02;
      phone.current.scale.setScalar(Math.max(0.001, cur.phone));
    }

    const h = (cur.house + 1) / 2;
    tmpColor.copy(BAD).lerp(GOOD, h);
    m.screen.emissive.copy(tmpColor);
    if (rim.current) rim.current.color.copy(tmpColor);
    m.windows.emissive.copy(BAD).lerp(WARM, h);
    m.windows.emissiveIntensity = 0.55 + h * 0.95 + (cur.house < 0 ? Math.max(0, Math.sin(t * 6)) * 0.55 : 0);
    if (houseLight.current) {
      houseLight.current.color.copy(m.windows.emissive);
      houseLight.current.intensity = 1.6 + h * 2.2;
    }

    if (shadow.current && root.current) {
      shadow.current.position.x = root.current.position.x;
      shadow.current.position.y = (narrow ? 0.56 : 0) + 0.002;
      const s = (1.28 + (cur.y < -0.2 ? 0.25 : 0) - jump * 2) * scale;
      shadow.current.scale.set(s, s * 0.6, 1);
    }

    // Villa visible sur desktop ET en version compacte sur mobile
    if (house.current) {
      house.current.visible = true;
      house.current.position.x = narrow ? -0.58 : 0.05;
      house.current.position.y = (narrow ? 0.68 : 0) + Math.sin(t * 0.7) * 0.015;
      house.current.position.z = narrow ? -4.3 : -3.7;
      house.current.scale.setScalar(narrow ? 0.66 : 1.12);
    }
  });

  return (
    <>
      <directionalLight ref={rim} position={[-4, 3.5, -3]} intensity={2.2} />

      {/* Ombre de contact */}
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>

      {/* Villa contemporaine à Abidjan (R+1 avec terrasse, pergola bois & baies vitrées) */}
      <group ref={house} position={[0.05, 0, -3.7]} rotation={[0, -0.38, 0]} scale={1.12}>
        <mesh position={[0, 0.04, 0.08]} material={m.trimDark}>
          <boxGeometry args={[2.15, 0.08, 1.45]} />
        </mesh>
        <mesh position={[0, 0.09, 0.1]} material={m.facadeStone}>
          <boxGeometry args={[1.92, 0.04, 1.25]} />
        </mesh>

        {/* Rez-de-chaussée */}
        <mesh position={[-0.12, 0.44, -0.02]} material={m.facadeLight}>
          <boxGeometry args={[1.52, 0.68, 0.96]} />
        </mesh>
        <mesh position={[0.56, 0.44, 0.14]} material={m.facadeStone}>
          <boxGeometry args={[0.36, 0.68, 0.68]} />
        </mesh>
        <mesh position={[-0.36, 0.4, 0.465]} material={m.windows}>
          <planeGeometry args={[0.64, 0.46]} />
        </mesh>
        <mesh position={[-0.36, 0.4, 0.468]} material={m.trimDark}>
          <boxGeometry args={[0.025, 0.48, 0.02]} />
        </mesh>
        <mesh position={[0.2, 0.36, 0.465]} material={m.woodSlat}>
          <boxGeometry args={[0.24, 0.5, 0.02]} />
        </mesh>

        {/* Dalle intermédiaire */}
        <mesh position={[0.04, 0.81, 0.08]} material={m.trimDark}>
          <boxGeometry args={[1.92, 0.07, 1.18]} />
        </mesh>

        {/* Étage R+1 */}
        <mesh position={[0.16, 1.14, -0.04]} material={m.facadeLight}>
          <boxGeometry args={[1.42, 0.6, 0.9]} />
        </mesh>
        <mesh position={[0.14, 1.47, 0.02]} material={m.trimDark}>
          <boxGeometry args={[1.6, 0.08, 1.06]} />
        </mesh>
        <mesh position={[0.18, 1.13, 0.415]} material={m.windows}>
          <planeGeometry args={[0.88, 0.42]} />
        </mesh>
        <mesh position={[0.18, 1.13, 0.418]} material={m.trimDark}>
          <boxGeometry args={[0.025, 0.44, 0.02]} />
        </mesh>
        <mesh position={[0.875, 1.14, 0.04]} rotation={[0, Math.PI / 2, 0]} material={m.windows}>
          <planeGeometry args={[0.42, 0.34]} />
        </mesh>

        {/* Garde-corps vitré du balcon */}
        <mesh position={[-0.52, 0.94, 0.48]} material={m.glassRailing}>
          <boxGeometry args={[0.66, 0.2, 0.02]} />
        </mesh>
        <mesh position={[-0.52, 1.045, 0.48]} material={m.trimDark}>
          <boxGeometry args={[0.68, 0.025, 0.03]} />
        </mesh>

        {/* Pergola lames bois */}
        {[-0.72, -0.58, -0.44, -0.3].map((px) => (
          <mesh key={px} position={[px, 1.45, 0.26]} material={m.woodSlat}>
            <boxGeometry args={[0.04, 0.035, 0.56]} />
          </mesh>
        ))}

        {/* Jardinières */}
        <mesh position={[-0.82, 0.2, 0.52]} material={m.foliage}>
          <sphereGeometry args={[0.14, 10, 8]} />
        </mesh>
        <mesh position={[0.84, 0.22, 0.46]} material={m.foliage}>
          <sphereGeometry args={[0.16, 10, 8]} />
        </mesh>

        <pointLight ref={houseLight} position={[0, 0.75, 1.1]} distance={4} />
      </group>

      {/* Koffi — Personnage 3D stylisé (costume gris cintré, cravate rose rayée, lunettes) */}
      <group ref={root}>
        <group ref={hips}>
          {/* Bassin */}
          <mesh position={[0, 0.01, 0]} scale={[1.06, 0.78, 0.8]} material={m.suitDark}>
            <sphereGeometry args={[0.19, 22, 18]} />
          </mesh>

          {/* Ceinture & boucle métallique */}
          <mesh position={[0, 0.095, 0]} scale={[1.07, 1, 0.79]} material={m.belt}>
            <cylinderGeometry args={[0.19, 0.19, 0.046, 24]} />
          </mesh>
          <mesh position={[0, 0.095, 0.156]} material={m.buckle}>
            <boxGeometry args={[0.064, 0.048, 0.018]} />
          </mesh>

          {/* Torse (veste en V épaulée + chemise + cravate rayée + pochette) */}
          <group ref={torso}>
            <mesh ref={chest} position={[0, 0.35, 0]} material={m.suit}>
              <capsuleGeometry args={[0.195, 0.29, 12, 22]} />
            </mesh>
            {/* Épaules structurées du costume */}
            <mesh position={[0.21, 0.53, 0]} scale={[1.1, 0.72, 0.88]} material={m.suit}>
              <sphereGeometry args={[0.095, 14, 12]} />
            </mesh>
            <mesh position={[-0.21, 0.53, 0]} scale={[1.1, 0.72, 0.88]} material={m.suit}>
              <sphereGeometry args={[0.095, 14, 12]} />
            </mesh>

            {/* Basques de la veste */}
            <mesh position={[0, 0.14, -0.005]} scale={[1.12, 1, 0.76]} material={m.suit}>
              <cylinderGeometry args={[0.186, 0.208, 0.18, 22]} />
            </mesh>
            {/* Rabats de poches latérales + poche poitrine */}
            <mesh position={[0.135, 0.17, 0.14]} rotation={[0, 0.32, 0]} material={m.suitDark}>
              <boxGeometry args={[0.075, 0.024, 0.015]} />
            </mesh>
            <mesh position={[-0.135, 0.17, 0.14]} rotation={[0, -0.32, 0]} material={m.suitDark}>
              <boxGeometry args={[0.075, 0.024, 0.015]} />
            </mesh>
            <mesh position={[-0.115, 0.44, 0.152]} rotation={[0, -0.2, 0]} material={m.suitDark}>
              <boxGeometry args={[0.062, 0.012, 0.012]} />
            </mesh>

            {/* Plastron chemise blanche + col */}
            <mesh position={[0, 0.42, 0.128]} rotation={[0.08, 0, 0]} material={m.shirt}>
              <boxGeometry args={[0.125, 0.31, 0.065]} />
            </mesh>
            <mesh position={[0, 0.598, 0.032]} material={m.shirt}>
              <cylinderGeometry args={[0.082, 0.096, 0.058, 18]} />
            </mesh>
            {/* Pointes du col blanc */}
            <mesh position={[0.038, 0.575, 0.148]} rotation={[0.2, 0, -0.45]} material={m.shirt}>
              <boxGeometry args={[0.042, 0.055, 0.014]} />
            </mesh>
            <mesh position={[-0.038, 0.575, 0.148]} rotation={[0.2, 0, 0.45]} material={m.shirt}>
              <boxGeometry args={[0.042, 0.055, 0.014]} />
            </mesh>

            {/* Revers crantés de la veste */}
            <mesh position={[0.074, 0.44, 0.146]} rotation={[0.08, -0.15, -0.24]} material={m.suitDark}>
              <boxGeometry args={[0.054, 0.26, 0.024]} />
            </mesh>
            <mesh position={[-0.074, 0.44, 0.146]} rotation={[0.08, 0.15, 0.24]} material={m.suitDark}>
              <boxGeometry args={[0.054, 0.26, 0.024]} />
            </mesh>

            {/* Cravate rose + rayures diagonales */}
            <mesh position={[0, 0.548, 0.164]} material={m.tie}>
              <boxGeometry args={[0.038, 0.042, 0.024]} />
            </mesh>
            <mesh position={[0, 0.375, 0.166]} rotation={[0.05, 0, 0]} material={m.tie}>
              <boxGeometry args={[0.04, 0.29, 0.015]} />
            </mesh>
            {[0.46, 0.39, 0.32].map((ty) => (
              <mesh
                key={ty}
                position={[0, ty, 0.175]}
                rotation={[0.05, 0, 0.48]}
                material={m.tieStripe}
              >
                <boxGeometry args={[0.042, 0.01, 0.004]} />
              </mesh>
            ))}

            {/* Boutons de veste */}
            <mesh position={[0, 0.27, 0.16]} material={m.belt}>
              <cylinderGeometry args={[0.012, 0.012, 0.01, 10]} />
            </mesh>
            <mesh position={[0, 0.19, 0.162]} material={m.belt}>
              <cylinderGeometry args={[0.012, 0.012, 0.01, 10]} />
            </mesh>

            {/* Cou */}
            <mesh position={[0, 0.655, 0.01]} material={m.skin}>
              <cylinderGeometry args={[0.058, 0.07, 0.11, 16]} />
            </mesh>

            {/* Tête sculptée (crâne + pommettes + mâchoire + lunettes + sourire) */}
            <group ref={head} position={[0, 0.66, 0.01]}>
              {/* Crâne supérieur */}
              <mesh position={[0, 0.2, -0.005]} scale={[0.95, 1.04, 0.98]} material={m.skin}>
                <sphereGeometry args={[0.162, 28, 22]} />
              </mesh>
              {/* Bas du visage / mâchoire et menton sculptés */}
              <mesh position={[0, 0.115, 0.018]} scale={[0.84, 0.78, 0.86]} material={m.skin}>
                <sphereGeometry args={[0.148, 24, 18]} />
              </mesh>

              {/* Coupe de cheveux courte dégradée (fade) */}
              <mesh position={[0, 0.23, -0.012]} rotation={[-0.18, 0, 0]} material={m.hair}>
                <sphereGeometry args={[0.168, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
              </mesh>
              <mesh position={[0, 0.34, 0.02]} scale={[0.92, 0.35, 0.85]} material={m.hair}>
                <sphereGeometry args={[0.145, 20, 12]} />
              </mesh>

              {/* Oreilles */}
              <mesh position={[0.158, 0.175, -0.005]} scale={[0.65, 1.15, 0.8]} material={m.skin}>
                <sphereGeometry args={[0.036, 12, 10]} />
              </mesh>
              <mesh position={[-0.158, 0.175, -0.005]} scale={[0.65, 1.15, 0.8]} material={m.skin}>
                <sphereGeometry args={[0.036, 12, 10]} />
              </mesh>

              {/* Yeux : sclère + iris + reflet vivant (catchlight) + paupières */}
              <mesh position={[0.056, 0.195, 0.138]} material={m.sclera}>
                <sphereGeometry args={[0.025, 14, 12]} />
              </mesh>
              <mesh position={[-0.056, 0.195, 0.138]} material={m.sclera}>
                <sphereGeometry args={[0.025, 14, 12]} />
              </mesh>
              <mesh position={[0.056, 0.195, 0.154]} material={m.iris}>
                <sphereGeometry args={[0.014, 12, 10]} />
              </mesh>
              <mesh position={[-0.056, 0.195, 0.154]} material={m.iris}>
                <sphereGeometry args={[0.014, 12, 10]} />
              </mesh>
              {/* Reflet blanc dans chaque œil */}
              <mesh position={[0.061, 0.2, 0.166]} material={m.catchlight}>
                <sphereGeometry args={[0.0042, 8, 8]} />
              </mesh>
              <mesh position={[-0.051, 0.2, 0.166]} material={m.catchlight}>
                <sphereGeometry args={[0.0042, 8, 8]} />
              </mesh>
              {/* Paupières animées */}
              <mesh ref={eyelidL} position={[0.056, 0.214, 0.144]} scale={[1, 0.2, 1]} material={m.skin}>
                <sphereGeometry args={[0.0265, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>
              <mesh ref={eyelidR} position={[-0.056, 0.214, 0.144]} scale={[1, 0.2, 1]} material={m.skin}>
                <sphereGeometry args={[0.0265, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>

              {/* Lunettes noires rectangulaires */}
              <group position={[0, 0.195, 0.168]}>
                <mesh position={[0.056, 0, 0]} material={m.glassesLens}>
                  <planeGeometry args={[0.072, 0.045]} />
                </mesh>
                <mesh position={[-0.056, 0, 0]} material={m.glassesLens}>
                  <planeGeometry args={[0.072, 0.045]} />
                </mesh>
                {/* Monture gauche */}
                <mesh position={[0.056, 0.024, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.082, 0.01, 0.012]} />
                </mesh>
                <mesh position={[0.056, -0.024, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.08, 0.008, 0.012]} />
                </mesh>
                <mesh position={[0.019, 0, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.009, 0.054, 0.012]} />
                </mesh>
                <mesh position={[0.095, 0, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.01, 0.054, 0.012]} />
                </mesh>
                {/* Monture droite */}
                <mesh position={[-0.056, 0.024, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.082, 0.01, 0.012]} />
                </mesh>
                <mesh position={[-0.056, -0.024, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.08, 0.008, 0.012]} />
                </mesh>
                <mesh position={[-0.019, 0, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.009, 0.054, 0.012]} />
                </mesh>
                <mesh position={[-0.095, 0, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.01, 0.054, 0.012]} />
                </mesh>
                {/* Pont nasal & branches */}
                <mesh position={[0, 0.012, 0.002]} material={m.glassesFrame}>
                  <boxGeometry args={[0.034, 0.009, 0.01]} />
                </mesh>
                <mesh position={[0.13, 0.005, -0.075]} material={m.glassesFrame}>
                  <boxGeometry args={[0.008, 0.009, 0.16]} />
                </mesh>
                <mesh position={[-0.13, 0.005, -0.075]} material={m.glassesFrame}>
                  <boxGeometry args={[0.008, 0.009, 0.16]} />
                </mesh>
              </group>

              {/* Sourcils expressifs */}
              <mesh ref={browL} position={[0.058, 0.258, 0.148]} material={m.hair}>
                <boxGeometry args={[0.064, 0.014, 0.014]} />
              </mesh>
              <mesh ref={browR} position={[-0.058, 0.258, 0.148]} material={m.hair}>
                <boxGeometry args={[0.064, 0.014, 0.014]} />
              </mesh>

              {/* Nez sculpté (arête + pointe + narines) */}
              <mesh position={[0, 0.168, 0.156]} rotation={[-0.25, 0, 0]} material={m.skin}>
                <capsuleGeometry args={[0.014, 0.028, 6, 10]} />
              </mesh>
              <mesh position={[0, 0.146, 0.165]} scale={[1.25, 0.85, 1]} material={m.skin}>
                <sphereGeometry args={[0.021, 12, 10]} />
              </mesh>

              {/* Bouche & sourire blanc */}
              <mesh ref={mouth} position={[0, 0.098, 0.152]} material={m.skinLip}>
                <torusGeometry args={[0.042, 0.0095, 8, 20, Math.PI]} />
              </mesh>
              <mesh ref={smileTeeth} position={[0, 0.09, 0.15]} material={m.teeth}>
                <boxGeometry args={[0.056, 0.016, 0.01]} />
              </mesh>
            </group>

            {/* Bras gauche (côté +X) : manche + montre + poignet chemise + main sculptée */}
            <group ref={lSh} position={[0.28, 0.55, 0]}>
              <mesh position={[0, -0.15, 0]} material={m.suit}>
                <capsuleGeometry args={[0.066, 0.2, 8, 14]} />
              </mesh>
              <group ref={lEl} position={[0, -0.31, 0]}>
                <mesh position={[0, -0.125, 0]} material={m.suit}>
                  <capsuleGeometry args={[0.056, 0.17, 8, 14]} />
                </mesh>
                <mesh position={[0, -0.245, 0]} material={m.shirt}>
                  <cylinderGeometry args={[0.044, 0.044, 0.032, 12]} />
                </mesh>
                {/* Montre argentée */}
                <mesh position={[0, -0.255, 0]} material={m.buckle}>
                  <cylinderGeometry args={[0.046, 0.046, 0.014, 14]} />
                </mesh>
                {/* Paume + pouce */}
                <mesh position={[0, -0.295, 0.006]} scale={[0.88, 1.15, 0.68]} material={m.skin}>
                  <sphereGeometry args={[0.05, 14, 12]} />
                </mesh>
                <mesh position={[-0.036, -0.285, 0.025]} rotation={[0.3, 0, 0.4]} material={m.skin}>
                  <capsuleGeometry args={[0.014, 0.026, 6, 8]} />
                </mesh>
              </group>
            </group>

            {/* Bras droit (côté -X) + téléphone */}
            <group ref={rSh} position={[-0.28, 0.55, 0]}>
              <mesh position={[0, -0.15, 0]} material={m.suit}>
                <capsuleGeometry args={[0.066, 0.2, 8, 14]} />
              </mesh>
              <group ref={rEl} position={[0, -0.31, 0]}>
                <mesh position={[0, -0.125, 0]} material={m.suit}>
                  <capsuleGeometry args={[0.056, 0.17, 8, 14]} />
                </mesh>
                <mesh position={[0, -0.245, 0]} material={m.shirt}>
                  <cylinderGeometry args={[0.044, 0.044, 0.032, 12]} />
                </mesh>
                {/* Paume + pouce */}
                <mesh position={[0, -0.295, 0.006]} scale={[0.88, 1.15, 0.68]} material={m.skin}>
                  <sphereGeometry args={[0.05, 14, 12]} />
                </mesh>
                <mesh position={[0.036, -0.285, 0.025]} rotation={[0.3, 0, -0.4]} material={m.skin}>
                  <capsuleGeometry args={[0.014, 0.026, 6, 8]} />
                </mesh>
                <group ref={phone} position={[0, -0.33, 0.045]}>
                  <mesh material={m.phone}>
                    <boxGeometry args={[0.09, 0.17, 0.014]} />
                  </mesh>
                  <mesh position={[0, 0, 0.0075]} material={m.screen}>
                    <planeGeometry args={[0.078, 0.152]} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>

          {/* Jambe gauche */}
          <group ref={lHip} position={[0.1, -0.02, 0]}>
            <mesh position={[0, -0.22, 0]} material={m.suitDark}>
              <capsuleGeometry args={[0.078, 0.3, 8, 14]} />
            </mesh>
            <group ref={lKnee} position={[0, -0.45, 0]}>
              <mesh position={[0, -0.205, 0]} material={m.suitDark}>
                <capsuleGeometry args={[0.068, 0.3, 8, 14]} />
              </mesh>
              <mesh position={[0, -0.445, 0.045]} material={m.shoe}>
                <boxGeometry args={[0.106, 0.062, 0.22]} />
              </mesh>
              <mesh position={[0, -0.45, 0.145]} scale={[1, 0.65, 1]} material={m.shoe}>
                <sphereGeometry args={[0.052, 12, 10]} />
              </mesh>
              <mesh position={[0, -0.482, 0.055]} material={m.sole}>
                <boxGeometry args={[0.11, 0.018, 0.25]} />
              </mesh>
            </group>
          </group>

          {/* Jambe droite */}
          <group ref={rHip} position={[-0.1, -0.02, 0]}>
            <mesh position={[0, -0.22, 0]} material={m.suitDark}>
              <capsuleGeometry args={[0.078, 0.3, 8, 14]} />
            </mesh>
            <group ref={rKnee} position={[0, -0.45, 0]}>
              <mesh position={[0, -0.205, 0]} material={m.suitDark}>
                <capsuleGeometry args={[0.068, 0.3, 8, 14]} />
              </mesh>
              <mesh position={[0, -0.445, 0.045]} material={m.shoe}>
                <boxGeometry args={[0.106, 0.062, 0.22]} />
              </mesh>
              <mesh position={[0, -0.45, 0.145]} scale={[1, 0.65, 1]} material={m.shoe}>
                <sphereGeometry args={[0.052, 12, 10]} />
              </mesh>
              <mesh position={[0, -0.482, 0.055]} material={m.sole}>
                <boxGeometry args={[0.11, 0.018, 0.25]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Canvas                                                                     */
/* -------------------------------------------------------------------------- */

export default function StoryScene({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1.35, 6.4], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0, 0.95, 0)}
    >
      <hemisphereLight args={['#e5f2ee', '#1b1714', 1.05]} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} />
      <directionalLight position={[-3, 2, 3]} intensity={0.7} color="#fff7ed" />
      <Character progress={progress} />
    </Canvas>
  );
}
