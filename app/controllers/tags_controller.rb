class TagsController < ApplicationController
  before_action :set_user_and_verify
  before_action :set_tag_and_verify, only: [:show, :update, :destroy]
  #TODO: Figure out mass updates

  # GET /tags.json
  def index
    @tags = Tag.where(user: @user)
  end

  # GET /tags/1.json
  def show
  end

  # POST /tags.json
  def create
    @tag = Tag.new(tag_params)

    respond_to do |format|
      if @tag.save
        format.json { render :show, status: :created, location: user_tag_url(@tag.user_id, @tag) }
      else
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tags/1.json
  def update
    respond_to do |format|
      if @tag.update(tag_params)
        format.json { render :show, status: :ok, location: user_tag_url(@tag.user_id, @tag) }
      else
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tags/1.json
  def destroy
    @tag.destroy
    respond_to do |format| #TODO: see if tag destroy can ever fail
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_and_verify
      @user = User.find(params[:user_id])
      if @user.blank?
        head :forbidden
      end
    end

    def set_tag_and_verify
      @tag = Tag.find(params[:id])
      if @user != @tag.user
        head :forbidden
      end
    end

    # Only allow a list of trusted parameters through.
    def tag_params
      params.fetch(:tag, {}).permit(:user_id, :tags_id, :name)
    end
end
