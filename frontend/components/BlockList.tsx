import { forwardRef, useImperativeHandle, useRef } from "react";
import { useApp } from "../context/AppContext";
import { LoopingBlock } from "./LoopingBlock";

export const BlockList = forwardRef(function BlockList(_props, ref) {
  const { soundEffectsEnabled } = useApp();

  const audioRef = useRef<HTMLAudioElement>(null);
  const blocksEls = useRef(new Array(3).fill(null));
  useImperativeHandle(ref, () => ({
    spin() {
      //   if (process.env.NEXT_PUBLIC_AUDIO_EFFECTS === "true") {
      if (soundEffectsEnabled) {
        audioRef.current?.play();
      }
      setTimeout(() => {
        blocksEls.current.forEach((block) => block.startSpin());
      }, 500);
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
        <source src="/pull-lever.mp3" type="audio/mpeg" />
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
        <div className="absolute w-[360px] h-[120px] border-4 border-yellow-400 left-0 top-[120px]"></div>
      </div>
    </>
  );
});
