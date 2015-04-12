

var Dashboard = React.createClass({displayName: "Dashboard",
	render: function() {
		return (
			React.createElement("h1", null, "Hello ", this.props.name, "!")
		);
	}
});

React.render(
	React.createElement(Dashboard, {name: "World"}),
	document.getElementById('sandbox')
);