import axios from "axios";

export const PostApiCaller = (URL, reqObj) => {
  return axios
    .post("http://localhost:5000/api/" + URL, reqObj)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.data;
    });
};

export const GetApiCaller = (URL) => {
  return axios
    .get("http://localhost:5000/api/" + URL)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.data;
    });
};
