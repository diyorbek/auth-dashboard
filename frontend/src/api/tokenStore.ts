import { requestRefreshToken } from "./auth";

type Subscriber = () => unknown;

let accessToken: string | null = null;
const subscribers = new Set<Subscriber>();

export const tokenStore = {
  async getToken(force?: boolean): Promise<string> {
    if (!accessToken || force) {
      const response = await requestRefreshToken();
      accessToken = response.accessToken;
      this.notify();
    }

    return accessToken;
  },

  subscribe(callback: Subscriber) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  notify() {
    for (const callback of subscribers) {
      callback();
    }
  },
};

tokenStore.subscribe(() => {
  console.log("outside React");
});
