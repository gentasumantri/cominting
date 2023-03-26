export const Conditional = ({ visible, children }) => {
  if (visible) return <>{children}</>;
  return <></>;
};
