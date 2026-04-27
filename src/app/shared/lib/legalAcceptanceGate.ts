type OpenLegalAcceptanceModalHandler = () => Promise<boolean>;

let openHandler: OpenLegalAcceptanceModalHandler | null = null;
let pendingRequest: Promise<boolean> | null = null;

export const registerLegalAcceptanceHandler = (handler: OpenLegalAcceptanceModalHandler) => {
  openHandler = handler;
  return () => {
    if (openHandler === handler) {
      openHandler = null;
    }
  };
};

export const requestLegalAcceptance = async (): Promise<boolean> => {
  if (!openHandler) {
    return false;
  }

  if (!pendingRequest) {
    pendingRequest = openHandler().finally(() => {
      pendingRequest = null;
    });
  }

  return pendingRequest;
};
