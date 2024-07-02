export class UrlMapper {
  static map(urlPath: string, params: Record<string, any>) {
    const url = new URL(urlPath);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    return url.toString();
  }
}
