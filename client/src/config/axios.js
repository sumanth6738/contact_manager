import Axios from 'axios'
const axios = Axios.create({
    baseURL:'http://localhost:3005',
    headers: {
            'x-auth': localStorage.getItem('token')
        }
})

export default axios