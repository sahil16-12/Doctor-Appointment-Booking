export default class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.timeout = 10000;
  }

  async request(path, method = "GET", body = null) {
    const url = `${this.baseUrl}${path}`;

    // Add token to request headers if available
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        method,
        timeout: this.timeout,
        headers: headers,
        contentType: "application/json",
        dataType: "json",
        data: body ? JSON.stringify(body) : undefined,
        processData: false,

        success: (data, textStatus, jqXHR) => {
          resolve({ status: jqXHR.status, data });
        },

        error: (jqXHR, textStatus, errorThrown) => {
          let errorMessage = "Request failed";
          let parsedError = null;

          console.log("API Error Debug:", {
            status: jqXHR.status,
            statusText: jqXHR.statusText,
            textStatus: textStatus,
            errorThrown: errorThrown,
            responseText: jqXHR.responseText,
            responseJSON: jqXHR.responseJSON,
            contentType: jqXHR.getResponseHeader("Content-Type"),
          });

          // Try to extract error from responseJSON first (jQuery auto-parses JSON)
          if (jqXHR.responseJSON) {
            parsedError = jqXHR.responseJSON;
            console.log("Using responseJSON:", parsedError);
          } else if (jqXHR.responseText) {
            // Try to manually parse if jQuery didn't auto-parse
            try {
              parsedError = JSON.parse(jqXHR.responseText);
              console.log("Manually parsed JSON:", parsedError);
            } catch (e) {
              console.warn("Failed to parse error response as JSON:", e);
              console.log("Raw response text:", jqXHR.responseText);
            }
          }

          // Extract error message from parsed response
          if (parsedError) {
            if (parsedError.message) {
              errorMessage = parsedError.message;
              console.log(
                "Extracted message from parsedError.message:",
                errorMessage,
              );
            } else if (parsedError.errors) {
              // Handle ASP.NET Core validation errors
              const validationErrors = [];
              for (const field in parsedError.errors) {
                if (Array.isArray(parsedError.errors[field])) {
                  validationErrors.push(...parsedError.errors[field]);
                } else {
                  validationErrors.push(parsedError.errors[field]);
                }
              }
              errorMessage = validationErrors.join("; ") || "Validation failed";
              console.log("Extracted validation errors:", errorMessage);
            } else if (parsedError.title) {
              errorMessage = parsedError.title;
              console.log(
                "Extracted message from parsedError.title:",
                errorMessage,
              );
            }
          }

          // If still no message extracted, use status-based defaults
          if (errorMessage === "Request failed" && !parsedError) {
            if (jqXHR.status === 0) {
              errorMessage =
                "Unable to connect to server. Please check your connection.";
            } else if (jqXHR.status === 401) {
              errorMessage = "Invalid credentials. Please try again.";
            } else if (jqXHR.status === 403) {
              errorMessage = "Access denied.";
            } else if (jqXHR.status === 404) {
              errorMessage = "Resource not found.";
            } else if (jqXHR.status >= 500) {
              errorMessage = "Server error. Please try again later.";
            } else {
              errorMessage = `Error ${jqXHR.status}: ${jqXHR.statusText || "Request failed"}`;
            }
            console.log("Using status-based default message:", errorMessage);
          }

          console.log("Final error message to be shown:", errorMessage);

          reject({
            status: jqXHR.status,
            message: errorMessage,
            originalError: parsedError,
          });
        },
      });
    });
  }

  post(path, body) {
    return this.request(path, "POST", body);
  }

  get(path) {
    return this.request(path, "GET");
  }

  put(path, body) {
    return this.request(path, "PUT", body);
  }

  delete(path) {
    return this.request(path, "DELETE");
  }
}
