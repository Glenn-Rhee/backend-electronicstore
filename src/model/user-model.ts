import { Gender } from "@prisma/client";

export interface CreateUserRequest {
  fullname: string;
  gender: Gender;
  dateOfBirth: Date;
  phone: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface SetUserData {
  phone: string;
  email: string;
  address: string;
  sosmed: string;
  username: string;
  fullName: string;
  city: string;
  zipCode: string;
}
