import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

axios.defaults.withCredentials = true
axios.defaults.baseURL = API_URL

export const getAccount = (accountId: string) => {
  return axios.get(`accounts/${accountId}`)
}
export const createAccount = () => {
  return axios.post(`accounts/`)
}
export const sendRollRequest = () => {
  return axios.post(`roll`)
}
export const sendCashoutRequest = () => {
  return axios.post(`cashout`)
}
