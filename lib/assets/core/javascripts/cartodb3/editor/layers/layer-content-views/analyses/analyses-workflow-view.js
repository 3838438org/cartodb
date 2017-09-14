var CoreView = require('backbone/core-view');
var template = require('./analyses-workflow.tpl');
var ListView = require('./analyses-workflow-list-view');
var ScrollView = require('../../../../components/scroll/scroll-view');
var checkAndBuildOpts = require('../../../../helpers/required-opts');

var REQUIRED_OPTS = [
  'analysisDefinitionNodesCollection',
  'analysisFormsCollection',
  'viewModel',
  'layerDefinitionModel'
];

module.exports = CoreView.extend({

  initialize: function (opts) {
    checkAndBuildOpts(opts, REQUIRED_OPTS, this);

    this.listenTo(this._analysisDefinitionNodesCollection, 'add', function () {
      // change:source happens when a node is deleted as well, so we can't just listen to it all the time
      this._layerDefinitionModel.once('change:source', this.render, this);
    });
  },

  render: function () {
    this.clearSubViews();
    this.$el.html(this._html());
    this._renderAnalysesView();
    return this;
  },

  _html: function () {
    return template({
      selectedNodeId: this._viewModel.get('selectedNodeId'),
      layerAnalysisCount: this._layerDefinitionModel.getNumberOfAnalyses()
    });
  },

  _renderAnalysesView: function () {
    var self = this;
    var view = new ScrollView({
      type: 'horizontal',
      createContentView: function () {
        return new ListView({
          analysisDefinitionNodesCollection: self._analysisDefinitionNodesCollection,
          analysisFormsCollection: self._analysisFormsCollection,
          model: self._viewModel,
          layerId: self._layerDefinitionModel.id
        });
      }
    });

    this.$('.ie11-hotfix').append(view.render().el);
    this.addView(view);
  }
});
