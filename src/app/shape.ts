export interface Shape {
    name: string,
    geometry: {
        type:any,
        params: number []
    },
    texture: any,
    material : any,
    position : {
        x:number,
        y:number,
        z:number,
    },
    rotation : {
        x:number,
        y:number,
        z:number,
    },
    animation: {
        x:number,
        y:number,
        z:number
    }
}