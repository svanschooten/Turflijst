/** @jsx React.DOM */
var React = require('react'),
	Room = require("./Room.js"),
	Management = require("./Management.js"),
	Graphs = require("./Graphs.js"),
	request = require("request");

var gupdate = {
		"room": "room",
		"type": "type",
		"occupant": "",
		"idx": -1
	};

var Main = React.createClass({
	getInitialState: function () {
		var cfg, $this = this;
		request("http://localhost:8080/config", function (error, response, body) {
			if (error) {
				throw error;
			} else {
				if (response.statusCode !== 200) {
					console.error(response);
				} else {
					$this.setState({config: JSON.parse(body)});
				}
			}
		});
		return {
			config: {
				drinks: {},
				rooms: {},
				graphs: {}
			},
			update: gupdate
		};
	},
	render: function () {
		var $this = this, room_i = 0;
		return (
			<div >
				<Management config={$this.state.config} clear={$this._clearConfig} increase={$this._increase} selectRoom={$this._selectRoom}/>
				<div id="main-wrapper" tabIndex="0">
					<div id="main-title">
						<h2 className="main-name">{$this.state.config.name}</h2><h4 className="main-slogan">{$this.state.config.slogan}</h4>
					</div>
					<div id="main-container">
						<div className="main-rooms">
							{ Object.keys($this.state.config.rooms).map(function (room_idx) {
								var odd = (room_i % 2 === 0);
								room_i = room_i + 1;
								return (
									<Room 
										key={room_idx} 
										roomNumber={room_idx} 
										room={$this.state.config.rooms[room_idx]} 
										config={$this.state.config} 
										increase={$this._increase}
										odd={odd}
										selected={$this.state.selectedRoom === room_idx ? true : false}/>
								);
							}) }
						</div>
						<Graphs className="main-graphs" config={this.state.config} update={this.state.update}/>
					</div>
				</div>
			</div>
		);
	},
	componentDidMount: function () {
		var $this = this;
		var timer = window.setInterval(function () {
			request("http://localhost:8080/config/new", function (error, response, body) {
				if (error) {
					throw error;
				} else {
					if (response.statusCode !== 200) {
						console.error(response);
					} else {
						if (JSON.parse(body)) {
							request("http://localhost:8080/config", function (error, response, body) {
								if (error) {
									throw error;
								} else {
									if (response.statusCode !== 200) {
										console.error(response);
									} else {
										$this.setState({config: JSON.parse(body)});
									}
								}
							});
						}
					}
				}
			});
		}, 3 * 1000);
	},
	_selectRoom: function (room) {
		this.setState({ selectedRoom: room});
	},
	_clearConfig: function () {
		var config = this.state.config;
		Object.keys(config.rooms).map(function (room) {
			Object.keys(config.rooms[room].turfs).map(function (drink) {
				config.rooms[room].turfs[drink] = 0;
			});
		});
		config.date = Date();
		this._saveConfig(config);
	},
	_saveConfig: function (new_config) {
		var $this = this;
		$this.setState({"config": new_config, "update": gupdate});
		request.post(
			{
				uri: "http://localhost:8080/config/save",
				json: true,
				body: new_config
			}, 
			function (error, response, body) {
				if (error) {
					throw error;
				} else {
					if (response.statusCode !== 200) {
						console.error(response);
					} else {
						if (!deepEqual(body, new_config)) {
							throw new Error("Incoming config does not match!");
						}
					}
				}
			}
		);
	},
	_increase: function (room, type) {
		var config = this.state.config;
		gupdate = {
			"room": room,
			"type": type,
			"occupant": this.state.config.rooms[room].occupant,
			"idx": this.state.update ? this.state.update.idx + 1 : 0
		};
		config.rooms[room].turfs[type] = this.state.config.rooms[room].turfs[type] + 1;
		this._saveConfig(config);
	}
});

module.exports = Main;