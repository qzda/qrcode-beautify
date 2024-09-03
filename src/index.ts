import QRcode from 'qrcode'

export interface QrcodeProps {
  content: string;
  codeColor?: string;
  codeBgColor?: string;
  margin?: number;
  error?: 'L' | 'M' | 'Q' | 'H';
  version?: number;
  point?: Point;
  eyeShape?: EyeShape;
  eyeOuterColor?: string;
  eyeInnerColor?: string;
  canvasId?: string;
  width?: number;
}

export enum Point {
  /**
   * 普通
   */
  Normal,
  /**
   * 瓷砖
   */
  BigSquare,
  /**
   * 小方点
   */
  MiniSquare,
  /**
   * 大圆点
   */
  BigCircle,
  /**
   * 小圆点
   */
  MiniCircle,
  /**
   * 菱形
   */
  Rhombic,
}

export const PointOptions = [
  { value: Point.Normal, label: '普通' },
  { value: Point.BigSquare, label: '瓷砖' },
  { value: Point.MiniSquare, label: '小方点' },
  { value: Point.BigCircle, label: '大圆点' },
  { value: Point.MiniCircle, label: '小圆点' },
  { value: Point.Rhombic, label: '菱形' },
]

export enum EyeShape {
  /**
   * 方正
   */
  Square,
  /**
   * 圆角
   */
  Radius,
  /**
   * 粗圆角
   */
  ThickRadius,
  /**
   * 中圆角
   */
  MiddleRadius,
  /**
   * 细圆角
   */
  ThinsRadius,
  /**
   * 粗圆形
   */
  ThickCircle,
  /**
   * 细圆形
   */
  ThinsCircle,
  /**
   * 气泡
   */
  Bubble,
  /**
   * 眼睛
   */
  Eye,
  /**
   * 单圆角
   */
  SingleRadius,
}

export const EyeShapeOptions = [
  { value: EyeShape.Square, label: '方正' },
  { value: EyeShape.Radius, label: '圆角' },
  { value: EyeShape.ThickRadius, label: '粗圆角' },
  { value: EyeShape.MiddleRadius, label: '中圆角' },
  { value: EyeShape.ThinsRadius, label: '细圆角' },
  { value: EyeShape.ThickCircle, label: '粗圆形' },
  { value: EyeShape.ThinsCircle, label: '细圆形' },
  { value: EyeShape.Bubble, label: '气泡' },
  { value: EyeShape.Eye, label: '眼睛' },
  { value: EyeShape.SingleRadius, label: '单圆角' },
]

export function createQrcode(opt: QrcodeProps, cb: (dataUrl: string, width: number) => void) {

  opt = {
    codeColor: '#000',
    codeBgColor: '#fff',
    margin: 0,
    error: 'Q',
    version: 1,
    point: Point.Normal,
    eyeShape: EyeShape.Square,
    eyeOuterColor: '#000',
    eyeInnerColor: '#000',
    ...opt,
  }

  let canvas: HTMLCanvasElement
  if (opt.canvasId) {
    canvas = document.getElementById(opt.canvasId) as HTMLCanvasElement
  } else {
    canvas = document.createElement('canvas')
  }

  const option: QRcode.QRCodeToDataURLOptions = {
    // scale: 20,
    width: opt.width ?? canvas.width,
    margin: opt.margin,
    errorCorrectionLevel: opt.error,
    version: opt.version,
  }

  option.color = {
    dark: opt.codeColor,
    light: opt.codeBgColor,
  }

  let qrcode = QRcode.create(opt.content, option)
  
  const ctx = canvas.getContext('2d')

  const margin = option.margin!
  
  if (!canvas || !ctx) return
  const size = qrcode.modules.size + margin * 2

  const w = +(option.width! / size).toFixed()

  canvas.width = w * size
  canvas.height = w * size
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = opt.codeBgColor!
  ctx.fillRect(0, 0, canvas.width, canvas.height)


  const eyes = getEyeCoords(size, margin)

  const eyeColor = {
    outer: opt.eyeOuterColor ?? opt.codeColor!,
    inner: opt.eyeInnerColor ?? opt.codeColor!,
  }
  
  drawQrcodeEyes(
    ctx,
    opt.eyeShape!, 
    eyes, 
    w, 
    eyeColor,
  )

  let index = 0
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let isMargin = false

      if (
        i < margin
        || i >= size - margin
        || j < margin
        || j >= size - margin
      ) {
        isMargin = true
      }

      const isEye = isEyeArea(eyes, i, j)

      if (!isMargin) {
        const num = qrcode.modules.data[index]
        index++
        if (num && !isEye) {
          ctx.fillStyle = opt.codeColor!
          let pointMargin = 0
          if (opt.point === Point.BigSquare) {
            const x = j * w
            const y = i * w
            pointMargin = 1
            ctx.beginPath();
            ctx.roundRect(x + pointMargin, y + pointMargin, w - pointMargin * 2, w - pointMargin * 2, w / 5);
            ctx.fill();
          } else if (opt.point === Point.MiniSquare) {
            const x = j * w
            const y = i * w
            ctx.beginPath();
            pointMargin = 2
            ctx.roundRect(x + pointMargin, y + pointMargin, w - pointMargin * 2, w - pointMargin * 2, w / 5);
            ctx.fill();
          } else if (opt.point === Point.BigCircle) {
            pointMargin = 1
            const r = w / 2 - pointMargin
            const x = j * w + r + pointMargin
            const y = i * w + r + pointMargin
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
          } else if (opt.point === Point.MiniCircle) {
            pointMargin = 2
            const r = w / 2 - pointMargin
            const x = j * w + r + pointMargin
            const y = i * w + r + pointMargin
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
          } else if (opt.point === Point.Rhombic) {
            ctx.beginPath();
            const centerX = j * w + w / 2
            const centerY = i * w + w / 2
            ctx.moveTo(centerX, i * w);
            ctx.lineTo(j * w + w, centerY);
            ctx.lineTo(centerX, i * w + w);
            ctx.lineTo(j * w, centerY);
            ctx.closePath();
            ctx.fill()
          } else {
            ctx.fillRect(j * w, i * w, w, w)
          }
        }
      }

    }
  }

  const dataUrl = canvas.toDataURL('png')
  cb(dataUrl, w * size)
}

function getEyeCoords(canvasSize: number, margin: number) {
  const eyeSize = 7
  return [
    { x1: margin, y1: margin, x2: margin + eyeSize - 1, y2: margin + eyeSize - 1 },
    { x1: canvasSize - margin - eyeSize, y1: margin, x2: canvasSize - margin, y2: margin + eyeSize - 1 },
    { x1: margin, y1: canvasSize - margin - eyeSize, x2: margin + eyeSize - 1, y2: canvasSize - margin },
  ]
}

function isEyeArea(eyes: ReturnType<typeof getEyeCoords>, row: number, col: number) {
  let isEye = false
  eyes.forEach(it => {
    if (it.y1 <= col && it.y2 >= col && it.x1 <= row && it.x2 >= row) {
      isEye = true
    }
  })
  return isEye
}

function changeCtxColor(ctx: CanvasRenderingContext2D, color: string) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
}

function drawQrcodeEyes(
  ctx: CanvasRenderingContext2D, 
  eyeShape: EyeShape, 
  eyes: ReturnType<typeof getEyeCoords>, 
  pointSize: number,
  color: {
    outer: string;
    inner: string;
  }
) {
  const eyeSize = 7
  const radius = pointSize * 1.2
  ctx.lineWidth = pointSize;
  eyes.forEach((it, index) => {
    switch (eyeShape) {
      case EyeShape.Square:
        // 外眼
        changeCtxColor(ctx, color.outer)
        ctx.strokeRect(it.x1 * pointSize + pointSize / 2, it.y1 * pointSize + pointSize / 2, eyeSize * pointSize - pointSize, eyeSize * pointSize - pointSize)

        // 内眼
        changeCtxColor(ctx, color.inner)
        ctx.fillRect((it.x1 + 2) * pointSize, (it.y1 + 2) * pointSize, (eyeSize - 4) * pointSize, (eyeSize - 4) * pointSize)
        break;
      case EyeShape.Radius:
        drawRadius(ctx, pointSize, it, 'Normal', color)
        break;
      case EyeShape.ThickRadius:
        drawRadius(ctx, pointSize, it, 'Big', color)
        break;
      case EyeShape.MiddleRadius:
        drawRadius(ctx, pointSize, it, 'Middle', color)
        break;
      case EyeShape.ThinsRadius:
        drawRadius(ctx, pointSize, it, 'Small', color)
        break;
      case EyeShape.ThickCircle:
        drawCircle(ctx, pointSize, it, 'Big', color)
        break
      case EyeShape.ThinsCircle:
        drawCircle(ctx, pointSize, it, 'Small', color)
        break
      case EyeShape.Bubble:
        const radiusBubble = [
          [radius, 0, radius, radius],
          [0, radius, radius, radius],
          [radius, radius, radius, 0],
        ]
        // 外眼
        changeCtxColor(ctx, color.outer)
        ctx.beginPath()
        ctx.roundRect(
          it.x1 * pointSize + ctx.lineWidth / 2, 
          it.y1 * pointSize + ctx.lineWidth / 2, 
          eyeSize * pointSize - ctx.lineWidth, 
          eyeSize * pointSize - ctx.lineWidth, 
          radiusBubble[index],
        )
        ctx.stroke()
        // 内眼
        changeCtxColor(ctx, color.inner)
        ctx.beginPath()
        ctx.roundRect((it.x1 + 2) * pointSize, (it.y1 + 2) * pointSize, pointSize * 3, pointSize * 3, radiusBubble[index])
        ctx.fill()
        break;
      case EyeShape.Eye:
        const radiusEye= [
          [0, radius, 0, radius],
          [radius, 0, radius, 0],
          [radius, 0, radius, 0],
        ]
        // 外眼
        changeCtxColor(ctx, color.outer)
        ctx.beginPath()
        ctx.roundRect(
          it.x1 * pointSize + ctx.lineWidth / 2, 
          it.y1 * pointSize + ctx.lineWidth / 2, 
          eyeSize * pointSize - ctx.lineWidth, 
          eyeSize * pointSize - ctx.lineWidth, 
          radiusEye[index],
        )
        ctx.stroke()
        // 内眼
        changeCtxColor(ctx, color.inner)
        ctx.beginPath()
        ctx.roundRect((it.x1 + 2) * pointSize, (it.y1 + 2) * pointSize, pointSize * 3, pointSize * 3, radiusEye[index])
        ctx.fill()
        break;
      case EyeShape.SingleRadius:
        const radiusSingleRadius= [
          [radius, 0, 0, 0],
          [0, radius, 0, 0],
          [0, 0, radius, 0],
        ]
        // 外眼
        changeCtxColor(ctx, color.outer)
        ctx.beginPath()
        ctx.roundRect(
          it.x1 * pointSize + ctx.lineWidth / 2, 
          it.y1 * pointSize + ctx.lineWidth / 2, 
          eyeSize * pointSize - ctx.lineWidth, 
          eyeSize * pointSize - ctx.lineWidth, 
          radiusSingleRadius[index],
        )
        ctx.stroke()
        // 内眼
        changeCtxColor(ctx, color.inner)
        ctx.beginPath()
        ctx.roundRect((it.x1 + 2) * pointSize, (it.y1 + 2) * pointSize, pointSize * 3, pointSize * 3, radiusSingleRadius[index])
        ctx.fill()
        break;
    }
  })
}

function drawRadius(
  ctx: CanvasRenderingContext2D, 
  pointSize: number, 
  eyeCoord: ReturnType<typeof getEyeCoords>[number], 
  size: 'Normal' | 'Big' | 'Middle' | 'Small',
  color: {
    outer: string;
    inner: string;
  }
) {
  ctx.lineWidth = pointSize;
  const eyeSize = 7
  const { x1, y1 } = eyeCoord
  const r = (eyeSize - 4) / 2 * pointSize
  const x = (x1 + r / pointSize + 2) * pointSize
  const y = (y1 + r / pointSize + 2) * pointSize
  // 外眼
  changeCtxColor(ctx, color.outer)
  ctx.beginPath();
  let radius = pointSize
  if (size === 'Middle') {
    ctx.lineWidth = pointSize / 1.5;
    radius = pointSize / 1.5
  } else if (size === 'Small') {
    ctx.lineWidth = pointSize / 2;
    radius = pointSize / 2
  }

  ctx.roundRect(
    x1 * pointSize + ctx.lineWidth / 2, 
    y1 * pointSize + ctx.lineWidth / 2, 
    eyeSize * pointSize - ctx.lineWidth, 
    eyeSize * pointSize - ctx.lineWidth, 
    radius
  )
  ctx.stroke()
  // 内眼
  changeCtxColor(ctx, color.inner)
  ctx.beginPath();
  if (size === 'Normal') {
    ctx.arc(x, y, r, 0, 2 * Math.PI)
  } else {
    ctx.roundRect((x1 + 2) * pointSize, (y1 + 2) * pointSize, pointSize * 3, pointSize * 3, pointSize)
  }
  ctx.fill()
}

function drawCircle(
  ctx: CanvasRenderingContext2D, 
  pointSize: number, 
  eyeCoord: ReturnType<typeof getEyeCoords>[number], 
  size: 'Big' | 'Small',
  color: {
    outer: string;
    inner: string;
  }
) {
  ctx.lineWidth = pointSize;

  if (size === 'Small') {
    ctx.lineWidth = pointSize / 2
  }

  const eyeSize = 7
  const { x1, y1 } = eyeCoord
  const R = eyeSize * pointSize / 2
  const X = x1 * pointSize + R
  const Y = y1 * pointSize + R
  const r = (eyeSize - 4) / 2 * pointSize
  const x = (x1 + r / pointSize + 2) * pointSize
  const y = (y1 + r / pointSize + 2) * pointSize

  // 外眼
  changeCtxColor(ctx, color.outer)
  ctx.beginPath();
  ctx.arc(X, Y, R, 0, 2 * Math.PI)
  ctx.stroke()
  // 内眼
  changeCtxColor(ctx, color.inner)
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
}