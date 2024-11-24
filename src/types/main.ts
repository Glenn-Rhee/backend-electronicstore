export interface ResponseUser<T, Te> {
  message: string;
  status: "success" | "failed";
  statusCode: number;
  data?: T;
  error?: Te;
}

export const responseUser = <T, Te>(
  data: ResponseUser<T, Te>
): ResponseUser<T, Te> => ({
  ...data,
});
