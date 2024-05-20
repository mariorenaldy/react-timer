/* eslint-disable react/prop-types */
import Button from "./Button";

export default function ButtonContainer({ running, playing, startTimer, resetTimer, soundChange }) {
  return (
    <div id="button-container" className="noselect">
      <Button id="start-btn" handleClick={startTimer}>
        {running ? "Stop" : playing ? "OK" : "Start"}
      </Button>
      <Button id="reset-btn" handleClick={resetTimer}>
        {"Reset"}
      </Button>
      <Button id="sound-btn" handleClick={soundChange}>
        <img src="assets/images/volume.png" alt="volume" />
      </Button>
    </div>
  );
}
