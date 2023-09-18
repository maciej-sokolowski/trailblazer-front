class ViewsController < ApplicationController
  require "cells"
  require "cells/__erb__"
  require "torture/cms"


  module My
    module Cell
      def self.delegate_to_controller_helpers(target, *methods) # FIXME: move to cells gem
        methods.each do |name|
          target.define_method name do |*args, **kws, &block|
            @options[:controller].helpers.send(name, *args, **kws, &block)
          end
        end
      end


      # This is delibarately a PORO, and not a cell, to play with the "exec_context" concept.
      class Section # #Torture::Cms::Section
        include Torture::Cms::Helper::Header # needs {headers}
        include Torture::Cms::Helper::Code   # needs {extract}

        def initialize(controller:, **options)
          @options = options.merge(controller: controller)
        end

        def to_h
          {
            headers: @options[:headers]
          }
        end

        def code_tabs(*args, **kws) # TODO: implement tabs
          code(*args, **kws)
        end
        def api(*) # FIXME: implement

        end

            # = image_tag "info_icon.svg"
        def info(type: :info, &block) # TODO: use cell for this.
          # TODO: allow kramdown
          %(<div class="rounded flex p-4 gap-4 mt-5 bg-bg-purple-1/50">
          #{@options[:controller].helpers.image_tag "info_icon.svg"}
<p>
  #{yield}
</p>
</div>)
        end

        def warning(&block)  # TODO: use info parametrized.
          # TODO: allow kramdown
          %(<div class="rounded flex p-4 gap-4 mt-5 bg-bg-orange">
          #{@options[:controller].helpers.image_tag "light_bulb_icon.svg"}
<p>
  #{yield}
</p>
</div>)
        end

        My::Cell.delegate_to_controller_helpers(self, :image_tag)

        module H
          def h2(*args, **options)
            super(*args, **options, classes: "text-2xl font-bold text-neutral-500 lg:text-3xl mt-6")
          end

          def h3(*args, **options)
            super(*args, **options, classes: "font-bold text-neutral-500 lg:text-2xl mt-6 text-xl")
          end

          def h4(*args, **options)
            super(*args, **options, classes: "font-bold text-neutral-500 lg:text-1xl mt-4 text-xl")
          end
        end

        include H
      end
    end
  end

  module Application
    module Cell
      class Container
        def initialize(controller:, **options)
          @options = options.merge(controller: controller)
        end

        My::Cell.delegate_to_controller_helpers(self, :csrf_meta_tags, :csp_meta_tag, :stylesheet_link_tag, :javascript_importmap_tags)

        def to_h
          {}
        end
      end

      class Layout
        # TODO: abstract into cells-5.
        module Render
          def initialize(controller:, **options)
            @options = options.merge(controller: controller)
          end

          My::Cell.delegate_to_controller_helpers(self, :link_to, :image_tag) # navbar.erb

          def render(template)
            ::Cell.({template: template, exec_context: self}) # DISCUSS: does {render} always mean we want the same exec_context?
          end

          def to_h
            {}
          end
        end

        include Render

        def navbar_link_to(text, path)
          link_to text, path, class: "font-medium text-base uppercase hover:scale-110 lg:normal-case lg:font-semibold"
        end
      end

      # This is delibarately a PORO, and not a cell, to play with the "exec_context" concept.
      class Section # #Torture::Cms::Section
        include Torture::Cms::Helper::Header # needs {headers}

        def initialize(controller:, **options)
          @options = options.merge(controller: controller)
        end

        def to_h
          {
            headers: @options[:headers]
          }
        end
      end
    end
  end

  module Documentation
    module Cell
      class TocRight
        def initialize(controller:, h2:, **options)
          @options = options.merge(controller: controller, h2: h2)
        end

        My::Cell.delegate_to_controller_helpers(self, :link_to)

        def h2
          @options[:h2]
        end

        def css_id
          "right-toc-#{@options[:h2].id}"
        end

        def to_h
          {}
        end
      end

      class Layout
        def link_to(text, url, **options)
          %(<a href="" class="#{options[:class]}">#{text}</a>)
        end

        def initialize(left_toc_html:, right_tocs_html:, version_options:)
          @options = {left_toc_html: left_toc_html, right_tocs_html: right_tocs_html, documentation_title: version_options[:title]||raise }
        end

        def to_h
          {}
        end

        def toc_left
          @options[:left_toc_html]
        end

        def tocs_right
          @options[:right_tocs_html]
        end

        def documentation_title
          @options[:documentation_title]
        end
      end

      class TocLeft
        def initialize(headers:)
          @options = {headers: headers}
        end

        def link_to(text, url, **options)
          %(<a href="#{url}" class="#{options[:class]}">#{text}</a>)
        end

        def to_h
          {}
        end
      end
    end

    Flow = Cms::Flow.build(
      toc_left:     {template_file: "app/concepts/cell/documentation/toc_left.erb", context_class: Documentation::Cell::TocLeft,
        options_for_cell: ->(ctx, level_1_headers:, **) { {headers: level_1_headers} },
        Trailblazer::Activity::Railway.Out() => {:content => :left_toc_html}},

      page:         {template_file: "app/concepts/cell/documentation/documentation.erb", context_class: Documentation::Cell::Layout,
        options_for_cell: ->(ctx, left_toc_html:, right_tocs_html:, content:, **options) { {yield_block: content, left_toc_html: left_toc_html, right_tocs_html: right_tocs_html, version_options: options} }},

      application:  {template_file: "app/concepts/cell/application/layout.erb", context_class: Application::Cell::Layout, options_for_cell: Cms::Flow.options_for_cell},
      html:         {template_file: "app/concepts/cell/application/container.erb", context_class: Application::Cell::Container, options_for_cell: Cms::Flow.options_for_cell}
    )

    class Render < Trailblazer::Activity::Railway
      step :render_right_tocs
      step Subprocess(Flow)

      def render_right_tocs(ctx, headers:, controller:, **)
        context_class = Documentation::Cell::TocRight
        template = ::Cell::Erb::Template.new("app/concepts/cell/documentation/toc_right.erb")

        right_tocs =
          headers[2].collect do |h2|
            cell_instance = context_class.new(h2: h2, controller: controller) # DISCUSS: what options to hand in here?

            result = ::Cell.({template: template, exec_context: cell_instance})

            result.to_s
          end

        ctx[:right_tocs_html] = right_tocs.join("\n")
      end
    end
  end

  module Landing
    class Cell
      include Application::Cell::Layout::Render
    end

    Flow = Cms::Flow.build(
      page: {template_file: "app/concepts/cell/landing/landing.erb", context_class: Landing::Cell, options_for_cell: Cms::Flow.options_for_cell_without_content},
      html: {template_file: "app/concepts/cell/application/container.erb", context_class: Application::Cell::Container, options_for_cell: Cms::Flow.options_for_cell}
    )
  end

  module Pro
    class Cell
      include Application::Cell::Layout::Render
    end

    Flow = Cms::Flow.build(
      page:         {template_file: "app/concepts/cell/pro/pro.erb", context_class: Pro::Cell, options_for_cell: Cms::Flow.options_for_cell_without_content},
      application:  {template_file: "app/concepts/cell/application/layout.erb", context_class: Application::Cell::Layout, options_for_cell: Cms::Flow.options_for_cell},
      html:         {template_file: "app/concepts/cell/application/container.erb", context_class: Application::Cell::Container, options_for_cell: Cms::Flow.options_for_cell}
    )
  end

  Pages = {
    # top-level options, going to all books.
    render: Documentation::Render,

    section_cell: My::Cell::Section,
    section_cell_options: {
      controller: self,
      pre_attributes: Rails.application.config.tailwind.pre,
      code_attributes: Rails.application.config.tailwind.code,
    },
    kramdown_options: {converter: "to_fuckyoukramdown"}, # use Kramdown::Torture parser from the torture-server gem.


    "trailblazer" => { # FIXME
      toc_title: "Trailblazer",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/trailblazer/index.html",
        target_url:  "/2.1/docs/trailblazer/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "rails_integration" => { # FIXME
      toc_title: "Rails integration",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/rails_integration/index.html",
        target_url:  "/2.1/docs/rails_integration/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "test" => { # FIXME
      toc_title: "Test",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/test/index.html",
        target_url:  "/2.1/docs/test/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "internals" => { # FIXME
      toc_title: "Internals",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/internals/index.html",
        target_url:  "/2.1/docs/internals/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "activity" => {
      toc_title: "Activity",
      "2.1" => {
        title: "Activity",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/activity/index.html",
        target_url:  "/2.1/docs/activity/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" },
        "dsl/strategy.md.erb" => { snippet_file: "strategy_test.rb" },
        "dsl/api.md.erb" => { snippet_file: "basics_test.rb" },
        "dsl/path.md.erb" => { snippet_file: "path_test.rb" },
        "dsl/subprocess.md.erb" => { snippet_file: "subprocess_test.rb" },
        "dsl/options.md.erb" => { snippet_file: "subprocess_test.rb" },
        "dsl/sequence.md.erb" => { snippet_file: "sequence_options_test.rb" },
        "dsl/patching.md.erb" => { snippet_file: "patching_test.rb" },
        "dsl/composable_variable_mapping.md.erb" => { snippet_file: "composable_variable_mapping_test.rb" },
        "dsl/variable_mapping.md.erb" => { snippet_file: "variable_mapping_test.rb" },
        "dsl/macro.md.erb" => { snippet_file: "macro_test.rb" },
        "internals.md.erb" => { snippet_file: "macro_test.rb" },
        "internals/introspect.md.erb" => { snippet_file: "introspect_test.rb" },
        "interfaces.md.erb" => { snippet_file: "activity_test.rb" },
        "task_wrap.md.erb" => { snippet_file: "task_wrap_test.rb" },
        "troubleshooting.md.erb" => {section_dir: "section/developer", snippet_dir: "../trailblazer-developer/test/docs", snippet_file: "developer_test.rb" },
        "kitchen_sink.md.erb" => { snippet_file: "____test.rb" },
      }
    },

    "macro" => {
      toc_title: "Macro",
      "2.1" => {
        title: "Macro",
        snippet_dir: "../trailblazer-macro/test/docs",
        section_dir: "section/macro",
        target_file: "public/2.1/docs/macro/index.html",
        target_url: "/2.1/docs/macro/index.html",

        "overview.md.erb"   => {snippet_file: "model_test.rb"},
        "nested/dynamic.md.erb"   => {snippet_file: "nested_static_test.rb"},
        "nested/auto_wire.md.erb"   => {snippet_file: "nested_static_test.rb"},
        "wrap.md.erb"   => {snippet_file: "wrap_test.rb"},
        "each.md.erb"   => {snippet_file: "each_test.rb"},
        "model_find.md.erb"   => {snippet_file: "model/find_test.rb"},
        "model.md.erb"   => {snippet_file: "model_test.rb"},
        "rescue.md.erb"   => {snippet_file: "rescue_test.rb"},
        "policy.md.erb"   => {snippet_file: "policy_test.rb"},
      }
    },

    "operation" => {
      toc_title: "Operation",
      "2.1" => {
        title: "Operation",
        snippet_dir: "../trailblazer-operation/test/docs",
        section_dir: "section/operation",
        target_file: "public/2.1/docs/operation/index.html",
        target_url: "/2.1/docs/operation/index.html",
      }
    },

    "workflow" => { # FIXME
      toc_title: "Workflow",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/workflow/index.html",
        target_url:  "/2.1/docs/workflow/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "endpoint" => { # FIXME
      toc_title: "Endpoint",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/endpoint/index.html",
        target_url:  "/2.1/docs/endpoint/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "reform" => { # FIXME
      toc_title: "Reform",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/reform/index.html",
        target_url:  "/2.1/docs/reform/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "cells" => { # FIXME
      toc_title: "Cells",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/cells/index.html",
        target_url:  "/2.1/docs/cells/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "representable" => { # FIXME
      toc_title: "Representable",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/representable/index.html",
        target_url:  "/2.1/docs/representable/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "disposable" => { # FIXME
      toc_title: "Trailblazer",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/disposable/index.html",
        target_url:  "/2.1/docs/disposable/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "roar" => { # FIXME
      toc_title: "Roar",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/roar/index.html",
        target_url:  "/2.1/docs/roar/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "tutorials" => { # FIXME
      toc_title: "Tutorials",
      "2.1" => {
        title: "Trailblazer",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "section/activity",
        target_file: "public/2.1/docs/tutorial/index.html",
        target_url:  "/2.1/docs/tutorial/index.html",

        "activity.md.erb" => { snippet_file: "basics_test.rb" }
      }
    },

    "pro_page" => {
      toc_title: "Trailblazer PRO",
      toc_left: false,
      "2.1" => {
        title: "Trailblazer PRO",
        snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
        section_dir: "sections/page",
        target_file: "public/2.1/pro.html",
        target_url:  "/2.1/pro.html",
        render: Pro::Flow,
      }
    },

  }

  def docs # TODO: remove me, this is only for development.
    pages = Torture::Cms::DSL.(Pages)

    pages, _ = Torture::Cms::Site.new.render_pages(pages,
      controller: self, # TODO: pass this to all cells.
    )

    activity_content_html = pages[0].to_h["2.1"][:content]

    render html: activity_content_html.html_safe
  end

  def product
    pages = {
      "pro_page" => {
        toc_title: "Trailblazer PRO",
        "2.1" => {
          title: "Trailblazer PRO",
          snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
          section_dir: "sections/page",
          target_file: "public/2.1/pro.html",
          target_url:  "/2.1/pro.html",
          render: Pro::Flow,
        }
      },
    }

    pages = Torture::Cms::DSL.(pages)

    pages, _ = Torture::Cms::Site.new.render_pages(pages,
      controller: self,
      kramdown_options: {converter: "to_fuckyoukramdown"}, # use Kramdown::Torture parser from the torture-server gem.
    )

    # raise pages[0].to_h["2.1"].inspect

    activity_content_html = pages[0].to_h["2.1"][:content]

    render html: activity_content_html.html_safe
  end

  def landing
    pages = {
      kramdown_options: {converter: "to_fuckyoukramdown"}, # use Kramdown::Torture parser from the torture-server gem.
      "landing" => {
        toc_title: "Trailblazer",
        "2.1" => {
          title: "Trailblazer",
          snippet_dir: "../trailblazer-activity-dsl-linear/test/docs",
          section_dir: "sections/page",
          target_file: "public/2.1/pro.html",
          target_url:  "/2.1/pro.html",
          render:      Landing::Flow,
        }
      },
    }

    pages = Torture::Cms::DSL.(pages)

    pages, _ = Torture::Cms::Site.new.render_pages(pages,
      controller: self,
    )

    activity_content_html = pages[0].to_h["2.1"][:content]

    render html: activity_content_html.html_safe
  end

  def about;end

  def blog;end
end
