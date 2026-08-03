#!/usr/bin/env python3
"""Prepare Punches Batch 01 AVIF/WebP review assets from client catalogue renders."""
from __future__ import annotations
import argparse, json
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from PIL import Image, ImageChops, ImageDraw, ImageFilter

CANVAS_SIZE = 1800
SAFE_REGION = 1500

@dataclass(frozen=True)
class CropSpec:
    asset_id: str
    source_name: str
    body_box: tuple[int,int,int,int]
    inset_box: tuple[int,int,int,int] | None = None
    body_rotate: float = 0.0
    inset_rotate: float = 0.0

CROPS: tuple[CropSpec,...] = (
    CropSpec('punches-yeoman-21-10','page-02.png',(150,285,1570,700),(220,790,620,1035),-22),
    CropSpec('punches-yeoman-21-11','page-02.png',(150,285,1570,700),(750,790,1160,1035),-22),
    CropSpec('punches-yeoman-21-12','page-02.png',(150,285,1570,700),(220,1490,620,1750),-22),
    CropSpec('punches-yeoman-21-13','page-02.png',(150,285,1570,700),(750,1490,1170,1750),-22),
    CropSpec('punches-yeoman-21-14','page-03.png',(200,540,1500,1010),(420,1090,750,1235),-22),
    CropSpec('punches-yeoman-21-15','page-03.png',(200,540,1500,1010),(930,1090,1250,1235),-22),
    CropSpec('punches-turrel-21-16','page-03.png',(200,540,1500,1010),(420,1510,760,1665),-22),
    CropSpec('punches-turrel-21-17','page-03.png',(200,540,1500,1010),(930,1510,1260,1665),-22),
    CropSpec('punches-fahlbusch','page-04.png',(350,320,1320,640),(180,675,500,795),-20),
    CropSpec('punches-nicola-spoon-shaped','page-04.png',(350,320,1320,640),(530,675,845,795),-20),
    CropSpec('punches-nicola-biopsy-straight','page-04.png',(350,320,1320,640),(875,675,1200,795),-20),
    CropSpec('punches-yasargil-nicola','page-04.png',(350,320,1320,640),(1220,675,1575,795),-20),
    CropSpec('punches-citelly','page-04.png',(320,1260,760,1850),(155,1220,315,1690),0),
    CropSpec('punches-beyer','page-04.png',(950,1260,1540,1850),(870,1240,1020,1410),0),
)

def parse_args():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--repo-root',type=Path,default=Path.cwd())
    p.add_argument('--force',action='store_true')
    p.add_argument('--workers',type=int,default=4)
    p.add_argument('--self-test',action='store_true')
    return p.parse_args()

def white_to_alpha(image: Image.Image)->Image.Image:
    rgb=image.convert('RGB')
    diff=ImageChops.difference(rgb,Image.new('RGB',rgb.size,'white'))
    alpha=diff.convert('L').point(lambda v: 0 if v <= 5 else min(255,v*12))
    alpha=alpha.filter(ImageFilter.MedianFilter(3))
    rgba=rgb.convert('RGBA'); rgba.putalpha(alpha); return rgba

def trim_alpha(image: Image.Image)->Image.Image:
    box=image.getchannel('A').getbbox()
    if box is None: raise ValueError('crop contains no visible pixels')
    return image.crop(box)

def prepare(image: Image.Image, rotate: float=0)->Image.Image:
    out=trim_alpha(white_to_alpha(image))
    if rotate:
        out=trim_alpha(out.rotate(rotate,resample=Image.Resampling.BICUBIC,expand=True))
    return out

def fit(image,max_w,max_h):
    scale=min(max_w/image.width,max_h/image.height)
    return image.resize((max(1,round(image.width*scale)),max(1,round(image.height*scale))),Image.Resampling.LANCZOS)

def compose(body:Image.Image,inset:Image.Image|None)->Image.Image:
    canvas=Image.new('RGBA',(CANVAS_SIZE,CANVAS_SIZE),(255,255,255,0))
    if inset is None:
        body=fit(body,SAFE_REGION,SAFE_REGION)
        canvas.alpha_composite(body,((CANVAS_SIZE-body.width)//2,(CANVAS_SIZE-body.height)//2))
        return canvas
    body=fit(body,1450,1120)
    body_x=(CANVAS_SIZE-body.width)//2
    body_y=580 if body.height < 950 else (CANVAS_SIZE-body.height)//2
    canvas.alpha_composite(body,(body_x,body_y))
    inset=fit(inset,720,560)
    inset_x=(CANVAS_SIZE-inset.width)//2
    inset_y=80
    canvas.alpha_composite(inset,(inset_x,inset_y))
    return canvas

def ensure_writable(paths:Iterable[Path],force:bool):
    if force:return
    for p in paths:
        if p.exists(): raise FileExistsError(f'Refusing to overwrite {p}; pass --force')

def encode_one(spec,source_dir,output_dir,force):
    src=source_dir/spec.source_name
    if not src.is_file(): raise FileNotFoundError(f'Missing source {src}. Extract the Punches source-page package at the repository root.')
    avif=output_dir/f'{spec.asset_id}.avif'; webp=output_dir/f'{spec.asset_id}.webp'
    ensure_writable((avif,webp),force)
    with Image.open(src) as im:
        rgb=im.convert('RGB')
        body=prepare(rgb.crop(spec.body_box),spec.body_rotate)
        inset=prepare(rgb.crop(spec.inset_box),spec.inset_rotate) if spec.inset_box else None
    asset=compose(body,inset)
    asset.save(webp,'WEBP',quality=88,method=6)
    asset.save(avif,'AVIF',quality=82)
    return {'assetId':spec.asset_id,'source':spec.source_name,'bodyCrop':spec.body_box,'insetCrop':spec.inset_box,'avif':str(avif),'webp':str(webp),'width':1800,'height':1800}

def contact(output_dir,review_dir):
    tiles=[]
    for spec in CROPS:
        with Image.open(output_dir/f'{spec.asset_id}.webp') as im: rgba=im.convert('RGBA')
        bg=Image.new('RGBA',rgba.size,(245,245,245,255)); bg.alpha_composite(rgba)
        preview=bg.convert('RGB'); preview.thumbnail((300,300))
        tile=Image.new('RGB',(340,360),'white'); tile.paste(preview,((340-preview.width)//2,10))
        ImageDraw.Draw(tile).text((12,325),spec.asset_id.removeprefix('punches-'),fill='black')
        tiles.append(tile)
    cols=4; rows=(len(tiles)+cols-1)//cols
    sheet=Image.new('RGB',(cols*340,rows*360),(225,225,225))
    for i,tile in enumerate(tiles):sheet.paste(tile,((i%cols)*340,(i//cols)*360))
    review_dir.mkdir(parents=True,exist_ok=True)
    path=review_dir/'punches-batch-01-contact.png'; sheet.save(path); return path

def run_self_test():
    assert len(CROPS)==14
    assert len({s.asset_id for s in CROPS})==14
    test=Image.new('RGB',(500,300),'white'); d=ImageDraw.Draw(test); d.line((30,150,470,150),fill=(90,90,90),width=18)
    asset=compose(prepare(test,-20),None)
    assert asset.size==(1800,1800) and asset.getchannel('A').getbbox()
    print('Punches Batch 01 offline self-test passed')

def main():
    args=parse_args()
    if args.self_test: run_self_test(); return 0
    root=args.repo_root.resolve(); src=root/'apps/web/local-data/catalogue-pages/punches'; out=root/'apps/web/public/media/catalogue-preview/punches'; review=root/'apps/web/local-data/catalogue-review/punches-batch-01'
    out.mkdir(parents=True,exist_ok=True); review.mkdir(parents=True,exist_ok=True)
    records=[]
    with ThreadPoolExecutor(max_workers=max(1,args.workers)) as ex:
        fs=[ex.submit(encode_one,s,src,out,args.force) for s in CROPS]
        for f in as_completed(fs): records.append(f.result())
    records.sort(key=lambda r:r['assetId'])
    sheet=contact(out,review)
    report=review/'punches-batch-01-report.json'; report.write_text(json.dumps(records,indent=2),encoding='utf-8')
    print(f'Generated {len(CROPS)} Punches Batch 01 configurations')
    print(f'Derivatives: {len(CROPS)*2} files')
    print(f'Output: {out}')
    print(f'Contact sheet: {sheet}')
    print(f'Report: {report}')
    return 0
if __name__=='__main__': raise SystemExit(main())
