import request from './request.js'

export const getRepairmanInfo = (params) => {
    return request.get('/frontdesk/findRepairman', {params: params})
  }