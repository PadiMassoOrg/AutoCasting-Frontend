import type { ImgHTMLAttributes } from 'react';

import ArrowLongLeftIconPurple from '../../icons/arrow-long-left-purple.svg';
import ArrowLongLeftIcon from '../../icons/arrow-long-left.svg';
import BehanceIconPurple from '../../icons/behance-purple.svg';
import BehanceIcon from '../../icons/behance.svg';
import BurgerCloseIconPurple from '../../icons/burger-close-purple.svg';
import BurgerCloseIcon from '../../icons/burger-close.svg';
import BurgerIconPurple from '../../icons/burger-purple.svg';
import BurgerIcon from '../../icons/burger.svg';
import CalendarIconPurple from '../../icons/calendar-purple.svg';
import CalendarIcon from '../../icons/calendar.svg';
import CatalogIconPurple from '../../icons/catalogo-purple.svg';
import CatalogIcon from '../../icons/catalogo.svg';
import ClapperIconPurple from '../../icons/clapper-purple.svg';
import ClapperIcon from '../../icons/clapper.svg';
import ClockIconPurple from '../../icons/clock-purple.svg';
import ClockIcon from '../../icons/clock.svg';
import CopyLinkIconPurple from '../../icons/copy-link-purple.svg';
import CopyLinkIcon from '../../icons/copy-link.svg';
import CrossIconPurple from '../../icons/cross-purple.svg';
import CrossIcon from '../../icons/cross.svg';
import DeleteIconRed from '../../icons/delete-red.svg';
import DeleteIcon from '../../icons/delete.svg';
import EditIconPurple from '../../icons/edit-purple.svg';
import EditIcon from '../../icons/edit.svg';
import FileIconPurple from '../../icons/file-purple.svg';
import FileIcon from '../../icons/file.svg';
import FilterIconPurple from '../../icons/filter-purple.svg';
import FilterIcon from '../../icons/filter.svg';
import ImdbIconPurple from '../../icons/imdb-purple.svg';
import ImdbIcon from '../../icons/imdb.svg';
import InstagramIconPurple from '../../icons/instagram-purple.svg';
import InstagramIcon from '../../icons/instagram.svg';
import LinkedInIconPurple from '../../icons/linkedin-purple.svg';
import LinkedInIcon from '../../icons/linkedin.svg';
import LocationIconPurple from '../../icons/location-purple.svg';
import LocationIcon from '../../icons/location.svg';
import LogoutIconRed from '../../icons/logout-red.svg';
import MailIconPurple from '../../icons/message-purple.svg';
import MailIcon from '../../icons/message.svg';
import OGIcon from '../../icons/og-image.svg';
import OpenIconPurple from '../../icons/open-purple.svg';
import OpenIcon from '../../icons/open.svg';
import ProfileIconPurple from '../../icons/profile-purple.svg';
import ProfileIcon from '../../icons/profile.svg';
import SettingsIconPurple from '../../icons/settings-purple.svg';
import SettingsIcon from '../../icons/settings.svg';
import SwitcherIconPurple from '../../icons/switcher-purple.svg';
import SwitcherIcon from '../../icons/switcher.svg';
import TickIconPurple from '../../icons/tick-2-purple.svg';
import TickIcon from '../../icons/tick-2.svg';
import TikTokIcon from '../../icons/tikTok.svg';
import ViewIconPurple from '../../icons/view-purple.svg';
import ViewIcon from '../../icons/view.svg';
import VimeoIconPurple from '../../icons/vimeo-purple.svg';
import VimeoIcon from '../../icons/vimeo.svg';
import WhatsappIconPurple from '../../icons/whatsapp-purple.svg';
import WhatsappIcon from '../../icons/whatsapp.svg';
import XIconPurple from '../../icons/x-purple.svg';
import XIcon from '../../icons/x.svg';

export type IconName =
  | 'ogIcon'
  | 'switcher'
  | 'tick'
  | 'view'
  | 'open'
  | 'burger'
  | 'burgerClose'
  | 'arrowLongLeft'
  | 'catalog'
  | 'copyLink'
  | 'clapper'
  | 'clock'
  | 'file'
  | 'filter'
  | 'profile'
  | 'settings'
  | 'cross'
  | 'edit'
  | 'mail'
  | 'location'
  | 'calendar'
  | 'behance'
  | 'imdb'
  | 'whatsapp'
  | 'vimeo'
  | 'instagram'
  | 'x'
  | 'tikTok'
  | 'linkedin'
  | 'delete'
  | 'logout';

export type IconVariant = 'default' | 'primary' | 'danger';

type BaseIconConfig = {
  default: string;
  primary?: string;
  danger?: string;
};

const ICONS: Record<IconName, BaseIconConfig> = {
  switcher: {
    default: SwitcherIcon,
    primary: SwitcherIconPurple,
  },
  tick: {
    default: TickIcon,
    primary: TickIconPurple,
  },
  view: {
    default: ViewIcon,
    primary: ViewIconPurple,
  },
  open: {
    default: OpenIcon,
    primary: OpenIconPurple,
  },
  burger: {
    default: BurgerIcon,
    primary: BurgerIconPurple,
  },
  burgerClose: {
    default: BurgerCloseIcon,
    primary: BurgerCloseIconPurple,
  },
  catalog: {
    default: CatalogIcon,
    primary: CatalogIconPurple,
  },
  profile: {
    default: ProfileIcon,
    primary: ProfileIconPurple,
  },
  settings: {
    default: SettingsIcon,
    primary: SettingsIconPurple,
  },
  logout: {
    default: LogoutIconRed,
    danger: LogoutIconRed,
  },
  arrowLongLeft: {
    default: ArrowLongLeftIcon,
    primary: ArrowLongLeftIconPurple,
  },
  cross: {
    default: CrossIcon,
    primary: CrossIconPurple,
  },
  copyLink: {
    default: CopyLinkIcon,
    primary: CopyLinkIconPurple,
  },
  clapper: {
    default: ClapperIcon,
    primary: ClapperIconPurple,
  },
  file: {
    default: FileIcon,
    primary: FileIconPurple,
  },
  delete: {
    default: DeleteIcon,
    danger: DeleteIconRed,
  },
  edit: {
    default: EditIcon,
    primary: EditIconPurple,
  },
  mail: {
    default: MailIcon,
    primary: MailIconPurple,
  },
  behance: {
    default: BehanceIcon,
    primary: BehanceIconPurple,
  },
  imdb: {
    default: ImdbIcon,
    primary: ImdbIconPurple,
  },
  whatsapp: {
    default: WhatsappIcon,
    primary: WhatsappIconPurple,
  },
  vimeo: {
    default: VimeoIcon,
    primary: VimeoIconPurple,
  },
  instagram: {
    default: InstagramIcon,
    primary: InstagramIconPurple,
  },
  x: {
    default: XIcon,
    primary: XIconPurple,
  },
  tikTok: {
    default: TikTokIcon,
    primary: TickIconPurple,
  },
  linkedin: {
    default: LinkedInIcon,
    primary: LinkedInIconPurple,
  },
  ogIcon: {
    default: OGIcon,
  },
  filter: {
    default: FilterIcon,
    primary: FilterIconPurple,
  },
  location: {
    default: LocationIcon,
    primary: LocationIconPurple,
  },
  calendar: {
    default: CalendarIcon,
    primary: CalendarIconPurple,
  },
  clock: {
    default: ClockIcon,
    primary: ClockIconPurple,
  },
};

export type IconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  name: IconName;
  variant?: IconVariant;
  size?: number;
};

export function Icon({ name, variant = 'default', size = 24, className, alt = '', style, ...rest }: IconProps) {
  const config = ICONS[name];

  const src = (variant === 'primary' && config.primary) || (variant === 'danger' && config.danger) || config.default;

  const finalStyle = {
    width: size,
    height: size,
    ...style,
  };

  const baseClassName = 'inline-block cursor-pointer';
  const finalClassName = className ? `${baseClassName} ${className}` : baseClassName;

  return <img src={src} alt={alt} className={finalClassName} style={finalStyle} {...rest} />;
}
