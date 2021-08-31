// Imports
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Configuracion basica
let size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

// Paleta de colores
const palette = {
  bgColor: '#000000', // CSS String
  planeColor: '#F5F5DC' ,
  cubeColor: '#00FFFF',
  sphereColor: '#7FFF00',
};

let plane = undefined;
const objects = {};
const lights = {
  sp: undefined,
};

let spotLight;

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

export function main(optionSize) {
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
}
  size = optionSize;

  // Configuracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(palette.bgColor, 1);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 15;
  camera.position.y = 15;

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // GUI
  //loadGUI();

  // Light
  setupLights();



//Dibujar el plano (:D)


  const geometry = new THREE.PlaneGeometry(size, size, size, size);
  const planematerial = new THREE.MeshBasicMaterial({
    color: palette.planeColor,
    side: THREE.DoubleSide,
    castShadow : true,
    wireframe: false,
  });
  plane = new THREE.Mesh(geometry, planematerial);
  objects.plano = plane;
  scene.add(plane);
  plane.rotation.x = Math.PI / 2;



          //Dibujar la figura (CUBO)
          const geometry2 = new THREE.BoxGeometry(2, 2, 2);
          const cubematerial = new THREE.MeshPhongMaterial({
            color : palette.cubeColor, 
            opacity: 0.5,
            wireframe: false,
            visible : false,
          });
          const cube = new THREE.Mesh(geometry2, cubematerial);
          objects.cubo = cube;
          cube.castShadow = true;
          cube.position.z = 0;
          cube.position.y = 3;
          scene.add(cube);
          camera.lookAt(cube.position); 

            // Dibujar la figura (ESFERA)
                const geometry3 = new THREE.SphereGeometry();
                const material3 = new THREE.MeshPhongMaterial({
                  color : palette.sphereColor, 
                  wireframe : false, 
                  visible : false,
                });
                const sphere = new THREE.Mesh( geometry3, material3 );
                objects.esfera = sphere;
                sphere.castShadow = true;
                sphere.position.z = 0;
                sphere.position.y = 3;
                scene.add(sphere);
                camera.lookAt(sphere.position); 

                
   // Menu GUI

    const gui = new dat.GUI();
    const formas = gui.addFolder('Formas');
    formas.add(cube.material, 'visible');
    formas.add(sphere.material, 'visible');
    const guu = gui.addFolder('Colores');
    guu.addColor(palette, 'planeColor');
    guu.addColor(palette, 'cubeColor');
    guu.addColor(palette, 'sphereColor');
    const guuu = gui.addFolder('Rotacion del cubo');
    guuu.add(cube.rotation, "x", 0, Math.PI * 2)
    guuu.add(cube.rotation, "y", 0, Math.PI * 2)
    guuu.add(cube.rotation, "z", 0, Math.PI * 2)
    const tras = gui.addFolder('Posicion del cubo');
    tras.add(cube.position, 'x', -6, Math.PI * 2)
    tras.add(cube.position, 'y', 1, Math.PI * 2)
    tras.add(cube.position, 'z', -6, Math.PI * 2)
    var box = gui.addFolder('Escalado del cubo');
    box.add(cube.scale, 'x', 0, 3).name('Width')
    box.add(cube.scale, 'y', 0, 3).name('Height')
    box.add(cube.scale, 'z', 0, 3).name('Length')
    const prop = gui.addFolder('Propiedades del Cubo');
    prop.add(cube.material, 'transparent');
    prop.add(cube.material, 'opacity', 0, 1);
    prop.add(cube.material, 'wireframe')
    //-------------------------------------------------------------//
    const guuu2 = gui.addFolder('Rotacion de la esfera');
    guuu2.add(sphere.rotation, "x", 0, Math.PI * 2)
    guuu2.add(sphere.rotation, "y", 0, Math.PI * 2)
    guuu2.add(sphere.rotation, "z", 0, Math.PI * 2)
    const tras2 = gui.addFolder('Posicion de la esfera');
    tras2.add(sphere.position, 'x', -6, Math.PI * 2)
    tras2.add(sphere.position, 'y', 1, Math.PI * 2)
    tras2.add(sphere.position, 'z', -6, Math.PI * 2)
    var box2 = gui.addFolder('Escalado de la esfera');
    box2.add(sphere.scale, 'x', 0, 3).name('Radius');
    box2.add(sphere.scale, 'y', 0, 3).name('Width');
    box2.add(sphere.scale, 'z', 0, 3).name('Height');
    const prop2 = gui.addFolder('Propiedades de la esfera');
    prop2.add(sphere.material, 'transparent');
    prop2.add(sphere.material, 'opacity', 0, 1);
    prop2.add(sphere.material, 'wireframe');
    var velocity = gui.addFolder('Velocidad de los objetos');
    velocity.add(options, 'velx', -0.2, 0.2).name('X');
    velocity.add(options, 'vely', -0.2, 0.2).name('Y');


  

   

  
  // Render
  render();
}



// Opciones
var options = {
  velx: 0.02,
  vely: 0.02,
  camera: {
    speed: 0.0001
  },
  
};


function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 10, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = true;
  scene.add(spotLight);
}

function render() {
  requestAnimationFrame(render);
  updateElements();
  renderer.render(scene, camera);
  objects.cubo.rotation.x += options.velx;
  objects.cubo.rotation.y += options.vely;
  objects.esfera.rotation.x += options.velx;
  objects.esfera.rotation.y += options.vely;
}



function updateElements() {
  objects.plano.material.color = new THREE.Color(palette.planeColor);
  objects.cubo.material.color = new THREE.Color(palette.cubeColor);
  objects.esfera.material.color = new THREE.Color(palette.sphereColor);
}