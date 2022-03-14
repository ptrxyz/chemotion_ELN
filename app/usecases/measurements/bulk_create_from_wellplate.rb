# frozen_string_literal: true

module Usecases
  module Measurements
    class BulkCreateFromWellplate
      attr_reader :wellplate

      def initialize(wellplate)
        @wellplate = wellplate
      end

      def execute!
        wellplate.wells.each do |well|
          Usecases::Measurements::BulkCreateFromWell.new(well).execute!
        end
      end
    end
  end
end

