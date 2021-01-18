class CreateTabs < ActiveRecord::Migration[6.0]
  def change
    create_table :tabs, force: :cascade do |t|
      t.bigint "user_id", null: false
      t.string "name", null: false
      t.integer "tab_order", null: false
      t.timestamps
      t.index ["user_id", "tab_order"], name: "index_tabs_on_user_id_and_tab_order", unique: true
      t.index ["user_id"], name: "index_tabs_on_user_id"
    end
    
    create_table "tabs_tags", force: :cascade do |t|
      t.bigint "tab_id", null: false
      t.bigint "tag_id", null: false
      t.index ["tag_id", "tab_id"], name: "index_tabs_tags_on_tag_id_and_tab_id", unique: true
    end

    add_foreign_key "tabs", "users", on_delete: :cascade
    add_foreign_key "tabs_tags", "tabs", on_delete: :cascade
    add_foreign_key "tabs_tags", "tags", on_delete: :cascade
  end
end
