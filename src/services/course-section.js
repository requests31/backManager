import request from '@/utils/request'

// 根据id获取章节和课时
export const getSectionById = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}
// 保存或更新章节
export const saveOrUpdateSection = data => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}
// 保存或更新课时
export const saveOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}

// 根据id获取章节
export const getBySectionId = sectionId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId
    }
  })
}
