import axios from 'axios'
axios.defaults.withCredentials = true

export type Pokemon = {
  name: string;
  url: string;
};


export const getAccount = (accountId: string) => {
  return axios.get(`http://localhost:4000/accounts/${accountId}`)
}
export const createAccount = () => {
  return axios.post(`http://localhost:4000/accounts/`)
}
export const sendRollRequest = () => {
  return axios.post(`http://localhost:4000/roll`)
}
export const sendCashoutRequest = () => {
  return axios.post(`http://localhost:4000/cashout`)
}
