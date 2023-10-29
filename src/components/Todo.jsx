import {  Fragment, useCallback, useEffect, useMemo, useRef,useState } from 'react';
import OptionsCmponent from './OptionsCmponent';

import { Droppable ,DragDropContext} from 'react-beautiful-dnd'
import Draggable from 'react-draggable';
import { TextField } from '@mui/material';
import TodoItem from './TodoItem';
import { v4 as uuidv4 } from 'uuid';
import Confetti from 'react-confetti'

const Todo = ({componentKey,details}) => {
  const nodeRef = useRef(null)
  const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);
  const [position,setPosition] = useState({x:details? details?.positionX : 0,y:details? details.positionY:0})
  const [todoContent,setTodoContent] = useState('')
  const [todoListItems,setTodoListItems] = useState(details?.todoListItems||[])
  const checkAllCompleted= useMemo(()=>{
    return todoListItems.every(item=>item.checked===true) && todoListItems.length>0
  },[todoListItems])
  const [celebrate,setCelebrate] = useState(false)
  
  const handleDragStop = useCallback((e,data)=>{
    if (position.x !== data.x || position.y !== data.y){
      setPosition({x:data.x,y:data.y})
    }
    // element.style.transform = ``
  },[position.x,position.y])
  const handleChange= useCallback((e)=>{
    setTodoContent(e.target.value)
  },[])

  useEffect(()=>{
    if (checkAllCompleted){
      setCelebrate(true)
    }else{
      setCelebrate(false)
    }
  },[checkAllCompleted])
 
  useEffect(()=>{
      localStorage.setItem(`todo_${componentKey}`,JSON.stringify({
        positionX:position.x,
        positionY:position.y,
        todoListItems
      }))

  },[position.x,position.y,componentKey,todoListItems])



  const handleInputSubmit = useCallback((e) =>{
    if (e.key === 'Enter') {
      if (todoContent.trim().length ===0)return
      const key = uuidv4();
      // handleAddTask({todoContent,id:key})
      setTodoListItems([...todoListItems,{todoContent,id:key,checked:false,color:'bg-[#333]'}])
      setTodoContent('')
    }

  },[todoContent,todoListItems])

  const handleRemoveTodo = useCallback((key) =>{
    const newTodoListItems = todoListItems.filter((todo)=>{
      return todo.id !== key
    })
    setTodoListItems(newTodoListItems)
  },[todoListItems])

  const handleUpdateTodo = useCallback((todoValue,key,checked,color)=>{
    const existTodo = todoListItems.findIndex((todo)=>{
      return todo.id === key
    })
    if (existTodo !== -1) {
      // console.log(todoListItems[existTodo])
      todoListItems[existTodo].todoContent = todoValue
      todoListItems[existTodo].checked = checked
      todoListItems[existTodo].color = color
    }
    
    let newTodoListItems = [...todoListItems]
    setTodoListItems(newTodoListItems)
   
  },[todoListItems])

  const  handleDragEnd =(result)=>{
    if (!result.destination) {
      return
    }
    const items=  Array.from(todoListItems)
    const [reorderedItem] = items.splice(result.source.index,1) //source is the current index
    items.splice(result.destination.index,0,reorderedItem) // destination is the new index
    setTodoListItems(items)
  }
  

  const handleDeleteCompleteTask = () =>{
    let newTodoListItems = todoListItems.filter((todo)=>{
      return todo.checked !== true
    })
    setTodoListItems(newTodoListItems)
  }
  const handleDeleteAllTask = () =>{
    setTodoListItems([])
  }
  const customStyle =useMemo(()=>( {
    top:`${position.y}px`,
    left: `${position.x}px`,
  }),[position.x,position.y])
  const handleDrag = useCallback((e,data) =>{
    setPosition({x:data.x,y:data.y})
  },[])
  useEffect(()=>{
    setCelebrate(false)
  },[])
  return (
    <DragDropContext onDragEnd={handleDragEnd} >
        <Draggable  
          nodeRef={nodeRef}
          disabled={isDraggingDisabled}
      
          defaultPosition={{x:position.x,y:position.y}}
          onStop={handleDragStop}
          onDrag={handleDrag}
          cancel='.no-move'
          // {...provided.dragHandleProps}
          >
          <div style={customStyle} className={`w-[360px] p-8 !transform-none absolute min-h-[400px] bg-white rounded-xl`} ref={nodeRef}>
            <TextField fullWidth 
              onChange={handleChange} onClick={() => setIsDraggingDisabled(true)}
              onMouseLeave={() => setIsDraggingDisabled(false)}
              className='!absolute bottom-0 left-0'
              onKeyDown={handleInputSubmit}
              value={todoContent}
              
            />
              <Droppable droppableId='todo-list' type='group'>
                {(provided)=>(

                  <div className='h-[300px] relative overflow-auto no-scrollbar' {...provided.droppableProps} ref={provided.innerRef}>
                          {todoListItems?.map((todo,index)=>(
                                <TodoItem key={todo.id} index={index} onUpdate={handleUpdateTodo} onRemove={handleRemoveTodo} todo={todo} />
                         ))}
                      {provided.placeholder}

                  </div>
              )}

            </Droppable>
          <OptionsCmponent componentKey={componentKey}  todoOption={{deleteComplete:handleDeleteCompleteTask,deleteAll:handleDeleteAllTask}} />
          {celebrate&&
            <Confetti
              height={600}
              className='w-full'
              recycle={false}
              numberOfPieces={700}
              onConfettiComplete ={()=>setCelebrate(false)}
              />

          }
          </div>
        </Draggable>
        
    </DragDropContext>
  )
}

export default Todo
