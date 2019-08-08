import request from '@/utils/request'

export function getListReport() {
  return request({
    url: '/rest/reporteSiaf/traerTodasSubCuenta/2017',
    method: 'get'
  })
}

