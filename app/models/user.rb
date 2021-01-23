class User < ApplicationRecord
    has_many :items, dependent: :destroy
    has_many :tags, dependent: :destroy
    has_many :tabs, dependent: :destroy #TODO: Write test code for this later
    validates :username, presence: true
    validates :username, uniqueness: true
    validates :username, format: {with: /\A\w+\Z/} #Expected format: CamelCase
    validates :username, length: { minimum: 10 }, unless: -> {username == "default"}
    def self.default
        User.find_by(username: "default")
    end
end
