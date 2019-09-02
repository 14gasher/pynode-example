const Data_URIs = (() => {
  const listeners = []
  const arr = []

  const processImage = url => {
    const canvas = document.createElement('canvas')
    canvas.width = 109
    canvas.height = 71
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = ''
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      arr.push(canvas.toDataURL('image/png'))
      if(arr.length === 3) listeners.forEach(todo => todo())
    }
    img.src = url
  }

  ;['img.png', 'img2.png', 'img3.png'].forEach(processImage)
  return {
    data: arr,
    isReady: () => arr.length === 3,
    addReadyListener: todo => arr.length === 3 ? todo() : listeners.push(todo),
  }
})()