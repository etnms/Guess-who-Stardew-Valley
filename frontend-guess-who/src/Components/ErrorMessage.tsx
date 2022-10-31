import styles from "./ErrorMessage.module.css";

interface IErrorMessage {
  message: string;
}
function ErrorMessage({ message }: React.PropsWithChildren<IErrorMessage>) {
  return <p className={styles.message}>{message}</p>;
}

export default ErrorMessage;
