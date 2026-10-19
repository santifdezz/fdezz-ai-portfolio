import Cocoa
import WebKit

// Usage: topdf <in.html> <out.pdf>   (A4, one page: 595x842 pt, content laid out at 794 CSS px)
let args = CommandLine.arguments
guard args.count == 3 else { fputs("usage: topdf in.html out.pdf\n", stderr); exit(2) }
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

final class Loader: NSObject, WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript("document.documentElement.scrollHeight") { h, _ in
            fputs("content height (css px): \(h ?? "?")  (page is 1123)\n", stderr)
            let config = WKPDFConfiguration()
            config.rect = CGRect(x: 0, y: 0, width: 595, height: 842)
            webView.createPDF(configuration: config) { result in
                switch result {
                case .success(let data): try? data.write(to: output); fputs("wrote \(output.path)\n", stderr)
                case .failure(let error): fputs("failed: \(error)\n", stderr)
                }
                exit(0)
            }
        }
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let web = WKWebView(frame: CGRect(x: 0, y: 0, width: 595, height: 842))
web.pageZoom = 595.0 / 794.0
let loader = Loader()
web.navigationDelegate = loader
web.loadFileURL(input, allowingReadAccessTo: input.deletingLastPathComponent())
DispatchQueue.main.asyncAfter(deadline: .now() + 30) { fputs("timeout\n", stderr); exit(1) }
app.run()
