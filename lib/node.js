var cx = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');
var ItemTypes = require('./const.js').ItemTypes;
var DragSource = require('react-dnd').DragSource;

var nodeSource = {
  beginDrag(props) {
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}


var Node = React.createClass({
  propTypes : {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  },
  renderCollapse() {
    var index = this.props.index;

    if(index.children && index.children.length) {
      var collapsed = index.node.collapsed;

      return connectDragSource (
        <span
          className={cx('collapse', collapsed ? 'caret-right' : 'caret-down')}
          onMouseDown={function(e) {e.stopPropagation()}}
          onClick={this.handleCollapse}>
        </span>
      );
    }

    return null;
  },

  renderChildren() {
    var index = this.props.index;
    var tree = this.props.tree;

    if(index.children && index.children.length) {
      var childrenStyles = {};
      if(index.node.collapsed) childrenStyles.display = 'none';
      childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

      return (
        <div className="children" style={childrenStyles}>
          {index.children.map((child) => {
            var childIndex = tree.getIndex(child);
            return (
              <Node
                tree={tree}
                index={childIndex}
                key={childIndex.id}
                paddingLeft={this.props.paddingLeft}
                onCollapse={this.props.onCollapse}
              />
            );
          })}
        </div>
      );
    }

    return null;
  },

  render() {
    console.log(this.props);
    var tree = this.props.tree;
    var index = this.props.index;
    var node = index.node;
    var styles = {};
    var connectDragSource = this.props.connectDragSource;
    var isDragging = this.props.isDragging;

    return connectDragSource(
      <div className={cx('m-node', '')} style={styles}>
        <div className="inner" ref="inner" onMouseDown={this.handleMouseDown}>
          {this.renderCollapse()}
          {tree.renderNode(node)}
        </div>
        {this.renderChildren()}
      </div>
    );
  },

  handleCollapse(e) {
    e.stopPropagation();
    var nodeId = this.props.index.id;
    if(this.props.onCollapse) this.props.onCollapse(nodeId);
  },

  handleMouseDown(e) {
    var nodeId = this.props.index.id;
    var dom = this.refs.inner;
  }
});

module.exports = DragSource(ItemTypes.NODE, nodeSource, collect)(Node);
