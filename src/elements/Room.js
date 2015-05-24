/** @jsx React.DOM */
var React = require('react'),
	TurfButton = require("./TurfButton.js");

var Room = React.createClass({
	render: function () {
		var $this = this, turf_i = 0;
		return (
			<div className={"room-wrapper " + (this.props.odd ? "odd" : "even") + (this.props.selected ? " selected" : "")}>
				<div className="room-number">{this.props.roomNumber}</div>
				<div className="occupant">{this.props.room.occupant}</div>
				<div className="turfs-wrapper">
					{ Object.keys(this.props.room.turfs).map(function (turf) {
						turf_i = turf_i + 1;
						if (turf_i <= 3) {
							return (
								<TurfButton 
									key={turf}
									turfType={turf}
									roomNumber={$this.props.roomNumber}
									turfAmount={$this.props.room.turfs[turf]}
									increase={$this.props.increase}
									secondary={$this.props.odd}
									primary={!$this.props.odd}/>
							);
						}
					}) }
				</div>
			</div>
		);
	}
});

module.exports = Room;