import axios from "axios";
const api= axios.create({baseURL:"http://localhost:4000",withCredentials: true});
export default api;

// http://192.168.3.36:5000/api