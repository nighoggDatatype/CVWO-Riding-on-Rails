import React from "react"
import Paper from "@material-ui/core/Paper";

interface Props {
  tags: string[],//TODO: If need be, see about making this the raw tags.
  onUpdate: (newTags: string[], changedTags:{before:string, after:string}[], deletedTags:string[]) => void,
}

class TagCloud extends React.Component<Props> {
  render () {
    return (
      <Paper>
        Tags: {this.props.tags}
      </Paper>
    );
  }
}
export default TagCloud
