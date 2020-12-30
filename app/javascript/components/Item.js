import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from "prop-types"
import EditIcon from '@material-ui/icons/Edit';
class Item extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { done: this.props.done };
  }
  render () {
    const done = this.state.done;
    return (
      <li>
        Id: {this.props.id}, 
        <Checkbox
          checked={this.state.done}
          onClick={() => this.setState((prev) => ({done: !prev.done}))}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        {done ? <s>{this.props.task}</s> : this.props.task}
        <IconButton aria-label="edit">
            <EditIcon/>
        </IconButton>
        Tags: {this.props.tags}
      </li>
    );
  }
}

Item.propTypes = {
  id: PropTypes.number,
  done: PropTypes.bool,
  task: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string)
};
export default Item
