import { useEffect, useMemo } from 'react';

import Button from '~/common/components/Button';
import Group from '~/common/components/Group';
import Text from '~/common/components/Text';
import { useUserListQuery } from '~/common/hooks/queries/useUserList';
import useForm from '~/common/hooks/useForm';
import { ERROR } from '~/constants/message';
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from '~/utils/isValid';

import useEmailDuplicate from '../../hooks/useEmailDuplicate';
import FormField from '../FormField';
import DuplicateButton from './DuplicateButton';

interface RegisterFormProps {
  mutation: { isPending: boolean };
  onRegisterCompleted: (isValid: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterForm = ({
  mutation,
  onRegisterCompleted,
  handleSubmit,
}: RegisterFormProps) => {
  const { data: userList } = useUserListQuery();

  const {
    emailDuplicateCheckMessage,
    setIsEmailDuplicate,
    setEmailDuplicateCheckMessage,
    isEmailDuplicate,
    checkDuplicateEmail,
  } = useEmailDuplicate({ userList });

  const { fields, validationStatus, isFormComplete, handleFieldChange } =
    useForm({
      initialValues: {
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
      },
      initialValidationStatus: {
        email: false,
        password: false,
        username: false,
        confirmPassword: false,
      },
      validate: {
        email: value => isValidEmail(value),
        password: value => isValidPassword(value),
        username: value => isValidUsername(value),
        confirmPassword: (value, values) => value === values.password,
      },
      dependencies: {
        password: ['confirmPassword'],
      },
    });

  const MemoizedDuplicateButton = useMemo(
    () => (
      <DuplicateButton
        checkDuplicateEmail={checkDuplicateEmail}
        email={fields.email}
        isEmailDuplicate={isEmailDuplicate}
        validationStatusEmail={validationStatus.email}
      />
    ),
    [
      checkDuplicateEmail,
      fields.email,
      isEmailDuplicate,
      validationStatus.email,
    ],
  );

  useEffect(() => {
    setIsEmailDuplicate(true);
    setEmailDuplicateCheckMessage('');
  }, [fields.email, setEmailDuplicateCheckMessage, setIsEmailDuplicate]);

  useEffect(() => {
    onRegisterCompleted(isFormComplete && !isEmailDuplicate);
  }, [isFormComplete, isEmailDuplicate, onRegisterCompleted]);

  return (
    <form onSubmit={handleSubmit} className="pb-[100px]">
      <Group direction="columns" spacing="md" grow={true}>
        <div>
          <FormField
            type="email"
            name="email"
            label="이메일"
            placeholder="이메일을 입력해주세요."
            onChange={handleFieldChange}
            value={fields.email}
            isValid={validationStatus.email}
            right={MemoizedDuplicateButton}
          />
          {emailDuplicateCheckMessage && (
            <Text
              className={
                isEmailDuplicate ? 'text-sm text-error' : 'text-sm text-success'
              }
            >
              {emailDuplicateCheckMessage}
            </Text>
          )}
        </div>

        <FormField
          type="text"
          name="username"
          label="이름"
          placeholder="이름을 입력해주세요."
          onChange={handleFieldChange}
          value={fields.username}
          isValid={validationStatus.username}
          errorMessage={ERROR.NAME_INVALID}
        />
        <FormField
          type="password"
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          onChange={handleFieldChange}
          value={fields.password}
          isValid={validationStatus.password}
          errorMessage={ERROR.PASSWORD_INVAILD}
        />
        <FormField
          type="password"
          name="confirmPassword"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 한번 입력해주세요."
          onChange={handleFieldChange}
          value={fields.confirmPassword}
          isValid={validationStatus.confirmPassword}
          errorMessage={ERROR.PASSWORD_NOT_MATCH}
        />
        <div className="sticky w-full p">
          <Button
            loading={mutation.isPending}
            fullwidth={true}
            disabled={mutation.isPending || isEmailDuplicate || !isFormComplete}
          >
            회원가입
          </Button>
        </div>
      </Group>
    </form>
  );
};

export default RegisterForm;
