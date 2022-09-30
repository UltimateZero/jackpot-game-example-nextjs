import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useAuth } from "../context/AuthContext";
import { sendRollRequest } from "../lib/get-account";
import useVirtual from "react-cool-virtual";
import { CashoutButton } from "../components/CashoutButton";

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

const Block = ({ value, index, numberOfBlocks }) => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [spinning, setSpinning] = useState<boolean>(false);
  const beforeElementRef = useRef<HTMLDivElement>(null);
  const currentElementRef = useRef<HTMLDivElement>(null);
  const afterElementRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef(null);
  const spinDelay = (numberOfBlocks - index + 1) * 30;
  const resultDelay = (index + 1) * 1000;
  const [randomValue, setRandomValue] = useState<number>(0);

  const stopSpin = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const startSpin = () => {
    stopSpin();
    intervalRef.current = setInterval(() => {
      setRandomValue((randomValue) => {
        if (randomValue === 0) {
          console.log("random value 0", beforeElementRef.current);
          beforeElementRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (randomValue === 1) {
          console.log("random value 1", currentElementRef.current);
          setRandomValue(2);
          currentElementRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (randomValue === 2) {
          console.log("random value 2", afterElementRef.current);
          setRandomValue(0);
          afterElementRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        return (randomValue + 1) % 3;
      });

      // setCurrentValue((currentValue) => {
      //   let newValue = Math.floor(Math.random() * symbols.length);
      //   return newValue === currentValue
      //     ? (newValue + 1) % symbols.length
      //     : newValue;
      // });
    }, 2000);
    // }, spinDelay);
  };

  useEffect(() => {
    if (value === -2) {
      return;
    } else if (value === -1) {
      setSpinning(true);
      startSpin();
      return;
    }
    // else, we have value
    // setTimeout(() => {
    //   setSpinning(false);
    //   stopSpin();
    //   setCurrentValue(value);
    //   console.log("set value to", value);
    // }, resultDelay);
  }, [value]);

  return (
    <div className="block">
      <span ref={beforeElementRef}>B</span>
      <span ref={currentElementRef} className={spinning ? "" : "block-done"}>
        {toEmoji(symbols[currentValue])}
      </span>
      <span ref={afterElementRef}>A</span>
    </div>
  );
};

const ITEMS_COUNT = 15000;

const LoopingBlock = forwardRef(function LoopingBlock({ delayMultiplier }, ref) {
  const [offsetIndex, setOffsetIndex] = useState<number>(0);
  const intervalRef = useRef<any>(null);
  const { outerRef, innerRef, items, scrollToItem, scrollTo } = useVirtual<
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
      if(offsetIndex > 10000) {
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
      }, 35 * delayMultiplier);
    },

    stopOn(stopIndex: number) {
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

const Home: NextPage = () => {
  const { user, balance, credit, login, logout, updateCredit } = useAuth();
  const [blocksIndices, setBlocksIndices] = useState([-2, -2, -2]);
  const firstBlockRef = useRef<HTMLDivElement>(null);
  const secondBlockRef = useRef<HTMLDivElement>(null);
  const thirdBlockRef = useRef<HTMLDivElement>(null);

  const handlePlayClicked = () => {
    firstBlockRef.current?.startSpin();
    secondBlockRef.current?.startSpin();
    thirdBlockRef.current?.startSpin();

    // setBlocksIndices([-1, -1, -1]);
    sendRollRequest().then(({ data }) => {
      setTimeout(() => {
        // const newBlocksIndices = blocksIndices.map((_) =>
        //   Math.floor(Math.random() * symbols.length)
        // );
        // setBlocksIndices(newBlocksIndices);
        // setBlocksIndices(data.result);
        console.log("Data", data.result);
        setTimeout(() => {
          firstBlockRef.current?.stopOn(data.result[0]);
        }, 1000);
        setTimeout(() => {
          secondBlockRef.current?.stopOn(data.result[1]);
        }, 2000);
        setTimeout(() => {
          thirdBlockRef.current?.stopOn(data.result[2]);
        }, 3000);
        setTimeout(() => {
          updateCredit(data.credit);
        }, 3000);
      }, 1500);
    });
  };

  useEffect(() => {
    const run = async () => {
      await login();
      console.log("Awaited", credit);
    };
    run();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Jackpot</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Jackpot!</h1>

        <p className={styles.description}>Pricenow coding challenge</p>
        <span>Balance: {balance}</span>
        <span>Credit: {credit}</span>
        <div
          style={{
            fontSize: "3rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          {blocksIndices.map((blockIdx, index) => {
            return (
              <Block
                key={index}
                index={index}
                numberOfBlocks={blocksIndices.length}
                value={blockIdx}
              ></Block>
            );
          })}
        </div>
        <button
          style={{ marginTop: "30px", fontSize: "2rem" }}
          onClick={handlePlayClicked}
        >
          Play
        </button>
        <div className="list-container">
          <LoopingBlock ref={firstBlockRef} delayMultiplier={3} />
          <LoopingBlock ref={secondBlockRef} delayMultiplier={2} />
          <LoopingBlock ref={thirdBlockRef} delayMultiplier={1} />
          <div className="highlighter"></div>
        </div>
        <CashoutButton />
      </main>
    </div>
  );
};

export default Home;
