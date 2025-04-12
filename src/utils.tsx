import { EntityWithId } from "./types/Entity";

export function getRelationCoordinates(fromEntity: EntityWithId, toEntity: EntityWithId | null | undefined, dragCoords: { x: number, y: number }) {
    const fromCenter = {x: fromEntity.positionX + fromEntity.baseStyle.width / 2, y: fromEntity.positionY + fromEntity.baseStyle.height / 2};

    const toCenter = 
        toEntity ? 
        {x: toEntity.positionX + toEntity.baseStyle.width / 2, y: toEntity.positionY + toEntity.baseStyle.height / 2} 
        :
        {x: dragCoords.x, y: dragCoords.y};

    if (!toEntity) {
        return {
            fromX: fromCenter.x,
            fromY: fromCenter.y,
            toX: dragCoords.x,
            toY: dragCoords.y,
        };
    }

    const direction = getDirection(fromCenter, toCenter);

    switch (direction) {
        case "north":
            return { fromX: fromCenter.x, fromY: fromCenter.y + fromEntity.baseStyle.height / 2, toX: toCenter.x, toY: toCenter.y - toEntity.baseStyle.height / 2 };
        case "south":
            return { fromX: fromCenter.x, fromY: fromCenter.y - fromEntity.baseStyle.height / 2, toX: toCenter.x, toY: toCenter.y + toEntity.baseStyle.height / 2 };
        case "east":
            return { fromX: fromCenter.x - fromEntity.baseStyle.width / 2, fromY: fromCenter.y, toX: toCenter.x + toEntity.baseStyle.width / 2, toY: toCenter.y };
        case "west":
            return { fromX: fromCenter.x + fromEntity.baseStyle.width / 2, fromY: fromCenter.y, toX: toCenter.x - toEntity.baseStyle.width / 2, toY: toCenter.y };
        case "northeast":
            return { fromX: fromCenter.x - fromEntity.baseStyle.width / 2, fromY: fromCenter.y + fromEntity.baseStyle.height / 2, toX: toCenter.x + toEntity.baseStyle.width / 2, toY: toCenter.y - toEntity.baseStyle.height / 2 };
        case "northwest":
            return { fromX: fromCenter.x + fromEntity.baseStyle.width / 2, fromY: fromCenter.y + fromEntity.baseStyle.height / 2, toX: toCenter.x - toEntity.baseStyle.width / 2, toY: toCenter.y - toEntity.baseStyle.height / 2 };
        case "southeast":
            return { fromX: fromCenter.x - fromEntity.baseStyle.width / 2, fromY: fromCenter.y - fromEntity.baseStyle.height / 2, toX: toCenter.x + toEntity.baseStyle.width / 2, toY: toCenter.y + toEntity.baseStyle.height / 2 };
        case "southwest":
            return { fromX: fromCenter.x + fromEntity.baseStyle.width / 2, fromY: fromCenter.y - fromEntity.baseStyle.height / 2, toX: toCenter.x - toEntity.baseStyle.width / 2, toY: toCenter.y + toEntity.baseStyle.height / 2 };
    }
    return { fromX: fromCenter.x, fromY: fromCenter.y, toX: toCenter.x, toY: toCenter.y };
}

function getDirection(from: { x: number; y: number }, to: { x: number; y: number }): string {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    if (angle >= -22.5 && angle < 22.5) return "west";
    if (angle >= 22.5 && angle < 67.5) return "northwest";
    if (angle >= 67.5 && angle < 112.5) return "north";
    if (angle >= 112.5 && angle < 157.5) return "northeast";
    if (angle >= 157.5 || angle < -157.5) return "east";
    if (angle >= -157.5 && angle < -112.5) return "southeast";
    if (angle >= -112.5 && angle < -67.5) return "south";
    if (angle >= -67.5 && angle < -22.5) return "southwest";

    return "unknown";
}