import { useEffect, useContext, useState, Fragment } from "react";
import { AddComponents } from "./components";
import { MainContext } from "./store/mainContext";
import {
  Notes,
  Counter,
  Todo,
  AlertDialogSlide,
  Timer,
} from "./components/index.js";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

function App() {
  const { toolsData, handleAddTools } = useContext(MainContext);
  const storedComponent = JSON.parse(localStorage.getItem("storedComponents"));
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const storedComponent = JSON.parse(
      localStorage.getItem("storedComponents")
    );

    if (storedComponent === null) {
      localStorage.setItem("storedComponents", JSON.stringify([]));
    }
  }, []);
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (storedComponent && storedComponent.length > 0) {
      storedComponent.forEach((component) => {
        const [componentType, compKey] = component.split("_");
        if (componentType === "notes") {
          // Handle Notes component
          const storedDetails = localStorage.getItem(
            `${componentType}_${compKey}`
          );
          if (storedDetails) {
            handleAddTools(
              <Notes
                key={compKey}
                componentKey={compKey}
                details={JSON.parse(storedDetails)}
              />
            );
          }
        } else if (componentType === "counter") {
          // Handle Counter component
          const storedDetails = localStorage.getItem(
            `${componentType}_${compKey}`
          );
          if (storedDetails) {
            handleAddTools(
              <Counter
                key={compKey}
                componentKey={compKey}
                details={JSON.parse(storedDetails)}
              />
            );
          }
        } else if (componentType === "todo") {
          // Handle Todo component
          const storedDetails = localStorage.getItem(
            `${componentType}_${compKey}`
          );
          if (storedDetails) {
            handleAddTools(
              <Todo
                key={compKey}
                componentKey={compKey}
                details={JSON.parse(storedDetails)}
              />
            );
          }
        } else if (componentType === "timer") {
          // Handle Timer component
          const storedDetails = localStorage.getItem(
            `${componentType}_${compKey}`
          );
          if (storedDetails) {
            handleAddTools(
              <Timer
                key={compKey}
                componentKey={compKey}
                details={JSON.parse(storedDetails)}
              />
            );
          }
        }
        // console.log({ componentType, compKey });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAddTools]);

  return (
    <div className="App font-Roboto">
      <Tooltip title="Delete All">
        <IconButton
          className="!absolute right-4 top-4 z-10 !text-white"
          onClick={handleOpenModal}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <AlertDialogSlide open={open} onClose={handleCloseModal} />
      <AddComponents />
      <div className="min-h-screen relative">
        {toolsData?.map((comp) => (
          <Fragment key={comp.key}>{comp}</Fragment>
        ))}
      </div>
      {/* <Main /> */}
    </div>
  );
}

export default App;
