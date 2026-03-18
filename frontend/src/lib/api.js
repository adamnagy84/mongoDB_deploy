const API_URL = import.meta.env.VITE_API_URL;

/* options, és options.headers nem ugyanaz */
/* ki kell teríteni, mert object */
/* és a headers-be csak a headers részt kell kiteríteni */

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || "Request failed.";
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (payload) =>
    request("/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () =>
    request("/users/logout", {
      method: "POST",
    }),
  me: () => request("/users/me"),
};
