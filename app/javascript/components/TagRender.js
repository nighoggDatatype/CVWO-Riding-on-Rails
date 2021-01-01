import React from "react"
import PropTypes from "prop-types"
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
class TagRender extends React.Component {
  render () {//NOTE: Don't reuse this for tag-cloud management, the interface requirements per tag are deletion, include, exclude, subtag creation, renaming, ect, and its too complex in general
    const handleDelete = (data) => console.log("");//TODO: Make this work properly
    return (
      <React.Fragment>
        {this.props.tags.map((data) => 
            <Chip
              size="small"
              label={data}
              onDelete={handleDelete(data)}
              style={{margin:"4px"}}
            />
        )}
        <Chip variant="outlined" size="small" style={{margin:"4px"}} icon={<AddIcon />} />
      </React.Fragment>
    );
  }
}

TagRender.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string)
};
export default TagRender
