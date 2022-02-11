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
    renderer.setSize( window.innerWidth, window.innerHeight );
    let scene = this.scene;
    let camera = this.camera;
    document.body.appendChild(this.renderer.domElement);

    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5,5,5)

    this.scene.add(pointLight);

    this.camera.position.z = 30;

    this.initGeo();
    this.initTextures();
    for( let key of Object.keys(this.textures)) {
      this.initBasicMat(key);
    }
    for(let key of Object.keys(this.geometries)){
      this.initMesh(key, key, 'MUG' )
    }
    

    const controls = new OrbitControls(camera,renderer.domElement);

    var animate = function () {
      requestAnimationFrame( animate );
      controls.update();
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
      let texture;
      switch(shape.geometry.type){
        case 'ring' :
          texture = new THREE.RingGeometry(shape.geometry.params[0],shape.geometry.params[1],shape.geometry.params[2]);
          break;
        case 'sphere' :
          texture = new THREE.SphereGeometry(shape.geometry.params[0]);
          break;
      }
    }
  }

}

