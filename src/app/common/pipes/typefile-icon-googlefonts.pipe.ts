import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeFileIconGoogleFonts'
})
export class TypeFileIconGoogleFontsPipe implements PipeTransform {

  private extensionIconMap: { [extension: string]: string } = {

    'png': 'image',
    'jpg': 'image',
    'jpeg': 'image',
    'gif': 'image',
    'bmp': 'image',
    'svg': 'image',

    'mp3': 'audiotrack',
    'wav': 'audiotrack',
    'ogg': 'audiotrack',
    'flac': 'audiotrack',

    'mp4': 'movie',
    'avi': 'movie',
    'mkv': 'movie',
    'mov': 'movie',
    'wmv': 'movie',

    'pdf': 'picture_as_pdf',

    'js': 'code',
    'ts': 'code',
    'java': 'code',
    'py': 'code',
    'c': 'code',
    'cpp': 'code',
    'cs': 'code',
    'html': 'code',
    'css': 'code',
    'json': 'code',
    'xml': 'code',
    'md': 'code',
    'txt': 'description',

    'doc': 'description',
    'docx': 'description',
    'xls': 'description',
    'xlsx': 'description',
    'ppt': 'description',
    'pptx': 'description',
    'csv': 'description',
    'zip': 'folder_zip',
    'rar': 'folder_zip',
    '7z': 'folder_zip',
    'tar': 'folder_zip',
    'gz': 'folder_zip',
    'tgz': 'folder_zip',
    'bz2': 'folder_zip',

    'kmz': 'location_on',
    'kml': 'location_on'
  };

  transform(filename: string | undefined): string {
    if (!filename) {
      return 'description';
    }
    const parts = filename.split('.');
    if (parts.length < 2) {
      return 'description';
    }
    const ext = parts.pop()?.toLowerCase() || '';
    const iconName = this.extensionIconMap[ext];
    return iconName ? iconName : 'description';
  }
}
