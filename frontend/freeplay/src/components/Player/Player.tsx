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
    this.capacityRef = React.createRef();
  }

  componentDidMount(): void {
    this.state.audioElement.addEventListener("timeupdate", (e) => {
      this.setState({
        progress:
          this.state.audioElement.currentTime /
            this.state.audioElement.duration || 0,
      });
    });

    const capacityLength = getComputedStyle(this.capacityRef.current).width;
    this.setState({ length: parseInt(capacityLength) });
    this.state.audioElement.addEventListener("ended", this.props.ended);
  }

  componentDidUpdate(prevProps: Readonly<any>): void {
    if (this.props.src != prevProps.src) {
      console.log("playing new song");
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
          <div style={{ flex: "0 0 100px" }}>
            {this.state.audioElement.currentTime}
          </div>
          <div ref={this.capacityRef} className="capacity">
            <div
              className="progress"
              style={{ width: this.state.progress * this.state.length }}
            ></div>
          </div>
          <div style={{ flex: "0 0 100px" }}>
            {this.state.audioElement.duration}
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
