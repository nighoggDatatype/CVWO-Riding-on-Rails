class TagsController < ApplicationController
  before_action :set_tag, only: [:show, :update, :destroy]
  #TODO: Figure what "before_action" does, and how to make everything json only
  #TODO: Figure out the general structure of this file.
  #TODO: Figure out how jbuilder works
  #TODO: Figure out mass updates
  #TODO: Figure out how to test this

  # GET /tags.json
  def index
    @tags = Tag.all #TODO: Filter by user
  end

  # GET /tags/1.json
  def show
    #TODO: Filter by user, or throw error
  end

  # POST /tags.json
  def create
    @tag = Tag.new(tag_params)

    respond_to do |format|
      if @tag.save
        format.json { render :show, status: :created, location: @tag }
      else
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tags/1.json
  def update
    respond_to do |format|
      if @tag.update(tag_params)
        format.json { render :show, status: :ok, location: @tag }
      else
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tags/1.json
  def destroy
    @tag.destroy
    respond_to do |format| #TODo: see if tag destroy can ever fail
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tag
      @tag = Tag.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def tag_params
      params.fetch(:tag, {})
    end

    def user_has_tag?
      #TOOD: Check tag's stored user_id against user_id
    end
end
