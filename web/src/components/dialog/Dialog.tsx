import * as React from "react";
import {
  Root,
  Overlay,
  Content,
  Title,
  Description,
  Close,
} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "./Dialog.module.scss";

export type DialogProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  onOpenChange: (open: boolean) => void;
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  description,
  onOpenChange,
  children,
}) => {
  const closeButtonLabel = "Close dialog"

  return (
    <Root open={isOpen} onOpenChange={onOpenChange}>
      <Overlay className={styles.overlay} />
      <Content className={styles.content}>
        {title && <Title className={styles.title}>{title}</Title>}
        {description && <Description>{description}</Description>}
        <Close className={styles.closeButton} aria-label={closeButtonLabel}>
          <Cross2Icon />
        </Close>
        {children}
      </Content>
    </Root>
  );
};
