/**
 * Visible FAQ list. Uses native <details> so answers stay in the HTML (crawlable)
 * while collapsed. The same Q&As are emitted as FAQPage JSON-LD by the page.
 */
export default function FaqList({ heading, faqs }: { heading: string; faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h2 id="faq-heading" className="text-2xl font-bold text-charcoal dark:text-white tracking-tight mb-6 flex items-center gap-3">
        <i className="fa-regular fa-circle-question text-accent" aria-hidden="true"></i> {heading}
      </h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            open={i === 0}
            className="group bg-white dark:bg-[#0A2B20] border border-gray-100 dark:border-primary-800/50 rounded-2xl overflow-hidden open:border-primary-200 dark:open:border-primary-700 transition-colors"
          >
            <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <h3 className="font-bold text-base text-charcoal dark:text-gray-100 group-open:text-primary-800 dark:group-open:text-primary-300">{f.q}</h3>
              <i className="fa-solid fa-plus text-[10px] text-softgray group-open:rotate-45 transition-transform" aria-hidden="true"></i>
            </summary>
            <p className="px-6 pb-6 text-base text-charcoal dark:text-gray-300 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
