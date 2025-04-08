import { DragMode } from "./DragMode"

export interface Relation {
    id: number // Unique identifier for the relation
    name: string
    type: 'arrow' // Type of the entity (e.g. 'arrow')
    from: number // Id of the entity that is the source of the relation
    to: number // Id of the entity that is the target of the relation
}