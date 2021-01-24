json.extract! tab, :id, :name
json.tag_ids do
  json.array! tab.tags, partial: "tags/tag", as: :tag
end
