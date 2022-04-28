import request from '@/utils/request'

// 根据条件获取角色
export const getRolePages = data => {
  return request({
    method: 'post',
    url: '/boss/role/getRolePages',
    data
  })
}

// 删除角色
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 保存或更新角色
export const saveOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 查询用户角色
export const getRoleId = id => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

// 获取所有角色
export const getRoleInfo = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// 给用户分配角色
export const getAllocateUserRoles = data => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

// 查询用户角色
export const getUserRoles = userId => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
