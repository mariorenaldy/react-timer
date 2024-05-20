/* eslint-disable react/prop-types */
export default function TimeInput({ inputRef, focus, hour, minute, second, value, handleClick, spanFocus, handleFocus, handleBlur, handleInput, handleKeyDown }) {
  return (
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
  );
}
