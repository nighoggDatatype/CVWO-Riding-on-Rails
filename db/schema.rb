# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_01_13_182251) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "items", force: :cascade do |t|
    t.boolean "done", null: false
    t.text "task", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id", null: false
    t.integer "list_order", null: false
    t.index ["user_id", "list_order"], name: "index_items_on_user_id_and_list_order", unique: true
    t.index ["user_id"], name: "index_items_on_user_id"
  end

  create_table "items_tags", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.bigint "tag_id", null: false
    t.index ["tag_id", "item_id"], name: "index_items_tags_on_tag_id_and_item_id", unique: true
  end

  create_table "tags", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "tags_id"
    t.integer "tag_level", null: false
    t.index ["name", "tags_id", "user_id"], name: "index_tags_on_name_and_tags_id_and_user_id", unique: true
    t.index ["tags_id"], name: "index_tags_on_tags_id"
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "username", null: false
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "items", "users", on_delete: :cascade
  add_foreign_key "items_tags", "items", on_delete: :cascade
  add_foreign_key "items_tags", "tags", on_delete: :cascade
  add_foreign_key "tags", "tags", column: "tags_id", on_delete: :cascade
  add_foreign_key "tags", "users", on_delete: :cascade
end
