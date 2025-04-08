import { useState } from 'react'
import { Entity } from '../types/Entity'

interface SidebarProps {
    dragStart: (e: any, data: Entity) => void
}

const entities = [
    {
        name: 'Box',
        type: 'box',
        baseStyle: {
            width: 50,
            height: 50,
            borderRadius: 0,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#000000',
            color: '#000000',
        },
    },
    {
        name: 'Circle',
        type: 'circle',
        baseStyle: {
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#000000',
            color: '#000000',
        },
    },
] as Entity[]

function Sidebar(props: SidebarProps) {

    return (
        <div className='bg-gray-800 flex flex-col gap-4 p-4 '>
            <h1 className='text-white font-bold text-2xl'>Entities</h1>
            {
                entities.map((entity, index) => (
                    <div key={index} className='w-20 h-20 rounded-lg bg-gray-700 flex items-center justify-center'>
                        <div 
                            draggable
                            onDragStart={(e: React.DragEvent<HTMLElement>) => props.dragStart(e, entity)}
                            style={{
                                width: entity.baseStyle.width,
                                height: entity.baseStyle.height,
                                borderRadius: entity.baseStyle.borderRadius,
                                backgroundColor: entity.baseStyle.backgroundColor,
                                borderWidth: entity.baseStyle.borderWidth,
                                borderStyle: entity.baseStyle.borderStyle,
                                borderColor: entity.baseStyle.borderColor
                            }}
                        />
                    </div>
                ))
            }



            
        </div>
    )
}

export default Sidebar
