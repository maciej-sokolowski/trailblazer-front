# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "anchor-js", preload: true # @5.0.0
pin "scrollmagic", preload: true # @2.0.8
pin "scrollspy"
pin "navigations"
# pin "highlight.js/lib/core", to: "highlight.js--lib--core.js" # @11.8.0
# pin "highlight.js/lib/languages/ruby", to: "highlight.js--lib--languages--ruby.js" # @11.8.0
pin "highlight.js/lib/core", to: "https://ga.jspm.io/npm:highlight.js@11.8.0/es/core.js"
pin "highlight.js/lib/languages/ruby", to: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/es/languages/ruby.min.js"
