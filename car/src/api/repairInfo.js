import request from './request.js'

export const getRepairInfo = (params) => {
    return request.get('/frontdesk/findFaults', {params: params})
  }

export const getSpecific = (params) => {
    return request.get('/frontdesk/findSpecifics', {params: params})
  }

export const getSpecificsByFaultNumber = (params) => {
    return request.get('/frontdesk/getSpecificsByFaultNumber', {params: params})
  }

export const addFaultInfo = (data) =>{
    return request.post('/frontdesk/addFault', data)
}