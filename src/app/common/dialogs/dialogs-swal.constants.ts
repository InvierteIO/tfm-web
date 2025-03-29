import { SweetAlertOptions } from 'sweetalert2';

export const DIALOG_SWAL_KEYS = {
  QUESTION: 'question',
  CONFIRMATION: 'confirmation',
  ERROR: 'error'
};

export const DIALOG_SWAL_OPTIONS: { [key: string]: (title: string) => SweetAlertOptions } = {
  question: (title: string): SweetAlertOptions => ({
    title: title,
    showCancelButton: true,
    confirmButtonColor: "#066B4B",
    cancelButtonColor: "#F9B234",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    customClass: {
      title: 'title-tp-h1 io-green-primary mt-4 mb-1'
    }
  }),
  confirmation: (title: string): SweetAlertOptions => ({
    title: title,
    showCloseButton: true,
    confirmButtonColor: "#066B4B",
    confirmButtonText: `Aceptar`,
    closeButtonHtml: `<img src="./assets/svg/close24.svg">`,
    customClass: {
      title: 'title-tp-h1 io-green-primary mt-5 mb-1'
    }
  }),
  error: (title: string): SweetAlertOptions => ({
    title: title,
    showCloseButton: true,
    icon: "error",
    confirmButtonColor: "#066B4B",
    confirmButtonText: `Aceptar`,
    closeButtonHtml: `<img src="./assets/svg/close24.svg">`,
    customClass: {
      title: 'title-tp-h1 io-green-primary mt-5 mb-1'
    }
  })
};
