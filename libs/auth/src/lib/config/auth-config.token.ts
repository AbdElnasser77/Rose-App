import { InjectionToken } from '@angular/core';
import { BaseUrlConfigModel } from '../models/base-url-config.model';

export const BASE_URL_CONFIG = new InjectionToken<BaseUrlConfigModel>('BASE_URL_CONFIG');