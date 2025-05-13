import axios from "axios";
const URL = import.meta.env.REACT_URL

export const getCommand = async (cmd) => {
    const request = axios.get(`${URL}/${encodeURIComponent(cmd)}`)
    const res = await request;
    return res.data;
}
