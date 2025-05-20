import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getCommand = (cmd) => {

  const request = axios.get(`${URL}/${encodeURIComponent(cmd)}`);

  
  return request.then((res) => res.data);

};

export const getCommands = ({page}) => {
  const request = axios.get(`${URL}?page=${(page)}`);

  return request.then((res) => res.data).catch((err) => {
    console.log(err);
    
    return [];
  });
}
