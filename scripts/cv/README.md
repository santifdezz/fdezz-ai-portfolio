# CV build

The one-page classic CV (ES/EN) served from `public/cv/`. Edit the text in `make_html.py`, then (macOS):

```bash
cd scripts/cv
python3 make_html.py
swiftc -O topdf.swift -o /tmp/topdf
for l in es en; do /tmp/topdf santiago-fernandez-cv-$l.html ../../public/cv/santiago-fernandez-cv-$l.pdf; done
```

`topdf` prints the content height in CSS px: it must be at most 1123 to fit the single A4 page.
Generated `.html` files are not committed.
