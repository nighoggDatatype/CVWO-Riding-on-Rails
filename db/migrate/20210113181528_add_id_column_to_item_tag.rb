class AddIdColumnToItemTag < ActiveRecord::Migration[6.0]
  def change
    add_column :items_tags, :id, :primary_key
  end
end
