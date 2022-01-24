# frozen_string_literal: true

require 'rails_helper'

describe Usecases::Measurements::CreateFromWell do
  let(:sample) { create(:sample) }
  let(:wellplate) { create(:wellplate, :with_random_wells, number_of_readouts: 3) }
  let(:well) { wellplate.wells.first }

  before do
    well.sample = sample
  end

  it 'creates measurements' do
    expect { described_class.new(well).execute! }.to change(Measurement, :count).by(3)

    measurements = Measurement.last(3)

    expect(measurements.all? { |m| m.well == well }).to be true
    expect(measurements.all? { |m| m.sample == sample }).to be true
    measurements.each_with_index do |measurement, i|
      expect(measurement.value).to eq well.readouts[i]['value']
      expect(measurement.unit).to eq well.readouts[i]['unit']
      expect(measurement.description).to eq wellplate.readout_titles[i]
    end
  end
end
