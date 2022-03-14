# frozen_string_literal: true

module Usecases
  module Measurements
    class BulkCreateFromRawData
      attr_reader :raw_data, :current_user

      # raw_data: 
      # [
      #   {
      #     description
      #     sample_id
      #     unit
      #     value
      #   }
      # ]
      def initialize(current_user, raw_data)
        @raw_data = raw_data
        @current_user = current_user
      end

      def execute!
        permission_error unless ElementsPolicy.new(current_user, samples).update?
        data_error unless raw_data.all? { |entry| required_fields_present?(entry) }

        Measurement.create!(raw_data)
      end

      private

      def samples
        @samples ||= begin
          sample_ids = raw_data.map { |entry| entry['sample_id'] }.compact.uniq
          sample_ids.any? ? Sample.where(id: sample_ids) : Sample.none
        end
      end

      def permission_error
        # TODO
        raise 'Permission Error - One or more samples can not be updated'
      end

      def required_fields_present?(entry)
        (entry.keys.sort == %w[description sample_id unit value]) && entry.values.none?(&:blank?)
      end

      def data_error
        # TODO
        raise 'Data Error - all entries need description, sample_id, unit and value data'
      end
    end
  end
end
