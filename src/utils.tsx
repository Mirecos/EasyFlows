import { EntityWithId } from "./types/Entity";

export function getRelativePosition(entity1: EntityWithId, entity2: {x: number, y: number}): string {
    const center1 = {
        x: entity1.positionX + entity1.baseStyle.width / 2,
        y: entity1.positionY + entity1.baseStyle.height / 2,
    };

    const center2 = {
        x: entity2.x,
        y: entity2.y,
    };

    const deltaX = center2.x - center1.x;
    const deltaY = center2.y - center1.y;

    if (deltaX === 0 && deltaY < 0) {
        return 'north';
    } else if (deltaX === 0 && deltaY > 0) {
        return 'south';
    } else if (deltaY === 0 && deltaX > 0) {
        return 'east';
    } else if (deltaY === 0 && deltaX < 0) {
        return 'west';
    } else if (deltaX < 0 && deltaY < 0) {
        return 'northwest';
    } else if (deltaX > 0 && deltaY < 0) {
        return 'northeast';
    } else if (deltaX < 0 && deltaY > 0) {
        return 'southwest';
    } else if (deltaX > 0 && deltaY > 0) {
        return 'southeast';
    } else {
        return 'unknown'; // If the entities are perfectly aligned or overlapping
    }
}


export function getArrowCoordinatesFromPosition(entity1: EntityWithId, entity2: EntityWithId | {x: number, y: number}, direction: string) {
    switch(direction){
        case 'north':
            return {
                x1: entity1.positionX + entity1.baseStyle.width / 2,
                y1: entity1.positionY,
                x2: entity2.positionX + entity2.baseStyle.width / 2,
                y2: entity2.positionY - 20
            }
        case 'south':
            return {
                x1: entity1.positionX + entity1.baseStyle.width / 2,
                y1: entity1.positionY + entity1.baseStyle.height,
                x2: entity2.positionX + entity2.baseStyle.width / 2,
                y2: entity2.positionY + entity2.baseStyle.height + 20
            }
        case 'east':
            return {
                x1: entity1.positionX + entity1.baseStyle.width,
                y1: entity1.positionY + entity1.baseStyle.height / 2,
                x2: entity2.positionX + entity2.baseStyle.width + 20,
                y2: entity2.positionY + entity2.baseStyle.height / 2
            }
        case 'west':
            return {
                x1: entity1.positionX,
                y1: entity1.positionY + entity1.baseStyle.height / 2,
                x2: entity2.positionX - 20,
                y2: entity2.positionY + entity2.baseStyle.height / 2
            }
        case 'northeast':
            return {
                x1: entity1.positionX + entity1.baseStyle.width,
                y1: entity1.positionY,
                x2: entity2.positionX + entity2.baseStyle.width + 20,
                y2: entity2.positionY - 20
            }
        case 'northwest':
            return {
                x1: entity1.positionX,
                y1: entity1.positionY,
                x2: entity2.positionX - 20,
                y2: entity2.positionY - 20
            }
        case 'southeast':
            return {
                x1: entity1.positionX + entity1.baseStyle.width,
                y1: entity1.positionY + entity1.baseStyle.height,
                x2: entity2.positionX + entity2.baseStyle.width + 20,
                y2: entity2.positionY + entity2.baseStyle.height + 20
            }
        case 'southwest':
            return {
                x1: entity1.positionX,
                y1: entity1.positionY + entity1.baseStyle.height,
                x2: entity2.positionX - 20,
                y2: entity2.positionY + entity2.baseStyle.height + 20
            }
        default:
            return {
                x1: entity1.positionX + entity1.baseStyle.width / 2,
                y1: entity1.positionY + entity1.baseStyle.height / 2,
                x2: entity2.positionX + entity2.baseStyle.width / 2,
                y2: entity2.positionY + entity2.baseStyle.height / 2
            }
    }
}