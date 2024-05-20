import { useState, useRef, useEffect } from "react";
import "../utils/HackTimer";
import "../styles/TimeWidget.css";
import TimeInput from "./TimeInput";
import ButtonContainer from "./ButtonContainer";
import Audio from "./Audio";

export default function TimeWidget() {
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

  function soundChange(event) {
    if (mute) {
      event.target.src = "assets/images/volume.png";
      setMute(false);
    } else {
      event.target.src = "assets/images/mute.png";
      setMute(true);
    }
  }

  return (
    <div id="widget-container">
      <TimeInput inputRef={inputRef} focus={focus} hour={hour} minute={minute} second={second} value={value} spanFocus={spanFocus} handleKeyDown={handleKeyDown} handleFocus={handleFocus} handleBlur={handleBlur} handleClick={handleClick} handleInput={handleInput} />
      <ButtonContainer running={running} playing={playing} startTimer={startTimer} resetTimer={resetTimer} soundChange={soundChange} />
      <Audio audioRef={audioRef} mute={mute} />
    </div>
  );
}
