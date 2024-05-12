import request from './request.js'

export const getCustomerInfo = (params) => {
  return request.get('/frontdesk/findClients', {params: params})
}

export const getClientCar = (params) => {
    return request.get('/frontdesk/findCars', {params: params})
  }

export const addClient = (data) => {
  return request.post('/frontdesk/addClient', data)
}

export const deletecar = (data) => {
  return request.post('/frontdesk/deleteCar', data)
}

export const addcar = (data) => {
  return request.post('/frontdesk/addCar', data)
}