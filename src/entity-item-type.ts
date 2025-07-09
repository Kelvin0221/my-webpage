export const EntityItemType = {
    PLAYERENTITY: "X",
    KEY: "k",
    NOTE: "n",
    PORTAL: "p",
    TRAP: "t",
}
export type EntityItemType = typeof EntityItemType[keyof typeof EntityItemType];