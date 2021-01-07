class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.boolean :done
      t.text :task

      t.timestamps
    end
  end
end
