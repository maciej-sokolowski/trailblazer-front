module Cms
  module Flow # DISCUSS: or "Steps" or something like that?
    def self.build(**steps)
      Class.new(Trailblazer::Activity::Railway) do
        steps.each do |name, options|
          step Torture::Cms::Page.method(:render_cell), **Flow.normalize_options(name, **options)
        end
      end
    end

    def self.normalize_options(name, template_file:, context_class:, options_for_cell:, **trb_options)
        template = ::Cell::Erb::Template.new(template_file) # TODO: of course, the cell should decide that.
        id = "render_#{name}"

        {
          id: id,
          Trailblazer::Activity::Railway.In() => [], # DISCUSS: change in TRB?
          Trailblazer::Activity::Railway.Inject(:context_class,     override: true) => ->(*) { context_class },
          Trailblazer::Activity::Railway.Inject(:template,          override: true) => ->(*) { template },
          Trailblazer::Activity::Railway.Inject(:options_for_cell,  override: true) => options_for_cell,
          **trb_options
        }
    end

    # Defaults for this app.
    @options_for_cell_without_content = ->(ctx, controller:, **) { {controller: controller} }
    @options_for_cell = ->(ctx, controller:, content:, **) { {yield_block: content, controller: controller} }
    singleton_class.attr_reader :options_for_cell_without_content, :options_for_cell
  end

end
