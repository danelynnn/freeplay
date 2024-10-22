import React from "react";
import "./Player.scss";
import { formatTime } from "utils";
import { ReactComponent as Play } from "img/play.svg";
import { ReactComponent as Pause } from "img/pause.svg";

class Player extends React.Component<any, any> {
  audioElement: any;
  audioCtx: any;

  state = {
    progress: -1,
    duration: -1,
    paused: false,
    volume: 100,
    length: 0,
  };
  capacityRef: any;

  constructor(props: any) {
    super(props);
    this.audioElement = new Audio();
    this.capacityRef = React.createRef();
    this.updateProgress = this.updateProgress.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.updateVolume = this.updateVolume.bind(this);
  }

  componentDidMount(): void {
    console.log("player mounted", this.props.src);
    this.audioElement.addEventListener("ended", this.props.ended);

    const capacityLength = getComputedStyle(this.capacityRef.current).width;
    this.setState({ length: parseInt(capacityLength) });
  }

  updateProgress() {
    if (!this.audioElement.paused) {
      this.state.duration = this.audioElement.duration;
      this.setState({ progress: this.audioElement.currentTime });
      requestAnimationFrame(this.updateProgress);
    }
  }

  componentDidUpdate(prevProps: Readonly<any>): void {
    if (this.props.src !== prevProps.src) {
      console.log("playing", this.props.src);
      this.audioElement.src = this.props.src;

      try {
        this.audioElement.play();
      } catch (e) {
        console.log(e);
      }
      requestAnimationFrame(this.updateProgress);
    }
  }

  togglePause() {
    if (this.audioElement.paused) {
      this.audioElement.play();
      requestAnimationFrame(this.updateProgress);
      this.setState({ paused: false });
    } else {
      this.audioElement.pause();
      this.setState({ paused: true });
    }
  }

  logScale(amount: number) {
    return (Math.pow(1.03, amount) - 1) * (100 / (Math.pow(1.03, 100) - 1));
  }

  updateVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    this.audioElement.volume = this.logScale(parseInt(input)) / 100;
    this.setState({ volume: input });
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className="progressbar">
          <div style={{ flex: "0 0 128px" }}>
            {formatTime(this.state.progress)}
          </div>
          <div ref={this.capacityRef} className="capacity">
            <div
              className="progress"
              style={{
                width:
                  (this.state.progress / this.state.duration) *
                  this.state.length,
              }}
            />
          </div>
          <div style={{ flex: "0 0 128px" }}>
            {formatTime(this.state.duration)}
          </div>
        </div>
        <div className="controls">
          <div className="play" onClick={this.togglePause}>
            {this.audioElement.paused ? (
              <Play className="hover" height={25} />
            ) : (
              <Pause className="hover" height={25} />
            )}
          </div>
          <input
            type="range"
            onChange={this.updateVolume}
            min={0}
            max={100}
            value={this.state.volume}
          />
        </div>
      </div>
    );
  }
}

export default Player;
