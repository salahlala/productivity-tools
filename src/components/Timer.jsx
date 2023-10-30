import IconButton from '@mui/material/IconButton';
import OptionsCmponent from './OptionsCmponent';
import Draggable from 'react-draggable';
import alarm from './../assets/alarm.mp3';
import { useCallback, useEffect, useRef,useState } from 'react';
import { TextField } from '@mui/material';
const Timer = ({componentKey,details}) => {
  const nodeRef = useRef(null)
  const inputRef = useRef(null)
  const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);
  const [position,setPosition] = useState({x:details? details?.positionX : 0,y:details? details.positionY:0})
  const [isRunning,setIsRunning] = useState(false)
  const [showTimer,setShowTimer] = useState(false)
  const [isPaused,setIsPaused] = useState(false)
  const [timerLeft,setTimerLeft]= useState(0)
  const [timer ,setTimer] = useState(10)
  const [timerInputVal,setTimerInputVal] = useState(10)
  const [showTimerInput,setShowTimerInput] = useState(false)
  const minutes = Math.floor(timerLeft / 60)
  const second  = timerLeft % 60
  const fullTime =`${minutes.toString().padStart(2,'0')}:${second.toString().padStart(2,'0')}` 
  const alarmAudio = new Audio(alarm)
  const handleTimerStart = () =>{
    setShowTimer(true)

    if (isPaused){
      setIsRunning(true)
      return
    }
    if (showTimerInput) {
      setIsRunning(true)
    setShowTimerInput(false)
    setTimerLeft(+timerInputVal * 60)
      return
    }
    setIsRunning(true)
    setShowTimerInput(false)
    
    setTimerLeft(+timer * 60)
    
  }
  const handleTimerPause = () =>{
    setIsRunning(false)
    setIsPaused(true)
  }
  const handleTimerReset = () =>{
    setIsRunning(false)
    setIsPaused(false)
    setTimerLeft(0)
    setShowTimer(false)
    setTimer(10)
    setShowTimerInput(false)
    setTimerInputVal(10)
  }

  const handleTimerClick = (timerVal) =>{
    setShowTimer(true)
    setIsRunning(true)
    setTimerLeft(+timerVal* 60)
  }

  const handleShowInput = () =>{
    setShowTimer(false)
    setShowTimerInput(true)
    setIsRunning(false)
    setIsPaused(false)
  }

  const handleTimerInputChange = useCallback((e) =>{
    if (e.target.value*1 <=0)return
    setTimerInputVal(e.target.value)
  },[])

  const handleDragStop = useCallback((e,data) =>{
    if (position.x !== data.x || position.y !== data.y){
      setPosition({x:data.x,y:data.y})
    }

  },[position.x,position.y])

  useEffect(()=>{
    let timer;
    if (isRunning) {
      timer = setInterval(()=>{
        setTimerLeft((prev)=>prev-1)
        if (timerLeft<=1 ) {
          alarmAudio.play()
          clearInterval(timer)
          setIsRunning(false)
          setIsPaused(false)
          setShowTimer(false)
          setTimeout(() => {
            
            alarmAudio.pause()
          }, 1000);
        }

      },1000)
    }
    return () => {
      clearInterval(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isRunning,timerLeft])

  useEffect(()=>{
    localStorage.setItem(`timer_${componentKey}`,JSON.stringify({
      // counterContent,
      positionX:position.x,
      positionY:position.y,
      // counterValue
    }))
  },[position.x,position.y,componentKey])

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={isDraggingDisabled}
      defaultPosition={{x:position.x,y:position.y}}
      onStop={handleDragStop}
      // onStart={handleDragStart}
      // onDrag={handleDrag}
      >

        <div className='w-[190px] p-6 absolute bg-lime-900 rounded-3xl h-fit text-white' ref={nodeRef}>
              {showTimerInput && (
                <TextField ref={inputRef} onTouchStart={()=>inputRef?.current.querySelector('input').focus()} InputLabelProps={{ shrink: true ,pattern: '[0-9]*'}} type='number' className='!text-white !mt-4'  onChange={handleTimerInputChange} value={timerInputVal} variant='standard'/>
              )}
              {showTimer&&<h2 className='text-white text-center text-[38px] font-semibold'>{fullTime}</h2>  }
              { !showTimer &&!showTimerInput&& <div className='flex gap-4 flex-wrap items-center mt-5 text-[20px]'>
              <p onClick={()=>handleTimerClick(5)} onTouchStart={()=>handleTimerClick(5)} className='cursor-pointer'>5</p>
              <p onClick={()=>handleTimerClick(10)} onTouchStart={()=>handleTimerClick(10)} className='cursor-pointer'>10</p>
              <p onClick={()=>handleTimerClick(20)}onTouchStart={()=>handleTimerClick(20)} className='cursor-pointer'>20</p>
              <p onClick={()=>handleTimerClick(30)}onTouchStart={()=>handleTimerClick(30)} className='cursor-pointer'>30</p>
              <p onClick={()=>handleTimerClick(45)}onTouchStart={()=>handleTimerClick(45)} className='cursor-pointer'>45</p>
              <p onClick={()=>handleTimerClick(60)}onTouchStart={()=>handleTimerClick(60)} className='cursor-pointer'>60</p>
              <p className='text-[18px] cursor-pointer' onTouchStart={handleShowInput} onClick={handleShowInput}>Custom</p>

            </div>}
            
            <div className='flex justify-between items-center mt-3'>
              {isRunning?
              <IconButton className='!text-white !text-[17px]' onClick={handleTimerPause} onTouchStart={handleTimerPause}>
              Pause
              </IconButton>
              : <IconButton className='!text-white !text-[17px]' onClick={handleTimerStart}  onTouchStart={handleTimerStart}>
                Start
              </IconButton>}
              
              <IconButton className='!text-white !text-[17px]' onClick={handleTimerReset}  onTouchStart={handleTimerReset}>
                Reset
              </IconButton>
              
            </div>
            <OptionsCmponent componentKey={componentKey}/>
        </div>
      
    
  </Draggable>
  )
}

export default Timer
