import { ChangeEvent, useCallback, useRef, useState } from 'react';

interface FormFields {
  [key: string]: string;
}

interface FieldsValidationStatus {
  [key: string]: boolean;
}

interface FieldValidators {
  [key: string]: (value: string, fields: FormFields) => boolean;
}

interface UseFormParams {
  initialValues: FormFields;
  initialValidationStatus: FieldsValidationStatus;
  validate: FieldValidators;
  dependencies?: { [key: string]: string[] };
}

const useForm = ({
  initialValues,
  initialValidationStatus,
  validate,
  dependencies = {},
}: UseFormParams) => {
  const [fields, setFields] = useState<FormFields>(initialValues);
  const validationStatusRef = useRef<FieldsValidationStatus>(
    initialValidationStatus,
  );
  const validateRef = useRef<FieldValidators>(validate);
  const dependenciesRef = useRef<{ [key: string]: string[] }>(dependencies);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const checkFieldValidity = useCallback(
    (fieldName: string, fieldValue: string): void => {
      setFields(prevFields => {
        const updatedFields = {
          ...prevFields,
          [fieldName]: fieldValue,
        };

        let fieldsToValidate = [fieldName];
        if (dependenciesRef.current[fieldName]) {
          fieldsToValidate = fieldsToValidate.concat(
            dependenciesRef.current[fieldName],
          );
        }

        const updatedValidationStatus = { ...validationStatusRef.current };
        fieldsToValidate.forEach(fieldToValidate => {
          updatedValidationStatus[fieldToValidate] = validateRef.current[
            fieldToValidate
          ](updatedFields[fieldToValidate], updatedFields);
        });

        validationStatusRef.current = updatedValidationStatus;

        return updatedFields;
      });

      const validationResult = allFieldsValid(validationStatusRef.current);
      setIsFormComplete(validationResult);
    },
    [],
  );

  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      checkFieldValidity(name, value);
    },
    [checkFieldValidity],
  );

  const allFieldsValid = (status: FieldsValidationStatus): boolean => {
    return Object.values(status).every(value => value);
  };

  return {
    fields,
    validationStatus: validationStatusRef.current,
    isFormComplete,
    handleFieldChange,
  };
};

export default useForm;
