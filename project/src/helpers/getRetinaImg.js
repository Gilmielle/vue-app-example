
export default function getRetinaImg(src) {
  return `${src.replace('.jpg', '')}@2x.jpg 2x`
}
