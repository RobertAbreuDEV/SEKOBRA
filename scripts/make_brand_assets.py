"""Genera los assets de marca a partir del wordmark y el icono originales.

uso: python make_assets.py <wordmark.png> <icon.png> <assets_dir>
"""
import sys
from PIL import Image

wordmark_path, icon_path, out = sys.argv[1:4]
BG = (7, 17, 31)


def color_to_alpha(im: Image.Image) -> Image.Image:
    """Quita el fondo BG conservando el antialiasing (como 'Color to Alpha' de GIMP)."""
    im = im.convert('RGBA')
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            alpha = 0.0
            for c, bc in zip((r, g, b), BG):
                if c > bc:
                    alpha = max(alpha, (c - bc) / (255 - bc))
                elif c < bc:
                    alpha = max(alpha, (bc - c) / bc)
            if alpha <= 0.02:
                px[x, y] = (0, 0, 0, 0)
                continue
            fg = tuple(
                max(0, min(255, round((c - (1 - alpha) * bc) / alpha)))
                for c, bc in zip((r, g, b), BG)
            )
            px[x, y] = (*fg, round(alpha * a / 255 * 255))
    return im


# ---------- Wordmark ----------
wm = Image.open(wordmark_path).convert('RGB')
L, T, R, B = 161, 150, 3863, 680  # bounds del contenido
wm = color_to_alpha(wm.crop((L, T, R, B)))
W, H = wm.size

# Elipse de la "O" (coordenadas relativas al recorte)
cx, cy, rx, ry = 1917.5 - L, 414.5 - T, 290, 272


def in_o(x: int, y: int) -> bool:
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1


sek = Image.new('RGBA', (W, H))
o = Image.new('RGBA', (W, H))
bra = Image.new('RGBA', (W, H))
src = wm.load()
for y in range(H):
    for x in range(W):
        p = src[x, y]
        if p[3] == 0:
            continue
        if in_o(x, y):
            o.putpixel((x, y), p)
        elif x < cx:
            sek.putpixel((x, y), p)
        else:
            bra.putpixel((x, y), p)

SCALE = 0.5  # wordmark completo (header)
PIECE_SCALE = 1.0  # piezas del splash: la O se muestra grande al inicio
pieces = {}
for name, img in (('sek', sek), ('o', o), ('bra', bra)):
    bbox = img.getbbox()
    piece = img.crop(bbox)
    piece = piece.resize((round(piece.width * PIECE_SCALE), round(piece.height * PIECE_SCALE)), Image.LANCZOS)
    piece.save(f'{out}/brand/wordmark-{name}.png', optimize=True)
    pieces[name] = bbox

full = wm.resize((round(W * SCALE), round(H * SCALE)), Image.LANCZOS)
full.save(f'{out}/brand/wordmark.png', optimize=True)

print('canvas', W, H)
for name, (l, t, r, b) in pieces.items():
    print(f"{name}: left={l / W:.5f} top={t / H:.5f} width={(r - l) / W:.5f} height={(b - t) / H:.5f}")

# ---------- Icono ----------
icon = Image.open(icon_path).convert('RGBA')
mark = color_to_alpha(icon).crop((206, 206, 818, 818))  # círculo de la O con margen
mark.save(f'{out}/brand/mark.png', optimize=True)

solid = Image.new('RGBA', icon.size, (*BG, 255))
solid.alpha_composite(icon)
solid.convert('RGB').save(f'{out}/icon.png', optimize=True)
solid.resize((48, 48), Image.LANCZOS).save(f'{out}/favicon.png', optimize=True)


def centered(img: Image.Image, canvas: int, fraction: float) -> Image.Image:
    size = round(canvas * fraction)
    c = Image.new('RGBA', (canvas, canvas), (0, 0, 0, 0))
    c.alpha_composite(img.resize((size, size), Image.LANCZOS), ((canvas - size) // 2, (canvas - size) // 2))
    return c


# Adaptive icon: área visible ≈ 72/108 del lienzo; la O ocupa ~59 % del área visible.
centered(mark, 1024, 0.42).save(f'{out}/android-icon-foreground.png', optimize=True)
Image.new('RGBA', (1024, 1024), (*BG, 255)).save(f'{out}/android-icon-background.png', optimize=True)
mono = mark.copy()
mono.putdata([(255, 255, 255, min(255, round(a / 0.88))) for (_, _, _, a) in mono.getdata()])
centered(mono, 1024, 0.42).save(f'{out}/android-icon-monochrome.png', optimize=True)

# Splash nativo: la misma O del wordmark, para que el paso a la animación JS sea continuo.
o_full = o.crop(pieces['o'])
side = max(o_full.size)
splash = Image.new('RGBA', (side, side), (0, 0, 0, 0))
splash.alpha_composite(o_full, ((side - o_full.width) // 2, (side - o_full.height) // 2))
splash.save(f'{out}/splash-icon.png', optimize=True)
print('ok')
