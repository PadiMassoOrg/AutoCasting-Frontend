import { Footer } from '../Footer';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex flex-col justify-center min-h-screen bg-slate-50">
        <div className="w-full max-w-[1366px] m-auto p-6">{children}</div>
      </div>
      <Footer></Footer>
    </>
  );
}
