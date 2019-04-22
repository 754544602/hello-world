import axios from 'axios'


export function getSongDetail(id) {
  const url = '/api/getSingerList'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: `{"comm":{"ct":24,"cv":0},"singerAlbum":{"method":"get_singer_album","param":{"singermid":"${id}","order":"time","begin":0,"num":5,"exstatus":1},"module":"music.web_singer_info_svr"}}`
  })

  return axios(url, {
    params: data
  })
}
