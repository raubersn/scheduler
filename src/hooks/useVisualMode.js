import React, { useState } from "react";

const MODE = {
  EMPTY: "EMPTY",
  SHOW: "SHOW",
  CREATE: "CREATE",
  EDIT: "EDIT",
  SAVING: "SAVING",
  DELETING : "DELETING",
  CONFIRM: "CONFIRM",
  ERRORSAVE: "ERRORSAVE",
  ERRORDELETE: "ERRORDELETE",
};

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial || MODE.EMPTY])
  
  const transition = (newMode) => {
    setHistory(prev =>[...prev, newMode]);
  };

  const back = () => {
    setHistory(prev => [...prev.slice(0, prev.length - 1)]);
  };

  return {
    mode: history[history.length - 1],
    transition,
    back
  };
};

export default useVisualMode;