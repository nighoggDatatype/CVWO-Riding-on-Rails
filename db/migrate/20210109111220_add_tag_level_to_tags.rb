class AddTagLevelToTags < ActiveRecord::Migration[6.0]
  def change
    add_column :tags, :tag_level, :integer
  end
end
