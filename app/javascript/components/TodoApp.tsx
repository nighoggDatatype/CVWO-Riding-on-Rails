import React from "react"
import TagCloud from "./TagCloud"

interface Props {
};

interface TagData {
  name:string,
  parentId?:number,
  cachedFullName?:string
}

interface State {
  tagCloud:Map<number,TagData> //To get key array from hashmap: Array.from(state.tagCloud.keys())
  tagState:string[]
};
class TodoApp extends React.Component<Props,State> {
  buildFullNames (dataStruct:Map<number,TagData>) {
    let built: Map<number,string> = new Map<number,string>();
    while (built.size < dataStruct.size){
      dataStruct.forEach((value, id) => {
        if (value.parentId !== undefined){
          let parentTag = built.get(value.parentId);
          if (parentTag !== undefined){
            built.set(id, parentTag + ":" + value.name);
          }
        } else {
          built.set(id, value.name);
        }
      });
    }
    for (let [id, fullName] of built.entries()) {
      let oldData = dataStruct.get(id);
      oldData.cachedFullName = fullName;
      dataStruct.set(id, oldData);
    }
    return dataStruct;
  }
  constructor(props) {
    super(props);
    var tempCloud = new Map<number,TagData>();
    tempCloud.set(1,{name: "Test String"});
    tempCloud.set(2,{name: "TAG"});
    tempCloud.set(3,{name: "Kill", parentId: 2});
    this.state = {
      tagCloud: this.buildFullNames(tempCloud),
      tagState: ["Test String"]
    }
  }
  extractCachedNames(){
    let cloud = this.state.tagCloud;
    return Array.from( cloud.values() ).map(value => value.cachedFullName);
  }

  reverseLookUp(fullTag:string){
    if (fullTag === undefined) return undefined;
    for(let [id,data] of this.state.tagCloud){
      if (data.cachedFullName == fullTag){
        return id;
      }
    }
    return;
  }

  render () {
    const state = this.state;
    const onCreate = (domain:string, newName:string) => //TODO: Replace with proper code
      this.setState((prev) => {
        let newIndex:number = undefined
        do{
          newIndex = Math.floor(Math.random() * 1000 * 1000);  
        }while(prev.tagCloud.get(newIndex) !== undefined);
        prev.tagCloud.set(newIndex, {
          name: newName,
          parentId: this.reverseLookUp(domain.slice(0,-1)),
          cachedFullName: domain+newName, })
        return {tagCloud: prev.tagCloud}
      });
    const onUpdate = (originalTag:string, newName:string) =>
      this.setState((prev) =>{
        const index = this.reverseLookUp(originalTag)
        let data = prev.tagCloud.get(index);
        data.name = newName
        prev.tagCloud.set(index,data);

        return {tagCloud: this.buildFullNames(prev.tagCloud)}
      });
    const onDestroy = (deleteTarget:string) => {
      this.setState((prev) => {
        let deleteIdTargets = [this.reverseLookUp(deleteTarget)]; //Used when deleteing item tags later
        let cloud = prev.tagCloud;
        for(let i = 0; i < deleteIdTargets.length; i+=1){
          cloud.delete(deleteIdTargets[i])
          for(let [key,value] of cloud){
            if (value.parentId == deleteIdTargets[i]){
              deleteIdTargets.push(key);
            }
          }
        }
        return {tagCloud: cloud};
      })
    }
    return (
      <React.Fragment>
        <TagCloud 
          tagCloud={this.extractCachedNames()}
          tagSelection={state.tagState}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDestroy={onDestroy}
        />
      </React.Fragment>
    );
  }
}

export default TodoApp