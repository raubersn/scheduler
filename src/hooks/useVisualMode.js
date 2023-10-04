import { useState } from "react";

export const MODES = {
  EMPTY: "EMPTY",
  SHOW: "SHOW",
  CREATE: "CREATE",
  EDIT: "EDIT",
  SAVING: "SAVING",
  CONFIRM: "CONFIRM",
  DELETING : "DELETING",
  ERRORSAVE: "ERRORSAVE",
  ERRORDELETE: "ERRORDELETE",
};

const useVisualMode = (initial = MODES.EMPTY) => {
  const [history, setHistory] = useState([initial])
  
  const transition = (newMode, replace = false) => {
    setHistory(prev =>[...prev.slice(0, prev.length - (replace ? 1 : 0)), newMode]);
  };

  const back = () => {
    if (history.length > 1) {
      setHistory(prev => [...prev.slice(0, prev.length - 1)]);  
    }    
  };

  return {
    mode: history[history.length - 1],
    transition,
    back
  };
};

export default useVisualMode;
