export default class AuthService {
    static getProfile() {
      const profile = sessionStorage.getItem("profile");
      return profile ? JSON.parse(profile) : null;
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
  
      if (!token || !profile || profile.user_type !== role) {
        window.location.href = redirectPath;
        return null;
      }
  
      return profile;
    }
  }
  