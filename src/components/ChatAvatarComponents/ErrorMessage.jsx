// Simple component to display error messages
const ErrorMessage = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{errorMessage}</span>
    </div>
  );
};

export default ErrorMessage;
