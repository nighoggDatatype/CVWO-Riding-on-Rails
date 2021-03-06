Rails.application.routes.draw do
  root to: 'todo_app#index', default: {username: nil}
  get 'todo_app/index', to: 'todo_app#index', default: {username: nil}, format: false
  get 'todo_app/:username', to: 'todo_app#index', format: false #TOOD: Add constraints on username
  resources :user, only: [:index, :show, :create, :update], constraints: { format: 'json' }, :defaults => { :format => 'json' } do
    resources :tags , only: [:index, :show, :create, :update, :destroy]
    resources :items, only: [:index, :show, :create, :update, :destroy]
    resources :tabs , only: [:index, :show, :create, :update, :destroy]
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
