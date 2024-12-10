import { Flex } from '@radix-ui/themes';
import styles from './Button.module.css';
import Link from 'next/link';

export default function ButtonM({ leftButton, rightButton }) {
  const renderButton = ({
    as = 'button',
    href,
    type = 'button',
    style,
    onClick,
    text,
    isLoading = false,
    isLoadingText = '로딩중...',
  }) => {
    const buttonText = isLoading ? isLoadingText : text;
    if (as == 'link' && href) {
      return (
        <Link href={href} className={style} disabled={isLoading}>
          {buttonText}
        </Link>
      );
    } else {
      return (
        <button type={type} onClick={onClick} className={style} disabled={isLoading}>
          {buttonText}
        </button>
      );
    }
  };
  return (
    <div className={styles.button_m}>
      <Flex asChild gap="10px" justify="end">
        <ul>
          {leftButton && <li>{renderButton({ ...leftButton, style: 'light' })}</li>}
          {rightButton && <li>{renderButton({ ...rightButton, style: 'deep' })}</li>}
        </ul>
      </Flex>
    </div>
  );
}
