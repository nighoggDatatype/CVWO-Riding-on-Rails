class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def not_found
    raise ActionController::RecordNotFound.new('Not Found')
  end  

  private
    def record_not_found
      render plain: "404 Not Found", status: :not_found
    end
end
