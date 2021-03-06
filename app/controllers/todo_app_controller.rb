class TodoAppController < ApplicationController
  def index
    if app_params.blank?
      @user = User.select(:id, :username).default
    else
      @user = User.select(:id, :username).find_by(username: app_params)
    end

    if @user.blank?
      head :forbidden
    else
      Item.joins(reviews: :customer)
      itemQuery = Item.where(user: @user).order(:list_order).pluck(:id, :done, :task)
      @items = itemQuery.map{|item| [:id, :done, :task, :tag_ids].zip(item << Item.find(item[0]).tag_ids).to_h}
      @tags = Tag.where(user: @user).order(:name).select(:id, :name, :tags_id)
      tabQuery = Tab.where(user: @user).order(:tab_order).pluck(:id, :name)
      @tabs = tabQuery.map{|tab| [:id, :name, :tag_ids].zip(tab << Tab.find(tab[0]).tag_ids).to_h}
      #Variable setup completed, they will be used in the index.html.erb code file.
    end
  end
  # Only allow a list of trusted parameters through.
  private 
    def app_params
      params.fetch(:username, "") #TODO: Check I don't have to fill params with anything
    end
end
