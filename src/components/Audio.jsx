/* eslint-disable react/prop-types */
export default function Audio({ audioRef, mute }) {
  return (
    <div id="audio-container">
      <audio ref={audioRef} loop style={{ opacity: 1 }} muted={mute ? true : false}>
        <source src={"assets/audios/audio.ogg"} type="audio/ogg" />
        <source src={"assets/audios/audio.mp3"} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
