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

    // Normalize role comparison - backend returns uppercase (PATIENT/DOCTOR)
    const normalizedRole = role?.toUpperCase();
    const profileUserType = profile?.userType?.toUpperCase();

    console.log("Auth Debug:", {
      token: !!token,
      profile,
      role: normalizedRole,
      profileUserType,
      match: profileUserType === normalizedRole,
    });

    if (!token || !profile || profileUserType !== normalizedRole) {
      console.log("Auth failed, redirecting to:", redirectPath);
      window.location.href = redirectPath;
      return null;
    }

    return profile;
  }
}
