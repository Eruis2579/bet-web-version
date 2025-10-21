export interface subcategorie {
  _id: string;
  key: string;
  group: string;
  title: string;
  description: string;
  isShow:boolean;
  createdAt:Date;
  updatedAt:Date;
}
export interface BetTypeLeague {
  _id: string;
  sports: subcategorie[];
}
