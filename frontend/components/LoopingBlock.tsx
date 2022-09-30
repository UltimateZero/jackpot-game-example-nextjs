import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import useVirtual from "react-cool-virtual";

const symbolsMap = new Map<string, string>([
  ["cherry", "🍒"],
  ["lemon", "🍋"],
  ["orange", "🍊"],
  ["watermelon", "🍉"],
]);
const symbols = Array.from(symbolsMap.keys());

const toEmoji = (fruit: string) => {
  return symbolsMap.get(fruit) || "🍒";
};



const MAX_BLOCKS = 3; // Number of blocks in the slot machine
const ITEMS_COUNT = 15000;
const SPIN_SPEED = 35; //ms

export const LoopingBlock = forwardRef(function LoopingBlock(
  { delayMultiplier }: { delayMultiplier: number },
  ref
) {
  const [offsetIndex, setOffsetIndex] = useState<number>(0);
  const intervalRef = useRef<any>(null);
  const { outerRef, innerRef, items, scrollToItem } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: ITEMS_COUNT, // Provide the total number for the list items
    itemSize: 64, // The size of each item (default = 50)
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
            smooth: offsetIndex % ITEMS_COUNT === 0 ? false : true,
          });
          return (offsetIndex + 1) % ITEMS_COUNT;
        });
      }, SPIN_SPEED * delayMultiplier);
    },

    stopOn(stopIndex: number) {
      setTimeout(() => {
        this.stopSpin();
        setOffsetIndex((offset) => {
          const currentRealIndex = offset % symbols.length;
          const toEnd = symbols.length - currentRealIndex;
          const stopOffsetIndex = toEnd + offset + stopIndex;
          scrollToItem({
            index: stopOffsetIndex + 1,
            smooth: true,
          });
          return stopOffsetIndex;
        });
      }, 1000 * (MAX_BLOCKS - delayMultiplier + 1));
    },
  }));

  return (
    <div
      ref={outerRef} // Attach the `outerRef` to the scroll container
      style={{
        width: "64px",
        height: 64 * 3 + "px",
        overflow: "hidden",
      }}
    >
      {/* Attach the `innerRef` to the wrapper of the items */}
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          // You can set the item's height with the `size` property
          <div key={index} style={{ height: `${size}px`, fontSize: "3rem" }}>
            {toEmoji(symbols[index % symbols.length])}
          </div>
        ))}
      </div>
    </div>
  );
});
