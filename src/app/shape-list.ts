import { Shape } from "./shape";
export const ShapeList:Shape[] = [
    {
        name: 'planet ring',
        geometry: {
            type: 'ring',
            params: [15,20,100]
        },
        texture: './assets/Mug_root_beer_logo.png',
        material: 'basic' ,
        position: {
            x:150,
            y:-50,
            z:-50
        },
        rotation:{
            x:5,
            y:0,
            z:0
        },
        animation: {
            x:0.01,
            y:0.01,
            z:0
        }
    },{
        name: 'planet',
        geometry: {
            type: 'sphere',
            params: [10]
        },
        texture: './assets/Mug_root_beer_logo.png',
        material: 'basic' ,
        position: {
            x:150,
            y:-50,
            z:-50
        },
        rotation:{
            x:5,
            y:0,
            z:0
        },
        animation: {
            x:0.01,
            y:0.01,
            z:0
        }
    }
];