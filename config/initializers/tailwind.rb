Rails.application.config.tailwind = OpenStruct.new(
    p: {class: "mt-6"},
    pre: {class: "mt-4"},
    code: {class: "rounded"},
    codespan: {class: "text-purple"},
  ).freeze


class Kramdown::Converter::Fuckyoukramdown < Kramdown::Converter::Html
  def convert_p(el, *args)
    el.attr.merge!(Rails.application.config.tailwind.p)
    super
  end

  def convert_codespan(el, *args)
    el.attr.merge!(Rails.application.config.tailwind.codespan)
    super
  end
end
