/** @jsx React.DOM */
var React = require('react'),
	mui = require("material-ui"),
	RaisedButton = mui.RaisedButton,
	Dialog = mui.Dialog,
	TextField = mui.TextField
	Snackbar = mui.Snackbar,
	request = require("request"),
	KeyboardControl = require("./KeyboardControl.js");

var callback;

var Management = React.createClass({
	getInitialState: function () {
		return {
			et: "",
			bs: false
		};
	},
	render: function () {
		var $this = this;
		var processActions = [
			{ text: 'Cancel', primary: true },
			{ text: 'Process!', onClick: this._onLogin }
		];
		return (
			<div className="management-wrapper">
				<RaisedButton className="management-login" secondary={true} label="Process" onClick={this.login}/>
				<RaisedButton className="management-blackscreen" primary={true} label="Black Screen" onClick={this.blackscreen}/>
				<KeyboardControl increase={this.props.increase} config={this.props.config} selectRoom={this.props.selectRoom} setBlackscreen={this.blackscreen} unsetBlackscreen={this.unsetBlackscreen}/>
				<div className={"element-blackscreen " + ($this.state.bs ? "visible" : "hidden")}></div>
				<Dialog className="management-login-dialog" title="Verify processing" ref="login" actions={processActions}>
					<TextField 
						hintText="password"
						floatingLabelText="Password"
						errorText={this.state.et}
						ref="loginPass"
						type="password"
						onChange={this._loginChange} />
				</Dialog>
				<Snackbar
					ref="processSnackbar"
					message="Processed, stored and mailed!"
					action="dismiss"
					onActionTouchTap={this._onProcessDismiss}/>
			</div>
		);
	},
	_onSave: function () {
		var $this = this;
		request.post(
			{
				uri: "http://localhost:8080/config/store",
				json: true,
				body: $this.props.config
			}, 
			function (error, response, body) {
				if (error) {
					throw error;
				} else {
					if (response.statusCode !== 200) {
						console.error(response);
					} else {
						request.post(
							{
								uri: "http://localhost:8080/config/mail",
								json: true,
								body: {
									options: {
										from: 'jvb59bier@gmail.com', // sender address
										to: $this.props.config.administrator.email, // list of receivers
										subject: 'Turflijst ' + (new Date()).toLocaleDateString(), // Subject line
										text: $this.createText($this.props.config), // plaintext body
										html: $this.createHtml($this.props.config), // html body
										attachments: [{
											filename: "data.json",
											content: JSON.stringify($this.props.config, null, "\t")
										},
										{
											filename: "data.csv",
											content: $this.createCsv($this.props.config)
										}]
									},
									auth: {
										user: $this.props.config.email.user,
										pass: $this.props.config.email.pass
									}
								}
							}, 
							function (error, response, body) {
								if (error) {
									throw error;
								} else {
									if (response.statusCode !== 200) {
										console.error(response);
									} else {
										$this.props.clear();
										$this.refs.processSnackbar.show();
									}
								}
							}
						);
					}
				}
			}
		);
	},
	createText: function (config) {
		var title_arr = ["Name\t\t"], rooms_arr = ["Heey " + config.administrator.name + "!", ""];
		Object.keys(config.drinks).map(function (drink) {
			title_arr.push(drink);
		});
		rooms_arr.push(title_arr.join("\t"));
		Object.keys(config.rooms).map(function (room) {
			var arr = [(config.rooms[room].occupant + "\t\t") ];
			Object.keys(config.rooms[room].turfs).map(function (drink) {
				arr.push(config.rooms[room].turfs[drink]);
			});
			rooms_arr.push(arr.join("\t"));
		})
		return rooms_arr.join("\n");
	},
	createHtml: function (config) {
		var str = "<h4>Heey " + config.administrator.name + "!</h4><table style=\"border: 1px solid black;border-collapse: collapse;padding: 5px;text-align: left;\"><thead><tr><th>Name</th>";
		Object.keys(config.drinks).map(function (drink) {
			str += "<th>" + drink + "</th>"
		});
		str += "</tr></thead><tbody>"
		Object.keys(config.rooms).map(function (room) {
			str += "<tr><td style=\"width: 15em;\">" + config.rooms[room].occupant + "</td>";
			Object.keys(config.rooms[room].turfs).map(function (drink) {
				str += "<td style=\"width: 5em;\">" + config.rooms[room].turfs[drink] + "</td>";
			});
			str += "</tr>";
		});
		return str + "</tbody></table>";
	},
	createCsv: function (config) {
		var title_arr = ["name"], rooms_arr = [];
		Object.keys(config.drinks).map(function (drink) {
			title_arr.push(drink);
		});
		rooms_arr.push(title_arr.join(","));
		Object.keys(config.rooms).map(function (room) {
			var arr = [config.rooms[room].occupant];
			Object.keys(config.rooms[room].turfs).map(function (drink) {
				arr.push(config.rooms[room].turfs[drink]);
			});
			rooms_arr.push(arr.join(","));
		})
		return rooms_arr.join("\n");
	},
	_loginChange: function () {
		this.setState({
			et: ""
		});
	},
	_onProcessDismiss: function () {
		this.refs.processSnackbar.dismiss();
	},
	_onLogin: function () {
		if (this.refs.loginPass.getValue() === this.props.config.administrator.password) {
			this.refs.login.dismiss();
			this.refs.loginPass.clearValue();
			this._onSave();
		} else {
			this.setState({
				et: "Invalid password!"
			});
		}
	},
	login: function () {
		this.refs.login.show();
		this.refs.loginPass.focus();
	},
	unsetBlackscreen: function () {
		if (this.state.bs){
			this.setState({
				bs: false
			});
			document.getElementsByTagName("body")[0].removeEventListener("mousemove", callback);
		}
	},
	blackscreen: function () {
		var $this = this;
		$this.setState({
			bs: true
		});
		callback = function () {
			$this.setState({
				bs: false
			});
			document.getElementsByTagName("body")[0].removeEventListener("mousemove", callback);
		}
		document.getElementsByTagName("body")[0].addEventListener("mousemove", callback);
	}
});

module.exports = Management;