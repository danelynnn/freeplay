import React from "react";
import "./Player.scss";

class Player extends React.Component<any, any> {
  state = {
    audioElement: new Audio(),
    audioCtx: new AudioContext(),
    progress: 0,
    length: 0,
  };
  capacityRef: any;

  constructor(props: any) {
    super(props);
    this.start = this.start.bind(this);
    this.ended = this.ended.bind(this);
    this.capacityRef = React.createRef();
  }

  componentDidMount(): void {
    this.state.audioElement.src =
      "https://download.samplelib.com/mp3/sample-3s.mp3";
    this.state.audioElement.addEventListener("timeupdate", (e) => {
      this.setState({
        progress:
          this.state.audioElement.currentTime /
          this.state.audioElement.duration,
      });
    });

    const capacityLength = getComputedStyle(this.capacityRef.current).width;
    this.setState({ length: parseInt(capacityLength) });
    this.state.audioElement.addEventListener("ended", this.ended);
  }

  start(): void {
    this.state.audioElement.play();
  }

  ended(): void {
    this.state.audioElement.src =
      "https://download.samplelib.com/mp3/sample-3s.mp3";
    this.state.audioElement.play();
  }

  render(): React.ReactNode {
    return (
      <div>
        <button onClick={this.start}>start</button>
        <div className="progressbar">
          {this.state.progress}
          {this.state.length}
          <div ref={this.capacityRef} className="capacity">
            <div
              className="progress"
              style={{ width: this.state.progress * this.state.length }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
