import { default as ReactCountdown } from "react-countdown";
import { useState } from "react";

const Countdown = ({ endDateTime, onCanBreed, totalSupply, isMintTimer = false }) => {
  const [iscompleted, setIsCompleted] = useState(false);
  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <>
        {iscompleted ? (
          <div className="text-2xl font-extrabold text-green-400 md:text-3xl animate-bounce">
            {isMintTimer ? "🚀 MINT IS LIVE!" : "MIU is live!"}
          </div>
        ) : (
          <>
            {!isMintTimer && <h1 className="text-xl text-white">WhiteList End : </h1>}
            <div className="text-2xl font-extrabold text-red-400 md:text-3xl animate-bounce">
              <span className="bg-red-500 bg-opacity-20 px-2 py-1 rounded mx-1">{days}D</span>
              <span className="text-red-300">:</span>
              <span className="bg-red-500 bg-opacity-20 px-2 py-1 rounded mx-1">{hours}H</span>
              <span className="text-red-300">:</span>
              <span className="bg-red-500 bg-opacity-20 px-2 py-1 rounded mx-1">{minutes}M</span>
              <span className="text-red-300">:</span>
              <span className="bg-red-500 bg-opacity-20 px-2 py-1 rounded mx-1">{seconds}S</span>
            </div>
          </>
        )}
      </>
    );
  };

  const update = () => {
    onCanBreed();
    setIsCompleted(true);
  };

  return (
    <ReactCountdown
      date={endDateTime}
      renderer={renderer}
      onComplete={update}
    />
  );
};

export default Countdown;
