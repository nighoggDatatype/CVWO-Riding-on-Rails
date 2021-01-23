export interface TagData {
  name:string,
  tags_id?:number,
  cachedFullName?:string,
}

export interface TagJson extends TagData {
  id:number,
}
export interface ItemData {
  done: boolean,
  task: string,
  tags: number[],
}

export interface ItemJson extends ItemData{
  id: number,
}

export interface SearchTabData {
  name: string,
  tags: number[],
}

export interface SearchTabJson extends SearchTabData{
    id: number,
}
export function generateTempId(existingData: Map<number,any>){
  let newIndex:number = null;
  do{
    newIndex = Math.floor(Math.random() * 1000 * 1000);  
  } while(existingData.get(newIndex) != null);
  return newIndex;
}

export interface UserJson {
    id: number
    username: string
}

export interface StateJson{
    tags: TagJson[],
    items: ItemJson[],
    tabs: SearchTabJson[],
}