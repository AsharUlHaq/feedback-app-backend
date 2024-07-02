import { v4 as uuidv4 } from "uuid";

class CommonService {
  getOrCreateSingleton<T>(cls: new () => {} | T): T {
    const className = cls.name;
    if (!(global as any)[className]) (global as any)[className] = new cls();
    return (global as any)[className] as T;
  }

  exclude<T, Key extends keyof T>(object: T, objectKeys: Key[]): Omit<T, Key> {
    return Object.fromEntries(
      Object.entries(object as any).filter(
        ([key]) => !objectKeys.includes(key as any)
      )
    ) as Omit<T, Key>;
  }

  uuidGenerator() {
    return uuidv4();
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  removeSpecialCharacters(inputString: string): string {
    return inputString.replace(/[^\w\s]/gi, "");
  }

  generateRandomName(nameLength = 16) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let randomName = "";
    for (let i = 0; i < nameLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomName += characters.charAt(randomIndex);
    }

    return randomName;
  }
}

if (!(global as any)["commonService"])
  (global as any)["commonService"] = new CommonService();
export const commonService = (global as any)["commonService"] as CommonService;
