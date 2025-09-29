import { useTranslation } from 'react-i18next';

export default function AccountPanel() {
  const { t } = useTranslation();
  return (
    <article className="w-full flex flex-col gap-6">
      {/* Título visible en mobile (sidebar está oculta) */}
      <h1 className="mb-2 text-2xl font-bold lg:hidden">{t('account.menu.access')}</h1>
      <h2>Hola</h2>
      {/* Aquí tu formulario de email/contraseña */}
      {/* ... */}
    </article>
  );
}
