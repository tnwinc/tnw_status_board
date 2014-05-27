App.WebPageComponent = Ember.Component.extend

  tagName: 'iframe'

  attributeBindings: [
    'src'
    'frameborder'
    'marginheight'
    'marginwidth'
    'scrolling'
  ]

  frameborder: 0
  marginheight: 0
  marginwidth: 0
  scrolling: 'no'
