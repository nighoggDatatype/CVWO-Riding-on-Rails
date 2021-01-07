class CreateTags < ActiveRecord::Migration[6.0]
  def change
    create_table :tags do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.timestamps
    end
    add_index :tags, [:user_id, :name], unique: true
  end
end
