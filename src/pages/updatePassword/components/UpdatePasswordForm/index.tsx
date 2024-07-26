import { FormEvent } from 'react';

import Button from '~/common/components/Button';
import Group from '~/common/components/Group';
import Input from '~/common/components/Input';
import Text from '~/common/components/Text';
import { useUpdatePassword } from '~/common/hooks/mutations/useUpdatePassword';
import useForm from '~/common/hooks/useForm';
import { ERROR } from '~/constants/message';
import { isValidPassword, isValidPasswordMatch } from '~/utils/isValid';

const UpdatePasswordForm = () => {
  const { updatePassword, isPending } = useUpdatePassword();
  const { fields, isFormComplete, handleFieldChange, validationStatus } =
    useForm({
      initialValues: {
        password: '',
        confirmPassword: '',
      },
      initialValidationStatus: {
        password: false,
        confirmPassword: false,
      },
      validate: {
        password: value => isValidPassword(value),
        confirmPassword: value =>
          isValidPasswordMatch({
            value: fields.password,
            newPassword: value,
          }),
      },
    });

  const { password, confirmPassword } = fields;

  const handleUpdatePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updatePassword(password);
  };

  return (
    <form
      className="flex flex-col gap-large p-small"
      onSubmit={handleUpdatePassword}
    >
      <Group spacing="sm" direction="columns" className="mt-large" grow>
        <Text size="small">새로운 비밀번호</Text>
        <Input
          type="password"
          name="password"
          value={password ?? ''}
          onChange={handleFieldChange}
          placeholder="새로운 비밀번호를 입력해주세요."
        />
        {password && !validationStatus.password && (
          <Text className="text-wrap text-xs text-error">
            {ERROR.PASSWORD_INVAILD}
          </Text>
        )}
        <Input
          type="password"
          name="confirmPassword"
          value={confirmPassword ?? ''}
          onChange={handleFieldChange}
          placeholder="비밀번호를 다시 한번 입력해주세요."
        />
        {confirmPassword && !validationStatus.confirmPassword && (
          <Text className="text-xs text-error">{ERROR.PASSWORD_NOT_MATCH}</Text>
        )}
        <div className="fixed bottom-[56px] left-0 p">
          <Button loading={isPending} fullwidth disabled={!isFormComplete}>
            변경하기
          </Button>
        </div>
      </Group>
    </form>
  );
};

export default UpdatePasswordForm;
