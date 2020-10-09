import { Observable } from 'rxjs';
import { User } from 'firebase/app';

export interface ArxisFirestoreAuthAbstractInterface<T> {
  authFillAction(user: User | null): Observable<T>;
}
