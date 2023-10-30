import IconButton from '@mui/material/IconButton';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from "@mui/icons-material/Delete";

import {Draggable as DragBeautiful,} from 'react-beautiful-dnd'
// import { Menu,MenuItem} from '@mui/material'

import { TextField,Checkbox ,Menu,MenuItem} from '@mui/material';
import { useState,useCallback ,useRef,useEffect, memo} from 'react';


const colors = {
  'CadetBlue':'bg-[#2b6d6b]',
  "Brown":'bg-[#795548]',
  "Purple":'bg-[#673AB7]',
  "DimGray":'bg-[#333]',
  "Blue":'bg-[#2196F3]',
  "MidnightBlue":'bg-[#191970]'
  
};
const TodoItem = ({todo,onRemove,onUpdate,index}) => {
  const [showInput,setShowInput] = useState(false)
  const {todoContent} = todo
  const curInput = useRef('')
  const [todoValue,setTodoValue] = useState(todoContent)
  const [checked,setChecked] = useState(todo.checked||false)
  const [showDragIcon,setShowDragIcon] = useState(false)
  const [color,setColor] = useState(todo.color||'bg-[#333]')
  const [anchorEl, setAnchorEl] = useState(null);

  const handleBlurInput = useCallback(() =>{
    if (todoValue.trim().length ===0)return

    setShowInput(false)
    // curItem[0].todoContent = todoValue
  },[todoValue])
  const handleInputVisible =useCallback( ()=>{
    setShowInput(true)
    setTimeout(()=>{
      curInput.current.querySelector('input').focus()
    },10)
  },[])
  const handleMouseEnter = () => {
    setShowDragIcon(true)

  }
  const handleMouseLeave = () => {
    setShowDragIcon(false)
  }
  const handleClickColor = (colorVal) =>{
    setColor(colorVal)
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    handleMouseLeave()
  };  
  const handleInputChange = useCallback((e)=>{
    if (e.target.value.trim().length ===0)return
    setTodoValue(e.target.value)
  },[])
  const handleCheckInput = (e) =>{
    setChecked(e.target.checked)
  }

  useEffect(()=>{
    onUpdate(todoValue,todo.id,checked,color)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[todoValue,todo.id,checked,color])




  return (
    
    <DragBeautiful draggableId={todo.id} key={todo.id} index={index} >
        {(provided,snapshot)=>(
          <div onMouseEnter={handleMouseEnter} style={{...provided.draggableProps.style}} onMouseLeave={handleMouseLeave} className={`select-none todo-item ${snapshot.isDragging ? 'dragging opacity-80' : ''} no-move flex items-center gap-2 mb-2 ${color} rounded`}    {...provided.draggableProps} ref={provided.innerRef}>
          <Checkbox onChange={handleCheckInput} checked={checked} color='default' sx={{color:'white'}}/>
          {showInput? <TextField className='!text-white' ref={curInput} value={todoValue} variant='standard' onKeyDown={(e)=>{e.key === 'Enter' && handleBlurInput()}} onChange={handleInputChange} onBlur={handleBlurInput}/> : <p className={`select-none w-full cursor-pointer text-white ${todo.checked && 'line-through !text-[#9b9999]'}`} onTouchEnd={handleBlurInput}  onTouchStart={handleInputVisible} onDoubleClick={handleInputVisible}>{todoValue}</p>}
        
          <div onClick={handleClick}  {...provided.dragHandleProps} className={`transition-opacity ${showDragIcon?'!opacity-full !visible':'!opacity-0 !invisible'}`}>
            <IconButton>
              <DragIndicatorIcon className='!text-white' />
            </IconButton>
          </div>
          <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
    
      >

         {Object.keys(colors).map((option,index) => (
          <MenuItem key={option}  onClick={()=>{
            handleClickColor(Object.values(colors)[index])
            handleClose()
          }}>
            <p className={`${Object.values(colors)[index]} py-[2px] px-2 rounded text-white mr-2`}>A</p>{option}
          </MenuItem>
        ))}
        
          <MenuItem onClick={()=>onRemove(todo.id)}>
            <DeleteIcon/> Delete 
          </MenuItem>
      </Menu>
        </div>
        )}
    </DragBeautiful>
    )
}

export default memo(TodoItem)
