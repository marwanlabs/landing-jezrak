from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from pathlib import Path
import json, hashlib

root = Path('public/fonts')
font = TTFont(root / 'Alexandria-source.ttf')
font = instantiateVariableFont(font, {'wght': 500}, inplace=True)
font.flavor = 'woff2'
font.save(root / 'Alexandria-Medium.woff2')
manifest = json.loads((root / 'manifest.json').read_text())
output = root / 'Alexandria-Medium.woff2'
manifest['files'] = [entry for entry in manifest['files'] if not entry.get('derivedFrom')]
manifest['files'].append({'path':output.name,'derivedFrom':'Alexandria-source.ttf','operation':'Instantiate the used weight 500 and package as WOFF2; permitted by OFL, no reserved font name declared','sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'bytes':output.stat().st_size})
(root / 'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
for path in root.glob('*.woff2'):
    f = TTFont(path)
    cmap = f.getBestCmap()
    text = 'Jizrak' if 'Arabic' not in path.name and 'Alexandria' not in path.name else 'Jizrakجِذرك'
    missing = [c for c in text if ord(c) not in cmap]
    if missing: raise RuntimeError(f'{path.name}: missing {missing}')
    print(f'{path.name}: Latin/Arabic glyph check passed, {path.stat().st_size} bytes')
css = "/* Self-hosted, pinned upstream fonts. See public/fonts/manifest.json and licenses/. */\n"
css += "@font-face{font-family:'Alexandria';src:url('/fonts/Alexandria-Medium.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap}\n"
for name, family in [('IBMPlexSans','IBM Plex Sans'),('IBMPlexSansArabic','IBM Plex Sans Arabic')]:
    for weight, number in [('Regular',400),('Medium',500),('SemiBold',600)]:
        css += f"@font-face{{font-family:'{family}';src:url('/fonts/{name}-{weight}.woff2') format('woff2');font-weight:{number};font-style:normal;font-display:swap}}\n"
Path('src/styles/fonts.css').write_text(css)
