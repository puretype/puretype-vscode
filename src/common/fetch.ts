import Auth from "./auth";

export function authenticatedFetch(auth: Auth): typeof fetch {
  return async function fetchWithAuth(
    input: string | Request | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(input, { ...init, headers });
  };
}
