/** @jsx React.DOM */
var React = require('react');

var PieGraph = React.createClass({
	render: function () {
		return (
			<div id="pie-graph">
			</div>
		);
	},
	componentDidUpdate: function () {
		this.redraw();
	},
	redraw: function () {
		var $this = this;

		d3.select("#pie-graph").selectAll("svg").remove();
		var color = d3.scale.category20();
		var data = [], drink_data = {}, num_drinks = 0;
		Object.keys($this.props.data.drinks).map(function (drink) {
			data.push([]);
			drink_data[drink] = num_drinks;
			num_drinks = num_drinks + 1;
		});

		Object.keys($this.props.data.rooms).map(function (room) {
			Object.keys($this.props.data.rooms[room].turfs).map(function (drink) {
				data[drink_data[drink]].push({
					type: drink,
					name: $this.props.data.rooms[room].occupant,
					value: $this.props.data.rooms[room].turfs[drink]
				});
			});
		});

		var svg = d3.select("#pie-graph").append("svg")
			.attr("width", $this.props.data.graphs["pie-graph"].width)
			.attr("height", $this.props.data.graphs["pie-graph"].height)
				.append("g")
			.attr("transform", "translate(" + $this.props.data.graphs["pie-graph"].width / 2 + "," + $this.props.data.graphs["pie-graph"].height / 2 + ")");

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d.value; });

		function bakepie(cn ,data, x, y, r1, r2, color){ 
			//color could be made a parameter
			var arc = d3.svg.arc().outerRadius(r1).innerRadius(r2);

			var g = svg.selectAll("." + cn)
					.data(pie(data))
				.enter().append("g")
					.filter(function(d) { return d.value !== 0; })
					.attr("class", cn);

			g.append("path")
				.attr("d", arc)
				.style("fill", function(d) { return color(d.data.name); });

			g.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", "-0.65em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.data.type; });

			g.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.data.name; });

			g.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", "1.35em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.data.value; });
		}

		var or = $this.props.data.graphs["pie-graph"]["outer-radius"], idx = 0;
		var rad_diff = $this.props.data.graphs["pie-graph"].r;
		data.map(function (subdata) {
			if (idx < 3) {
				bakepie("arc" + or, subdata, $this.props.data.graphs["pie-graph"].width, $this.props.data.graphs["pie-graph"].height, or, or - rad_diff, color);
				or = or - (rad_diff + 5);
				idx += 1;
			}
		});
	}
});

module.exports = PieGraph;