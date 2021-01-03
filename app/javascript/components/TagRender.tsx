import React from "react"
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';

interface Props {
  tags: string[]
};

class TagRender extends React.Component<Props,{}> {
  render () {//NOTE: Don't reuse this for tag-cloud management, the interface requirements per tag are deletion, include, exclude, subtag creation, renaming, ect, and its too complex in general
    const handleDelete = (event) => {console.log(event)};//TODO: Make this work properly
    return (
      <React.Fragment>
        {this.props.tags.map((data) => 
            <Chip
              size="small"
              label={data}
              onDelete={handleDelete}
              style={{margin:"4px"}}
            />
        )}
        <Chip variant="outlined" size="small" style={{margin:"4px"}} icon={<AddIcon />} />
      </React.Fragment>
    );
  }
}
export default TagRender
