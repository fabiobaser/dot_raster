/** @format */

const canvasSketch = require("canvas-sketch")
const {
  renderPaths,
  createPath,
  pathsToPolylines,
} = require("canvas-sketch-util/penplot")
const { clipPolylinesToBox } = require("canvas-sketch-util/geometry")
const Random = require("canvas-sketch-util/random")
const chunks = require("./chunks.js")

const RENDER_CIRCLES = true
const RENDER_BOX = false

console.log("Random Seed:", Random.getSeed())

const settings = {
  dimensions: "A4",
  orientation: "portrait",
  pixelsPerInch: 300,
  scaleToView: true,
  units: "cm",
}

const TWO_PI = Math.PI * 2

const sketch = (props) => {
  const { width, height, units } = props
  console.log(width, height)
  const paths = []
  console.log(chunks.length)

  RENDER_BOX &&
    paths.push(
      createPath((ctx) => {
        ctx.rect(0.5, 0.5, width - 1, height - 1)
      })
    )

  let circleCount = 0

  RENDER_CIRCLES &&
    chunks.slice(0, 1000000).forEach((chunk) => {
      let [x, y, l] = chunk
      x = x / 29 + 0.4
      y = y / 30 + 0.75

      const s = 1 - l

      const radius = s * 0.048

      paths.push(
        createPath((ctx) => {
          ctx.arc(x, y, radius, 0, TWO_PI)
        })
      )
      circleCount++

      if (s > 0.7) {
        paths.push(
          createPath((ctx) => {
            ctx.arc(x, y, s * 0.01, 0, TWO_PI)
          })
        )
        circleCount++
      }
    })

  let lines = pathsToPolylines(paths, { units })
  console.log("%cNumber of Circles: ", "color: orange", circleCount)

  const box = [1, 1, width - 1, height - 1]
  lines = clipPolylinesToBox(lines, box)

  return (props) =>
    renderPaths(lines, {
      ...props,
      lineJoin: "round",
      lineCap: "round",
      lineWidth: 0.08,
      optimize: false,
    })
}

canvasSketch(sketch, settings)
