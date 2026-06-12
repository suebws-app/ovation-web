type AuthFormErrorProps = {
  message: string;
};

export const AuthFormError = ({ message }: AuthFormErrorProps) => (
  <p className="type-body-small text-destructive mt-4" role="alert">
    {message}
  </p>
);
