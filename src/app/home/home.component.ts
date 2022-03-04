import { Component, OnInit } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { ShapeList } from '../shape-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
  renderer = new THREE.WebGLRenderer();
  shapeList = ShapeList;
  geometries:any = [];
  textures:any = [];
  materials:any = [];
  meshes:any = [];


  constructor() { }

  ngOnInit(): void {
    let renderer = this.renderer;
    renderer.setSize( window.outerWidth, window.innerHeight );
    let scene = this.scene;
    let camera = this.camera;
    document.body.appendChild(this.renderer.domElement);
    this.buildShapes();

    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(100,50,50)

    this.scene.add(pointLight);

    this.camera.position.z = 30;

    this.initGeo();
    this.initTextures();
    
    const waterTexture = new THREE.TextureLoader().load('./assets/underwater.jpg')
    scene.background = waterTexture;

    var animate = function () {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    };

    animate();
  }

  initGeo(): void {
    this.geometries['planet-ring'] = new THREE.RingGeometry( 15, 20,100 );
    this.geometries['planet'] = new THREE.SphereGeometry( 10 );
  }

  initTextures(): void {
    this.textures['MUG'] = new THREE.TextureLoader().load('./assets/Mug_root_beer_logo.png');
  }

  initBasicMat(texture : string):void {
    this.materials[texture] =  new THREE.MeshBasicMaterial( { map:this.textures[texture]} );
  }

  initMesh(name:string, geometry:string, material:string){
    this.meshes[name] = new THREE.Mesh( this.geometries[geometry], this.materials[material]);

  }

  buildShapes(){
    for(let shape of this.shapeList){
      let geo;
      switch(shape.geometry.type){
        case 'ring' :
          geo = new THREE.RingGeometry(shape.geometry.params[0],shape.geometry.params[1],shape.geometry.params[2]);
          break;
        case 'sphere' :
          geo = new THREE.SphereGeometry(shape.geometry.params[0]);
          break;
      }
      let texture =  new THREE.TextureLoader().load(shape.texture);
      let material = new THREE.MeshBasicMaterial( { map:texture, wireframe: true} );
      let mesh = new THREE.Mesh( geo, material );
      this.scene.add(mesh);
      mesh.position.set(shape.position.x, shape.position.y , shape.position.z) ;
      mesh.rotateX(shape.rotation.x);
      mesh.rotateY(shape.rotation.y);
      mesh.rotateZ(shape.rotation.z);
    }
  }

  buildBackground(){

  }
}

