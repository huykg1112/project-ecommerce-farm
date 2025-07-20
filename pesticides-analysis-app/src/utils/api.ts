import axios, { AxiosError, AxiosRequestConfig } from "axios";

const handleAxiosError =
  <T>(resolve: (value: T | PromiseLike<T>) => void) =>
  async (err: unknown) => {
    const response = (err as AxiosError<T>).response;
    let data = response?.data;
    if (!data) {
      data = {
        message: response?.statusText,
      } as T;
    }
    resolve(data);
  };

/**
 * Fetches data from the given URL with query parameters.
 *
 * @param url - The URL to fetch data from.
 * @param params - The query parameters to be appended to the URL.
 * @param config - Configuration for Axios request.
 * @returns A promise that resolves to the fetched data.
 */
export const get = <T>(url: string, params?: object, config?: AxiosRequestConfig) => {
  return new Promise<T>((resolve) => {
    axios
      .get<T>(url, {
        ...config,
        params,
      })
      .then((result) => {
        return resolve(result.data);
      })
      .catch(handleAxiosError(resolve));
  });
};

export const post = <T>(url: string, params?: object, config?: AxiosRequestConfig) => {
  return new Promise<T>((resolve) => {
    axios
      .post<T>(url, { ...params }, { ...config })
      .then((result) => {
        return resolve(result.data);
      })
      .catch(handleAxiosError(resolve));
  });
};

/**
 * Sends a PUT request to the specified URL with the provided data and returns the response data.
 * @param url - The URL to send the request to.
 * @param params - The data to send with the request.
 * @param config - Configuration for Axios request.
 * @returns A Promise that resolves to the response data.
 */
export const put = <T>(url: string, params: object, config?: AxiosRequestConfig) => {
  return new Promise<T>((resolve) => {
    axios
      .put<T>(url, { ...params }, { ...config })
      .then((result) => {
        return resolve(result.data);
      })
      .catch(handleAxiosError(resolve));
  });
};

/**
 * Sends a DELETE request to the specified URL with the given parameters and returns the response data.
 * @param url - The URL to send the DELETE request to.
 * @param params - The parameters to include in the request.
 * @param config - Configuration for Axios request.
 * @returns - The response data as a Promise.
 */
export const del = <T>(url: string, params: object, config?: AxiosRequestConfig) => {
  return new Promise<T>((resolve) => {
    axios
      .delete<T>(url, {
        ...config,
        params,
      })
      .then((result) => {
        return resolve(result.data);
      })
      .catch(handleAxiosError(resolve));
  });
};
