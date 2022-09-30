import { useRef, useState } from "react";

export function CashoutButton(props: any) {
  const [disabled, setDisabled] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = () => {
    // TODO should they be mutually exclusive?
    const shouldMove = Math.random() < 0.5; // 50% chance
    const shouldDisable = Math.random() < 0.4; // 40% chance
    if (shouldMove) {
      const dir = Math.random() < 0.5 ? "translateX" : "translateY"; // 50% chance of moving in x or y direction
      const amount = 300 * (Math.random() < 0.5 ? -1 : 1); // 50% chance of moving in positive or negative direction
      buttonRef.current?.style.setProperty("transform", `${dir}(${amount}px)`);
    }
    if (shouldDisable) {
      setDisabled(true);
    }
  };
  const handleMouseOut = () => {
    if(props.disabled) return
    setDisabled(false);
  };

  const handleClicked = () => {
    props.onClicked?.()
  };
  return (
    <div
      ref={buttonRef}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="transition-transform duration-500 ease-in-out"
    >
      <button
        className={"btn btn-warning btn-lg " + (props.className || "")}
        disabled={props.disabled || disabled}
        onClick={handleClicked}
      >
        💵 Cashout 💵
      </button>
    </div>
  );
}
