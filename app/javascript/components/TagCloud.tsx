import React from "react"

interface Props {
  tags: string[],//TODO: If need be, see about making this the raw tags.
  onUpdate: (event: string[]) => void,
  onRename: (event: {before:string, after:string}[]) => void,
}

class TagCloud extends React.Component<Props> {
  render () {
    return (
      <React.Fragment>
        Tags: {this.props.tags}
      </React.Fragment>
    );
  }
}
export default TagCloud
