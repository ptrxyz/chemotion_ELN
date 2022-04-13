import Aviator from 'aviator';
import { researchPlanShowOrNew } from './routesUtils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ElementActions from './actions/ElementActions';
import ElementStore from './stores/ElementStore';
import MeasurementsFetcher from './fetchers/MeasurementsFetcher';

export default class MeasurementsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      samplesWithMeasurements: []
    }
  };

  componentDidMount() {
    var samplesWithMeasurements = [];
    MeasurementsFetcher.fetchMeasurementHierarchy(this.props.sample).then(samples => {
      this.setState({samplesWithMeasurements: samples});
    });
  }

  // currently only research plan is supported as source
  navigateToSource(measurement) {
    const { params, uri } = Aviator.getCurrentRequest();
    Aviator.navigate(`${uri}/${measurement.source_type}/${measurement.source_id}`, { silent: true });
    if (measurement.source_type == 'research_plan') {
      researchPlanShowOrNew({ params: { research_planID: measurement.source_id } });
    }
  }

  renderEntry(entry) {
    const measurements = entry.measurements.map(measurement => {
      if (measurement.source_id) {
        return (
          <li className="measurementList--measurement" key={`Measurement${measurement.id}`}>
            <a
              key={`MeasurementSource${measurement.id}`}
              onClick={() => this.navigateToSource(measurement)}
              style={{ cursor: 'pointer' }}
            >
              {measurement.description}: {measurement.value}{measurement.unit}
            </a>
          </li>
        );
      } else {
        return (
          <li className="measurementList--measurement" key={`Measurement${measurement.id}`}>
            {measurement.description}: {measurement.value}{measurement.unit}
          </li>
        );
      }
    });

    return (
      <div className="measurementList--entry" key={`MeasurementListEntry${entry.id}`}>
        <h4 className="measurementList--sampleName" key={`MeasurementListEntryHeadline${entry.ide}`}>
          {entry.short_label} {entry.name}
        </h4>
        <ul className="unstyled-list">
          {measurements}
        </ul>
      </div>
    );
  }

  render() {
    const entries = this.state.samplesWithMeasurements.map(entry => this.renderEntry(entry));
    if (entries.length == 0) {
      return (
        <span>No measurements recorded for this sample</span>
      );
    } else {
      return (
          <div className="measurementList">
            {entries}
        </div>
      );
    }
  }
}
MeasurementsList.propTypes = {
  sample: PropTypes.object.isRequired
};
