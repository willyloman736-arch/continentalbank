import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Engagement",
  description:
    "Continental Bank Terms of Engagement — the contractual framework between the Bank and its private clients.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Governance"
      title="Terms of Engagement"
      lead="These Terms set out the contractual framework between Continental Bank (the &ldquo;Bank&rdquo;) and the private client who, upon execution of the mandate, becomes a Client of the Bank."
      effective="01 January 2026"
      sections={[
        {
          title: "1. The Mandate",
          body: (
            <>
              <p>
                Upon successful onboarding the Client appoints the Bank as custodian and
                administrator of the assets deposited within the Continental relationship. The
                Bank, in turn, accepts the mandate and undertakes to discharge it with the care of
                a prudent banker and under the supervision of its prudential regulator.
              </p>
              <p>
                The relationship is personal and confidential. It cannot be assigned by the Client
                without the prior written consent of the Bank.
              </p>
            </>
          ),
        },
        {
          title: "2. Instructions",
          body: (
            <p>
              Instructions are accepted from the Client or any duly authorised representative
              identified to the Bank in writing. The Bank may, but is not obliged to, accept
              instructions communicated through the secure portal, over a recorded telephone line,
              or by signed letter. Any ambiguity will be resolved by the responsible relationship
              manager in conversation with the Client.
            </p>
          ),
        },
        {
          title: "3. Withdrawals",
          body: (
            <>
              <p>
                All outbound payments require manual review and authorisation by a responsible
                officer of the Bank. The Bank operates no automated settlement of client funds.
                Settlement is effected once instructions have been verified and counter-party
                accounts have been validated.
              </p>
              <p>
                The Bank may decline an outbound instruction where (a) source-of-funds questions
                remain open, (b) sanctions screening produces a positive match, or (c) the
                instruction would breach an applicable law in any jurisdiction in which the Bank
                operates. A declined instruction is recorded against the audit log with the
                justifying note.
              </p>
            </>
          ),
        },
        {
          title: "4. Fees",
          body: (
            <p>
              Standard banking fees, custody fees, and bespoke advisory fees are set out in the
              schedule provided at onboarding and reviewed annually. The Bank does not accept
              retrocessions from third-party fund managers in respect of Client assets. Where such
              retrocessions are received, they are credited to the Client&rsquo;s reporting
              currency account within thirty days.
            </p>
          ),
        },
        {
          title: "5. Reporting",
          body: (
            <p>
              The Client is provided with continuous portal access to balances, the immutable
              ledger, withdrawal status, and audit history. A consolidated quarterly statement is
              issued in the Client&rsquo;s reporting currency on the first business day of each
              calendar quarter. Annual reporting for tax purposes is prepared on instruction.
            </p>
          ),
        },
        {
          title: "6. Liability",
          body: (
            <p>
              The Bank is liable for losses arising from its gross negligence or wilful
              misconduct. The Bank is not liable for losses arising from a Client&rsquo;s own
              instructions, from third-party counter-party failure, or from events beyond its
              reasonable control. Aggregate liability for any twelve-month period is capped at the
              total fees paid by the Client during that period, save where the relevant law
              prohibits such cap.
            </p>
          ),
        },
        {
          title: "7. Termination",
          body: (
            <p>
              Either party may terminate the relationship upon ninety days&rsquo; written notice.
              The Bank may terminate without notice in the event of a breach of these Terms, of a
              material change in the Client&rsquo;s circumstances that renders continued service
              imprudent, or of a development that prevents the Bank from satisfying its regulatory
              obligations.
            </p>
          ),
        },
        {
          title: "8. Governing law and jurisdiction",
          body: (
            <p>
              These Terms are governed by the substantive law of Switzerland. The ordinary courts
              of the Canton of Geneva have exclusive jurisdiction over any dispute arising in
              connection with them, subject to mandatory provisions providing for an alternate
              forum to the benefit of a consumer.
            </p>
          ),
        },
      ]}
    />
  );
}
