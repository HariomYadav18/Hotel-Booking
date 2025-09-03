export const intents = [
  { pattern: /refund|cancel/i, reply: 'Refunds: Free if >7 days before check-in. 70% refund if 2-7 days. No refund within 2 days.' },
  { pattern: /book(ing)? steps|how to book/i, reply: 'Search hotels, pick dates and room, enter guest details, and pay via Stripe.' },
  { pattern: /coupon|discount/i, reply: 'Use a valid coupon code at checkout to see discounted total.' },
  { pattern: /check(-| )?in|check(-| )?out/i, reply: 'Check-in from 2pm, check-out by 11am. Early/late subject to availability.' },
  { pattern: /hello|hi|hey/i, reply: 'Hello! How can I help you with your booking?' },
];

export function replyFor(message) {
  for (const intent of intents) {
    if (intent.pattern.test(message)) return intent.reply;
  }
  return 'I can help with booking steps, coupons, or refund policy.';
}


