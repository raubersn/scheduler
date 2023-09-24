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
  const [ mode, setMode ] = useState(initial || MODE.EMPTY);
  
  return { mode };
};

export default useVisualMode;