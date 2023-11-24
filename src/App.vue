<script setup>
import * as THREE from 'three';
import { getPathRadius } from "./utils";
import { onMounted } from "vue"


onMounted(
  async () => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    // 光源
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);


    // 创建一个球体表示字符路径
    const sphereRadius = 3; // 球体半径

    const spherePoints = await getPathRadius("A", sphereRadius);
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 10000; // 粒子总数量

    const posArray = new Float32Array(particlesCnt * 3);
    for (let i = 0; i < particlesCnt * 3; i += 3) {
      const spherePointIndex = i % spherePoints.length; // 使用取余操作
      const { x, y, z } = spherePoints[spherePointIndex]; // 解构

      if (Math.random() < 0.1) {
        let theta = Math.random() * 2 * Math.PI;
        let phi = Math.acos((Math.random() * 2) - 1);
        posArray[i] = sphereRadius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = sphereRadius * Math.cos(phi);
        console.log("posArray", posArray[i])
      } else {
        posArray[i] = x;
        posArray[i + 1] = y;
        posArray[i + 2] = z;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ff00,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const ParticleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(ParticleMesh);


    // 点在表面起伏

    const velocities = [];

    for (let i = 0; i < posArray; i += 3) {
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1, // X轴速度
        (Math.random() - 0.5) * 0.1, // Y轴速度
        (Math.random() - 0.5) * 0.1  // Z轴速度
      );
      velocities.push(velocity);
    }


    // 动画
    function animate() {
      requestAnimationFrame(animate);

      const positions = particlesGeometry.attributes.position.array;

      for (let i = 0; i < posArray; i++) {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        // 将粒子位置重新约束到球面上
        const vec = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        vec.normalize().multiplyScalar(1.5); // 1.5是球体半径

        positions[i * 3] = vec.x;
        positions[i * 3 + 1] = vec.y;
        positions[i * 3 + 2] = vec.z;
      }

      particlesGeometry.attributes.position.needsUpdate = true;

      ParticleMesh.rotation.y -= 0.01;

      renderer.render(scene, camera);
    }

    animate();

    camera.position.z = 5;


  }
)


</script>

<template>
  <div></div>
</template>

