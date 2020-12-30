import React from "react"
import PropTypes from "prop-types"
import Item from "./Item"
class ListBody extends React.Component {
  render () {
    return (
      <React.Fragment>
        {this.props.entries.map((data) => <Item {...data}/>)}
      </React.Fragment>
    );
  }
}

ListBody.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};
export default ListBody
