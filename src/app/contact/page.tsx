import ContentPanel from "@/components/ContentPanel";
import Link from "next/link";

export const metadata = {
  title: "Contact | AI Terminal Portfolio",
};

export default function ContactPage() {
  return (
    <ContentPanel title="COMMUNICATION CHANNELS" showBackButton>
      <section className="space-y-5">
        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-3 uppercase tracking-wider">
            Direct Contact
          </h2>
          <div className="space-y-2">
            <div>
              <p className="text-cyan-400 text-xs md:text-sm font-bold">Email</p>
              <Link
                href="mailto:contact@example.com"
                className="text-cyan-100/80 hover:text-cyan-300 text-xs md:text-sm transition-colors"
              >
                contact@example.com
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-3 uppercase tracking-wider">
            Social & Web
          </h2>
          <div className="space-y-2">
            <div>
              <p className="text-cyan-400 text-xs md:text-sm font-bold">GitHub</p>
              <Link
                href="https://github.com/devalentineomonya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-100/80 hover:text-cyan-300 text-xs md:text-sm transition-colors break-all"
              >
                github.com/devalentineomonya
              </Link>
            </div>
            <div>
              <p className="text-cyan-400 text-xs md:text-sm font-bold">LinkedIn</p>
              <Link
                href="https://linkedin.com/in/devalentineomonya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-100/80 hover:text-cyan-300 text-xs md:text-sm transition-colors break-all"
              >
                linkedin.com/in/devalentineomonya
              </Link>
            </div>
            <div>
              <p className="text-cyan-400 text-xs md:text-sm font-bold">Twitter</p>
              <Link
                href="https://twitter.com/devalentineomonya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-100/80 hover:text-cyan-300 text-xs md:text-sm transition-colors break-all"
              >
                twitter.com/devalentineomonya
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-3 uppercase tracking-wider">
            Resources
          </h2>
          <div className="space-y-2">
            <div>
              <p className="text-cyan-400 text-xs md:text-sm font-bold">CV</p>
              <Link
                href="/cv.pdf"
                download
                className="text-cyan-100/80 hover:text-cyan-300 text-xs md:text-sm transition-colors inline-flex items-center gap-1"
              >
                Download PDF
              </Link>
            </div>
            <div>
              <p className="text-cyan-400 text-xs md:text-sm font-bold">Resume</p>
              <Link
                href="/resume.pdf"
                download
                className="text-cyan-100/80 hover:text-cyan-300 text-xs md:text-sm transition-colors inline-flex items-center gap-1"
              >
                Download PDF
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-cyan-500/20">
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
            <div>
              <p className="text-cyan-400 font-bold">Availability</p>
              <p className="text-cyan-100/70">OPEN</p>
            </div>
            <div>
              <p className="text-cyan-400 font-bold">Response Time</p>
              <p className="text-cyan-100/70">24-48 hours</p>
            </div>
          </div>
        </div>

        <div className="text-xs md:text-sm text-cyan-400">
          <p>Preferred method: Email or GitHub issues</p>
        </div>
      </section>
    </ContentPanel>
  );
}
