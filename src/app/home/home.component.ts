import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
  renderer = new THREE.WebGLRenderer();
  

  constructor() { }

  ngOnInit(): void {
    let renderer = this.renderer;
    renderer.setSize( window.innerWidth, window.innerHeight );
    let scene = this.scene;
    let camera = this.camera;
    document.body.appendChild(this.renderer.domElement);
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );

    this.camera.position.z = 5;

    var animate = function () {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render( scene, camera );
    };

    animate();
  }

}
