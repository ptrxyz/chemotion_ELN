# frozen_string_literal: true

module Usecases
  module Measurements
    class BulkCreateFromRawData
      attr_reader :raw_data, :current_user
      ERRORS = {
        permission_error: 'Permission Error - You are not allowed to update this sample',
        sample_not_found: 'Could not find sample',
        missing_fields: 'Data Error - description, sample identifier, unit and value data required',
        sample_identifier_ambiguous: 'Sample identifier matches more than one sample, measurement cannot be assigned correctly',
      }

      # raw_data: 
      # [
      #   {
      #     uuid # an artificial identifier only required for the frontend, can be ignored
      #     description
      #     sample_identifier
      #     unit
      #     value
      #   }
      # ]
      def initialize(current_user, raw_data)
        @raw_data = raw_data
        @current_user = current_user
      end

      def execute!
        raw_data.map do |entry|
          entry['errors'] ||= []
          check_sample_availability!(entry)
          check_sample_permissions!(entry)
          create_measurement!(entry)

          entry
        end
      end

      private

      def check_sample_permissions!(entry)
        return if entry_has_errors?(entry)

        sample = Sample.find_by(short_label: entry['sample_identifier'])

        entry['errors'] << ERRORS[:permission_error] unless ElementPolicy.new(current_user, sample).update?
      end

      def create_measurement!(entry)
        return if entry_has_errors?(entry)

        sample = Sample.find_by(short_label: entry['sample_identifier'])
        measurement = Measurement.new(
          sample: sample,
          description: entry['description'],
          unit: entry['unit'],
          value: entry['value']
        )
        if (measurement.valid?)
          measurement.save!
          entry['id'] = measurement.id
        else
          measurement.errors.full_messages.each { |message| entry['errors'] << message }
        end

        entry
      end

      def required_fields_missing?(entry)
        %w[description sample_identifier unit value].all? do |key|
          entry.key?(key) && entry[key].present?
        end
      end

      def check_required_fields!(entry)
        entry['errors'] << ERRORS[:missing_fields] if required_fields_missing?(entry)
      end

      def check_sample_availability!(entry)
        count = Sample.where(short_label: entry['sample_identifier']).count
        return if count == 1

        entry['errors'] << ERRORS[:sample_not_found] if count.zero?
        entry['errors'] << ERRORS[:sample_identifier_ambiguous] if count > 1
      end

      def entry_has_errors?(entry)
        return entry['errors'].size > 0
      end
    end
  end
end
