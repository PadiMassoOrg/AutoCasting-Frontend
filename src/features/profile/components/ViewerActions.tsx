import share from '../icons/share.svg';
import message from '../icons/message.svg';

const ViewerActions = () => {
  return (
    <div className="w-full flex items-center justify-center gap-2">
      <span className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center cursor-pointer">
        <img src={share} alt="share" className="bg-[var(--color-primary-light-grey)] w-5" />
      </span>
      <span className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center cursor-pointer">
        <img src={message} alt="email" className="bg-[var(--color-primary-light-grey)] w-5" />
      </span>
    </div>
  );
};

export default ViewerActions;
