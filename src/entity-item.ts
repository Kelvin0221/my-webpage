import { EntityItemType } from "./entity-item-type"
import { MapEntities } from "./entity-map-type";

export class EntityItem{
    itemType: EntityItemType;
    mapPosX: number;
    mapPosY: number;
    description: String;
    //Key only use
    targetPosX: number = -1;
    targetPosY: number = -1;

    //Trap
    targetEntityType: MapEntities = MapEntities.PATH;

    constructor(itemType: EntityItemType, mapPosX: number, mapPosY: number, description: String, targetPosX?: number, targetPosY?: number, targetEntityType?: MapEntities){
        this.itemType=itemType;
        this.mapPosX=mapPosX;
        this.mapPosY=mapPosY;
        this.description=description;

        if(itemType === EntityItemType.KEY){
            if( targetPosX !== undefined && targetPosY !== undefined){
                this.targetPosX=targetPosX;
                this.targetPosY=targetPosY; 
            }
            else{
                throw new Error("Key without door to unlock is not allowed");
            }
        }

        if(itemType === EntityItemType.TRAP){
            if(targetEntityType !== undefined && targetPosX !== undefined && targetPosY !== undefined){
                this.targetEntityType = targetEntityType;
                this.targetPosX=targetPosX;
                this.targetPosY=targetPosY; 
            }else{
                throw new Error("Trap requires triggers");
            }
        }
    }

    inspectItem(): String{
        return this.description
    }
}