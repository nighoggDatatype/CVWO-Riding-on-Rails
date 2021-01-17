json.extract! tab, :id, :name
json.tags do
  json.array! tab.tags, partial: "tags/tag", as: :tag
end
