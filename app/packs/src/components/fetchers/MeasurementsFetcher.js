import 'whatwg-fetch';
import Measurement from '../models/measurement';

export default class MeasurementsFetcher {
  static fetchMeasurementHierarchy(sample) {
    const promise = fetch(`/api/v1/measurements/?sample_id=${sample.id}`, {
      credentials: 'same-origin',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(json => { json }).catch(errorMessage => { console.log(errorMessage); })

    return promise;
  }

  static postResearchPlanMetadata(measurementCandidates) {
    const measurements = measurementCandidates.map(candidate => new Measurement(candidate));

    return fetch('/api/v1/measurements/bulk_create_from_raw_data', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw_data: measurements })
    }).then(response => response.json())
      .then(json => json.bulk_create_from_raw_data)
      .catch((errorMessage) => { console.log(errorMessage); });
  }
}
