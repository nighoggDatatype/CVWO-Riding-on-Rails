class ItemsController < ApplicationController
  #TODO: Test this
  #TODO: Get appropriate jbuilder files
  before_action :set_user_and_verify
  before_action :set_item_and_verify, only: [:show, :update, :destroy]
  #TODO: Figure out mass updates

  # GET /items.json
  def index
    @items = Item.where(user: @user)
  end

  # GET /items/1.json
  def show
  end

  # POST /items.json
  def create
    @item = Item.new(item_params)
    @item.user = @user

    respond_to do |format|
      if @item.save
        format.json { render :show, status: :created, location: user_item_url(@item.user_id, @item) }
      else
        format.json { render json: @item.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /items/1.json
  def update
    success = nil
    if swap_not_item? 
      ActiveRecord::Base.transaction do
        temp = @destination.list_order
        @destination.list_order = @source.list_order
        @source.list_order = temp
      end
      success = true 
    else
      success = @item.update(item_params)
    end

    respond_to do |format|
      if success
        format.json { render :show, status: :ok, location: user_item_url(@item.user_id, @item) }
      else
        format.json { render json: @item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /items/1.json
  def destroy
    respond_to do |format|
      if @item.destroy
        format.json { head :no_content }
      else #TODO: Check if there is some way of triggering this for testing
        format.json { render json: @item.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_and_verify #TODO: Make this common to both items and tags
      @user = User.find_by(id: params[:user_id])
      if @user.blank?
        head :forbidden
      end
    end

    def set_item_and_verify
      if swap_not_item
        @source      = Item.find_by id: swap_params["src_id"]
        @destination = Item.find_by id: swap_params["dst_id"]
        source_forbid = (!@source.blank?) && (@user != @source.user)
        destination_forbid = (!@destination.blank?) && (@user != @destination.user)
        if source_forbid || destination_forbid
          head: forbidden
        if @source.blank? || @destination.blank?
          not_found
        end
      else
        @item = Item.find params[:id]
        if @user != @item.user
          head :forbidden
        end
      end
    end

    # Only allow a list of trusted parameters through.
    def item_params
      params.fetch(:item, {}).permit(:done, :task, :tags)
    end
    
    def swap_params
      params.fetch(:swap, {}).permit(:src_id, :dst_id)
    end

    def swap_not_item #TODO: See if I can add question mark as postfix
      return !params[:is_swap].blank? #TODO: Figure this out later
    end
end