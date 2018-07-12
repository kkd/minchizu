import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import FirebaseAuthProvider = firebase.auth.AuthProvider;

@Injectable()
export class FireauthProvider {

	private user: firebase.User;

	constructor(
	  public afAuth: AngularFireAuth
	 ) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}
	
	// 匿名ユーザ
  signInAnonymously() {
    console.log("Sign in with anonymous")
    return this.afAuth.auth.signInAnonymously();
  }

	signInWithEmail(credentials) {
		console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
	}

	signInWithGoogle() {
		console.log('Sign in with google');
		return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
	}
	
	signInWithFacebook() {
		console.log('Sign in with Facebook');
		let provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope("email");
		
		return this.oauthSignIn(provider);
	}
	
	private oauthSignIn(provider: FirebaseAuthProvider) {
		return this.afAuth.auth.signInWithPopup(provider);
	}
	
	get authenticated(): boolean {
	  return this.user !== null;
	}
	
	get isAnonymous(): boolean {
	  return this.user.isAnonymous;
	}
	
	get uid(): any {
		return this.user.uid;
	}
	
	signOut(): Promise<void> {
	  return this.afAuth.auth.signOut();
	}

}