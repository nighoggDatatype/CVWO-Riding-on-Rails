class FixJoinTable < ActiveRecord::Migration[6.0]
  def change
    add_foreign_key "items_tags", "tags"
    add_foreign_key "items_tags", "items"
  end
end
