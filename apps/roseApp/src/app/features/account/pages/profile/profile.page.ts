import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  ButtonComponent,
  PhoneInputComponent,
  ReusableInputComponent,
} from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { ToastService } from '@org/shared-util-notification';
import { AuthFacade, AuthStore, UpdateProfileRequestModel, UserModel } from '@org/auth';
import { AvatarUploadComponent } from '../../components/avatar-upload/avatar-upload.component';
import { ReadonlyFieldComponent } from '../../components/readonly-field/readonly-field.component';
import { DeleteAccountModalComponent } from '../../components/delete-account-modal/delete-account-modal.component';
import { ChangeEmailModalComponent } from '../../components/change-email-modal/change-email-modal.component';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ButtonComponent,
    ReusableInputComponent,
    PhoneInputComponent,
    AvatarUploadComponent,
    ReadonlyFieldComponent,
    DeleteAccountModalComponent,
    ChangeEmailModalComponent,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authFacade = inject(AuthFacade);
  private readonly authStore = inject(AuthStore);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly user = this.authStore.user;
  readonly deleteModalOpen = signal(false);
  readonly emailModalOpen = signal(false);
  readonly pendingPhoto = signal<string | null>(null);

  readonly profileForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: [''],
  });

  ngOnInit(): void {
    // Seed from the cached user first so the fields are never briefly blank,
    // then refresh from the server.
    this.patchFrom(this.user());
    this.authFacade
      .loadProfile()
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.patchFrom(user));
  }

  save(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const { firstName, lastName, phone } = this.profileForm.getRawValue();
    const trimmedPhone = phone.trim();
    const photo = this.pendingPhoto();
    const data: UpdateProfileRequestModel = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(trimmedPhone ? { phone: trimmedPhone } : {}),
      ...(photo ? { photo } : {}),
    };
    this.authFacade
      .updateProfile(data)
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.profileForm.markAsPristine();
        this.pendingPhoto.set(null);
        this.patchFrom(user);
        this.toast.show(
          this.translate.instant('ACCOUNT.PROFILE.UPDATE_SUCCESS'),
          'success'
        );
      });
  }

  onPhotoUploaded(url: string): void {
    this.pendingPhoto.set(url);
    this.profileForm.markAsDirty();
  }

  confirmDelete(): void {
    this.deleteModalOpen.set(false);
    this.authFacade
      .deleteAccount()
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // Session artefact the navbar still reads; nothing else clears it.
        localStorage.removeItem('username');
        this.toast.show(
          this.translate.instant('ACCOUNT.DELETE_ACCOUNT.SUCCESS'),
          'success'
        );
        this.router.navigate(['/home']);
      });
  }

  private patchFrom(user: UserModel | null): void {
    // A response landing after the user started typing must not discard the edit.
    if (!user || this.profileForm.dirty) return;
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? '',
    });
  }
}
