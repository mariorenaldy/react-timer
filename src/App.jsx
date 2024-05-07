import { useState, useEffect, useRef } from "react";
import sandglass from "./assets/sandglass.png";
import audio from "./assets/audio.ogg";
import mp3Audio from "./assets/audio.mp3";
import "./App.css";

export default function App() {
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("05");
  const [hour, setHour] = useState("00");
  const [prevSecond, setPrevSecond] = useState("00");
  const [prevMinute, setPrevMinute] = useState("05");
  const [prevHour, setPrevHour] = useState("00");
  const [value, setValue] = useState("");
  const [running, setRunning] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [focus, setFocus] = useState(false);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  function formatNumber(event) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        if (second > 0) {
          if (second - 1 < 10) {
            setSecond("0" + String(second - 1));
          } else {
            setSecond(second - 1);
          }
        } else if (minute > 0) {
          if (minute - 1 < 10) {
            setMinute("0" + String(minute - 1));
          } else {
            setMinute(minute - 1);
          }
          setSecond(59);
        } else if (hour > 0) {
          setHour(hour - 1);
          setMinute(59);
          setSecond(59);
        } else {
          audioRef.current.play();
          setPlaying(true);
          clearInterval(intervalRef.current);
          setRunning(false);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running, second, minute, hour]);

  function startTimer() {
    if (!running && second == 0 && minute == 0 && hour == 0) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      setRunning(!running);
    }
  }

  function resetTimer() {
    if (running) {
      setRunning(!running);
    } else if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    }
    setSecond(prevSecond);
    setMinute(prevMinute);
    setHour(prevHour);
  }

  function handleFocus(inputRef) {
    inputRef.current.focus();
  }

  function handleInput(value) {
    const text = value;
    setValue(value);
    let second = text.substring(text.length - 2, text.length);
    let minute = text.substring(text.length - 4, text.length - 2);
    let hour = text.substring(text.length - 6, text.length - 4);

    if (second == "") {
      second = "00";
    }
    if (minute == "") {
      minute = "00";
    }
    if (hour == "") {
      hour = "00";
    }

    if (second.length == 1) {
      second = "0" + second;
    }
    if (minute.length == 1) {
      minute = "0" + minute;
    }
    if (hour.length == 1) {
      hour = "0" + hour;
    }

    setSecond(second);
    setMinute(minute);
    setHour(hour);
    setPrevSecond(second);
    setPrevMinute(minute);
    setPrevHour(hour);
  }

  return (
    <>
      <div>
        <img src={sandglass} id="sandglass" alt="Sandglass" />
      </div>
      <h1>Timer</h1>
      <div id="widget-container">
        <div
          id="time-container"
          onClick={() => {
            handleFocus(inputRef);
          }}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <span className={"time-digit" + (focus && String(hour).charAt(0) !== value.substring(value.length - 6, value.length - 5) ? " time-unsure" : "")} style={{ display: !focus && String(hour).charAt(0) == 0 ? "none" : "inline" }}>
            {String(hour).charAt(0)}
          </span>
          <span className={"time-digit" + (focus && String(hour).charAt(1) !== value.substring(value.length - 5, value.length - 4) ? " time-unsure" : "")} style={{ display: !focus && hour == 0 ? "none" : "inline" }}>
            {String(hour).charAt(1)}
          </span>
          <span className={"time-separator" + (focus && value.substring(value.length - 6, value.length - 4) == "" ? " time-unsure" : "")} style={{ display: !focus && hour == 0 ? "none" : "inline" }}>
            h
          </span>
          <span className={"time-digit" + (focus && String(minute).charAt(0) !== value.substring(value.length - 4, value.length - 3) ? " time-unsure" : "")} style={{ display: !focus && String(minute).charAt(0) == 0 && hour == 0 ? "none" : "inline" }}>
            {String(minute).charAt(0)}
          </span>
          <span className={"time-digit" + (focus && String(minute).charAt(1) !== value.substring(value.length - 3, value.length - 2) ? " time-unsure" : "")} style={{ display: !focus && minute == 0 && hour == 0 ? "none" : "inline" }}>
            {String(minute).charAt(1)}
          </span>
          <span className={"time-separator" + (focus && value.substring(value.length - 4, value.length - 2) == "" ? " time-unsure" : "")} style={{ display: !focus && minute == 0 && hour == 0 ? "none" : "inline" }}>
            m
          </span>
          <span className={"time-digit" + (focus && String(second).charAt(0) !== value.substring(value.length - 2, value.length - 1) ? " time-unsure" : "")} style={{ display: !focus && String(second).charAt(0) == 0 && minute == 0 ? "none" : "inline" }}>
            {String(second).charAt(0)}
          </span>
          <span className={"time-digit" + (focus ? " time-cursor" : "") + (focus && String(second).charAt(1) !== value.substring(value.length - 1, value.length) ? " time-unsure" : "")}>{String(second).charAt(1)}</span>
          <span className={"time-separator" + (focus && value == "" ? " time-unsure" : "")} style={{ paddingRight: 0 }}>
            s
          </span>
          {/* <input ref={inputRef} value={value} type="text" onFocus={() => (setValue(""), setFocus(true))} onBlur={() => setFocus(false)} onInput={() => handleInput(event.target.value)} onKeyPress={(event) => formatNumber(event)} style={{ width: 0, height: 0, position: "absolute", cursor: "pointer", opacity: 0 }} /> */}
          <input ref={inputRef} value={value} type="text" onFocus={() => (setValue(""), setFocus(true))} onBlur={() => setFocus(false)} onInput={() => handleInput(event.target.value)} onKeyPress={(event) => formatNumber(event)} style={{ width: 0, height: 0, position: "absolute", cursor: "pointer", opacity: 0 }} />
        </div>
        <div id="button-container">
          <button onClick={startTimer} id="start-btn" className="button">
            {running ? "Stop" : playing ? "OK" : "Start"}
          </button>
          <button onClick={resetTimer} id="reset-btn" className="button">
            Reset
          </button>
          {/* <button id="sound-btn">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAGFBMVEVMaXEAAAAAAAAAAAAAAAAAAAAAAAAAAACrC2ehAAAACHRSTlMA2IAX/16rO6dkyYQAAACdSURBVHgB3ZI1EgJhGEMfXuI1egDsAEhYWjgD26P3xz3M/P2+NvNpQiKp9PiP6uCkQVrjdGGlSc8LBHRV9QIBBU28QABHNa1A3EoWViAA4sgKxBIYqfdbIKIe5NX8LRAqQUElXugOmgK1GS6oB/ECXFhCdw4uNMNCuJUP93XDB9pL7Ilbf6K93YzKaRaw1sIQhePjgQtH1ENt1EkcZynLNG+pHaRaAAAAAElFTkSuQmCC" alt="" />
          </button> */}
        </div>
        <div id="audio-container">
          <audio ref={audioRef} loop style={{ opacity: 1 }}>
            <source src={audio} type="audio/ogg" />
            <source src={mp3Audio} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </>
  );
}
