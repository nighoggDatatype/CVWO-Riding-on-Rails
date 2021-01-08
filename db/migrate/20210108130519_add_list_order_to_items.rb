class AddListOrderToItems < ActiveRecord::Migration[6.0]
  def change
    add_column :items, :list_order, :integer
    add_index :items, [:user_id, :list_order], unique: true
  end
end
