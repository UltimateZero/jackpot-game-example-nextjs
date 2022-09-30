import { useEffect, useState } from "react";

export function BlockList(props: any) {
  //state: init, spinning, stopped, win
  const [state, setState] = useState("init");

  useEffect(() => {
    if (state === "init") {
      setState("spinning");
    }
    
  }, [state]);
}
