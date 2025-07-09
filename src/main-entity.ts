import type { EntityItem } from "./entity-item";

export const EntityMovement = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
    IDLE: "idle"
}
type EntityMovement = typeof EntityMovement[keyof typeof EntityMovement];

export class MainEntity{
    initialPosX: number;
    initialPosY: number;

    currPosX: number = 0;
    currPosY: number = 0;

    mappedPosX: number = 0;
    mappedPosY: number = 0;

    inventory: EntityItem[] = [];

    constructor(iPosX: number, iPosY: number){
        this.initialPosX = iPosX;
        this.initialPosY = iPosY;

        this.currPosX=iPosX;
        this.currPosY=iPosY;
    }

    moveUp(){
        this.currPosY -= 1;
    }

    moveDown(){
        this.currPosY += 1;
    }

    moveLeft(){
        this.currPosX -= 1;
    }

     moveRight(){
        this.currPosX += 1;
    }

    getCurrentPosition(): [number, number]{
        return [this.currPosX, this.currPosY];
    }

    setCurrPosition(posX: number, posY: number){
        this.currPosX = posX;
        this.currPosY = posY;
    }

    setReturnInitialPosition(){
        this.currPosX = this.initialPosX;
        this.currPosY = this.initialPosY;
    }
}