class TabsController < ApplicationController
  before_action :set_user_and_verify
  before_action :set_tab_and_verify, only: [:show, :update, :destroy]
  #TODO: Figure out mass updates

  # GET /tabs.json
  def index
    @tabs = Tab.where(user: @user).order(:tab_order)
  end

  # GET /tabs/1.json
  def show
  end

  # POST /tabs.json
  def create
    @tab = Tab.new(tab_params)
    @tab.user = @user

    respond_to do |format|
      if @tab.save
        format.json { render :show, status: :created, location: user_tab_url(@tab.user_id, @tab) }
      else
        format.json { render json: @tab.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tabs/1.json
  def update
    if swap_not_tab
      if @source == @destination
        render plain: "422 Unprocessable Entity", status: :unprocessable_entity
      else 
        Tab.transaction do
          temp = @destination.tab_order
          @destination.tab_order = @source.tab_order
          @source.tab_order = -1 #Note: tab order must allow negative 1 as the lowest number.
          @source.save!
          @destination.save!
          @source.tab_order = temp
          @source.save!
        end
        respond_to do |format|
          @tabs = Tab.where(id: [@source.id, @destination.id]).order(:tab_order)
          format.json { render :index, status: :ok }
        end
      end
    else
      respond_to do |format|
        if @tab.update(tab_params)
          format.json { render :show, status: :ok, location: user_tab_url(@tab.user_id, @tab) }
        else
          format.json { render json: @tab.errors, status: :unprocessable_entity }
        end
      end
    end

    
  end

  # DELETE /tabs/1.json
  def destroy
    respond_to do |format|
      if @tab.destroy
        format.json { head :no_content }
      else #TODO: Check if there is some way of triggering this for testing
        format.json { render json: @tab.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_and_verify #TODO: Make this common to both tabs and tags
      @user = User.find_by(id: params[:user_id])
      if @user.blank?
        head :forbidden
      end
    end

    def set_tab_and_verify
      if swap_not_tab
        @source      = Tab.find_by id: params[:id]
        @destination = Tab.find_by id: swap_params["target"]
        source_forbid = (!@source.blank?) && (@user != @source.user)
        destination_forbid = (!@destination.blank?) && (@user != @destination.user)
        if source_forbid || destination_forbid
          head :forbidden
        elsif @source.blank? || @destination.blank?
          render plain: "404 Not Found", status: :not_found
        end
      else
        @tab = Tab.find params[:id]
        if @user != @tab.user
          head :forbidden
        end
      end
    end

    # Only allow a list of trusted parameters through.
    def tab_params
      filtered = params.fetch(:tab, {}).permit(:name, tag_ids: [])
      if filtered[:tag_ids].blank?
        filtered[:tag_ids] = nil
      end 
      return filtered
    end
    
    def swap_params
      params.fetch(:swap, {}).permit(:target)
    end

    def swap_not_tab #TODO: See if I can add question mark as postfix
      return !params[:is_swap].blank? #TODO: Figure this out later
    end
end
