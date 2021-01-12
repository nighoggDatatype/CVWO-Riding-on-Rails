class User < ApplicationRecord
    has_many :items, dependent: :destroy  #TODO: Check if :item needs to be :items
    has_many :tags, dependent: :destroy   #TODO: Ditto as above, also check if cascade works later
    validates :username, presence: true
    validates :username, uniqueness: true
    validates :username, format: {with: /\A\w+\Z/} #Expected format: CamelCase
    validates :username, length: { minimum: 10 } #Note: Only care about minimum to prevent wardialing
    #TODO: Mirror cascading delete to schema
end
