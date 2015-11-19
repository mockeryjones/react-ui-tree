'use strict';

var React = require('react');
var Tree = require('./tree');
var Node = require('./node');

module.exports = React.createClass({
  displayName: 'UITree',

  propTypes: {
    tree: React.PropTypes.object.isRequired,
    paddingLeft: React.PropTypes.number,
    renderNode: React.PropTypes.func.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      paddingLeft: 20
    };
  },
  getInitialState: function getInitialState() {
    return this.init(this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!this._updated) this.setState(this.init(nextProps));else this._updated = false;
  },
  init: function init(props) {
    var tree = new Tree(props.tree);
    tree.isNodeCollapsed = props.isNodeCollapsed;
    tree.renderNode = props.renderNode;
    tree.changeNodeCollapsed = props.changeNodeCollapsed;
    tree.updateNodesPosition();

    return {
      tree: tree
    };
  },
  render: function render() {
    console.log('rendering tree');
    var tree = this.state.tree;
    var dragging = this.state.dragging;

    return React.createElement(
      'div',
      { className: 'm-tree' },
      draggingDom,
      React.createElement(Node, {
        tree: tree,
        index: tree.getIndex(1),
        key: 1,
        paddingLeft: this.props.paddingLeft,
        onCollapse: this.toggleCollapse,
        dragging: dragging && dragging.id
      })
    );
  },
  change: function change(tree) {
    this._updated = true;
    if (this.props.onChange) this.props.onChange(tree.obj);
  },
  toggleCollapse: function toggleCollapse(nodeId) {
    var tree = this.state.tree;
    var index = tree.getIndex(nodeId);
    var node = index.node;
    node.collapsed = !node.collapsed;
    tree.updateNodesPosition();

    this.setState({
      tree: tree
    });

    this.change(tree);
  }
});