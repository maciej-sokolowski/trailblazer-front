require_relative "config/environment"

module ::Guard
  # https://github.com/guard/guard/wiki/Create-a-guard
  class Torture < Plugin
  end
end

pages_config = ::Torture::Cms::DSL.(ViewsController::Pages)

controller = ViewsController.new()
req = ActionDispatch::Request.new 'HTTP_HOST' => 'example.com'
controller.instance_variable_set(:@_request, req)

puts "here comes full site compile"
pages, returned = ::Torture::Cms::Site.new.produce_versioned_pages(pages_config,
  controller: controller, # TODO: pass this to all cells.
)

file_to_page_map  = returned.fetch(:file_to_page_map)
h1_headers        = returned[:h1_headers]

guard :torture do
  pages = {"section/rails/cells.md.erb" => 99}

  # This runs the modified test
  watch /section\/(.*)/ do |m|
    puts %(Re-rendering #{m[0].inspect}...)
    # pp file_to_page_map

    book_name, version = file_to_page_map.fetch(m[0])


    book_options = pages_config.fetch(book_name)[:versions].fetch(version).fetch(:options)
    book_sections = pages_config.fetch(book_name)[:versions].fetch(version).fetch(:sections)

    page, _ = ::Torture::Cms::Site.new.render_page(name: book_name, sections: book_sections, **book_options)

    page, _ = ::Torture::Cms::Site.new.render_final_page(book_name, h1_headers: h1_headers,  controller: controller, **page)
    page, _ = ::Torture::Cms::Site.new.produce_page(**page)
  end
  # # This calls the plugin with a new file name - which may not even exist
  # watch(%r{^lib/(.*/)?([^/]+)\.rb$})     { |m| "test/#{m[1]}test_#{m[2]}.rb" }

  # # This call the plugin with the 'test' parameter - see Guard::Minitest docs
  # # for information in how it finds/choose files in the given 'test' directory
  # watch(%r{^test/test_helper\.rb$})      { 'test' }
end
