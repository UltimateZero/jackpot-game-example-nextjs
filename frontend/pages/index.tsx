import React, { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useAuth } from "../context/AuthContext";
import { sendCashoutRequest, sendRollRequest } from "../lib/get-account";
import { CashoutButton } from "../components/CashoutButton";
import { BlockList } from "../components/BlockList";
import { doConfetti } from "../lib/confetti";
import { useApp } from "../context/AppContext";

const Home: NextPage = () => {
  const { balance, credit, login, updateCredit, updateBalance } = useAuth();
  const { soundEffectsEnabled, toggleSoundEffectsEnabled } = useApp();
  const blockListRef = useRef(null);
  const winAudioRef = useRef<HTMLAudioElement>(null);
  const cheerAudioRef = useRef<HTMLAudioElement>(null);
  const [spinning, setSpinning] = useState(false);

  const handlePlayClicked = () => {
    setSpinning(true);
    blockListRef.current?.spin();
    sendRollRequest().then(({ data }) => {
      setTimeout(() => {
        console.log("Data", data.result);
        blockListRef.current?.stopOn(data.result);
        setTimeout(() => {
          setSpinning(false);
          updateCredit(data.credit);
          if (data.won && soundEffectsEnabled) {
            doConfetti();
            winAudioRef.current?.play();
            cheerAudioRef.current?.play();
          }
        }, 3000);
      }, 1500);
    });
  };

  const handleCashoutClicked = () => {
    sendCashoutRequest().then(({ data }) => {
      updateCredit(data.credit);
      updateBalance(data.balance);
    });
  };

  useEffect(() => {
    const run = async () => {
      await login();
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
        <audio ref={winAudioRef}>
          <source src="/youwin.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <audio ref={cheerAudioRef}>
          <source src="/cheer.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className="form-control absolute top-3 left-3">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Sound Effects</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={soundEffectsEnabled}
              onChange={toggleSoundEffectsEnabled}
            />
          </label>
        </div>
        <h1 className={styles.title}>Jackpot!</h1>

        <span className="text-3xl mt-5">Balance: {balance}</span>
        <span className="text-3xl mt-3">Credit: {credit}</span>

        <div className="flex flex-row flex-wrap items-center gap-6 h-[360px] mt-20">
          <BlockList ref={blockListRef} />

          <button
            className="btn btn-primary btn-lg mt-5 h-full"
            disabled={spinning || credit <= 0}
            onClick={handlePlayClicked}
          >
            🎰 Play 🎰
          </button>
        </div>

        <CashoutButton
          className="mt-8"
          disabled={spinning || credit <= 0}
          onClicked={handleCashoutClicked}
        />
      </main>
    </div>
  );
};

export default Home;
