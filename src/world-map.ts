import { MainEntity } from "./main-entity";
import {EntityItem} from "./entity-item";
import { EntityItemType } from "./entity-item-type";
import { MapEntities } from "./entity-map-type";

export class WorldMap extends MainEntity {
    mapWidth: number;
    mapHeight: number;

    observerWidth: number=0;
    observerHeight: number=0;

    map: Array<Array<string>>;
    mapItems: Array<EntityItem> = [];

    mapDialogue: String = "";
    mapMessage: String = "";

    constructor(iPosX: number, iPosY: number, mW: number, mH: number){
        super(iPosX, iPosY);
        this.mapWidth=mW;
        this.mapHeight=mH;

        this.map = new Array(mH);
        for (let i = 0; i < mH; i++) {
            this.map[i] = new Array(mW);
            this.map[i].fill("0");
        }
    }

    setObserverSize(oW:number, oH:number): void{
        (oW>=this.mapWidth)? this.observerWidth=this.mapWidth: this.observerWidth=oW;

        (oH>=this.mapWidth)? this.observerHeight=this.mapHeight: this.observerHeight=oH;
    }

    getObserverSize(): [number, number]{
        return [this.observerWidth, this.observerHeight];
    }

    getObserverView(){
        //center view
        var top: number, bottom: number, left: number, right: number;
        var viewPoint: string[][] = Array(this.observerHeight).fill(MapEntities.VOID).map(() => Array(this.observerWidth).fill(MapEntities.VOID));

        if(this.observerHeight %2 > 0){
            top = (this.observerHeight-1)/2;
            bottom = (this.observerHeight-1)/2;
        }else{
            top = Math.floor((this.observerHeight-1)/2);
            bottom = Math.ceil((this.observerHeight-1)/2);
        }

        if(this.observerWidth%2 > 0){
            left = (this.observerWidth-1)/2;
            right = (this.observerWidth-1)/2;
        }else{
            left = Math.floor((this.observerWidth-1)/2);
            right = Math.ceil((this.observerWidth-1)/2);
        }

        let viewHeight = 0;
        for(let h = this.currPosY - top; h < 1 + this.currPosY + bottom; h++){
            let viewWidth = 0;
            for(let w = this.currPosX - left; w < 1 + this.currPosX + right; w++){
                //Within map
                if(h >= 0 && h < this.mapHeight && w >= 0 && w < this.mapWidth){
                    viewPoint[viewHeight][viewWidth] = this.map[h][w];
                    if(h === this.currPosY){
                        this.mappedPosY = viewHeight;
                    }

                    if(w === this.currPosX){
                        this.mappedPosX = viewWidth;
                    }
                }
                viewWidth+=1;
            }
            viewHeight+=1;
        }

        return viewPoint;
    }

    addItem(item: EntityItem): void{
        if(item.itemType === EntityItemType.KEY){
            //Force spawn door
            this.map[item.targetPosY][item.targetPosX] = MapEntities.DOOR;
        }
        this.map[item.mapPosY][item.mapPosX] = item.itemType;
        this.mapItems.push(item);
    }

    removeItem(item: EntityItem): void{
        this.mapItems.splice(this.mapItems.indexOf(item),1);
    }

    getMapSize(): [number, number]{
        return [this.mapWidth, this.mapHeight];
    }

    moveUp(){
        (this.currPosY-1 >= 0 && !this.pathBlocked(this.currPosX,this.currPosY-1))?super.moveUp(): this.currPosY = this.currPosY;
        this.interactItem();
    }

    moveDown(){
        (this.currPosY+1 < this.mapHeight && !this.pathBlocked(this.currPosX,this.currPosY+1))?super.moveDown(): this.currPosY = this.currPosY;
        this.interactItem();
    }

    moveLeft(){
        (this.currPosX-1 >= 0 && !this.pathBlocked(this.currPosX-1,this.currPosY))?super.moveLeft(): this.currPosX = this.currPosX;
        this.interactItem();
    }

    moveRight(){
        (this.currPosX+1 < this.mapWidth && !this.pathBlocked(this.currPosX+1,this.currPosY))?super.moveRight(): this.currPosX = this.currPosX;
        this.interactItem();
    }

    pathBlocked(nextPositionX: number, nextPositionY: number): boolean{
        this.mapMessage="";

        if(this.map[nextPositionY][nextPositionX] === MapEntities.DOOR){

            if(this.inventory.find(k => 
                k.itemType===EntityItemType.KEY 
                && k.targetPosX === nextPositionX 
                && k.targetPosY === nextPositionY) !== undefined
            ){
                this.mapMessage="Door unlocked";
                this.map[nextPositionY][nextPositionX] = MapEntities.PATH;
                return false;
            }
            else{
                this.mapMessage="Door is locked";
                return true;
            }

        }

        return (this.map[nextPositionY][nextPositionX] === MapEntities.WALL || 
            this.map[nextPositionY][nextPositionX] === MapEntities.DOOR
        );
    }

    interactItem(){
        this.mapDialogue = "";
        if(this.map[this.currPosY][this.currPosX] !== MapEntities.PATH){
            var item = this.mapItems.find(i => i.mapPosX===this.currPosX && i.mapPosY===this.currPosY);

            if(item === undefined) return;

            switch (this.map[this.currPosY][this.currPosX]){
                case EntityItemType.KEY:
                    this.inventory.push(item);
                    //Item picked up
                    this.map[this.currPosY][this.currPosX] = MapEntities.PATH;
                    break;
                case EntityItemType.NOTE:
                    //Trigger dialogue
                    this.mapDialogue= item.inspectItem();
                    break;
                case EntityItemType.TRAP:
                    this.map[item.targetPosY][item.targetPosX] = item.targetEntityType;
                    this.map[this.currPosY][this.currPosX] = MapEntities.PATH;
                    break;
                case EntityItemType.PORTAL:
                    break;
            }
        }

    }

}