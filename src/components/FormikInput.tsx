import { useField } from "formik";

export const FormikInput = ({
  name,
  label,
  type = "text",
  disabled = false,
}: {
  name: string;
  label: string;
  type?: string;
  disabled?: boolean;
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <input id={name} {...field} type={type} disabled={disabled} min={0} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};
