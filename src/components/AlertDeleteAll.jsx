import * as React from 'react';

import {DialogTitle,Slide,DialogActions,Dialog,Button} from '@mui/material';
import { useContext } from 'react';
import { MainContext } from '../store/mainContext';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AlertDialogSlide({open,onClose}) {
  // const [open, setOpen] = React.useState(false);
  const {handleClearAll} = useContext(MainContext);
  const handleRemoveAll = () => {
    // setOpen(true);
    handleClearAll()
    onClose()
  };

  const handleClose = () => {
    // setOpen(false);
    onClose()
  };

  return (
    <div>
      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure you want to clear all?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleRemoveAll}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}