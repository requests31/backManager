import request from '@/utils/request'

// 按条件分页查询资源
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 保存或更新资源
export const saveOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 获取编辑资源页面信息
export const getEditResource = (id = -1) => {
  return request({
    method: 'GET',
    url: '/boss/resource',
    params: {
      id
    }
  })
}
// 删除资源信息
export const deleteResource = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 查询资源分类列表
export const getCategoryInfo = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}
