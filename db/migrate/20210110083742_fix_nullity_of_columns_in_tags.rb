class FixNullityOfColumnsInTags < ActiveRecord::Migration[6.0]
  def change
    change_column_null :tags, :name, false
    change_column_null :tags, :tag_level, false
  end
end
