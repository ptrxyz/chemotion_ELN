# frozen_string_literal: true

module Usecases
  module Measurements
    class CreateFromWell
      attr_reader :well

      def initialize(well)
        @well = well
      end

      def execute!
        measurements = well.readouts.map.with_index do |readout, index|
          {
            description: well.wellplate.readout_titles[index],
            sample: well.sample,
            unit: readout['unit'],
            value: readout['value'],
            well: well
          }
        end

        Measurement.create!(measurements)
      end
    end
  end
end

