json.extract! tag, :id, :name, :tags_id #TODO: Figure out about how to handle nil tags_id
json.url user_tag_url(tag, format: :json) #TODO: Figure out what this means
