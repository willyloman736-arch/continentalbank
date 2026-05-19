import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "About",
  description: "About Continental Bank — a private institution serving principals since 1972.",
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="The House"
      title="A private institution, established 1972."
      lead="Continental Bank was founded in Geneva fifty-three years ago by a small group of partners who believed that private banking, properly practised, required restraint over scale and continuity over novelty. We hold to that belief."
      sections={[
        {
          title: "Heritage",
          body: (
            <>
              <p>
                The House was established in the spring of 1972 in Geneva&rsquo;s Place de la
                Concorde. Its founding partners — bankers from older institutions who had
                concluded that the post-war industrialisation of private banking did not serve the
                principals they had been entrusted to protect — set out a charter of restraint
                that, in substance, remains in force today.
              </p>
              <p>
                The original partnership documents are kept under glass in the boardroom of the
                Geneva head office. They state, plainly: <em>do not advertise; do not pursue
                scale; do not engage in any line of business which the Senior Partner would not
                explain to his grandchildren.</em>
              </p>
            </>
          ),
        },
        {
          title: "Standard",
          body: (
            <p>
              Continental Bank serves a small, finite roster of principals, family offices, and
              institutional clients on terms set out at the start of each relationship and revised
              only with the Client&rsquo;s written consent. Each Client is assigned a single named
              relationship manager. There is no general telephone number. We do not maintain a
              call centre. We do not maintain a marketing database.
            </p>
          ),
        },
        {
          title: "Desks",
          body: (
            <>
              <p>
                The Bank operates from six co-ordinated desks: Geneva (1972), London (1981),
                Luxembourg (1986), Singapore (1997), Dubai (2009), and a representative office in
                New York (2014). Each desk operates under the same protocols, the same ledger, and
                the same standard of service.
              </p>
              <p>
                The Bank is not, and has never been, listed on a stock exchange. The Partnership
                holds itself accountable to its Clients, to its prudential regulator, and to no
                other party.
              </p>
            </>
          ),
        },
        {
          title: "Engagement",
          body: (
            <p>
              Continental Bank does not accept walk-in introductions. A new relationship begins
              with an introduction from an existing Client, a counsel of long standing, or a
              senior officer of the Bank. The introduction is followed by a private conversation,
              an exchange of formal documents, and a review by the partner responsible for the
              corresponding desk.
            </p>
          ),
        },
      ]}
    />
  );
}
