import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListView from '../components/ListView';
import eventActions from '../redux/eventsRedux';
import { getAllEvents } from '../selectors';

class Events extends Component {
  componentWillMount() {
    this.props.startup();
  }

  componentWillReceiveProps(nextProps) {
    this.props.events = nextProps.events;
  }

  renderEvent() {
    if (this.props.events.length === 0) {
      return (<p class="jp-block jp-pseudo">is</p>);
    }

    return (<ListView class="jp-block__element" data={this.props.events} />);
  }

  render() {
    return (
      <div>
        { this.renderEvent() }
      </div>
    );
  }
}

Events.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  startup: PropTypes.func.isRequired,
};

Events.defaultProps = {
  events: [
    {
      name: 'No Event',
    },
  ],
};

const mapStateToProps = state => ({
  events: getAllEvents(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  startup: eventActions.eventsRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Events);
