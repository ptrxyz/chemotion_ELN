# frozen_string_literal: true

require 'rails_helper'

describe Usecases::Measurements::BulkCreateFromWellplate do
  let(:wellplate) { create(:wellplate, :with_random_wells, number_of_readouts: 3) }

  it 'creates measurements' do
    expect { described_class.new(wellplate).execute! }.to change(Measurement, :count).by(96 * 3)

    measurements = Measurement.last(96 * 3)

    wellplate.wells.each do |well|
      measurement = measurements.find do |m|
        m.sample == well.sample &&
          m.well == well &&
          [m.value, m.unit].in?(well.readouts.map { |r| [r['value'], r['unit']] })
      end

      expect(measurement.present?).to be true
    end
  end
end
