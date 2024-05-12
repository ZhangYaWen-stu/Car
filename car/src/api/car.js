import request from './request.js'

export const getCarInfo = (params) => {
    return request.get('/frontdesk/findCars', {params: params})
  }
export const deleteCarInfo = (params) => {
    return request.post('/frontdesk/deleteCar', params)
  }