import Draggable  from "react-draggable"
import TextField from '@mui/material/TextField';
import OptionsCmponent from "./OptionsCmponent";
import { useCallback, useEffect, useRef, useState } from "react";

const colors = {
  'white':'bg-[#faebd7]',
  "orange":'bg-[#FF9800]',
  "purple":'bg-[#e68dee]',
  "green":'bg-[#b8ea7b]',
  "blue":'bg-[#82bae9]',
  "red":'bg-[#f9310e]'
};
const Notes = ({componentKey,details}) => {
  const [position,setPosition] = useState({x:details? details?.positionX : 0,y:details? details.positionY:0})
  const [noteContent,setNoteContent] = useState(details?.noteContent||'')
  const [color,setColor] = useState(details?.color ||'bg-[#faebd7]')
  const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);
  const nodeRef = useRef(null)
  const inputRef = useRef(null)
  const handleDragStop = useCallback((e,data)=>{
    if (position.x !== data.x || position.y !== data.y){
      setPosition({x:data.x,y:data.y})
    }
    },[position.x,position.y])
  const handleChange = (e)=>{
    // console.log(e.target.value)
    setNoteContent(e.target.value)
  }

  const handleClickColor = (color) => {
    setColor(color)
  }
  useEffect(()=>{
    localStorage.setItem(`notes_${componentKey}`,JSON.stringify({
      noteContent: noteContent,
      positionX:position.x,
      positionY:position.y,
      color
    }))
  },[position.x,position.y,componentKey,noteContent,color])

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={isDraggingDisabled}
      defaultPosition={details?{x:details.positionX,y:details.positionY}:undefined}
      onStop={handleDragStop}
      // onStart={handleDragStart}
      // onDrag={handleDrag}
      >
      
    <div className={`w-[320px] lg:w-[360px] p-6 absolute ${color} rounded-3xl h-fit min-h-[300px] lg:min-h-[400px]`} ref={nodeRef}>
      <TextField
        fullWidth
            multiline
            value={noteContent}
            ref={inputRef}
          // className="w-full !border-0 !outline-0 focus:outline-0"
          onChange={handleChange}
            onClick={() => setIsDraggingDisabled(true)}
            onTouchStart={(e) => {
              // e.stopPropagation()
              setIsDraggingDisabled(true)
              inputRef?.current.querySelector('textarea').focus()
            }}
            onTouchMove={(e)=>{
              setIsDraggingDisabled(true)
            }}
            onTouchEnd={(e) => {
              setIsDraggingDisabled(false)
              inputRef?.current.querySelector('textarea').blur()

            }}
              onMouseLeave={() => setIsDraggingDisabled(false)}
          variant="standard" 
          InputProps={{
            disableUnderline: true,
          }}

      />
      <OptionsCmponent componentKey={componentKey} options={colors} onClickFunction={handleClickColor}/>
    </div>
  </Draggable>
  )
}

export default Notes
