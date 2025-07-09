export const MapEntities = {
    VOID: "V",
    WALL: "W",
    PATH: "O", 
    DOOR: "D",
}
export type MapEntities = typeof MapEntities[keyof typeof MapEntities];