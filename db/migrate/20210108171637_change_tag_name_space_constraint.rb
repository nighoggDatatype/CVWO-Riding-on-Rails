class ChangeTagNameSpaceConstraint < ActiveRecord::Migration[6.0]
  def change
    remove_index :tags, name: :index_tags_on_user_id_and_name
    add_index :tags, [:tags_id, :name], unique: true
  end
end
