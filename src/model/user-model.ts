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
