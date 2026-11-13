import sys, asyncio
from playwright.sync_api import sync_playwright
out = sys.argv[1]; theme = sys.argv[2]; width = sys.argv[3]; grid = len(sys.argv) > 4
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1700, 'height': 1000}, device_scale_factor=1)
    pg.goto('file:///home/claude/dieter-rams/preview/index.html')
    pg.select_option('#theme', theme); pg.select_option('#w', width)
    if grid: pg.check('#grid')
    pg.wait_for_timeout(300)
    pg.screenshot(path=out, full_page=True); b.close()
