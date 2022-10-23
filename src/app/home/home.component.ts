import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { ShapeList } from '../shape-list';
import { Flow } from "three/examples/jsm/modifiers/CurveModifier";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Fish } from './fish';
import transformSVGPath from './transformSVGPath';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('renderCanvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement>;
  scene = new THREE.Scene();
  flow:any;
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/ window.innerHeight,
    0.01,
    2000
  )
  renderer : any;
  shapeList = ShapeList;
  geometries:any = [];
  textures:any = [];
  materials:any = [];
  meshes:any = {};
  background:any = [];
  scroll:number = 0;

  @HostListener('window:scroll',['$event'])
  onScroll(){
    let scroll = document.body.getBoundingClientRect().top;
    let change = scroll-this.scroll
    this.camera.position.z += change*-0.001;
    this.camera.position.x -= change*0.1;
    this.camera.position.y += change*0.001;
    this.scroll = scroll;
    let color = Math.trunc(47 - 0.5*this.camera.position.x) + "," + Math.trunc(163 - this.camera.position.x) + "," + Math.trunc(176 - this.camera.position.x) 
    console.log(color)
    this.scene.fog = new THREE.Fog(new THREE.Color("rgb(" + color + ")"), -1,20)
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
    camera.up.set(-1,0,0);
    document.body.appendChild(this.renderer.domElement);
    this.buildShapes();
    console.log(this.meshes)

    let light = new THREE.DirectionalLight( 0xffffff, 2.5 )
    let lh = new THREE.DirectionalLightHelper(light)
    light.position.set(-5,0,0)
    scene.add(light.target)
    light.target.position.set(1,0,10)
    scene.add(light);
    scene.add(lh)
    scene.fog = new THREE.Fog(0x2A9EAB, -1,20)
    camera.position.set(-1, 12, 0);
    camera.lookAt(1, 0, 0);
    scene.add(camera);

    this.initGeo();
    this.initTextures();

    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );
    
    const waterTexture = new THREE.TextureLoader().load('./assets/underwater.jpg')
    scene.background =  waterTexture

    var animate =  () => {
      requestAnimationFrame( animate );
      this.flow.moveAlongCurve(0.001);
      this.tick();
      renderer.render( scene, camera );
      
    };
    let shark
    const loader = new GLTFLoader()
    loader.load("./assets/shark1.glb", (gltf) => {
      shark= gltf.scene
      console.log(shark)
      const svg = document.getElementById("circle");
      console.log(svg?.getAttribute('viewBox'))
      const points = this.getSVGPoints(svg,0.3,100)
      const fpoints = this.getFishPointsFromPoints(points);
      this.showLine(fpoints,scene)

      let curve = new THREE.CatmullRomCurve3(fpoints, true);
      this.followPoints(curve,shark)
      console.log(shark )
    },function(xhr){
      console.log(xhr.loaded/xhr.total)

    })
    animate()
    
   this.startLoop(camera,scene,renderer);
  }

  getFishPointsFromPoints(points:any){
    const fishPoints = [];
    let pointCount = 100, frequency = 14, amplitude = 0.10;
    console.log(frequency, amplitude);
    const curve = new THREE.CatmullRomCurve3(points);
    for (let i = 0; i < pointCount; i++) {
      const t = i / pointCount;
      const angle = (i / (pointCount / frequency)) % 1;
      const displacement = Math.sin(Math.PI * 2 * angle) * amplitude;
      let point = curve.getPoint(t);
      const tangeant = curve.getTangent(t);
      const normal = tangeant.clone().cross(new THREE.Vector3(0,1, 0));
  
      point = point.add(normal.multiplyScalar(displacement));
      fishPoints.push(point);
    }
    return fishPoints;
  };

  followPoints( curve: any, shark: any){
  this.flow = new Flow(shark);
	this.flow.updateCurve(0, curve);
	this.scene.add(this.flow.object3D);
  }

  showLine(points:any, scene:any) {
    const line = new THREE.LineLoop(
			new THREE.BufferGeometry().setFromPoints(points),
			new THREE.LineBasicMaterial({ color: 0xffff })
		);
		line.geometry.center();

		scene.add(line);
    console.log(line)
  }

  getSVGPoints(svg : any, scale: number, pcount:number ) {
    const viewBox = svg?.getAttribute('viewBox').split(' ')
    const width = parseFloat(viewBox[2])
    const height = parseFloat(viewBox[3])
    const path = svg?.querySelector('path').getAttribute('d')

    const shape =  transformSVGPath(path);
    const points = shape.getPoints(pcount).map((point:any) => {
      let v = new THREE.Vector3(point.x - width/2, 0, point.y - height/2)
      v = v.multiplyScalar(scale)
      return v
    })

    return points
    

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
    for(let obj of this.background){
      obj.data.translateX(obj.speedx)
      obj.data.translateY(obj.speedy)
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
    const count = THREE.MathUtils.randInt(50,70);
    for(let i = 0; i < count; i++){
      const speedy = THREE.MathUtils.randFloat(-0.1,0.1);
      const speedx = THREE.MathUtils.randFloat(0.1,0);
      const geometry = new THREE.SphereGeometry(0.25,24,24);
      const material = new THREE.MeshBasicMaterial({color:0xffffff});
      const obj = new THREE.Mesh(geometry, material);
      let x = THREE.MathUtils.randFloat(-100,50);
      let y = THREE.MathUtils.randFloat(-50,0);
      let z = THREE.MathUtils.randFloatSpread(200);
      obj.position.set(x,y,z);
      this.scene.add(obj)
      let object = {
        data: obj,
        speedx: speedx,
        speedy: speedy,
        x:x,
        y:y
      }
      this.background.push(object);
    }
    
  }



  moveCamera(){

  }
}

