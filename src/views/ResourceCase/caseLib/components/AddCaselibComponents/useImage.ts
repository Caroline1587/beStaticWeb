// vite 构建
const Files:any = import.meta.globEager('@/assets/images/CaselibIcon/*.png')
let imageMap:any = {}
Object.keys(Files).forEach((key:any) => {
  const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
  imageMap[name] = Files[key].default
})
export default imageMap

// 回显图片的方法
export const handleIcon = (imgUrl:string) => {
  if (!imgUrl) return imageMap.icon1
  if (imgUrl.startsWith('http')) return imgUrl
  return imageMap[imgUrl.replace('SystemIcon', 'icon')]
}
