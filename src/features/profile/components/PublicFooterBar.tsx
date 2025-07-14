import share from '../icons/share.svg';
import email from '../icons/email.svg';
import whatsapp from '../icons/whatsapp.svg';

const PublicFooterBar = () => {
  return (
    <div className="w-full fixed bottom-0 left-0 flex items-center justify-between gap-4 bg-white p-4 ">
      <span className="border border-gray-400 rounded-xl w-full h-10 sm:h-14 p-4 flex items-center justify-center cursor-pointer">
        <img src={share} alt="share" className="bg-white w-4 sm:w-7" />
      </span>
      <span className="border  border-gray-400 rounded-xl w-full h-10 sm:h-14 p-4 flex items-center justify-center cursor-pointer">
        <img src={email} alt="email" className="bg-white w-4 sm:w-7" />
      </span>
      <span className="border border-gray-400 rounded-xl w-full h-10 sm:h-14 p-4 flex items-center justify-center cursor-pointer">
        <img src={whatsapp} alt="phone" className="bg-white w-4 sm:w-7" />
      </span>
    </div>
  );
};

export default PublicFooterBar;
