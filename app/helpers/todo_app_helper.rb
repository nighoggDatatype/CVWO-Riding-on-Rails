module TodoAppHelper
    def get_json_as_var(template, locals_hash = {})
        render(template: template, formats: [:json], locals: locals_hash).html_safe
      end
end
