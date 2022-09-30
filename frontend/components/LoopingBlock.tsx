import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import useVirtual from "react-cool-virtual";
import { useApp } from "../context/AppContext";

const symbols = ["🍒", "🍋", "🍊", "🍉"];

const NUM_BLOCKS = 3; // Number of blocks in the slot machine
const ITEMS_COUNT = 15000; //arbitrary number of items to render in the virtual list, should be much higher than the number of symbols
const SPIN_SPEED = 35; //ms
const ITEM_SIZE = 120; //px

export const LoopingBlock = forwardRef(function LoopingBlock(
  { delayMultiplier }: { delayMultiplier: number },
  ref
) {
  const { soundEffectsEnabled } = useApp();
  const [offsetIndex, setOffsetIndex] = useState<number>(0);
  const intervalRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { outerRef, innerRef, items, scrollToItem } =
    useVirtual<HTMLDivElement>({
      itemCount: ITEMS_COUNT,
      itemSize: ITEM_SIZE,
    });

  useImperativeHandle(ref, () => ({
    stopSpin() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    },

    startSpin() {
      this.stopSpin();
      // Just in case we exceed it
      if (offsetIndex > 10000) {
        setOffsetIndex(0);
        scrollToItem(0);
      }
      intervalRef.current = setInterval(() => {
        setOffsetIndex((offsetIndex) => {
          scrollToItem({
            index: offsetIndex % ITEMS_COUNT,
            smooth: true
          });
          return (offsetIndex + 1) % ITEMS_COUNT;
        });
      }, SPIN_SPEED * delayMultiplier); // The last block spins the fastest, then the second last, etc.
    },

    async stopOn(stopIndex: number) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.stopSpin();
          setOffsetIndex((offset) => {
            const currentRealIndex = offset % symbols.length;
            const toEnd = symbols.length - currentRealIndex; // How many to go to the end of the "real" list i.e. 🍒🍋🍊🍉 (4)
            const stopOffsetIndex = offset + toEnd + stopIndex; //  Go to the next "loop" of the real list, and then add the index we want to stop on
            scrollToItem({
              index: stopOffsetIndex + 1,
              smooth: true,
            });
            // if (process.env.NEXT_PUBLIC_AUDIO_EFFECTS === "true") {
            if (soundEffectsEnabled) {
              audioRef.current?.play();
            }
            resolve(true);
            return stopOffsetIndex;
          });
        }, 1000 * (NUM_BLOCKS - delayMultiplier + 1)); // The first block stops after 1 second, then the second after 2 seconds, etc.
      });
    },
  }));

  return (
    <>
      <audio ref={audioRef}>
        <source src="/blockstop.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div
        ref={outerRef} // Attach the `outerRef` to the scroll container
        style={{
          width: ITEM_SIZE + "px",
          height: ITEM_SIZE * NUM_BLOCKS + "px",
          overflow: "hidden",
        }}
      >
        {/* Attach the `innerRef` to the wrapper of the items */}
        <div ref={innerRef}>
          {items.map(({ index, size }) => (
            // You can set the item's height with the `size` property
            <div
              key={index}
              style={{ height: `${size}px`, fontSize: "80px" }}
              className="select-none"
            >
              {symbols[index % symbols.length]}
            </div>
          ))}
        </div>
      </div>
    </>
  );
});
