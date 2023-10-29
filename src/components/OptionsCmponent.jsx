import { Menu,MenuItem} from '@mui/material'
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { MainContext } from "../store/mainContext";

import { useState,useContext, memo } from 'react';

const OptionsCmponent = ({options,componentKey,onClickFunction,todoOption}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {handleRemoveTool} = useContext(MainContext)
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // todoOptions
  const deleteAllTasks = () =>{
    todoOption.deleteAll()
    handleClose()
  }
  const deleteCompleteTasks = () =>{
    todoOption.deleteComplete()
    handleClose()
  }
  return (
    <div className={`absolute top-0 right-0`}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >

        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
     
      >
        {options&&Object.keys(options).map((option,index) => (
          <MenuItem key={option}  onClick={()=>{
            onClickFunction(Object.values(options)[index])
            handleClose()
          }}>
            <p className={`${Object.values(options)[index]} text-white px-2 py-[2px] rounded mr-2`}>A</p>{option}
          </MenuItem>
        ))}

            {todoOption&&
              <div>
                <MenuItem onClick={deleteCompleteTasks}>
                  Delete  Completed Tasks
                </MenuItem>
                <MenuItem onClick={deleteAllTasks}>
                  Delete  All Tasks
                </MenuItem>
            </div>
          }
          <MenuItem onClick={()=>handleRemoveTool(componentKey)}>
            
            Remove <DeleteForeverIcon className="text-red-500"/>
          </MenuItem>
      </Menu>
    </div>


)}

export default memo(OptionsCmponent)
