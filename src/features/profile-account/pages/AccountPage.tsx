import AccountSideNav from '../../../layouts/components/AccountSideNav';

export default function AccountPanel() {
  return (
    <section className="w-full h-full min-w-0 flex flex-col gap-6">
      <div className="lg:flex lg:flex-row lg:gap-4 h-full min-h-0">
        <AccountSideNav />
        {/* Content */}
        <article
          className="w-full h-full lg:pb-4 lg:py-6 lg:max-w-[650px] xl:max-w-[778px] lg:m-auto
        min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]
        scrollbar-hide"
        >
          <h2>hola</h2>
        </article>
      </div>
    </section>
  );
}
