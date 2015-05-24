/** @jsx React.DOM */
var React = require('react');

var gidx = -1;

var BarGraph = React.createClass({
	render: function () {
		return (
			<div id="bar-graph">
			</div>
		);
	},
	componentDidUpdate: function () {
		this.redraw();
	},
	redraw: function () {
		var $this = this,
			ogidx = gidx;
		var margin = {top: 20, right: 20, bottom: 100, left: 40},
		    width = $this.props.config.width - margin.left - margin.right,
		    height = $this.props.config.height - margin.top - margin.bottom;

		var n = Object.keys($this.props.data.rooms).length;
		var m = Object.keys($this.props.data.drinks).length;
			
		var x0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, width], .1);
		var x1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, x0.rangeBand()]);
		var y = d3.scale.linear().range([height, 0]);
		var color = d3.scale.ordinal().range(Object.keys($this.props.data.drinks).map(function (drink) {
			return $this.props.data.drinks[drink];
		}));

		var xAxis = d3.svg.axis().scale(x0).orient("bottom");
		var yAxis = d3.svg.axis().scale(y).orient("left");//.tickFormat(d3.format(".2s"));

		d3.select("#bar-graph").selectAll("svg").remove();
		var chart = d3.select("#bar-graph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
				.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var data = [];
		Object.keys($this.props.data.rooms).map(function (room) {
			var obj = { occupant: $this.props.data.rooms[room].occupant, turfs: []};
			Object.keys($this.props.data.rooms[room].turfs).map(function (drink) {
				if (obj.turfs.length < 3) {
					obj[drink] = $this.props.data.rooms[room].turfs[drink];
					obj.turfs.push({
						name: drink,
						value: $this.props.data.rooms[room].turfs[drink],
						occupant: $this.props.data.rooms[room].occupant
					});
				}
			});
			data.push(obj);
		});

		x0.domain(data.map(function(d) { return d.occupant; }));
		x1.domain(Object.keys($this.props.data.drinks)).rangeRoundBands([0, x0.rangeBand()]);
		y.domain([0, d3.max([10, d3.max(data, function(d) { return d3.max(d.turfs, function(d) { return d.value; }); })])]);

		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
				.selectAll("text")  
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", ".15em")
					.attr("transform", "rotate(-65)");

		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		var turf = chart.selectAll(".turf")
				.data(data)
			.enter().append("g")
				.attr("class", "turf")
				.attr("transform", function(d) { return "translate(" + x0(d.occupant) + ",0)"; });

		function p(v) {
			if ($this.props.update) {
				if (v.value > 0) {
					return v.value - ((v.occupant === $this.props.update.occupant  && $this.props.update.type === v.name  && ogidx !== $this.props.update.idx)? 1 : 0);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		}

		turf.selectAll("rect")
				.data(function(d) { return d.turfs; })
			.enter().append("rect")
				.attr("class", "bar")
				.attr("width", x1.rangeBand())
				.attr("x", function(d) { return x1(d.name); })
				.attr("height", function(d) { return height - y(p(d)); })
				.attr("y", function(d) { return y(p(d)); })
				.style("fill", function(d) { return color(d.name); })
				.transition()
				.delay(function (d, i) { return i*100; })
				.attr("y", function(d) { return y(d.value); })
				.attr("height", function(d) { return height - y(d.value); });


		turf.selectAll(".count")
				.data(function(d) { return d.turfs; })
			.enter().append("text")
				.filter(function(d) { return d.value !== 0; })
				.attr("class", "count")
				.attr("transform", function(d) { return "translate(" + x1(d.name) + "," + y(d.value) + ")"; })
				.style("text-anchor", "middle")
				.attr("fill", "white")
				.attr("dx", "15px")
				.attr("dy", "15px")
				.text(function(d) { return d.value; });

		gidx = $this.props.update ? $this.props.update.idx : -1;
	}
});

module.exports = BarGraph;