/** @jsx React.DOM */
var React = require('react'),
	mui = require("material-ui"),
	FlatButton = mui.FlatButton;

var KeyboardControl = React.createClass({
	getInitialState: function () {
		return {
			state: "enter room:",
			text: "",
			class: ""
		}
	},
	render: function () {
		return (
			<FlatButton id="keyboard-ctl" primary={this.state.class === "error"} secondary={this.state.class === "selected"} label={ this.state.state + " " + this.state.text}/>
		);
	},
	componentDidMount: function () {
		var $this = this;
		document.querySelector("#main-wrapper").focus();
		document.querySelector("#main-wrapper").addEventListener("keydown", function (key) {
			if (key.keyCode === 8) {
				key.preventDefault();
			}
			$this.props.unsetBlackscreen();
			if ($this.state.state === "enter room:") {
				if ((key.keyCode >= 48 && key.keyCode <= 57) || (key.keyCode >= 96 && key.keyCode <= 105)) {
					key.preventDefault();
					var c = String.fromCharCode(key.keyCode);
					if (key.keyCode >= 96 && key.keyCode <= 105) {
						c = String.fromCharCode(key.keyCode - 48);
					}
					$this.setState({
						text: $this.state.text + c,
						class: ""
					});
				} else if (key.keyCode === 13) {
					key.preventDefault();
					if ($this.props.config.rooms[$this.state.text]) {
						$this.setState({
							state: "enter turf",
							class: "selected"
						});
						$this.props.selectRoom($this.state.text);
					} else {
						$this.setState({
							state: "enter room:",
							class: "error",
							text: ""
						});
						$this.props.selectRoom($this.state.text);
					}
				} else if (key.keyCode === 8) {
					key.preventDefault();
					$this.setState({
						text: "",
						class: ""
					});
					$this.props.selectRoom($this.state.text);
					$this.props.setBlackscreen();
				}
			} else if ($this.state.state === "enter turf") {
				var drinks = Object.keys($this.props.config.drinks);
				if (key.keyCode === 111 && drinks[0]) {
					key.preventDefault();
					$this.props.increase($this.state.text, drinks[0]);
					$this.setState({
						class: "selected"
					});
				} else if (key.keyCode === 106 && drinks[1]) {
					key.preventDefault();
					$this.props.increase($this.state.text, drinks[1]);
					$this.setState({
						class: "selected"
					});
				} else if (key.keyCode === 107 && drinks[2]) {
					key.preventDefault();
					$this.props.increase($this.state.text, drinks[2]);
					$this.setState({
						class: "selected"
					});
				} else if (key.keyCode === 13) {
					key.preventDefault();
					$this.setState({
						state: "enter room:",
						class: "",
						text: ""
					});
					$this.props.selectRoom($this.state.text);
				}
			}
			
		}, true);
	}
});

module.exports = KeyboardControl;