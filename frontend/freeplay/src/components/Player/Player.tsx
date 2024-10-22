import React from "react";
import "./Player.scss";
import { formatTime } from "utils";
import { ReactComponent as Play } from "img/play.svg";

class Player extends React.Component<any, any> {
  state = {
    audioElement: new Audio(),
    audioCtx: new AudioContext(),
    progress: -1,
    duration: -1,
    length: 0,
  };
  capacityRef: any;

  constructor(props: any) {
    super(props);
    this.capacityRef = React.createRef();
  }

  componentDidMount(): void {
    console.log("player mounted", this.props.src);
    this.state.audioElement.addEventListener("timeupdate", (e) => {
      this.setState({ progress: this.state.audioElement.currentTime });
      this.setState({ duration: this.state.audioElement.duration });
    });
    this.state.audioElement.addEventListener("ended", this.props.ended);

    const capacityLength = getComputedStyle(this.capacityRef.current).width;
    this.setState({ length: parseInt(capacityLength) });
  }

  componentDidUpdate(prevProps: Readonly<any>): void {
    if (this.props.src !== prevProps.src) {
      console.log("playing", this.props.src);
      this.state.audioElement.src = this.props.src;
      try {
        this.state.audioElement.play();
      } catch (e) {
        console.log(e);
      }
    }
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
          <div>
            <Play width={20} />
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
