import { useRef, useState } from "react";

export function CashoutButton(props: any) {
  const [disabled, setDisabled] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseOver = () => {
    console.log("hovering");
    const shouldMove = Math.random() < 0.5;
    const shouldDisable = Math.random() < 0.4;
    if (shouldMove) {
        const dir = Math.random() < 0.5 ? "translateX" : "translateY";
        const amount = 300 * (Math.random() < 0.5 ? -1 : 1);
        buttonRef.current?.style.setProperty("transform", `${dir}(${amount}px)`);
    }
    if (shouldDisable) {
      console.log("Disabling");
      setDisabled(true);
    }
  };
  const handleMouseOut = () => {
    console.log("not hovering");
    setDisabled(false);
  };

  const handleClicked = () => {
    console.log("clicked");
  };
  return (
    <button
      ref={buttonRef}
      className="cashout-button"
      disabled={props.disabled}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClicked}
    >
      Cashout
    </button>
  );
}
