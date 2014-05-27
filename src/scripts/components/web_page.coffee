App.WebPageComponent = Ember.Component.extend

  tagName: 'iframe'

  attributeBindings: [
    'src'
    'sandbox'
    'frameborder'
    'marginheight'
    'marginwidth'
    'scrolling'
  ]

  sandbox: 'allow-same-origin allow-scripts allow-forms'
  frameborder: 0
  marginheight: 0
  marginwidth: 0
  scrolling: 'no'
