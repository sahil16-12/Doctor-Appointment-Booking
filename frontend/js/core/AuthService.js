export default class AuthService {
  static getProfile() {
    const profile = sessionStorage.getItem("profile");
    const parsed = profile ? JSON.parse(profile) : null;
    return parsed;
  }

  static getToken() {
    return sessionStorage.getItem("token");
  }

  static isAuthenticated() {
    return !!this.getToken() && !!this.getProfile();
  }

  static requireRole(role, redirectPath = "../pages/login.html") {
    const token = this.getToken();
    const profile = this.getProfile();

    console.log("Auth Debug:", {
      token: !!token,
      profile,
      role,
      profileUserType: profile?.userType,
      match: profile?.userType === role,
    });

    if (!token || !profile || profile.userType !== role) {
      console.log("Auth failed, redirecting to:", redirectPath);
      window.location.href = redirectPath;
      return null;
    }

    return profile;
  }
}
