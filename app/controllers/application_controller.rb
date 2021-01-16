class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

  def not_found
    raise ActionController::RecordNotFound.new('Not Found')
  end  

  private
    def record_not_found
      render plain: "404 Not Found", status: :not_found
    end

    def record_invalid
      render plain: "422 Unprocessable Entity", status: :unprocessable_entity 
    end
end
