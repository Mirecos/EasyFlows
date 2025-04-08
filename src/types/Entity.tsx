import { baseStyle } from "./BaseStyle"

export interface Entity {
    name: string
    positionX: number,
    positionY: number,
    type: string
    baseStyle: baseStyle
}

export interface EntityWithId extends Entity {
    id: number
}