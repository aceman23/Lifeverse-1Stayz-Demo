import { ArrowRight, CheckCircle2, HeartHandshake, MessageCircleHeart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/public/PublicLayout';

const BUSINESS_CONTACT = {
  legalName: 'Lifeverse',
  address: 'PO Box 10547, Austin, TX 78766',
  email: 'support@1stayz.com',
  phone: '(512) 555-0148',
};

export function PublicHomePage() {
  return (
    <PublicLayout>
      <section className="border-b border-[#D8DDDC] bg-[#F2F8F6]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <span className="inline-flex rounded-full border border-[#B8DCD5] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#017A6E]">Guest follow-up, made personal</span>
            <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#10151A] sm:text-6xl">Every first-time guest deserves a thoughtful next step.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6B6F76]">1Stayz helps churches follow up personally with first-time guests by text and email, on the church's behalf.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-[#018477] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#016F65]">Sign in to 1Stayz <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/connect/grace-community-church" className="inline-flex items-center gap-2 rounded-full border border-[#B8DCD5] bg-white px-5 py-3 text-sm font-semibold text-[#017A6E] transition-colors hover:bg-[#E7F4F1]">Try a guest card</Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#CBE4DF] bg-white p-6 shadow-[0_24px_60px_rgba(16,21,26,0.08)]">
            <div className="flex items-center gap-3 border-b border-[#EDF0EF] pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A2E2A] text-white"><HeartHandshake className="h-5 w-5" /></div>
              <div><p className="font-semibold">A warmer follow-up rhythm</p><p className="text-sm text-[#6B6F76]">Personal, timely, pastor-aware</p></div>
            </div>
            <div className="space-y-3 pt-5">
              {['Welcome every first-time guest', 'Answer simple questions quickly', 'Bring pastoral concerns to a person'].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-[#F7FAF9] p-3 text-sm text-[#26343A]"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#018477]" />{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          <Feature icon={MessageCircleHeart} title="Follow up with care" text="Send helpful, human-sounding messages that make guests feel remembered after Sunday." />
          <Feature icon={ShieldCheck} title="Keep people in control" text="Your team reviews sensitive moments and decides what gets sent on the church's behalf." />
          <Feature icon={HeartHandshake} title="Notice who needs you" text="See which guests need a call, a reply, or a personal welcome from your team." />
        </div>
      </section>

      <section className="border-t border-[#D8DDDC] bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#017A6E]">Questions or support</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">We're here to help your church follow through.</h2></div>
          <a href={`mailto:${BUSINESS_CONTACT.email}`} className="inline-flex items-center justify-center rounded-full border border-[#D8DDDC] px-5 py-3 text-sm font-semibold text-[#10151A] hover:bg-[#F2F8F6]">Contact support</a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="rounded-3xl bg-[#10151A] p-7 text-white sm:p-10"><div className="grid gap-8 md:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8CD9CE]">Business contact</p><h2 className="mt-3 text-2xl font-semibold">Lifeverse, the team behind 1Stayz</h2></div><address className="not-italic text-sm leading-7 text-white/70"><p className="font-medium text-white">{BUSINESS_CONTACT.legalName}</p><p>{BUSINESS_CONTACT.address}</p><p><a className="hover:text-white" href={`mailto:${BUSINESS_CONTACT.email}`}>{BUSINESS_CONTACT.email}</a></p><p><a className="hover:text-white" href={`tel:${BUSINESS_CONTACT.phone}`}>{BUSINESS_CONTACT.phone}</a></p></address></div></div>
      </section>
    </PublicLayout>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof HeartHandshake; title: string; text: string }) {
  return <div className="rounded-2xl border border-[#D8DDDC] bg-white p-6"><Icon className="h-5 w-5 text-[#018477]" /><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6B6F76]">{text}</p></div>;
}
