export type UserRole = "USER";

export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseModel {
  email: string;
  name: string;
  points: number;
}

export interface Coffee extends BaseModel {
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

export interface Art extends BaseModel {
  title: string;
  artist: string;
  price: number;
  image: string;
}

export interface Workshop extends BaseModel {
  title: string;
  capacity: number;
  price: number;
  date: string;
}
