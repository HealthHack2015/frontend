var Selector = React.createClass({displayName: "Selector",

	handleOnChange: function(e) {
		var new_state = {
			selected: false,
			input: e.target.value
		}
		this.props.handleOnClick(new_state, this.props.index);
	},

	handleOnClick: function(value) {
		var new_state = {
			selected: true,
			input: value
		}
		this.props.handleOnClick(new_state, this.props.index);
	},

    handleOutFocus: function(e) {
		var new_state = {
			selected: true,
			input: e.target.value
		}
		this.props.handleOnClick(new_state, this.props.index);
    },

	render: function() {
		var input = this.props.input.trim().toLowerCase();
		var diseases;
		if (!this.props.selected && input.length > 0) {
			diseases = this.props.diseases.filter(function(dis) {
				return dis.toLowerCase().match( input );
			}).map(function(dis, i) {
				return (React.createElement("li", {onMouseDown: this.handleOnClick.bind(this,dis)},  dis ));
			}, this);
		};

		return (
        	React.createElement("div", {className: "diseaseSelector col-md-4"}, 
                React.createElement("input", {className: this.props.name, type: "text", value: this.props.input, onBlur: this.handleOutFocus, onChange: this.handleOnChange, placeholder: "Type here"}), 
                React.createElement("ul", null,  diseases )
            )
		);
	}
});

var Dashboard = React.createClass({displayName: "Dashboard",

	getInitialState: function() {
		return {
			selectors: [],
			diseases: [],
			scores: []
		};
	},

	loadDiseases: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				console.log(this.props.url, data);
				this.setState({diseases: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	componentDidMount: function() {
    	this.loadDiseases();
    	this.addNewSelector();
    	this.addNewSelector();
	},

	addNewSelector: function() {
		var curr_selectors = this.state.selectors;
		curr_selectors.push({
			selected: false,
			input: ""
		});
		this.setState({selectors: curr_selectors});
	},

	handleOnClick: function(new_input, index) {
		var curr_selectors = this.state.selectors;
		curr_selectors[index] = new_input;
		this.setState({selectors: curr_selectors});
	},

	render: function() {
		var selector_objects = this.state.selectors.map(function(selector, index) {
			return (
				React.createElement(Selector, {key: index, index: index, selected: selector.selected, input: selector.input, handleOnClick: this.handleOnClick, diseases: this.state.diseases})
			);
		},this)

		var button;
		if (this.state.selectors.length == 2) {
			button = (React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.addNewSelector}, "Add New Disease"))
		} else if (this.state.selectors.length == 3) {
			button = (React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.addNewSelector}, "Remove Disease"))
		}

		return (
			React.createElement("div", {className: "dashboard container"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement("h1", null, "NeedMD"), 
					 button, 
					React.createElement("br", null), React.createElement("br", null)
				), 
				React.createElement("div", {className: "row"}, 
					 selector_objects 
				)
			)
		);
	}
});

React.render(
	React.createElement(Dashboard, {url: "http://23.94.43.139:8081/get_diseases"}),
	document.getElementById('sandbox')
);