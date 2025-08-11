import { deleteCookie } from "cookies-next";

export const getKeycloakLoginUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/load`,
    response_type: "code",
    scope: "openid email profile",
  });

  return `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/auth?${params}`;
};

export const getKeycloakLogoutUrl = () => {
  const idToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("id_token="))
    ?.split("=")[1];

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
    post_logout_redirect_uri: process.env.NEXT_PUBLIC_APP_URL!,
  });

  if (idToken) {
    params.set("id_token_hint", idToken);
  }

  return `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/logout?${params}`;
};

export function performFullLogout() {
  window.location.href = getKeycloakLogoutUrl();

  const allCookies = document.cookie ? document.cookie.split("; ") : [];
  allCookies.forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    if (name) deleteCookie(name);
  });
}

// this is old way if u call this it will redirect to logout confirmation page
// export const getKeycloakLogoutUrl = () => {
//   const params = new URLSearchParams({
//     client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
//     post_logout_redirect_uri: process.env.NEXT_PUBLIC_APP_URL!,
//   });

//   return `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/logout?${params}`;
// };
