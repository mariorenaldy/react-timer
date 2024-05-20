/* eslint-disable react/prop-types */
export default function Button({ id, handleClick, children }) {
  return (
    <button id={id} onClick={handleClick} className={id == "sound-btn" ? "" : "button"}>
      {children}
    </button>
  );
}
