import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const accurateInterval = require('accurate-interval');
const audio = new Audio("https://www.myinstants.com/media/sounds/alarm.mp3");

/**
 * Header
 */
class Header extends Component  {
    render() {
        return (
            <div id="header">
                <h1 id="title">Pomodoro Clock</h1>
                <div>
                    <p id="session-label">Session Length</p>
                    <i id="session-increment" className="fas fa-angle-up" onClick={this.props.increaseSession}></i>
                    <p id="session-length" style={{ display: 'inline-block' }}>{this.props.sessionlength}</p>
                    <i id="session-decrement" className="fas fa-angle-down" onClick={this.props.decreaseSession}></i>
                </div>
                <div>
                    <p id="break-label">Break Length</p>
                    <i id="break-increment" className="fas fa-angle-up" onClick={this.props.increaseBreak}></i>
                    <p id="break-length" style={{ display: 'inline-block' }}>{this.props.breaklength}</p>
                    <i id="break-decrement" className="fas fa-angle-down" onClick={this.props.decreaseBreak}></i>
                </div>
            </div>
        )
    }
}

/**
 * Progress Bar
  */
const Bar = () => {
    return (
        <div id="bar"></div>
    )
}

/**
 * Timer
 */
class Timer extends Component {
    render() {
        return(
            <div id="timer">
                <h2 id="timer-label">{this.props.timerlabel}</h2>
                <div id="time-left">{this.props.clock}</div>
                <div id="timer-controls">
                    <i id="start_stop" className="fas fa-play" onClick={this.props.startstop}></i>
                    <i id="reset" className="fas fa-retweet" onClick={this.props.reset}></i>
                </div>
            </div>
        )
    }
}

/**
 * Footer
 */
const Footer = () => {
    return (
        <footer>
            <p>Design and Code by <a href="http://seanmurphy.eu" target="_blank" rel="noopener noreferrer">Sean Murphy</a></p>
        </footer>
    )
}


/**
 * Return Element
 */
class App extends Component {

    constructor() {
        super();

        this.state = {
            sessionlength: 25,
            breaklength: 5,
            time: 25,
            clock: '25:00',
            interval: '',
            label: 'Session',
            running: false,
            convert: true
        }

        this.increaseSession = this.increaseSession.bind(this);
        this.decreaseSession = this.decreaseSession.bind(this);
        this.increaseBreak = this.increaseBreak.bind(this);
        this.decreaseBreak = this.decreaseBreak.bind(this);
        this.timer = this.timer.bind(this);
        this.startstop = this.startstop.bind(this);
        this.reset = this.reset.bind(this);
    }

    /**
     * Length Methods
     */
    increaseSession() {
        if (this.state.sessionlength === 60 | this.state.running === true) return false;
        this.setState({
            sessionlength: this.state.sessionlength + 1,
            time: this.state.sessionlength + 1,
            clock: `${this.state.sessionlength + 1}:00`
        })
    }
    decreaseSession() {
        if (this.state.sessionlength === 1 | this.state.running === true) return false;
        this.setState({
            sessionlength: this.state.sessionlength - 1,
            time: this.state.sessionlength - 1,
            clock: `${this.state.sessionlength - 1}:00`
        })
    }
    increaseBreak() {
        if (this.state.breaklength === 60 | this.state.running === true) return false;
        this.setState({
            breaklength: this.state.breaklength + 1,
        })
    }
    decreaseBreak() {
        if (this.state.breaklength === 1 | this.state.running === true) return false;
        this.setState({
            breaklength: this.state.breaklength - 1,
        })
    }

    /**
     * Timer Methods
      */
     timer() {
        let time = this.state.time;

        // Check if its a Break
        if (time === 0 && this.state.label === 'Session') {
            this.audio.play();
            this.setState({
                label: 'Break',
                time: this.state.breaklength,
                clock: `${this.state.breaklength}:00`,
                convert: true
            })
            return false;
        }

        // Check if Break is Finished
        if (time === 0 && this.state.label === 'Break') {
            this.audio.play();
            this.setState({
                label: 'Session',
                time: this.state.sessionlength,
                clock: `${this.state.sessionlength}:00`,
                convert: true
            })
            return false;
        }

        // Convert to millisecs if not done
        if (this.state.convert === true) {
            time = ((this.state.time * 60) * 1000); 
        }

        time -= 1000;
        let seconds = (time / 1000) % 60;
        let minutes = Math.floor(((time - seconds) / 1000) / 60);

        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        // Set the Current State
        this.setState({
            time: time,
            seconds: seconds,
            clock: `${minutes}:${seconds}`,
            convert: false
        })
        
     }

     startstop() {
        if (this.state.running === false) {
            let pause = document.querySelector('#start_stop');
            pause.className = 'fas fa-pause';
            this.setState({
                running: true,
                interval: accurateInterval(() => {
                    this.timer();
                }, 1000, { aligned: true, immediate: true })
            })
        }
        else {
            this.state.interval.clear();
            let start = document.querySelector('#start_stop');
            start.className = 'fas fa-play';
            this.setState({
                running: false,
            })
        }
     }

     reset() {
        if (this.state.running === true) {
            this.state.interval.clear();
        }
        this.audio.pause()
        this.audio.currentTime = 0;
        this.setState({
            sessionlength: 25,
            breaklength: 5,
            time: 25,
            clock: '25:00',
            label: 'Session',
            running: false,
            convert: true,
        })
     }

    render() {
        return (
            <div>
                <Header 
                    sessionlength={this.state.sessionlength} breaklength={this.state.breaklength} 
                    decreaseBreak={this.decreaseBreak}  increaseBreak={this.increaseBreak} 
                    decreaseSession={this.decreaseSession} increaseSession={this.increaseSession} 
                />
                <Bar />
                <Timer 
                    timerlabel={this.state.label}
                    clock={this.state.clock}
                    startstop={this.startstop}
                    reset={this.reset}
                />
                <Footer />
                <audio id="beep" src="https://www.myinstants.com/media/sounds/alarm.mp3" ref={(audio) => { this.audio = audio; }}></audio>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
