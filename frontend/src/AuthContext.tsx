import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useLogout } from "./api/auth";
import { tokenStore } from "./api/tokenStore";
import { useEffectOnce } from "./helpers/useEffectOnce";

const Context = createContext<{
  accessToken?: string;
} | null>(null);

/*
  Context object needs to stay private and its items/data must be exposed carefully.
  Because we want to be purposeful in what we do and discourage wrong/unintended usage.

  Created separate hooks for context items for maintainability and visibility.
  If components or hooks need access token only, no need to provide token setter.
  It makes it easier to identify:
    1. where access token is consumed
    2. where access token is set
*/
export function useAccessToken() {
  const context = useContext(Context);

  if (!context) throw new Error("useAccessToken is used outside AuthContext");

  return context.accessToken;
}

export function AuthContext({ children }: PropsWithChildren) {
  const logout = useLogout();
  const [accessToken, setAccessToken] = useState<string>();

  useEffectOnce(() => {
    tokenStore
      .getToken()
      .then(setAccessToken)
      .catch(async () => {
        await logout();
      });

    const unsubscribe = tokenStore.subscribe(async () => {
      console.log("inside hook");

      setAccessToken(await tokenStore.getToken());
    });

    return () => void unsubscribe();
  });

  return <Context value={{ accessToken }}>{children}</Context>;
}
