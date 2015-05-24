/** @jsx React.DOM */
var React = require('react'),
	FlatButton = require("material-ui").FlatButton;

var Room = React.createClass({
	render: function () {
		var $this = this;
		return (
			<FlatButton className="turf-button" onClick={this.increase} secondary={this.props.secondary ? true : false} primary={this.props.primary ? true : false}>
				<div className="turf-type">{this.props.turfType}</div>
				<div className="turf-amount">{$this.props.turfAmount}</div>
			</FlatButton>
		);
	},
	increase: function () {
		this.props.increase(this.props.roomNumber, this.props.turfType);
	}
});

module.exports = Room;