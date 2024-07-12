import axios, {InternalAxiosRequestConfig} from 'axios'
import { global } from "globals";

const instance = axios.create({
    withCredentials: true
})

instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        config.headers['X-Frontend-Client'] = 'Bot/SDK/Node.js'
        config.headers['Authorization'] = 'Bearer ' + global.token
        config.headers['Content-Type'] = 'application/json'
        config.baseURL = global.server
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (res) => {
        if (res.data == null) res.data = { nullValue: true }
        return Promise.resolve(res)
    },
    (err) => {
        console.error('Http request failed:', err.message)

        if (!err?.response) {
            err.response = { code: 520, data: {} }
        }

        if (err?.code == 'ERR_NETWORK') err.response.data.$network = err.code

        err.response.data.$error = err
        return Promise.resolve(err.response)
    }
)

export default instance