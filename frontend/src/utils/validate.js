export const validateSignup = (formData) => {
  const errors = {};
  if (!formData.name) errors.name = "Name is required.";
  if (!formData.password) errors.password = "Password is required.";
  if (!formData.phNo && !formData.email)
    errors.contact = "Either Phone or Email is required.";
  return errors;
};
