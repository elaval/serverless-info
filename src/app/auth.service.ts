import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase/app';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()
export class AuthService {

  userSubject: Subject<any> = new Subject();
  user: Observable<any> = this.userSubject.asObservable();
  tokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  token: Observable<any> = this.tokenSubject.asObservable();

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {
    firebase.initializeApp(environment['firebase']);
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          this.tokenSubject.next(token);
          this.userSubject.next(user);
        });
      }
    });
  }

  login(username, password) {
    
    this.angularFireAuth.auth.signInWithEmailAndPassword('ernesto.laval@gmail.com', 'password')
    .then((user) => {
      this.userSubject.next(user);
      console.log(user);
    });
    
  }

  logout() {
    this.angularFireAuth.auth.signOut()
    .then((d) => {
      this.userSubject.next(null);
    });
  }

  getUser() {
    return this.angularFireAuth.authState;
  }

  gitHubLogin() {
    // const p2 = new this.angularFireAuth.auth.GithubAuthProvider();
    const provider = new firebase.auth.GithubAuthProvider();
    //firebase.auth().signInWithPopup(provider).then((result) => {
    this.angularFireAuth.auth.signInWithPopup(provider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      this.userSubject.next(user);
      console.log(user);
      // ...
    }).catch((error: any) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });
  }

}
