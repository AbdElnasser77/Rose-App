import { Pipe, PipeTransform } from '@angular/core';

declare const __webpack_public_path__: string;

@Pipe({ name: 'assetUrl' })
export class AssetUrlPipe implements PipeTransform {
  transform(path: string): string {
    const base =
      (typeof __webpack_public_path__ !== 'undefined' && __webpack_public_path__) || '/';
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
