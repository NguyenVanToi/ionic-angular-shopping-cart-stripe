import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';

@Injectable()
export class UserService {
  constructor(private fireStore: Firestore, private auth: Auth) {}

  getCurrentUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.fireStore, `users/${user.uid}`);
    return docData(userDocRef);
  }

  async setStripeCustomerId(token: string) {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.fireStore, `users/${user.uid}`);
    return setDoc(userDocRef, { tokenStripe: token });
  }

  async saveInvoicesStripe(invoices: any) {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.fireStore, `users/${user.uid}`);
    return setDoc(userDocRef, { invoices });
  }
}
