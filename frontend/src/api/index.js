import axios from "axios";

let baseUrl = "http://localhost:5000";

export const uploadData = (file) => {
  const data = new FormData();
  data.append("file", file);
  return axios
    .post(`${baseUrl}/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const getPatient = (options) => {
  return axios
    .get(`${baseUrl}/patient`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: options,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const getPatientProfile = (id) => {
  return axios
    .get(`${baseUrl}/patient/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
