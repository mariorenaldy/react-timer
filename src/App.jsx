import { useState, useEffect, useRef } from "react";
import audio from "./assets/audio.ogg";
import mp3Audio from "./assets/audio.mp3";
import "./App.css";
import "./js/HackTimer";

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
  const [spanFocus, setSpanFocus] = useState(new Array(5).fill(false));
  const [mute, setMute] = useState(false);

  const intervalRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  function handleKeyDown(event) {
    if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
      event.preventDefault();
    }

    if (event.key === "ArrowLeft") {
      let inputPos = event.currentTarget.selectionStart;
      let length = inputRef.current.value.length;
      if (inputPos == 0 || (length == 6 && inputPos == 1)) {
        return;
      }
      inputPos = inputPos - 1;
      const spanFocus_new = new Array(6).fill(false);
      spanFocus_new[length - inputPos] = true;
      setSpanFocus(spanFocus_new);
      inputRef.current.setSelectionRange(inputPos, inputPos);
    } else if (event.key === "ArrowRight") {
      let inputPos = event.currentTarget.selectionStart;
      let length = inputRef.current.value.length;
      if (inputPos == length) {
        return;
      }
      inputPos = inputPos + 1;
      const spanFocus_new = new Array(6).fill(false);
      spanFocus_new[length - inputPos] = true;
      setSpanFocus(spanFocus_new);
      inputRef.current.setSelectionRange(inputPos, inputPos);
    } else if (event.key === "ArrowUp") {
      let inputPos = 0;
      let length = inputRef.current.value.length;
      if (length == 6) {
        inputPos = 1;
      }
      const spanFocus_new = new Array(6).fill(false);
      spanFocus_new[length - inputPos] = true;
      setSpanFocus(spanFocus_new);
      inputRef.current.setSelectionRange(inputPos, inputPos);
    } else if (event.key === "ArrowDown") {
      let inputPos = inputRef.current.value.length;
      const spanFocus_new = new Array(6).fill(false);
      spanFocus_new[0] = true;
      setSpanFocus(spanFocus_new);
      inputRef.current.setSelectionRange(inputPos, inputPos);
    }
  }

  function convertToTwoDigit(time) {
    if (String(time).length > 1) {
      return String(time);
    } else {
      return "0" + String(time);
    }
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        if (second > 0) {
          setSecond(convertToTwoDigit(second - 1));
          if (hour == 0) {
            document.title = convertToTwoDigit(minute) + ":" + convertToTwoDigit(second - 1);
          } else {
            document.title = convertToTwoDigit(hour) + ":" + convertToTwoDigit(minute) + ":" + convertToTwoDigit(second - 1);
          }
        } else if (minute > 0) {
          setMinute(convertToTwoDigit(minute - 1));
          setSecond(59);
          if (hour == 0) {
            document.title = convertToTwoDigit(minute - 1) + ":59";
          } else {
            document.title = convertToTwoDigit(hour) + convertToTwoDigit(minute - 1) + ":59";
          }
        } else if (hour > 0) {
          setHour(convertToTwoDigit(hour - 1));
          setMinute(59);
          setSecond(59);

          if (hour - 1 == 0) {
            document.title = "59" + ":59";
          } else {
            document.title = convertToTwoDigit(hour - 1) + ":59" + ":59";
          }
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
    if (focus) {
      setFocus(false);
      checkTime();
    }

    if (!running && second == 0 && minute == 0 && hour == 0) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      setRunning(!running);
    }
  }

  function resetTimer() {
    if (focus) {
      setFocus(false);
      checkTime();
    } else {
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

      if (prevHour == 0 && prevMinute == 0 && prevSecond == 0) {
        document.title = "Timer";
      } else if (prevHour == 0) {
        document.title = prevMinute + ":" + prevSecond;
      } else {
        document.title = prevHour + ":" + prevMinute + ":" + prevSecond;
      }
    }
  }

  function handleFocus(inputRef) {
    if (running) {
      setRunning(false);
    }
    inputRef.current.focus();
    if (!focus) {
      const spanFocus_new = [true, ...Array(5).fill(false)];
      setSpanFocus(spanFocus_new);

      setValue("");
      setFocus(true);
    }
  }

  function handleBlur(target, inputRef) {
    if (target == null) {
      const spanFocus_new = new Array(6).fill(false);
      setSpanFocus(spanFocus_new);

      inputRef.current.blur();
      setFocus(false);

      checkTime();
    }
  }

  function checkTime() {
    let checkSecond = parseInt(second);
    let checkMinute = parseInt(minute);
    let checkHour = parseInt(hour);
    if (checkSecond > 59) {
      if (checkMinute > 59 && checkHour == 99) {
        checkSecond = 59;
        checkMinute = 59;
      } else {
        checkSecond = checkSecond - 60;
        checkMinute = checkMinute + 1;
      }
      setSecond(convertToTwoDigit(checkSecond));
      setMinute(convertToTwoDigit(checkMinute));
    }
    if (checkMinute > 59) {
      if (checkHour == 99) {
        checkSecond = 59;
        checkMinute = 59;
        setSecond(convertToTwoDigit(checkSecond));
        setMinute(convertToTwoDigit(checkMinute));
      } else {
        checkMinute = checkMinute - 60;
        checkHour = checkHour + 1;
        setMinute(convertToTwoDigit(checkMinute));
        setHour(convertToTwoDigit(checkHour));
      }
    }
    if (checkHour > 99) {
      checkHour = 99;
      setHour(convertToTwoDigit(checkHour));
    }

    if (checkHour == 0 && checkMinute == 0 && checkSecond == 0) {
      document.title = "Timer";
    } else if (checkHour == 0) {
      document.title = convertToTwoDigit(checkMinute) + ":" + convertToTwoDigit(checkSecond);
    } else {
      document.title = convertToTwoDigit(checkHour) + ":" + convertToTwoDigit(checkMinute) + ":" + convertToTwoDigit(checkSecond);
    }

    setPrevSecond(convertToTwoDigit(checkSecond));
    setPrevMinute(convertToTwoDigit(checkMinute));
    setPrevHour(convertToTwoDigit(checkHour));
  }

  function handleClick(spanNum) {
    const pos = value.length - spanNum;
    const spanFocus_new = new Array(6).fill(false);
    spanFocus_new[spanNum] = true;
    setSpanFocus(spanFocus_new);
    inputRef.current.setSelectionRange(pos, pos);
  }

  function handleInput(value) {
    if (value.length > 6) {
      value = value.substring(1);
      let pos = inputRef.current.selectionStart - 1;
      setTimeout(function () {
        inputRef.current.setSelectionRange(pos, pos);
      }, 0);
    }

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

  function soundChange(event) {
    if (mute) {
      event.target.src = "/src/assets/volume.png";
      setMute(false);
    } else {
      event.target.src = "/src/assets/mute.png";
      setMute(true);
    }
  }

  return (
    <>
      <h1 id="title" className="noselect">
        REACT{" "}
        <span className="animate-character">
          TIME
          <span id="timer-r">R</span>
        </span>
      </h1>

      <div id="widget-container">
        <div id="time-container" tabIndex={-1} onFocus={() => handleFocus(inputRef)} style={{ cursor: "pointer", position: "relative" }}>
          <span onClick={() => (value.length > 4 ? handleClick(5) : undefined)} className={"time-digit" + (spanFocus[5] && focus ? " time-cursor" : "") + (focus && String(hour).charAt(0) !== value.substring(value.length - 6, value.length - 5) ? " time-unsure" : "")} style={{ display: !focus && String(hour).charAt(0) == 0 ? "none" : "inline" }}>
            {String(hour).charAt(0)}
          </span>
          <span onClick={() => (value.length > 3 ? handleClick(4) : undefined)} className={"time-digit" + (spanFocus[4] && focus ? " time-cursor" : "") + (focus && String(hour).charAt(1) !== value.substring(value.length - 5, value.length - 4) ? " time-unsure" : "")} style={{ display: !focus && hour == 0 ? "none" : "inline" }}>
            {String(hour).charAt(1)}
          </span>
          <span className={"time-separator" + (focus && value.substring(value.length - 6, value.length - 4) == "" ? " time-unsure" : "")} style={{ display: !focus && hour == 0 ? "none" : "inline" }}>
            h
          </span>
          <span onClick={() => (value.length > 2 ? handleClick(3) : undefined)} className={"time-digit" + (spanFocus[3] && focus ? " time-cursor" : "") + (focus && String(minute).charAt(0) !== value.substring(value.length - 4, value.length - 3) ? " time-unsure" : "")} style={{ display: !focus && String(minute).charAt(0) == 0 && hour == 0 ? "none" : "inline" }}>
            {String(minute).charAt(0)}
          </span>
          <span onClick={() => (value.length > 1 ? handleClick(2) : undefined)} className={"time-digit" + (spanFocus[2] && focus ? " time-cursor" : "") + (focus && String(minute).charAt(1) !== value.substring(value.length - 3, value.length - 2) ? " time-unsure" : "")} style={{ display: !focus && minute == 0 && hour == 0 ? "none" : "inline" }}>
            {String(minute).charAt(1)}
          </span>
          <span className={"time-separator" + (focus && value.substring(value.length - 4, value.length - 2) == "" ? " time-unsure" : "")} style={{ display: !focus && minute == 0 && hour == 0 ? "none" : "inline" }}>
            m
          </span>
          <span onClick={() => (value.length > 0 ? handleClick(1) : undefined)} className={"time-digit" + (spanFocus[1] && focus ? " time-cursor" : "") + (focus && String(second).charAt(0) !== value.substring(value.length - 2, value.length - 1) ? " time-unsure" : "")} style={{ display: !focus && String(second).charAt(0) == 0 && minute == 0 && hour == 0 ? "none" : "inline" }}>
            {String(second).charAt(0)}
          </span>
          <span onClick={() => (value.length > 0 ? handleClick(0) : undefined)} className={"time-digit" + (spanFocus[0] && focus ? " time-cursor" : "") + (focus && String(second).charAt(1) !== value.substring(value.length - 1, value.length) ? " time-unsure" : "")}>
            {String(second).charAt(1)}
          </span>
          <span className={"time-separator" + (focus && value == "" ? " time-unsure" : "")} style={{ paddingRight: 0 }}>
            s
          </span>
          <input ref={inputRef} value={value} type="text" onBlur={() => handleBlur(event.relatedTarget, inputRef)} onInput={(event) => handleInput(event.target.value)} onKeyDown={(event) => handleKeyDown(event)} style={{ width: 0, height: 0, position: "absolute", cursor: "pointer", opacity: 0 }} />
        </div>
        <div id="button-container" className="noselect">
          <button onClick={startTimer} id="start-btn" className="button">
            {running ? "Stop" : playing ? "OK" : "Start"}
          </button>
          <button onClick={resetTimer} id="reset-btn" className="button">
            Reset
          </button>
          <button id="sound-btn" onClick={() => soundChange(event)}>
            <img src="/src/assets/volume.png" alt="volume" />
          </button>
        </div>
        <div id="audio-container">
          <audio ref={audioRef} loop style={{ opacity: 1 }} muted={mute ? true : false}>
            <source src={audio} type="audio/ogg" />
            <source src={mp3Audio} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </>
  );
}
