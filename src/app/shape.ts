export interface Shape {
    name: string,
    geometry: {
        type:any,
        params: number []
    },
    texture: any,
    material : any,
    position : {
        x:0,
        y:0,
        z:0,
    },
    animation: {
        x:0,
        y:0,
        z:0
    }
}