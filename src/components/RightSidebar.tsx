import { useState } from 'react'
import { Entity, EntityWithId } from '../types/Entity'
import { FaTrash } from "react-icons/fa6";

interface RightSidebarProps {
    data: EntityWithId | null,
    setData: (data: EntityWithId | null) => void,
    deleteCurrentEntity: () => void
}


function RightSidebar(props: RightSidebarProps) {
    return (
        <div className=' w-full min-h-full '>
            <div className='bg-gray-800 text-white p-4 font-bold  text-2xl flex flex-row justify-between items-center'>
                <h1 className='underline'>Propriétés</h1>
                <div onClick={props.deleteCurrentEntity}>
                    <FaTrash />
                </div>
            </div>
            
            <div className='flex flex-col gap-4 p-4'>
                <div>
                    <span>Nom : {props.data?.name}</span>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='positionX' className='font-medium mb-1'>Position X</label>
                    <input
                        id='positionX'
                        type='number'
                        className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter X position'
                        value={props.data?.positionX}
                        onChange={(e) => {
                            if(props.data){
                                props.setData({
                                    ...props.data,
                                    positionX: parseInt(e.target.value)
                                })
                            }
                        }}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='positionY' className='font-medium mb-1'>Position Y</label>
                    <input
                        id='positionY'
                        type='number'
                        className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter Y position'
                        value={props.data?.positionY}
                        onChange={(e) => {
                            if(props.data){
                                props.setData({
                                    ...props.data,
                                    positionY: parseInt(e.target.value)
                                })
                            }
                        }}
                    />
                </div>
            </div>

        </div>
    )
}

export default RightSidebar
