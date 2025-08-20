export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Email is used already';
    case 'auth/invalid-email':
      return 'Invalid email format';
    case 'auth/operation-not-allowed':
      return 'Operation is not allowed';
    case 'auth/weak-password':
      return 'Weak password';
    case 'auth/user-disabled':
      return 'User is disabled';
    case 'auth/user-not-found':
      return 'User is not found';
    case 'auth/wrong-password':
      return 'Wrong password';
    case 'auth/popup-closed-by-user':
      return 'Authorization was cancelled by user';
    case 'auth/popup-blocked':
      return 'Popup was blocked by browser';
    case 'auth/network-request-failed':
      return 'Network error';
    default:
      return 'Auth error';
  }
};
