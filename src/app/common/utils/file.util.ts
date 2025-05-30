import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';

export class FileUtil {
  static validateFileExtensionMessage(
    file: File,
    allowedExtensions: string[] = ['.png', '.jpg', '.jpeg', '.pdf'],
    message: string = 'Debes seleccionar archivos PDF o imagenes (PNG o JPG)'
  ): boolean {
    const lowerName = file.name.toLowerCase();
    const isValid = allowedExtensions.some(ext => lowerName.endsWith(ext));
    if (!isValid) {
      Swal.fire(
        DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.ERROR](message)
      ).then(() => {});
    }
    return isValid;
  }
}
