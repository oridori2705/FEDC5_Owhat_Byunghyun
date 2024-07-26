import { memo } from 'react';

import Button from '~/common/components/Button';

interface DuplicateButtonProps {
  validationStatusEmail: boolean;
  isEmailDuplicate: boolean;
  email: string;
  checkDuplicateEmail: (email: string) => void;
}

const DuplicateButton = memo(
  ({
    validationStatusEmail,
    isEmailDuplicate,
    email,
    checkDuplicateEmail,
  }: DuplicateButtonProps) => (
    <Button
      onClick={() => checkDuplicateEmail(email)}
      type="button"
      styleType="ghost"
      className="absolute right-0 top-0 z-10 translate-y-[7%] text-sm"
      disabled={
        !validationStatusEmail || (validationStatusEmail && !isEmailDuplicate)
      }
    >
      중복 확인
    </Button>
  ),
);

export default DuplicateButton;
