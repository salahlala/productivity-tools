import { createContext } from "react";
import { useState, useReducer, useCallback } from "react";

const MainContext = createContext();
const defaultData = {
  toolsData: [],
};

const toolReducer = (state, action) => {
  if (action.type === "ADD_TOOLS") {
    // let data = state.toolsData.concat(action.payload);
    const existIndex = state.toolsData.findIndex(
      (item) => item.key === action.payload.key
    );

    const existingData = state.toolsData[existIndex];

    if (!existingData) {
      let allData = state.toolsData.concat(action.payload);
      return {
        toolsData: allData,
      };
    } else {
      return {
        toolsData: state.toolsData,
      };
    }
  }

  if (action.type === "REMOVE_TOOL") {
    let allData = state.toolsData.filter((item) => item.key !== action.payload);
    return {
      toolsData: allData,
    };
  }

  if (action.type === "CLEAR_ALL") {
    return {
      toolsData: [],
    };
  }

  return defaultData;
};
const AppState = ({ children }) => {
  const [toolState, dispatchTool] = useReducer(toolReducer, defaultData);
  const [componentsList, setComponentsList] = useState([]);

  const addComponents = useCallback((component) => {
    setComponentsList((prev) => [...prev, component]);
  }, []);

  const handleAddTools = useCallback((component) => {
    dispatchTool({ type: "ADD_TOOLS", payload: component });
  }, []);
  // console.log(storeComponent[0].split("_")[1]);
  const handleRemoveTool = useCallback((compKey) => {
    const storeComponent = JSON.parse(localStorage.getItem("storedComponents"));

    dispatchTool({ type: "REMOVE_TOOL", payload: compKey });
    localStorage.removeItem(`notes_${compKey}`);
    localStorage.setItem(
      "storedComponents",
      JSON.stringify(
        storeComponent.filter((comp) => comp.split("_")[1] !== compKey)
      )
    );
  }, []);

  const handleClearAll = useCallback(() => {
    dispatchTool({ type: "CLEAR_ALL" });
    localStorage.removeItem("storedComponents");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, []);

  return (
    <MainContext.Provider
      value={{
        componentsList,
        addComponents,
        handleAddTools,
        handleRemoveTool,
        handleClearAll,
        toolsData: toolState.toolsData,
        // loadComponents: toolState.loadComponents,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { MainContext, AppState };
