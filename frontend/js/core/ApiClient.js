export default class ApiClient {
    constructor(baseUrl) {
      this.baseUrl = baseUrl.replace(/\/+$/, "");
      this.timeout = 10000;
    }
  
    async request(path, method = "GET", body = null) {
      const url = `${this.baseUrl}${path}`;
  
      return new Promise((resolve, reject) => {
        $.ajax({
          url,
          method,
          timeout: this.timeout,
          dataType: "json",
          contentType: "application/json",
          data: body ? JSON.stringify(body) : undefined,
  
          success: (data, textStatus, jqXHR) => {
            resolve({ status: jqXHR.status, data });
          },
  
          error: (jqXHR) => {
            let err;
            try {
              err = jqXHR.responseJSON || JSON.parse(jqXHR.responseText);
            } catch {
              err = { message: "Server error" };
            }
            reject({
              status: jqXHR.status,
              message: err.message || "Request failed"
            });
          }
        });
      });
    }
  
    post(path, body) {
      return this.request(path, "POST", body);
    }
  }
  