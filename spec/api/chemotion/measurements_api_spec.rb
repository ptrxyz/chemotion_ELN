# frozen_string_literal: true

require 'rails_helper'

describe Chemotion::MeasurementsAPI do
  context 'with authorized user' do
    let(:user) { create(:person) }

    before do
      allow_any_instance_of(WardenAuthentication).to receive(:current_user).and_return(user)
    end

    describe 'POST /api/v1/measurements/bulk_create_from_raw_data' do
      let(:collection) { create(:collection, user_id: user.id, is_shared: true, permission_level: 3) }
      let(:wellplate) { create(:wellplate, :with_random_wells, number_of_readouts: 3) }
      let(:raw_data) do
        wellplate.wells.map do |well|
          well.readouts.map.with_index do |readout, readout_index|
            {
              uuid: SecureRandom.uuid,
              description: wellplate.readout_titles[readout_index],
              sample_identifier: well.sample.short_label,
              unit: readout['unit'],
              value: readout['value']
            }.with_indifferent_access
          end
        end.flatten
      end
      let(:research_plan) { create(:research_plan) }
      let(:params) do
        { raw_data: raw_data, source_type: 'research_plan', source_id: research_plan.id }
      end

      before do
        CollectionsResearchPlan.create(research_plan: research_plan, collection: collection)
        CollectionsWellplate.create!(wellplate: wellplate, collection: collection)
        wellplate.wells.each do |well|
          CollectionsSample.create!(sample: well.sample, collection: collection)
        end
      end

      it 'creates measurements from the given well' do
        measurements_before = Measurement.count
        post "/api/v1/measurements/bulk_create_from_raw_data", params: params, as: :json

        created_measurements = Measurement.count - measurements_before

        expect(created_measurements).to eq 96*3

        measurements = Measurement.last(96*3)
        well = wellplate.wells.first

        (0..2).each do |i|
          expect(measurements[i].description).to eq wellplate.readout_titles[i]
          expect(measurements[i].sample_id).to eq well.sample_id
          expect(measurements[i].unit).to eq well.readouts[i]['unit']
          expect(measurements[i].value.to_f).to eq well.readouts[i]['value']
        end
      end
    end
  end
end
