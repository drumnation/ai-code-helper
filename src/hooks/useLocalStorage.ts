import { useEffect } from 'react';

function useLocalStorage({
  updateInterview,
  updateSendEmailPoints,
  updateIsSendEmail,
  updateState,
  state,
}) {
  useEffect(() => {
    const storedSendEmailPoints = localStorage.getItem('sendEmailPoints');
    const storedReplyToEmail = localStorage.getItem('replyToEmail');
    const storedSender = localStorage.getItem('sender');
    const storedReceiver = localStorage.getItem('receiver');
    const storedIsSendEmail = localStorage.getItem('isSendEmail');
    const storedInterview = localStorage.getItem('interview');
    if (storedInterview) updateInterview(JSON.parse(storedInterview));
    if (storedSendEmailPoints)
      updateSendEmailPoints(JSON.parse(storedSendEmailPoints));
    if (storedIsSendEmail) updateIsSendEmail(JSON.parse(storedIsSendEmail));
    updateState({
      ...state,
      ...(storedReplyToEmail && { email: storedReplyToEmail }),
      ...(storedSender && { sender: storedSender }),
      ...(storedReceiver && { receiver: storedReceiver }),
    });
  }, []);

  return {};
}

export default useLocalStorage;
