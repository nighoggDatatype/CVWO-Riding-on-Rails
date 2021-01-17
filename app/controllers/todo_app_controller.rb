class TodoAppController < ApplicationController
  def index
    if app_params.blank?
      @user = User.default #TODO: Figure out why User.default.blank? is true
    else
      @user = User.find_by(username: app_params)
    end

    if @user.blank?
      head :forbidden #Note for debuggin later, this trips for some reason.
    else
      @items = Item.where(user: @user).order(:list_order)
      @tags = Tag.where(user: @user).order(:name)
      #Variable setup completed, they will be used in the index.html.erb code file.
    end
  end
  # Only allow a list of trusted parameters through.
  private 
    def app_params
      params.fetch(:username, "") #TODO: Check I don't have to fill params with anything
    end
end
