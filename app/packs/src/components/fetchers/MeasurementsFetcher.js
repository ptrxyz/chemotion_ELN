import 'whatwg-fetch';
import Measurement from '../models/measurement';

export default class MeasurementsFetcher {
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
