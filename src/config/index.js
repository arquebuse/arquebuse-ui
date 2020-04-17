let baseUrl;

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:8080/api/v1';
} else {
  baseUrl = 'api/v1';
}

export const apiHost = baseUrl