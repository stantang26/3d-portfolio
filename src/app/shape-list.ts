import { Shape } from "./shape";
export const ShapeList:Shape[] = [
    {
        name: 'subject',
        geometry: {
            type: 'box',
            params: [5,5,5]
        },
        texture: './assets/Subject.png',
        material: 'basic' ,
        position: {
            x:15,
            y:20,
            z:6
        },
        rotation:{
            x:0,
            y:Math.PI/2,
            z:0 
        },
        animation: {
            x:0.5,
            y:1,
            z:0
        }
    },
    {
        name: 'planet ring',
        geometry: {
            type: 'box',
            params: [13,10,10]
        },
        texture: './assets/vidshare.png',
        material: 'basic' ,
        position: {
            x:47.5,
            y:-20.5,
            z:44
        },
        rotation:{
            x:0,
            y:1.5,
            z:Math.PI/2
        },
        animation: {
            x:1.3,
            y:-0.93,
            z:2
        }
    },{
        name: 'planet',
        geometry: {
            type: 'box',
            params: [10,10,10]
        },
        texture: './assets/Unchained.png',
        material: 'basic' ,
        position: {
            x:61,
            y:-17,
            z:-30
        },
        rotation:{
            x:1,
            y:-1,
            z:1
        },
        animation: {
            x:1,
            y:-0.5,
            z:-1
        }
    },{
        name: 'colosseum',
        geometry: {
            type: 'box',
            params: [10,10,10]
        },
        texture: './assets/colosseum.png',
        material: 'basic' ,
        position: {
            x:105,
            y:-24,
            z:43
        },
        rotation:{
            x:2,
            y:-1,
            z:1
        },
        animation: {
            x:1.5,
            y:-0.53,
            z:1
        }
    }
];