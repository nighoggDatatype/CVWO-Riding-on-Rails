class MakeColumnsNotNullItems < ActiveRecord::Migration[6.0]
  def change
    change_column_null :items, :done, false
    change_column_null :items, :task, false
    change_column_null :items, :list_order, false
  end
end
