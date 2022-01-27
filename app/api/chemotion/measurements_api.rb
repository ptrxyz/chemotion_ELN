# frozen_string_literal: true

module Chemotion
  class MeasurementsAPI < Grape::API
    include Grape::Kaminari

    namespace :measurements do
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
            requires :sample_id, type: Integer
            requires :unit, type: String
            requires :value, type: Float
          end
        end

        post do
          Usecases::Measurements::BulkCreateFromRawData.new(current_user, params[:raw_data]).execute!
          {}
        rescue StandardError => e
          error!(e.full_message, 500)
        end
      end
    end
  end
end
