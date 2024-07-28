import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

interface FormFields {
  [key: string]: FieldState;
}

interface FieldState {
  value: string;
  isValid: boolean;
}

interface FieldsValidationStatus {
  [key: string]: boolean;
}

interface FieldValidators {
  [key: string]: (value: string, fields: FormFields) => boolean;
}

interface UseFormParams {
  initialValues: FormFields;
  validation: FieldValidators;
  dependencies?: { [key: string]: string[] };
}

const useForm = ({
  initialValues,
  validation,
  dependencies = {},
}: UseFormParams) => {
  const [fields, setFields] = useState<FormFields>(initialValues);
  const validateFuncRef = useRef<FieldValidators>(validation);
  const dependenciesRef = useRef<{ [key: string]: string[] }>(dependencies);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const checkFieldValidity = useCallback(
    (fieldName: string, fieldValue: string): void => {
      setFields(prevFields => {
        const updatedFields = {
          ...prevFields,
          [fieldName]: {
            ...prevFields[fieldName],
            value: fieldValue,
          },
        };

        const fieldsToValidate = [
          fieldName,
          ...(dependenciesRef.current[fieldName] || []),
        ];

        fieldsToValidate.forEach(fieldToValidate => {
          const validationResult = validateFuncRef.current[fieldToValidate](
            updatedFields[fieldToValidate].value,
            updatedFields,
          );

          updatedFields[fieldToValidate].isValid = validationResult;
        });

        return updatedFields;
      });
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

  useEffect(() => {
    const validationStatus: FieldsValidationStatus = Object.entries(
      fields,
    ).reduce((acc: FieldsValidationStatus, [key, { isValid }]) => {
      acc[key] = isValid;
      return acc;
    }, {});

    const allFieldsValid = Object.values(validationStatus).every(
      value => value,
    );
    setIsFormComplete(allFieldsValid);
  }, [fields]);

  return {
    fields: Object.fromEntries(
      Object.entries(fields).map(([key, { value }]) => [key, value]),
    ),
    validationStatus: Object.fromEntries(
      Object.entries(fields).map(([key, { isValid }]) => [key, isValid]),
    ),
    isFormComplete,
    handleFieldChange,
  };
};

export default useForm;
