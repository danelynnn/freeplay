import "./Player.scss";

import { useCallback, useEffect, useState } from "react";
import React from "react";

import { formatTime } from "utils";
import { ReactComponent as Play } from "img/play.svg";
import { ReactComponent as Pause } from "img/pause.svg";

function logScale(amount: number) {
  return (Math.pow(1.03, amount) - 1) * (100 / (Math.pow(1.03, 100) - 1));
}

const audioElement = new Audio();

function Player(props: { src: string; ended: () => void }) {
  const audioCtx = null;

  const [progress, setProgress] = useState(-1);
  const [duration, setDuration] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [length, setLength] = useState(0);

  const capacityRef = React.createRef<any>();

  // send audio element's ended flag up the chain
  audioElement.addEventListener("ended", props.ended);

  const updateProgress = useCallback(() => {
    if (!audioElement.paused) {
      if (duration == -1) setDuration(audioElement.duration);
      setProgress(audioElement.currentTime);
      requestAnimationFrame(updateProgress);
    }
  }, []);

  const updateVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    audioElement.volume = logScale(parseInt(input)) / 100;
  }, []);

  const togglePause = useCallback(() => {
    if (audioElement.paused) {
      audioElement.play();
      requestAnimationFrame(updateProgress);
      setPaused(false);
    } else {
      audioElement.pause();
      setPaused(true);
    }
  }, []);

  // on mount, update recorded length based on length of element
  useEffect(() => {
    const capacityLength = getComputedStyle(capacityRef.current)?.width;
    setLength(parseInt(capacityLength));
  }, []);

  // on change url, play it
  useEffect(() => {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = props.src;
    try {
      audioElement.play();
    } catch (e) {
      console.log(e);
    }
    requestAnimationFrame(updateProgress);
  }, [props.src]);

  return (
    <div className="player">
      <div className="progressbar">
        <div style={{ flex: "0 0 128px" }}>{formatTime(progress)}</div>
        <div ref={capacityRef} className="capacity">
          <div
            className="progress"
            style={{
              width: (progress / duration) * length,
            }}
          />
        </div>
        <div style={{ flex: "0 0 128px", textAlign: "right" }}>
          {formatTime(duration)}
        </div>
      </div>
      <div className="controls">
        <div className="play" onClick={togglePause}>
          {paused ? (
            <Play className="hover" height={25} />
          ) : (
            <Pause className="hover" height={25} />
          )}
        </div>
        <input type="range" onChange={updateVolume} min={0} max={100} />
      </div>
    </div>
  );
}

export default Player;
