import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ElementActions from './actions/ElementActions';
import ElementStore from './stores/ElementStore';

export default class MeasurementList extends Component {
  constructur(props) {
    super(props);
    this.state = {
      measurements: []
    }
  }

  componentDidMount() {
    const entries = MeasurementsFetcher.fetchMeasurementHierarchy(sample)
    this.setState({measurements: entries});
  }

  renderEntry(entry) {
    const measurements = entry.measurements.map(measurement => {
      return (
        <li class="measurementList--measurement">
          {measurement.description}: {measurement.value}{measurement.unit}
        </li>
      );
    });

    return (
      <div class="measurementList--entry">
        <h3 class="measurementList--sampleName">{entry.short_label} {entry.name}</h3>
        <ul class="unstyled-list">
          {measurements}
        </ul>
      </div>
    );
  }

  render() {
    const entries = this.state.measurements.map(entry => renderEntry(entry));
    return (
        <div class="measurementList">
          {entries}
      </div>
    );
  }
}
