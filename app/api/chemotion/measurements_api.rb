# frozen_string_literal: true

module Chemotion
  class MeasurementsAPI < Grape::API
    include Grape::Kaminari

    namespace :measurements do
      desc 'Returns measurements'
      params do
        requires :sample_id, type: Integer
        optional :show_hierarchy, type: Boolean, default: true
        optional :source_type, type: String
        optional :source_id, type: Integer
      end
      paginate per_page: 100, offset: 0
      before do
        # TODO: check if sample is readable
      end

      # Gewünschter Output:
      # {
      #   samples: [
      #     {
      #       ... some sample fields for display purposes,
      #       measurements: {
      #         description: abc
      #         value: 1.3
      #         unit: g
      #         source_type: ResearchPlan
      #         source_id: 2342
      #       }
      #     },
      #     ... more samples
      #   }
      # }

      get do
        sample = Sample.joins(:collections)
                       .where(collections: { user_id: current_user.id})
                       .distinct
                       .find(params[:sample_id])

        samples = []
        if params[:show_hierarchy]
          samples = [sample.root, sample.root.descendants].flatten.compact
        else
          samples = [sample]
        end

        scope = Measurement.where(sample_id: samples.pluck(:id))
        if params.key(:source_type) && params.key?(:source_id)
          scope = scope.where(source_type: params[:source_type], source_id: params[:source_id])
        end
        measurements = scope.to_a
        results = []
        samples.each do |sample|
          entry = {
            id: sample.id,
            name: sample.name,
            short_label: sample.short_label,
            measurements: measurements.select { |m| m.sample == sample }.map do |measurement|
              {
                id: measurement.id,
                description: measurement.description,
                value: measurement.value,
                unit: measurement.unit,
                source_type: measurement.source_type,
                source_id: measurement.source_id
              }
            end
          }
          results << entry
        end
        results
      end

      namespace :bulk_create_from_well do
        params do
          requires :well_id, type: Integer, desc: 'Well ID'
        end
        post do
          well = Well.find(params[:well_id])
          sample = well.sample
          error!('401 Unauthorized', 401) unless ElementPolicy.new(current_user, well.wellplate).read?
          error!('401 Unauthorized', 401) unless ElementPolicy.new(current_user, sample).update?

          Usecases::Measurements::BulkCreateFromWell.new(well).execute!

          {}
        rescue StandardError => e
          error!(e, 500)
        end
      end

      namespace :bulk_create_from_wellplate do
        params do
          requires :wellplate_id, type: Integer, desc: 'Wellplate ID'
        end
        post do
          wellplate = Wellplate.includes(wells: [:sample]).find(params[:wellplate_id])
          samples = Sample.where(id: wellplate.wells.map(&:sample_id))
          error!('401 Unauthorized', 401) unless ElementPolicy.new(current_user, wellplate).read?
          error!('401 Unauthorized', 401) unless ElementsPolicy.new(current_user, samples).update?

          Usecases::Measurements::BulkCreateFromWellplate.new(wellplate).execute!

          {}
        rescue StandardError => e
          error!(e, 500)
        end
      end

      namespace :bulk_create_from_raw_data do
        params do
          requires :raw_data, type: Array do
            requires :description, type: String
            requires :sample_identifier, type: String
            requires :unit, type: String
            requires :uuid, type: String
            requires :value, type: Float
          end
          requires :source_type, type: String
          requires :source_id, type: Integer
        end

        post do
          Usecases::Measurements::BulkCreateFromRawData.new(current_user, params).execute!
        rescue StandardError => e
          error!(e.full_message, 500)
        end
      end
    end
  end
end
