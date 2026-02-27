import type { ImgHTMLAttributes } from 'react';

import ApplicantsIconDisabled from '../../icons/applicants-disabled.svg';
import ApplicantsIconPurple from '../../icons/applicants-purple.svg';
import ApplicantsIcon from '../../icons/applicants.svg';
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
import ClapperManageIconPurple from '../../icons/clapper-manage-purple.svg';
import ClapperManageIcon from '../../icons/clapper-manage.svg';
import ClapperIconPurple from '../../icons/clapper-purple.svg';
import ClapperIcon from '../../icons/clapper.svg';
import ClockIconPurple from '../../icons/clock-purple.svg';
import ClockIcon from '../../icons/clock.svg';
import CopyLinkIconDisabled from '../../icons/copy-link-disabled.svg';
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
import InfoIconPurple from '../../icons/info-purple.svg';
import InfoIcon from '../../icons/info.svg';
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
import OpenIconDisabled from '../../icons/open-disabled.svg';
import OpenIconPurple from '../../icons/open-purple.svg';
import OpenIcon from '../../icons/open.svg';
import OverflowMenuIconPurple from '../../icons/overflowmenu-purple.svg';
import OverflowMenuIcon from '../../icons/overflowmenu.svg';
import PlusIconPurple from '../../icons/plus-purple.svg';
import PlusIconWhite from '../../icons/plus-white.svg';
import PlusIcon from '../../icons/plus.svg';
import ProfileIconPurple from '../../icons/profile-purple.svg';
import ProfileIcon from '../../icons/profile.svg';
import PublishIconDisabled from '../../icons/publish-disabled.svg';
import PublishIconPurple from '../../icons/publish-purple.svg';
import PublishIcon from '../../icons/publish.svg';
import SaveIconPurple from '../../icons/save-purple.svg';
import SaveIcon from '../../icons/save.svg';
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

import SearchIconDisabled from '../../icons/search-disabled.svg';
import SearchIconPurple from '../../icons/search-purple.svg';
import SearchIcon from '../../icons/search.svg';

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
  | 'clapperManage'
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
  | 'plus'
  | 'whatsapp'
  | 'vimeo'
  | 'instagram'
  | 'x'
  | 'tikTok'
  | 'linkedin'
  | 'delete'
  | 'save'
  | 'publish'
  | 'overflowmenu'
  | 'applicants'
  | 'search'
  | 'info'
  | 'logout';

export type IconVariant = 'default' | 'primary' | 'white' | 'danger' | 'disabled';

type BaseIconConfig = {
  default: string;
  primary?: string;
  white?: string;
  danger?: string;
  disabled?: string;
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
    disabled: OpenIconDisabled,
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
    disabled: CopyLinkIconDisabled,
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
  plus: {
    default: PlusIcon,
    primary: PlusIconPurple,
    white: PlusIconWhite,
  },
  clapperManage: {
    default: ClapperManageIcon,
    primary: ClapperManageIconPurple,
  },
  save: {
    default: SaveIcon,
    primary: SaveIconPurple,
  },
  publish: {
    default: PublishIcon,
    primary: PublishIconPurple,
    disabled: PublishIconDisabled,
  },
  overflowmenu: {
    default: OverflowMenuIcon,
    primary: OverflowMenuIconPurple,
  },
  applicants: {
    default: ApplicantsIcon,
    primary: ApplicantsIconPurple,
    disabled: ApplicantsIconDisabled,
  },
  search: {
    default: SearchIcon,
    primary: SearchIconPurple,
    disabled: SearchIconDisabled,
  },
  info: {
    default: InfoIcon,
    primary: InfoIconPurple,
  },
};

export type IconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  name: IconName;
  variant?: IconVariant;
  size?: number;
};

export function Icon({ name, variant = 'default', size = 18, className, alt = '', style, ...rest }: IconProps) {
  const config = ICONS[name];

  const src =
    (variant === 'primary' && config.primary) ||
    (variant === 'white' && config.white) ||
    (variant === 'danger' && config.danger) ||
    (variant === 'disabled' && config.disabled) ||
    config.default;

  const finalStyle = {
    width: size,
    height: size,
    ...style,
  };

  const baseClassName = `inline-block ${variant === 'disabled' ? 'cursor-not-allowed' : 'cursor-pointer'}`;
  const finalClassName = className ? `${baseClassName} ${className}` : baseClassName;

  return <img src={src} alt={alt} className={finalClassName} style={finalStyle} {...rest} />;
}
