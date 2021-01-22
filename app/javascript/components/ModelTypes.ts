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