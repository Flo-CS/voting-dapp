import { useEffect, useState } from "react";

export default function useUncontrolledInput(initValue: string) {
  const [draftValue, setDraftValue] = useState(initValue);
  const [validatedValue, setValidatedValue] = useState(initValue);

  useEffect(() => {
    setDraftValue(validatedValue);
  }, [validatedValue]);

  return {
    draftValue,
    setDraftValue,
    validatedValue,
    setValidatedValue,
  };
}
