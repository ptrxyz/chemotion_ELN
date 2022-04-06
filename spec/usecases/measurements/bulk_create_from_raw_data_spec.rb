# frozen_string_literal: true

require 'rails_helper'

describe Usecases::Measurements::BulkCreateFromRawData do
  let(:current_user) { create(:person) }
  let(:wellplate) { create(:wellplate, :with_random_wells, number_of_readouts: 3) }
  let(:collection) { create(:collection, user_id: current_user.id, is_shared: true, permission_level: 3) }
  let(:raw_data) do 
    wellplate.wells.map do |well|
      well.readouts.map.with_index do |readout, readout_index|
        {
          description: wellplate.readout_titles[readout_index],
          sample_identifier: well.sample.short_label,
          unit: readout['unit'],
          value: readout['value']
        }.with_indifferent_access
      end
    end.flatten
  end

  before do
    wellplate.wells.each do |well|
      CollectionsSample.create!(sample: well.sample, collection: collection)
    end
  end

  context 'when all data is accessible' do
    it 'creates measurements for each data point' do
      expect { described_class.new(current_user, raw_data).execute! }.to change(Measurement, :count).by(96 * 3)

      measurements = Measurement.last(96 * 3)

      raw_data.each do |datapoint|
        measurement = measurements.find do |m|
          m.description == datapoint[:description] &&
            m.sample.short_label == datapoint[:sample_identifier] &&
            m.unit == datapoint[:unit] &&
            m.value.to_f == datapoint[:value] # db uses BigDecimal while spec has float
        end

        expect(measurement.present?).to be true
      end
    end
  end
end
