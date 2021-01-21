class TodoAppController < ApplicationController
  def index
    if app_params.blank?
      @user = User.default
    else
      @user = User.find_by(username: app_params)
    end

    if @user.blank?
      head :forbidden
    else
      @items = Item.where(user: @user).order(:list_order).select(:id, :done, :task, :tags)
      @tags = Tag.where(user: @user).order(:name).select(:id, :name, :tags_id)
      #Variable setup completed, they will be used in the index.html.erb code file.
    end
  end
  # Only allow a list of trusted parameters through.
  private 
    def app_params
      params.fetch(:username, "") #TODO: Check I don't have to fill params with anything
    end
end
