import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LoopingBlock } from "./LoopingBlock";

export const BlockList = forwardRef(function BlockList(_props, ref) {
  const blocksEls = useRef(new Array(3).fill(null));
  useImperativeHandle(ref, () => ({
    spin() {
      blocksEls.current.forEach((block) => block.startSpin());
    },
    stopOn(result: Array<number>) {
      blocksEls.current.forEach((block, index) => block.stopOn(result[index]));
    },
  }));

  return (
    <div className="list-container">
      {blocksEls.current.map((_, index) => (
        <LoopingBlock
          key={index}
          delayMultiplier={blocksEls.current.length - index}
          ref={(element) => (blocksEls.current[index] = element)}
        />
      ))}
      <div className="highlighter"></div>
    </div>
  );
});
