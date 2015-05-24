/** @jsx React.DOM */
var React = require('react'),
	BarGraph = require("./BarGraph.js"),
	PieGraph = require("./PieGraph.js"),
	ScatterPlot = require("./ScatterPlot.js"),
	mui = require("material-ui"),
	RaisedButton = mui.RaisedButton;

var Graphs = React.createClass({
	getInitialState: function () {
		return {
			selected: "bar"
		};
	},
	render: function () {
		var $this = this;
		return (
			<div className="main-graphs">
				<div className="button-wrapper">
					<RaisedButton className="half-button" secondary={true} label="Bar" onClick={this.set_bar} />
					<RaisedButton className="half-button" secondary={true} label="Pie" onClick={this.set_pie} />
					<RaisedButton className="half-button" secondary={true} label="scatter" onClick={this.set_scatter} />
				</div>
				<div className={this.state.selected === "bar" ? "visible" : "invisible"}>
					<BarGraph data={this.props.config} config={this.props.config.graphs["bar-graph"]} update={this.props.update}/>
				</div>
				<div className={this.state.selected === "pie" ? "visible" : "invisible"}>
					<PieGraph data={this.props.config} config={this.props.config.graphs["pie-graph"]}/>
				</div>
				<div className={this.state.selected === "scatter" ? "visible" : "invisible"}>
					<ScatterPlot data={this.props.config} config={this.props.config.graphs["scatter-graph"]}/>
				</div>
			</div>
		);
	},
	set_pie: function () {
		this.setState({
			selected: "pie"
		});
	},
	set_bar: function () {
		this.setState({
			selected: "bar"
		});
	},
	set_scatter: function () {
		this.setState({
			selected: "scatter"
		});
	}
});

module.exports = Graphs;