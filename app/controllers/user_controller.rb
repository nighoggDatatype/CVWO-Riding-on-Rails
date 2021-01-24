class UserController < ApplicationController
  before_action :set_user_and_verify, only: [:show, :update, :destroy]
  skip_before_action :verify_authenticity_token #This will do since we don't bother to authenticate.
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
    @tag_sorted = sorted_tag_params
    ActiveRecord::Base.transaction do
      #User
      @user = User.create!(username: username_params)

      #Tags
      @tagIdMap = Hash.new
      @tagsWithIds = []
      @tag_sorted.each{|tag| 
        #Generate and save tag
        safeTag = {name: tag.fetch(:name), tags_id: @tagIdMap[tag.fetch(:tags_id)]}
        newTag = @user.tags.create!(safeTag)
        #Build Dependency
        @tagIdMap[tag.fetch(:id)] = newTag.id
        @tagsWithIds << newTag
      }
      
      #Items
      @item_data = item_params.map{|item|{
            done: item.fetch(:done), 
            task: item.fetch(:task), 
            tag_ids: item.fetch(:tag_ids,[]).map{|tag| @tagIdMap[tag]}
        }
      }
      @itemsWithIds = @user.items.create!(@item_data)

      #Tabs
      @search_data = search_params.map{|tab|{
          name: tab.fetch(:name), 
          tag_ids: tab.fetch(:tag_ids,[]).map{|tag| @tagIdMap[tag]}
        }
      }
      @tabsWithIds= @user.tabs.create!(@search_data)
    end
    respond_to do |format|
        format.json { render :show, status: :created, location: todo_app_index_url(@user.username) }
    end
  end

  # PATCH/PUT /user/1.json 
  def update
    if @user = User.default
      head :forbidden
    end
    @tag_sorted = sorted_tag_params
    ActiveRecord::Base.transaction do
      #Clean house and reset
      @user.tags.clear
      @user.items.clear
      @user.tabs.clear

      #Tags
      @tagIdMap = Hash.new
      @tagsWithIds = []
      @tag_sorted.each{|tag| 
        #Generate and save tag
        safeTag = {name: tag.fetch(:name), tags_id: @tagIdMap[tag.fetch(:tags_id)]}
        newTag = @user.tags.create!(safeTag)
        #Build Dependency
        @tagIdMap[tag.fetch(:id)] = newTag.id
        @tagsWithIds << newTag
      }
      
      #Items
      @item_data = item_params.map{|item|{
            done: item.fetch(:done), 
            task: item.fetch(:task), 
            tag_ids: item.fetch(:tag_ids,[]).map{|tag| @tagIdMap[tag]}
        }
      }
      @itemsWithIds = @user.items.create!(@item_data)

      #Tabs
      @search_data = search_params.map{|tab|{
          name: tab.fetch(:name), 
          tag_ids: tab.fetch(:tag_ids,[]).map{|tag| @tagIdMap[tag]}
        }
      }
      @tabsWithIds= @user.tabs.create!(@search_data)
    end
    respond_to do |format|
        format.json { render :show, status: :created, location: todo_app_index_url(@user.username) }
    end
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

    def tag_params
      params.permit(tags: [:id, :tags_id, :name]).fetch(:tags, [])
    end

    def sorted_tag_params
      parentAlreadyFound = [nil]
      tag_sorted = []
      tag_data = tag_params
      target = tag_data.length
      while tag_sorted.length < target do
          tag_data = tag_data.delete_if {|tag|
              if parentAlreadyFound.include?(tag.fetch(:tags_id))
                  tag_sorted << tag
                  parentAlreadyFound << tag.fetch(:id)
                  true
              end
          }
      end
      return tag_sorted
    end

    def item_params
      params.permit(items: [:id, :done, :task, tag_ids:[]]).fetch(:items, [])
    end

    def search_params
      params.permit(tabs: [:id, :name, tag_ids:[]]).fetch(:tabs, [])
    end
end
