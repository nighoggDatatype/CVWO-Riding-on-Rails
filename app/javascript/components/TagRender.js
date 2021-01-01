import React from "react"
import PropTypes from "prop-types"
import Chip from '@material-ui/core/Chip';
class TagRender extends React.Component {
  render () {
    const handleDelete = (data) => console.log("");
    return (
      <React.Fragment>
        {this.props.tags.map((data) => 
          <li key={data}>
            <Chip
              size="small"
              label={data}
              onDelete={handleDelete(data)}
            />
          </li>
        )}
      </React.Fragment>
    );
  }
}

TagRender.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string)
};
export default TagRender
