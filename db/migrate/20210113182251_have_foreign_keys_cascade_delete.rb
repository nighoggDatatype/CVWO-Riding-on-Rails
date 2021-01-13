class HaveForeignKeysCascadeDelete < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key  "items", "users"
    add_foreign_key     "items", "users",                  on_delete: :cascade
    
    remove_foreign_key  "items_tags", "items"
    add_foreign_key     "items_tags", "items",             on_delete: :cascade
    
    remove_foreign_key  "items_tags", "tags"
    add_foreign_key     "items_tags", "tags",              on_delete: :cascade
    
    remove_foreign_key  "tags", "tags", column: "tags_id"
    add_foreign_key     "tags", "tags", column: "tags_id", on_delete: :cascade
    
    remove_foreign_key  "tags", "users"
    add_foreign_key     "tags", "users",                   on_delete: :cascade
  end
end
