import { useCallback, useRef, useState } from "react";
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  DragEvent,
  MouseEvent,
  MutableRefObject,
} from "react";

type UseImageUploaderOptions = {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  enableCameraCapture?: boolean;
  disableClick?: boolean;
};

type RefCallback = MutableRefObject<HTMLInputElement | null> | ((instance: HTMLInputElement | null) => void);

type GetRootProps = (
  props?: ComponentPropsWithoutRef<"div">,
) => ComponentPropsWithoutRef<"div">;

type GetInputProps = (
  props?: ComponentPropsWithoutRef<"input"> & { ref?: RefCallback },
) => ComponentPropsWithoutRef<"input"> & { ref: (instance: HTMLInputElement | null) => void };

export function useImageUploader({
  onFiles,
  multiple = false,
  maxFiles,
  accept = "image/*",
  enableCameraCapture = true,
  disableClick = false,
}: UseImageUploaderOptions) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragCounter = useRef(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const processFiles = useCallback(
    (fileList: FileList | null | undefined) => {
      if (!fileList) return;
      const collected = Array.from(fileList);
      if (!collected.length) return;

      let limited = collected;
      if (maxFiles !== undefined) {
        limited = limited.slice(0, maxFiles);
      }
      if (!multiple && limited.length > 1) {
        limited = [limited[0]];
      }
      if (!limited.length) return;
      onFiles(limited);
    },
    [maxFiles, multiple, onFiles],
  );

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      processFiles(event.currentTarget.files);
      event.currentTarget.value = "";
    },
    [processFiles],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      dragCounter.current = 0;
      setIsDragActive(false);
      processFiles(event.dataTransfer?.files);
    },
    [processFiles],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current += 1;
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const mergeRefs = useCallback((node: HTMLInputElement | null, ref?: RefCallback) => {
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as MutableRefObject<HTMLInputElement | null>).current = node;
    }
  }, []);

  const getInputProps: GetInputProps = useCallback(
    (props = {}) => {
      const { ref: forwardedRef, onChange, capture, ...rest } = props;
      return {
        ...rest,
        ref: (instance: HTMLInputElement | null) => {
          inputRef.current = instance;
          mergeRefs(instance, forwardedRef);
        },
        type: "file",
        accept,
        multiple,
        capture: enableCameraCapture ? (capture ?? "environment") : capture,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          handleChange(event);
          onChange?.(event);
        },
      };
    },
    [accept, enableCameraCapture, handleChange, mergeRefs, multiple],
  );

  const getRootProps: GetRootProps = useCallback(
    (props = {}) => {
      const {
        onClick,
        onDrop,
        onDragOver: onDragOverProp,
        onDragEnter: onDragEnterProp,
        onDragLeave: onDragLeaveProp,
        ...rest
      } = props;
      return {
        ...rest,
        onClick: (event: MouseEvent<HTMLElement>) => {
          if (!disableClick) {
            event.preventDefault();
            open();
          }
          onClick?.(event);
        },
        onDrop: (event: DragEvent<HTMLElement>) => {
          handleDrop(event);
          onDrop?.(event);
        },
        onDragOver: (event: DragEvent<HTMLElement>) => {
          handleDragOver(event);
          onDragOverProp?.(event);
        },
        onDragEnter: (event: DragEvent<HTMLElement>) => {
          handleDragEnter(event);
          onDragEnterProp?.(event);
        },
        onDragLeave: (event: DragEvent<HTMLElement>) => {
          handleDragLeave(event);
          onDragLeaveProp?.(event);
        },
      };
    },
    [disableClick, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, open],
  );

  return {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
  };
}

export type ImageUploaderReturn = ReturnType<typeof useImageUploader>;
