/**
 * / -> %2F 로 인코딩하면 querystring 자리에는 들어갈 수 있지만
 * Path 자리에는 보안상 문제로 못들어가게 함(Apache 기본 기준)
 * 이를 위한 해결법이 있는데
 * Apache AllowEncodedSlashs On | NoDecoded 옵션, Proxy ... nocanon
 * 이것도 안먹혀서 /를 다른 문자열로 치환해서 보내야 함.
 */

export const encodeUrlSlash = (component: string) => {
  return component.replaceAll('/', '!');
};

export const decodeUrlSlash = (component: string) => {
  return component.replaceAll('!', '/');
};
