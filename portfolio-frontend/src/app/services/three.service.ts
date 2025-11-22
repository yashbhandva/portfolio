import { Injectable, signal } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId!: number;
  
  isInitialized = signal(false);
  animationRunning = signal(false);

  init(container: HTMLElement): void {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer(container);
    this.setupLighting();
    this.createObjects();
    this.startAnimation();

    this.isInitialized.set(true);
    this.animationRunning.set(true);
  }

  private setupScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x667eea);
    this.scene.fog = new THREE.Fog(0x667eea, 10, 50);
  }

  private setupCamera(): void {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 15);
  }

  private setupRenderer(container: HTMLElement): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    this.scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x4f46e5, 0.5, 100);
    pointLight1.position.set(10, 10, 10);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 0.5, 100);
    pointLight2.position.set(-10, -10, -10);
    this.scene.add(pointLight2);
  }

  private createObjects(): void {
    this.createFloatingShapes();
    this.createParticleSystem();
  }

  private createFloatingShapes(): void {
    const geometries = [
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.ConeGeometry(1.5, 3, 32),
      new THREE.TorusGeometry(2, 0.5, 16, 100)
    ];

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.3, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.3, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.3, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.3, roughness: 0.4 })
    ];

    geometries.forEach((geometry, index) => {
      const material = materials[index % materials.length];
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20
      );
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      (mesh as any).userData = {
        originalY: mesh.position.y,
        speed: 0.5 + Math.random() * 1,
        rotationSpeed: new THREE.Vector3(
          Math.random() * 0.02,
          Math.random() * 0.02,
          Math.random() * 0.02
        )
      };
      
      this.scene.add(mesh);
    });
  }

  private createParticleSystem(): void {
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
  }

  private startAnimation(): void {
    const animate = () => {
      if (this.animationRunning()) {
        this.animationId = requestAnimationFrame(animate);
        this.animateObjects();
        this.renderer.render(this.scene, this.camera);
      }
    };
    animate();
  }

  private animateObjects(): void {
    this.scene.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.userData['originalY'] !== undefined) {
        child.position.y = child.userData['originalY'] + Math.sin(Date.now() * 0.001 * child.userData['speed']) * 0.5;
        child.rotation.x += child.userData['rotationSpeed'].x;
        child.rotation.y += child.userData['rotationSpeed'].y;
        child.rotation.z += child.userData['rotationSpeed'].z;
      }
    });
  }

  private onWindowResize(container: HTMLElement): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  toggleAnimation(): void {
    this.animationRunning.set(!this.animationRunning());
    if (this.animationRunning()) {
      this.startAnimation();
    }
  }

  dispose(): void {
    this.animationRunning.set(false);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    this.scene?.clear();
    this.isInitialized.set(false);
  }
}