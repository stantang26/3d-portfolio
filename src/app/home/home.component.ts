import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { ShapeList } from '../shape-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('renderCanvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement>;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
  renderer : any;
  shapeList = ShapeList;
  geometries:any = [];
  textures:any = [];
  materials:any = [];
  meshes:any = {};
  background:any = {};

  @HostListener('window:scroll',['$event'])
  onScroll(){
    let t = document.body.getBoundingClientRect().top;
    console.log(t)
    this.camera.position.x = t*-0.0001;
    this.camera.position.y = t*-0.0001;
    this.camera.position.z = t*-0.01;
  }

  constructor() { }

  ngOnInit(): void {
    let canvas = this.canvas.nativeElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha:true
    });
    let renderer = this.renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.outerWidth, window.innerHeight );
    let scene = this.scene;
    let camera = this.camera;
    document.body.appendChild(this.renderer.domElement);
    this.buildShapes();
    console.log(this.meshes)

    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0,0,0)

    let lightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(lightHelper)

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
   this.startLoop(camera,scene,renderer);
  }

  startLoop(camera : any, scene : any, renderer : any): void {
    renderer.setAnimationLoop(()=>{
      this.tick();
      renderer.render(scene,camera);
    })
  }

  stopLoop(renderer : any): void {
    renderer.setAnimationLoop(null);
  }

  tick(): void{
    for(let shape of this.shapeList){
      if(this.meshes[shape.name]){
        this.meshes[shape.name].translateX(shape.animation.x);
        this.meshes[shape.name].translateY(shape.animation.y);
        this.meshes[shape.name].translateZ(shape.animation.z);
      }
    }
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
    this.buildBackground()
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
      let material = new THREE.MeshBasicMaterial( { map:texture} );
      let mesh = new THREE.Mesh( geo, material );
      this.scene.add(mesh);
      mesh.position.set(shape.position.x, shape.position.y , shape.position.z) ;
      mesh.rotateX(shape.rotation.x);
      mesh.rotateY(shape.rotation.y);
      mesh.rotateZ(shape.rotation.z);
      this.meshes[shape.name] = mesh;
    }
  }

  buildBackground(){
    const count = THREE.MathUtils.randInt(50,100);
    const speed = THREE.MathUtils.randInt(50,100);
    const direction = THREE.MathUtils.randInt(1,3);
    for(let i = 0; i < count; i++){
      const geometry = new THREE.SphereGeometry(0.25,24,24);
      const material = new THREE.MeshBasicMaterial({color:0xffffff});
      const obj = new THREE.Mesh(geometry, material);
      let x = THREE.MathUtils.randFloatSpread(100);
      let y = THREE.MathUtils.randFloatSpread(100);
      let z = THREE.MathUtils.randFloatSpread(100);
      obj.position.set(x,y,z);
      this.scene.add(obj)
    }
    
  }

  moveCamera(){

  }
}

