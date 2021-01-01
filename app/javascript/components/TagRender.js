import React from "react"
import PropTypes from "prop-types"
import Chip from '@material-ui/core/Chip';
class TagRender extends React.Component {
  render () {
    const handleDelete = (data) => console.log("");//TODO: Make this work properly
    return (
      <React.Fragment>
        {this.props.tags.map((data) => 
            <Chip
              size="small"
              label={data}
              onDelete={handleDelete(data)}
            />
        )}
      </React.Fragment>
    );
  }
}

TagRender.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string)
};
export default TagRender
