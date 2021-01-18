class TagsController < ApplicationController
  before_action :set_user_and_verify
  #TODO: Consider the use of mass updates here for update
  #TODO: Get test suite and jbuilder up and running

  # GET /user/1.json
  def show
  end

  # POST /user.json
  def create
    @tag = Tag.new(tag_params)
    @tag.user = @user

    respond_to do |format|
      if @tag.save
        format.json { render :show, status: :created, location: user_tag_url(@tag.user_id, @tag) }
      else
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user/1.json
  def update
    respond_to do |format|
      if @tag.update(tag_params)
        format.json { render :show, status: :ok, location: user_tag_url(@tag.user_id, @tag) }
      else
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user/1.json
  def destroy
    respond_to do |format|
      if @tag.destroy
        format.json { head :no_content }
      else #TODO: Check if there is some way of triggering this for testing
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_and_verify
      @user = User.find_by(id: params[:user_id])
      if @user.blank?
        head :forbidden
      end
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.fetch(:user, {}).permit(:username)
    end

    def tags_params
      params.fetch(:tags, {}).permit(???) #TODO: figure these out, how to autenticate an array
    end

    def items_params
      params.fetch(:items, {}).permit(???) #TODO: figure these out
    end

    def tabs_params
      params.fetch(:tabs, {}).permit(???) #TODO: figure these out
    end
end
