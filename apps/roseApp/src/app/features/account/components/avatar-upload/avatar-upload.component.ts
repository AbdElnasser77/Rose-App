import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { LucideAngularModule, CloudUpload, User } from 'lucide-angular';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  UploadApiService,
} from '../../../../core/services/upload-api.service';

@Component({
  selector: 'app-avatar-upload',
  imports: [TranslatePipe, LucideAngularModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly uploadApi = inject(UploadApiService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly photo = input<string | null>(null);

  readonly uploaded = output<string>();

  readonly CloudUpload = CloudUpload;
  readonly User = User;
  readonly accept = ACCEPTED_IMAGE_TYPES.join(',');

  private readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  readonly uploading = signal(false);
  private readonly localPreview = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => this.revokePreview());
  }

  previewUrl(): string {
    return this.localPreview() ?? this.uploadApi.toAbsoluteUrl(this.photo());
  }

  openPicker(): void {
    this.fileInput().nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      this.toast.show(
        this.translate.instant('ACCOUNT.PROFILE.PHOTO_TYPE_ERROR'),
        'error'
      );
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      this.toast.show(
        this.translate.instant('ACCOUNT.PROFILE.PHOTO_SIZE_ERROR'),
        'error'
      );
      return;
    }

    this.uploading.set(true);
    this.uploadApi
      .uploadImage(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (url) => {
          this.uploading.set(false);
          this.revokePreview();
          this.localPreview.set(URL.createObjectURL(file));
          this.uploaded.emit(url);
        },
        error: () => this.uploading.set(false),
      });
  }

  private revokePreview(): void {
    const url = this.localPreview();
    if (url) {
      URL.revokeObjectURL(url);
    }
    this.localPreview.set(null);
  }
}
