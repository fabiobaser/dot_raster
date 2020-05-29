/** @format */

const canvasSketch = require("canvas-sketch")

const settings = {
  dimensions: "A4",
}

const sketch = ({ context, width, height }) => {
  console.log("%cSettings: ", "color: orange", settings, { width, height })

  const img = document.createElement("img")
  img.setAttribute("src", "./orig.jpg")

  return ({ context, width, height }) => {
    context.drawImage(img, 0, 0)

    const chunkSize = 5
    const chunks = []
    for (let x = 0; x < width; x += chunkSize) {
      for (let y = 0; y < height; y += chunkSize) {
        const imageData = context.getImageData(x, y, chunkSize, chunkSize)
        const pixelComponents = imageData.data
        const pixels = []
        for (let i = 0; i < pixelComponents.length; i += 4) {
          const l = pixelComponents[i]
          pixels.push(l)
        }

        const l = pixels.reduce((prev, curr) => (curr += prev)) / pixels.length

        const chunk = [x, y, l / 255]
        chunks.push(chunk)
      }
    }

    window.download = () => {
      download("chunks.json", JSON.stringify(chunks))

      function download(filename, text) {
        var pom = document.createElement("a")
        pom.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        )
        pom.setAttribute("download", filename)

        if (document.createEvent) {
          var event = document.createEvent("MouseEvents")
          event.initEvent("click", true, true)
          pom.dispatchEvent(event)
        } else {
          pom.click()
        }
      }
    }

    chunks.forEach((chunk) => {
      let [x, y, l] = chunk
      l *= 255
      context.fillStyle = `rgb(${l},${l},${l})`
      context.fillRect(x, y, chunkSize, chunkSize)
    })

    console.log(chunks)
  }
}

canvasSketch(sketch, settings)
