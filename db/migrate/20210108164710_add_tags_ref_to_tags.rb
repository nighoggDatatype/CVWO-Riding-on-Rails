class AddTagsRefToTags < ActiveRecord::Migration[6.0]
  def change
    #This allows for tags to have parent tags
    add_reference :tags, :tags, null: true, foreign_key: true
  end
end
