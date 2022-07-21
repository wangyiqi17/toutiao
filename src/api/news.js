import request from '@/utils/request'

/**
 *
 * @param {*} channelId 获取频道的id
 * @param {*} timestamp 获取第一页的文章，传到当前时间戳.获取上一页文章，传pre_timestamp
 * @returns
 */
export const getArticleList = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}
