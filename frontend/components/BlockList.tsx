import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LoopingBlock } from "./LoopingBlock";

export const BlockList = forwardRef(function BlockList(_props, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const blocksEls = useRef(new Array(3).fill(null));
  useImperativeHandle(ref, () => ({
    spin() {
      if (process.env.NEXT_PUBLIC_AUDIO_EFFECTS === "true") {
        audioRef.current?.play();
      }
      blocksEls.current.forEach((block) => block.startSpin());
    },
    stopOn(result: Array<number>) {
      blocksEls.current.forEach((block, index) => {
        block.stopOn(result[index]).then(() => {
          if (index === blocksEls.current.length - 1) {
            setTimeout(() => {
              audioRef.current?.pause();
              audioRef.current?.load();
            }, 500);
          }
        });
      });
    },
  }));

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/theyseemerolling.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="mt-3 relative grid grid-cols-3">
        {blocksEls.current.map((_, index) => (
          <LoopingBlock
            key={index}
            delayMultiplier={blocksEls.current.length - index}
            ref={(element) => (blocksEls.current[index] = element)}
          />
        ))}
        <div className="absolute w-[360px] h-[120px] border-4 border-green-400 left-0 top-[120px]"></div>
        {/* <div style={{fontSize: "80px"}}>🍒</div> */}
      </div>
    </>
  );
});
