App.IterationController = Ember.ObjectController.extend

  needs: 'settings'

  hasStories: Ember.computed.gt 'filteredStories.length', 0

  sttgCtrl: Ember.computed.alias 'controllers.settings'

  filteredStories: (->
    stories = @get 'stories'

    showAcceptedType = @get 'sttgCtrl.showAcceptedType'
    showAcceptedValue = @get 'sttgCtrl.showAcceptedValue'

    cutoff = if showAcceptedType is 'count'
      numAcceptedStories = (_.filter stories, (story)=> @storyIsAccepted story).length
      cutoff = numAcceptedStories - showAcceptedValue
      if cutoff >= 0 then cutoff else 0
    else
      moment().startOf('day').subtract('days', showAcceptedValue).unix()

    _.filter stories, (story, index)=>
      if @storyIsAccepted(story)
        value = if showAcceptedType is 'count'
          index
        else
          moment(story.accepted_at).startOf('day').unix()

        value >= cutoff
      else
        true
  ).property 'stories', 'sttgCtrl.showAcceptedType', 'sttgCtrl.showAcceptedValue'

  storyIsAccepted: (story)->
    story.current_state is 'accepted'

  actions:

    toggleExpansion: ->
      @toggleProperty 'expanded'
      return
