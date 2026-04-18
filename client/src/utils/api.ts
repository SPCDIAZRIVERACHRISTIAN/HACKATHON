function getCookie(name: string): string | null {
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    const [cookieName, ...cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue.join("="));
    }
  }

  return null;
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = getCookie("csrftoken");

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Only attach CSRF for non-GET requests
  if (options.method && options.method !== "GET") {
    (defaultHeaders as Record<string, string>)["X-CSRFToken"] =
      csrfToken || "";
  }

  return fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });
}
