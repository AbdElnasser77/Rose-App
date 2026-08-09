// POST /users/email/request - the server knows the current address, the body
// carries the target one.
export interface RequestEmailChangeRequestModel {
  newEmail: string;
}

// POST /users/email/confirm - the pending address is held server side against
// the session, so only the code is sent.
export interface ConfirmEmailChangeRequestModel {
  code: string;
}
