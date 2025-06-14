import { SweetAlertOptions } from 'sweetalert2';

export const DIALOG_SWAL_KEYS = {
  QUESTION: 'question',
  CONFIRMATION: 'confirmation',
  ERROR: 'error',
  WARNING: 'warning'
};

export const DIALOG_SWAL_OPTIONS: { [key: string]: (title?: string, confirmText?: string, cancelText?: string) => SweetAlertOptions } = {
  question: (
    title?: string,
    confirmText: string = "Aceptar",
    cancelText: string = "Cancelar"
  ): SweetAlertOptions => ({
    title: title,
    showCancelButton: true,
    confirmButtonColor: "#066B4B",
    cancelButtonColor: "#F9B234",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    allowOutsideClick: false,
    customClass: {
      title: 'title-tp-h1 io-green-primary mt-4 mb-1'
    }
  }),
  confirmation: (
    title?: string,
    confirmText: string = "Aceptar",
    cancelText?: string
  ): SweetAlertOptions => ({
    title: title,
    showCloseButton: true,
    confirmButtonColor: "#066B4B",
    confirmButtonText: confirmText,
    closeButtonHtml: `<img src="./assets/svg/close24.svg">`,
    customClass: {
      title: 'title-tp-h1 io-green-primary mt-5 mb-1'
    }
  }),
  error: (
    title?: string,
    confirmText: string = "Aceptar",
    cancelText?: string
  ): SweetAlertOptions => ({
    title: title,
    showCloseButton: true,
    icon: "error",
    confirmButtonColor: "#F9B234",
    confirmButtonText: confirmText,
    closeButtonHtml: `<img src="./assets/svg/close24.svg">`,
    customClass: {
      title: 'title-tp-h1 io-green-primary mt-5 mb-1'
    }
  })
  ,
  warning: (
    title?: string,
    confirmText: string = "Aceptar",
    cancelText: string = "Cancelar"
  ): SweetAlertOptions => ({
    title: title,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#066B4B",
    cancelButtonColor: "#F9B234",
    customClass: {
      title: 'title-tp-h1 io-green-primary mt-4 mb-1'
    }
  })
};
