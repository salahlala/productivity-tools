import IconButton from '@mui/material/IconButton';
import OptionsCmponent from './OptionsCmponent';

import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { useCallback, useEffect, useRef,useState } from 'react';
import Draggable from 'react-draggable';

import { TextField } from '@mui/material';
const Counter = ({componentKey,details}) => {
  const nodeRef = useRef(null)
  const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);
  const [position,setPosition] = useState({x:details? details?.positionX : 0,y:details? details.positionY:0})
  const [counterContent,setCounterContent] = useState(details?.counterContent||'')
  const [counterValue,setCounterValue] = useState(details?.counterValue||0)
  const [showInput,setShowInput] = useState(true)
  const curInput = useRef('')
  const handleDragStop = useCallback((e,data)=>{
    if (position.x !== data.x || position.y !== data.y){
      setPosition({x:data.x,y:data.y})
    }
    
  },[position.x,position.y])
  const handleChange= useCallback((e)=>{
    setCounterContent(e.target.value)
  },[])

  const handleInputVisible =useCallback( ()=>{
    setShowInput(true)
    setTimeout(()=>{
      curInput.current.querySelector('input').focus()
    },10)
  },[])
  const handleBlurInput = useCallback(() =>{
    if (counterContent.trim().length ===0)return

    setShowInput(false)
  },[counterContent])

  useEffect(()=>{
    handleBlurInput()
  },[])

  useEffect(()=>{
    localStorage.setItem(`counter_${componentKey}`,JSON.stringify({
      counterContent,
      positionX:position.x,
      positionY:position.y,
      counterValue
    }))
  },[counterValue,position.x,position.y,componentKey,counterContent])
  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={isDraggingDisabled}
      defaultPosition={{x:position.x,y:position.y}}
      onStop={handleDragStop}
      // onStart={handleDragStart}
      // onDrag={handleDrag}
      >
      
    <div className={`w-[190px] p-6 absolute bg-[#FF9800] rounded-3xl h-fit text-white `} ref={nodeRef}>
      {showInput? <TextField
        fullWidth
          ref={curInput}
          value={counterContent}
          // className="w-full !border-0 !outline-0 focus:outline-0"
          onChange={handleChange}
          onBlur={handleBlurInput}
            onClick={() => setIsDraggingDisabled(true)}
              onMouseLeave={() => setIsDraggingDisabled(false)}
          variant="standard" 
          onKeyDown={(e)=>{
            if (e.key === 'Enter'){
              handleBlurInput()
            }
          }}

      />:
      <h2 className='font-semibold text-center text-[25px]' onClick={handleInputVisible}>{counterContent}</h2>

      }
        {/* create arrow to increament and decreament counter  */}
      <div className='flex gap-2 items-center mt-4 justify-center relative'>
          <p className='font-semibold text-[35px]'>{counterValue}</p>

          <div className='flex flex-col absolute right-[11px] '>
            <IconButton className='!text-[20px] !text-white' onClick={() => setCounterValue(counterValue + 1)}>
              <ArrowCircleUpIcon />
            </IconButton>
            <IconButton className='!text-[20px] !text-white' onClick={() => setCounterValue(counterValue - 1)}>
              <ArrowCircleDownIcon />
            </IconButton>
          </div>
      </div>
      <OptionsCmponent componentKey={componentKey} />
    </div>
  </Draggable>
  )
}

export default Counter
