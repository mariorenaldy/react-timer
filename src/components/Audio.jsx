/* eslint-disable react/prop-types */
import audio from "../assets/audios/audio.ogg";
import mp3Audio from "../assets/audios/audio.mp3";

export default function Audio({ audioRef, mute }) {
  return (
    <div id="audio-container">
      <audio ref={audioRef} loop style={{ opacity: 1 }} muted={mute ? true : false}>
        <source src={audio} type="audio/ogg" />
        <source src={mp3Audio} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
