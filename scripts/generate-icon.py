from pathlib import Path
from PIL import Image, ImageDraw
root = Path(__file__).resolve().parents[1] / 'src-tauri' / 'icons'
image = Image.new('RGBA', (256, 256), (16, 25, 30, 255))
d = ImageDraw.Draw(image)
d.rounded_rectangle((10,10,246,246), radius=48, outline=(63,94,92), width=3)
for points in [[(128,65),(128,120),(65,120),(65,178)],[(128,120),(191,120),(191,178)],[(128,120),(128,195)]]:
    d.line(points,fill=(111,217,178),width=7,joint='curve')
for x,y in [(128,62),(65,178),(191,178),(128,198)]:
    d.rounded_rectangle((x-15,y-15,x+15,y+15),radius=7,fill=(111,217,178))
image.save(root/'icon.png')
image.save(root/'icon.ico',format='ICO',sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
print('Icônes générées localement.')
