export function getId(type: string): string {
  const id =
    type +
    new Date().toLocaleDateString().split("/").join("") +
    new Date().toLocaleTimeString().split(".").join("");

  return id;
}
