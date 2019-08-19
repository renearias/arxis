import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

export interface ArxisFirestoreAuthAbstractInterface<T> {
  authFillAction(user: firebase.User): Observable<T>;
}
