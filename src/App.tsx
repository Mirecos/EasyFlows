import { useEffect, useRef, useState } from 'react'
import "./index.css";
import Sidebar from './components/Sidebar';
import { Entity, EntityWithId } from './types/Entity';
import { DragMode } from './types/DragMode';
import RightSidebar from './components/RightSidebar';
import { Relation } from './types/Relations';
import { getArrowCoordinatesFromPosition, getRelativePosition } from './utils';

function App() {
  // List of entities
  const [entities, setEntities] = useState([] as EntityWithId[])

  //List of relations
  const [relations, setRelations] = useState([] as Relation[])

  // Right sidebar
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false)

  // Drag context
  const [dragMode, setDragMode] = useState('create' as DragMode)
  const [draggedEntityIndex, setDraggedEntityIndex] = useState(null as number | null)

  // Hovered context
  const hoveredIndex = useRef<number | null>(null);

  // Selected context
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedEntityData, setSelectedEntityData] = useState<EntityWithId | null>(null);

  // Resizing context
  const isResizing = useRef(false);
  const resizeDirection = useRef(null as string | null);
  const resizeEntityIndex = useRef(null as number | null);
  const resizeStartX = useRef(null as number | null);
  const resizeStartY = useRef(null as number | null);

  // Relations context
  const currentRelationIndex = useRef(null as number | null)
  const currentRelationDragX = useRef(null as number | null)
  const currentRelationDragY = useRef(null as number | null)




  const getNewRelationId = () => {
    const highestId = relations.reduce((maxId, entity) => Math.max(maxId, entity.id), 0);
    return highestId + 1;
  };

  const getNewEntityId = () => {
    const highestId = entities.reduce((maxId, entity) => Math.max(maxId, entity.id), 0);
    return highestId + 1;
  };

  const dragStart = (e: React.DragEvent<HTMLElement>, data: Entity) => {
    setDragMode(DragMode.CREATE)
    e.dataTransfer.setData('text/plain', JSON.stringify(data))
  }

  const moveEntityStart = (e: React.DragEvent<HTMLElement>, index: number) => {
    setDragMode(DragMode.MOVE)
    setDraggedEntityIndex(index)
    e.dataTransfer.setData('text/plain', JSON.stringify(entities[index]))
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0)
  }

  const dragEnd = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    if(dragMode === DragMode.MOVE && draggedEntityIndex !== null) {
      const newEntities = [...entities]
      newEntities[draggedEntityIndex].positionX = e.clientX
      newEntities[draggedEntityIndex].positionY = e.clientY
      newEntities[draggedEntityIndex].id = getNewEntityId()
      setEntities(newEntities)
    }else if(dragMode === DragMode.CREATE) {
      const newEntity = JSON.parse(e.dataTransfer.getData('text/plain')) as EntityWithId
      newEntity.positionX = e.clientX
      newEntity.positionY = e.clientY 
      setEntities([...entities, newEntity])
    }else if(dragMode === DragMode.CREATE_RELATION) {
      const newRelations = [...relations]
      if(currentRelationIndex.current === null || hoveredIndex === null) return
      newRelations[currentRelationIndex.current].to = hoveredIndex.current!
      setRelations(newRelations)
    }
  }

  const startResize = (e: React.MouseEvent, index: number, direction: string) => {
    isResizing.current = true;
    resizeDirection.current = direction
    resizeEntityIndex.current = index;
    resizeStartX.current = e.clientX;
    resizeStartY.current = e.clientY;

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || resizeEntityIndex === null || resizeDirection === null) return;
    if (resizeStartX.current === null || resizeStartY.current === null) return;
    const deltaX = e.clientX - resizeStartX.current;
    const deltaY = e.clientY - resizeStartY.current;

    const newEntities = [...entities];
    if(resizeEntityIndex.current === null) return;
    const entity = {...newEntities[resizeEntityIndex.current]};
    newEntities[resizeEntityIndex.current] = entity;

    switch (resizeDirection.current) {
      case 'topRight':
        entity.positionY = entity.positionY + deltaY;
        entity.baseStyle = {
          ...entity.baseStyle,
          height: Math.max(20, entity.baseStyle.height - deltaY ),
          width: Math.max(20, entity.baseStyle.width + deltaX )
        };
        break;
      case 'topLeft':
        entity.positionX = entity.positionX + deltaX;
        entity.positionY = entity.positionY + deltaY;
        entity.baseStyle = {
          ...entity.baseStyle,
          height: Math.max(20, entity.baseStyle.height - deltaY ),
          width: Math.max(20, entity.baseStyle.width - deltaX )
        };
        break;
      case 'bottomRight':
        entity.baseStyle = {
          ...entity.baseStyle,
          width: Math.max(20, entity.baseStyle.width + deltaX ),
          height: Math.max(20, entity.baseStyle.height + deltaY )
        };
        break;
      case 'bottomLeft':
        entity.positionX = entity.positionX + deltaX;

        entity.baseStyle = {
          ...entity.baseStyle,
          width: Math.max(20, entity.baseStyle.width - deltaX ),
          height: Math.max(20, entity.baseStyle.height + deltaY )
        };
        break;
    }
    
    setEntities(newEntities);

  };

  const stopResize = () => {

    isResizing.current = false;
    resizeDirection.current = '';
    resizeEntityIndex.current = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  const onElementClick = (index: number) => {
    if(selectedIndex === index){
      setSelectedIndex(null)
      setSelectedEntityData(null)
      setRightSidebarVisible(false)
    }else{
      setSelectedIndex(index)
      setSelectedEntityData(entities[index])
      setRightSidebarVisible(true)
    }

  }

  const deleteSelectedEntity = () => {
    if(selectedIndex === null) return
    const newEntities = [...entities]
    newEntities.splice(selectedIndex, 1)
    setEntities(newEntities)
    setSelectedIndex(null)
    setRightSidebarVisible(false)
  }


  const dragStartRelation = (e: React.MouseEvent) => {
    if(selectedIndex === null) return 

    setDragMode(DragMode.CREATE_RELATION)
    const relationId = getNewRelationId()
    const newArray = [...relations]
    newArray.push({from: selectedIndex, id: relationId, to: -1, name: 'relation', type: 'arrow'})
    setRelations(newArray)
    currentRelationIndex.current = relations.length-1;

    document.addEventListener('mousemove', handleRelation);
    document.addEventListener('mouseup', stopRelation);
  }

  const handleRelation = (e: MouseEvent) => {
    currentRelationDragX.current = e.clientX
    currentRelationDragY.current = e.clientY
    if(currentRelationIndex.current !== null){
      const newArray = [...relations]
      if(hoveredIndex.current != null){
        newArray[currentRelationIndex.current].to = hoveredIndex.current
      }else{
        newArray[currentRelationIndex.current].to = -1
      }
      setRelations(newArray)
    }
  }

  const stopRelation = () => {
    setDragMode(DragMode.CREATE)

    document.removeEventListener('mousemove', handleRelation);
    document.removeEventListener('mouseup', stopRelation);
  }


  useEffect(()=>{
    //Replicate updates from right sidebar to the main entity list
    if(selectedIndex !== null && selectedEntityData !== null){
      const newEntities = [...entities]
      newEntities[selectedIndex] = selectedEntityData
      setEntities(newEntities)
    }
  }, [selectedEntityData])

  return (
    <div className='flex flex-row h-screen w-screen bg-gray-300'>
      <Sidebar dragStart={dragStart} />
      <div
        onClick={()=> {
          setRightSidebarVisible(false)
          setSelectedIndex(null)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={dragEnd}
        className='
        bg-white w-full h-full max-w-full max-h-full overflow-scroll 
        bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]
        '
        >
          {
            entities.map((entity, index) => (
              <div
                key={index}
                className='absolute'
                style={{
                  left: entity.positionX,
                  top: entity.positionY,
                }}
              >
                <div
                  id='entity'
                  draggable
                  onDragStart={(e) => {moveEntityStart(e, index)}}

                  //Set as selected on hovered
                  onMouseEnter={() => hoveredIndex.current = index}
                  onMouseLeave={() => hoveredIndex.current = null}

                  onClick={(e)=>{
                    e.stopPropagation()
                    onElementClick(index)
                  }}

                  key={index}
                  className='absolute'
                  style={{
                    width: entity.baseStyle.width,
                    height: entity.baseStyle.height,
                    borderRadius: entity.baseStyle.borderRadius,
                    backgroundColor: entity.baseStyle.backgroundColor,
                    borderWidth: hoveredIndex.current === index || selectedIndex === index ? 1: entity.baseStyle.borderWidth,
                    borderStyle: hoveredIndex.current === index || selectedIndex === index ? 'dashed':entity.baseStyle.borderStyle,
                    borderColor : hoveredIndex.current === index || selectedIndex === index ? 'black':entity.baseStyle.borderColor
                  }}
                />
                {
                    selectedIndex === index && (
                      <div 
                        style={{
                          width: entity.baseStyle.width,
                          height: entity.baseStyle.height,
                        }}
                      >
                        <div
                          style={{
                            left: -4,
                            top: -4,
                          }} 
                          className='absolute bg-gray-800 w-5 h-5 cursor-nw-resize rounded-full border-2 border-solid border-white'
                          onMouseDown={(e) => {
                            startResize(e, index, 'topLeft')
                          }} 
                        />
                        <div
                          style={{
                            right: -4,
                            top: -4,
                          }} 
                          className='absolute bg-gray-800 w-5 h-5 cursor-ne-resize rounded-full border-2 border-solid border-white'
                          onMouseDown={(e) => {
                            startResize(e, index, 'topRight')
                          }} 
                        />
                        <div
                          style={{
                            left: -4,
                            bottom: -4,
                          }} 
                          className='absolute bg-gray-800 w-5 h-5 cursor-sw-resize rounded-full border-2 border-solid border-white'
                          onMouseDown={(e) => {
                            startResize(e, index, 'bottomLeft')
                          }} 
                        />
                        <div
                          style={{
                            right: -4,
                            bottom: -4,
                          }} 
                          className='absolute bg-gray-800 w-5 h-5 cursor-se-resize rounded-full border-2 border-solid border-white'
                          onMouseDown={(e) => {
                            startResize(e, index, 'bottomRight')
                          }} 
                        />



                        <div
                          style={{
                            left: -20,
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                          className='absolute bg-gray-800 w-5 h-5 cursor-w-resize rounded-full border-2 border-solid border-white'
                          onMouseDown={(e) => {
                            dragStartRelation(e)
                          }}
                        />
                        <div
                          style={{
                            right: -20,
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                          className='absolute bg-gray-800 w-5 h-5 cursor-w-resize rounded-full border-2 border-solid border-white'
                          onMouseDown={(e) => {
                            dragStartRelation(e)
                          }}
                        />
                        <div
                          style={{
                            bottom: -20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                          className='absolute bg-gray-800 w-5 h-5 cursor-w-resize rounded-full border-2 border-solid border-white'
                          onMouseDown={(e) => {
                            dragStartRelation(e)
                          }}
                        />
                        <div
                          style={{
                            top: -20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                          className='absolute bg-gray-800 w-5 h-5 cursor-w-resize rounded-full border-2 border-solid border-white'
                          onMouseDown={(e) => {
                            dragStartRelation(e)
                          }}
                        />
                      </div>
                      
                    )
                }
              </div>
              

            ))
          }
      </div>


      {
        relations.map((relation, index) => {

          const fromEntity = entities.find((_, i) => i === relation.from)
          if(fromEntity === undefined) return null
          const toEntity = relation.to === -1 ? null : entities.find((_, i) => i === relation.to)
          
          const secondEntityPosition = relation.to === -1 ? {x: currentRelationDragX.current!, y: currentRelationDragY.current!} : {x: toEntity!.positionX + (toEntity!.baseStyle!.width / 2), y: toEntity!.positionY + (toEntity!.baseStyle!.height / 2)}
          const relationPositions = getRelativePosition(fromEntity, secondEntityPosition)
          
          const fromX = fromEntity.positionX
          const fromY = fromEntity.positionY
          const toX = toEntity ? toEntity.positionX : currentRelationDragX.current
          const toY = toEntity ? toEntity.positionY: currentRelationDragY.current
      

          return (
            <svg
              className="absolute pointer-events-none w-full h-full"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
              </defs>
              <line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="black"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          )
        })
      }



      <div 
      style={{display: rightSidebarVisible?'':'none', position: rightSidebarVisible?'absolute':'unset'}} 
        className='border-l-2 border-solid border-gray-800 bg-white absolute w-96 right-0 min-h-screen'>
          <RightSidebar 
            data={selectedEntityData} 
            setData={setSelectedEntityData}
            deleteCurrentEntity={deleteSelectedEntity}
          />
      </div>
    </div>
  )
}

export default App
