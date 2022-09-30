import { useRef, useState } from "react";

export function CashoutButton(props: any) {
  const [disabled, setDisabled] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={buttonRef}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="transition-transform duration-500 ease-in-out"
    >
      <button
        className={"btn btn-warning btn-lg " + (props.className || "")}
        disabled={disabled}
        onClick={handleClicked}
      >
        💵 Cashout 💵
      </button>
    </div>
  );
}
