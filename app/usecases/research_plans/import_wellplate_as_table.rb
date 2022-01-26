# frozen_string_literal: true

module Usecases
  module ResearchPlans
    class ImportWellplateAsTable
      attr_reader :research_plan, :wellplate

      def initialize(research_plan, wellplate)
        @research_plan = research_plan
        @wellplate = wellplate
      end

      def execute!
        table = convert_wellplate_to_table(wellplate)
        research_plan.body << table
        research_plan.save!
      end

      def convert_wellplate_to_table(wellplate)
        {
          id: SecureRandom.uuid,
          type: :table,
          title: wellplate.name || "Wellplate #{wellplate.id}",
          wellplate_id: wellplate.id,
          value: {
            rows: convert_rows(wellplate),
            columns: convert_columns(wellplate)
          }
        }
      end

      private

      def convert_columns(wellplate)
        columns = [
          { key: :wellplate_position, name: 'Position', width: 50, editable: false, resizable: true },
          { key: :sample, name: 'Sample', width: 75, editable: false, resizable: true }
        ]

        wellplate.readout_titles.each_with_index do |readout_title, index|
          %w[value unit].each do |column_suffix|
            columns << {
              key: "readout_#{index + 1}_#{column_suffix}",
              name: [readout_title, column_suffix.capitalize].join(' '),
              width: 100,
              editable: true,
              resizable: true
            }
          end
        end

        columns
      end

      def convert_rows(wellplate)
        rows = []
        wellplate.wells.sort_by { |well| [well.position_x, well.position_y] }.each do |well|
          next unless well.sample

          row = {
            wellplate_position: well.alphanumeric_position,
            sample: well.sample.name
          }
          well.readouts.each_with_index do |readout, index|
            next if [readout['value'], readout['unit']].any?(&:blank?)

            row["readout_#{index + 1}_value"] = readout['value']
            row["readout_#{index + 1}_unit"] = readout['unit']
          end
          rows << row
        end

        rows
      end
    end
  end
end
