# qrcode-beautify
Create visually appealing QR codes effortlessly with qrcode-beautify.

## Installation
```
npm i qrcode-beautify
```

## example
```JavaScript
createQrcode(
    {
        content: 'qrcode',
        // This is optional
        canvasId: 'canvasId',
    },
    (base64, width) => {}
)

interface QrcodeProps {
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

```