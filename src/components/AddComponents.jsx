// import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Filter1Icon from '@mui/icons-material/Filter1';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TimerIcon from '@mui/icons-material/Timer';
import { useContext ,memo, useCallback} from 'react';
import { MainContext } from '../store/mainContext';

import {Counter,Notes,Timer,Todo} from './index'
import { v4 as uuidv4 } from 'uuid';

const actions = [
  { icon: <FormatListBulletedIcon />, name: 'Todo' },
  { icon: <Filter1Icon />, name: 'Counter' },
  { icon: <TextSnippetIcon />, name: 'Notes' },
  {icon:<TimerIcon/>,name:'Timer'},
];
const colors = ['!bg-blue-950','!bg-[#FF9800]','!bg-emerald-900','!bg-lime-900','!bg-[#f9310e]']

export default  memo(function AddComponents() {
  const {handleAddTools} = useContext(MainContext);

  const handleAddComponent = useCallback((type,index) =>{
    const key = uuidv4();
    const oldData= JSON.parse(localStorage.getItem('storedComponents'))||[]

    if (type === 'todo') {
      handleAddTools(<Todo key={key} componentKey={key} />)
      
    }else if (type ==='notes') {
      handleAddTools(<Notes key={key} componentKey={key}/>)
    }else if (type ==='counter') {
      handleAddTools(<Counter key={key} componentKey={key}/>)
    }else if (type ==='timer') {
      handleAddTools(<Timer key={key} componentKey={key}/>)
    }
    localStorage.setItem('storedComponents',JSON.stringify([
      ...oldData,
      `${type}_${key}`
    ]))
  },[handleAddTools])
  return (
    <div className='absolute w-full bottom-0 z-30'>
        <Box sx={{ height: '', transform: 'translateZ(0px)', flexGrow: 1 }} >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 25, right: 16 }}
        icon={<SpeedDialIcon />}
        // className='!bg-white'
      >
          {actions.map((action,index) => (
            <SpeedDialAction onClick={()=>handleAddComponent(action.name.toLowerCase(),index)} key={action.name} icon={action.icon} tooltipTitle={action.name} className={`${colors[index]} !text-white`}/>
          ))}
          
      </SpeedDial>
    </Box>
    </div>
  );
})