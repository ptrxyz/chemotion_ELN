# frozen_string_literal: true

module Usecases
  module Measurements
    class BulkCreateFromWell
      attr_reader :well

      def initialize(well)
        @well = well
      end

      def execute!
        return unless well.sample
        measurements = well.readouts.map.with_index do |readout, index|
          next if [readout['value'], readout['unit']].any?(&:blank?)

          {
            description: well.wellplate.readout_titles[index],
            sample: well.sample,
            unit: readout['unit'],
            value: readout['value'],
            well: well
          }
        end.compact

        Measurement.create!(measurements) if measurements.any?
      end
    end
  end
end

