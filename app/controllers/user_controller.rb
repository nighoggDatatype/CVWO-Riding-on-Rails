class UserController < ApplicationController
  #before_action :set_user_and_verify, only: [:show, :update, :destroy]
  #TODO: Figure out mass updates

  # GET /user.json
  def index
    if User.exists?(username: username_params) 
        head :conflict
    else
        head :no_content
    end
  end

  # GET /user/1.json
  def show
    #TODO: Figure this out later
  end

  # POST /user.json
  def create
    #TODO: Figure this out
  end

  # PATCH/PUT /user/1.json 
  def update
    #TODO: See about doing it properly some other time
  end

  # def destroy #TODO: Add this back if I ever implement passwords
  #   respond_to do |format|
  #     if @user.destroy
  #       format.json { head :no_content }
  #     else #TODO: Check if there is some way of triggering this for testing
  #       format.json { render json: @item.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  private
    def set_user_and_verify #TODO: Make this common to both tabs and tags
      @user = User.find_by(id: params[:user_id])
      if @user.blank?
        head :forbidden
      end
    end
    # Only allow a list of trusted parameters through.
    def username_params
      params.fetch(:username, "")
    end
end
