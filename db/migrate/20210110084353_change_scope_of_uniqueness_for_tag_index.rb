class ChangeScopeOfUniquenessForTagIndex < ActiveRecord::Migration[6.0]
  def change
    remove_index :tags, name: :index_tags_on_tags_id_and_name
    add_index :tags, [:name, :tags_id, :user_id], unique: true
  end
end
