import { useCallback, useState } from 'react';

import { User } from '~/api/types/userTypes';
import { ERROR, MESSAGE } from '~/constants/message';
interface useEmailDuplicateParams {
  userList: User[];
}

const useEmailDuplicate = ({ userList }: useEmailDuplicateParams) => {
  const [emailDuplicateCheckMessage, setEmailDuplicateCheckMessage] =
    useState('');
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(true);

  const checkDuplicateEmail = useCallback(
    (email: string) => {
      const users: User[] = userList;
      const isDuplicate = users.some(user => user.email === email);

      setIsEmailDuplicate(isDuplicate);
      if (isDuplicate) {
        setEmailDuplicateCheckMessage(ERROR.DUPLICATE_EMAIL);
      } else {
        setEmailDuplicateCheckMessage(MESSAGE.POSSIBLE_EMAIL);
      }
    },
    [userList],
  );

  return {
    emailDuplicateCheckMessage,
    setIsEmailDuplicate,
    setEmailDuplicateCheckMessage,
    isEmailDuplicate,
    checkDuplicateEmail,
  };
};

export default useEmailDuplicate;
