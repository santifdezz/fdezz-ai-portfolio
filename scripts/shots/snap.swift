import Cocoa
import WebKit

// Usage: snap <url> <out.png> [width=1600] [height=1000] [waitSeconds=3] [js]
// Renders the page in WebKit at the given size, waits, optionally runs `js`, waits again, writes a PNG.
let args = CommandLine.arguments
guard args.count >= 3 else { fputs("usage: snap url out.png [w] [h] [wait] [js]\n", stderr); exit(2) }
guard let url = URL(string: args[1]) else { fputs("bad url\n", stderr); exit(2) }
let output = URL(fileURLWithPath: args[2])
let width = args.count > 3 ? Double(args[3]) ?? 1600 : 1600
let height = args.count > 4 ? Double(args[4]) ?? 1000 : 1000
let wait = args.count > 5 ? Double(args[5]) ?? 3 : 3
let script = args.count > 6 ? args[6] : nil

final class Loader: NSObject, WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        DispatchQueue.main.asyncAfter(deadline: .now() + wait) {
            func shoot() {
                let config = WKSnapshotConfiguration()
                config.rect = CGRect(x: 0, y: 0, width: width, height: height)
                webView.takeSnapshot(with: config) { image, error in
                    guard let image, let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
                          let png = rep.representation(using: .png, properties: [:]) else {
                        fputs("snapshot failed: \(String(describing: error))\n", stderr); exit(1)
                    }
                    try? png.write(to: output)
                    fputs("wrote \(output.path)\n", stderr)
                    exit(0)
                }
            }
            if let script {
                webView.evaluateJavaScript(script) { _, _ in
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { shoot() }
                }
            } else { shoot() }
        }
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let web = WKWebView(frame: CGRect(x: 0, y: 0, width: width, height: height))
let loader = Loader()
web.navigationDelegate = loader
web.load(URLRequest(url: url))
DispatchQueue.main.asyncAfter(deadline: .now() + 60) { fputs("timeout\n", stderr); exit(1) }
app.run()
