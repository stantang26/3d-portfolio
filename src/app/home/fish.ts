export class Fish {

    x:number;
    y:number;
    z:number;
    deltax:number;
    deltay:number;
    deltaz:number;
    speed: number;
    speedx: number = 0;
    speedy: number = 0;
    speedz: number = 0;
    leader: any;
    change = false;

    constructor(x:number,y:number,z:number,speed:number, leader ?:Fish){
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;
        this.leader = leader;
    }

    tick(){
        if(this.leader){
           
                this.deltax = this.leader.getX()- this.getX()
                this.deltay = this.leader.getY()- this.getY()
                this.deltaz = this.leader.getZ()- this.getZ()
                let m = this.deltax^2 + this.deltay^2 + this.deltaz^2;
            if(Math.abs(this.deltax) >1){
                this.speedx = this.leader.speedx 
            }
            if(Math.abs(this.deltay) >0.1){
                this.speedy = this.deltay  * this.speed;
            }
            
          
        }else{
            if(this.getX() >200){
                this.change = true;
                if(this.getZ()>70){
                    this.setZ(this.getZ() -30);
                }
            }
           if(this.change == false){
                this.speedx = this.speed;
                this.speedy = -this.speed*0.01;
                this.speedz = -this.speed*0.01;
            }else{
                this.speedx = -this.speed;
                this.speedy = this.speed*0.01;
                this.speedz = -this.speed*0.01;
            }
        }
        this.setX(this.getX()+this.speedx)
        this.setY(this.getY()+this.speedy)
        this.setZ(this.getZ()+this.speedz)
        
        
    }

    getX():number{return this.x}

    setX(x:number){this.x = x}

    getY():number{return this.y}

    setY(y:number){this.y = y}

    getZ():number{return this.z}

    setZ(z:number){this.z = z}

    getSpeed():number{return this.speed}

    setSpeed(speed:number){this.speed = speed}

}