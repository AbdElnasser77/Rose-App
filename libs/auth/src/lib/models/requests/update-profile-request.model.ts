// Every field optional so callers can omit what they do not manage - the profile
// form has no photo picker yet, and omitting the key is safer than sending null.
export interface UpdateProfileRequestModel {
  firstName?: string;
  lastName?: string;
  phone?: string;
  photo?: string;
}
