function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="text-left p-4">
      <p>
        <strong className="text-base md:text-xl font-semibold">{q}</strong>
      </p>
      <p className="text-xs md:text-lg">{a}</p>
    </div>
  );
}

export default function FaqContent() {
  return (
    <div className="flex flex-col text-sm md:text-xl tracking-wider text-center font-(family-name:--font-playfair-display)">
      <p>
        If you need help with the RSVP or have other questions - please contact
        us!
      </p>
      <div className="grid md:grid-cols-2 md:m-6">
        <div className="flex flex-col grow">
          <Faq
            q="Are the ceremony and reception at the same venue?"
            a="Yes, all festivities will be at The Rural Society venue."
          />
          <Faq
            q="Is there parking?"
            a="Yes, there is ample parking in front of the venue."
          />
        </div>
        <div className="flex flex-col grow md:border-l">
          <Faq
            q="What time should I arrive?"
            a="Please arrive at least 15 minutes before the ceremony begins at 3:30."
          />
          <Faq
            q="Who exactly is invited and can I bring extra guests?"
            a="Please only bring those who are listed under your RSVP - dinner is plated and we will not have any extra seats for those not directly invited (including children)."
          />
        </div>
      </div>
    </div>
  );
}
