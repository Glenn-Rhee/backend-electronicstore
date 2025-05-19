export interface SetStoreRequest {
  phone: string;
  email: string;
  address: string;
  sosmed: string;
  username: string;
  fullName: string;
  storeName: string;
  storeDescription: string;
  storeCategory: "LAPTOP" | "ACCESSORIES";
  openStore: string;
  closeStore: string;
  bankName: string;
  accountNumber: string;
  urlImage: string;
  city: string;
  zipCode: string;
}
