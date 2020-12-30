import React from "react"
import PropTypes from "prop-types"
import Item from "./Item"//TODO: Check if this actually works
class ListBody extends React.Component {
  render () {
    return (
      <React.Fragment>
        {data.map((current) => <Item {...current}/>)}//TODO: Test this first
      </React.Fragment>
    );
  }
}

ListBody.propTypes = {
  entries: PropTypes.arrayOf(Item.propTypes)
};
export default ListBody
