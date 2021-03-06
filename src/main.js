var Selector = React.createClass({

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
				return (<li onMouseDown={this.handleOnClick.bind(this,dis)}>{ dis }</li>);
			}, this);
		};

		return (
        	<div className="diseaseSelector col-md-3" style={{'text-align': 'center', 'margin': 0}}>
                <input className={this.props.name} type="text" value={this.props.input} onBlur={this.handleOutFocus} onChange={this.handleOnChange} placeholder="Type here" />
                <ul>{ diseases }</ul>
            </div>
		);
	}
});

var Dashboard = React.createClass({

	getInitialState: function() {
		return {
			selectors: [],
			diseases: [],
			scores: []
		};
	},

	loadDiseases: function() {
		$.ajax({
			url: "http://23.94.43.139:8081/get_diseases",
			dataType: 'json',
			success: function(data) {
				this.setState({diseases: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error("http://23.94.43.139:8081/get_diseases", status, err.toString());
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

	removeSelector: function() {
		var curr_selectors = this.state.selectors;
		curr_selectors.pop();
		this.setState({selectors: curr_selectors});
	},

	handleOnClick: function(new_input, index) {
		var curr_selectors = this.state.selectors;
		curr_selectors[index] = new_input;
		this.setState({selectors: curr_selectors});
	},

	computeScores: function() {
		var curr_selectors = this.state.selectors;
		var param = [];
		for (i in curr_selectors) {
			param.push(curr_selectors[i].input);
		}
		$.ajax({
			url: "http://23.94.43.139:8081/get_scores",
			dataType: 'json',
			success: function(data) {
				console.log("http://23.94.43.139:8081/get_scores", data);
				// this.setState({diseases: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error("http://23.94.43.139:8081/get_scores", status, err.toString());
			}.bind(this)
		});
	},

	render: function() {
		var selector_objects = this.state.selectors.map(function(selector, index) {
			return (
				<Selector key={index} index={index} selected={selector.selected} input={selector.input} handleOnClick={this.handleOnClick} diseases={this.state.diseases} />
			);
		},this)

		var add_button, remove_button;
		if (this.state.selectors.length < 3) { add_button = (<button type="button" className="btn btn-default" onClick={this.addNewSelector}>Add New Disease</button>); }
		else { add_button = (<button type="button" className="btn btn-default" disabled>Add New Disease</button>); }
		if (this.state.selectors.length > 2) { remove_button = (<button type="button" className="btn btn-default" onClick={this.removeSelector}>Remove Disease</button>); }
		else { remove_button = (<button type="button" className="btn btn-default" disabled>Remove Disease</button>); }

		return (
			<div className="dashboard container">
				<div className="row">
					<div className="col-md-3" style={{'text-align': 'left', 'padding-left': 13}}>
						<h1>NeedMD</h1>
						<button type="button" className="btn btn-default" onClick={this.computeScores}>Compute Options!</button>
						<br/><br/>
						{ add_button }
						<br/><br/>
						{ remove_button }
						<br/><br/>
					</div>
					{ selector_objects }
				</div>
			</div>
		);
	}
});

React.render(
	<Dashboard />,
	document.getElementById('sandbox')
);