Rails.application.routes.draw do
  resources :tags #TODO: Make only do json operations, also only CRUD + Index operations I guess
  get 'todo_app/index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
