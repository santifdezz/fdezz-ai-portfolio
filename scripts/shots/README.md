# Screenshots for the project cards

`snap.swift` renders a URL in WebKit (macOS) and writes a PNG:

```bash
swiftc -O snap.swift -o /tmp/snap
/tmp/snap https://punch.sfseoane.es/escaparate/ out.png 1600 1000 4
```

Optional last argument: JavaScript to run after load (to open a state before the shot).
The PNGs the site uses live in `public/work/`.
