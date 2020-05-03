import { Injectable } from '@angular/core';
import { Contact, PhoneType} from './contact.model';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContactsService {
    private resourceUrl = environment.apiUrl + '/contacts';
    constructor(private http: HttpClient) {
    }

    getContacts() {
        return this.http.get<Contact[]>(this.resourceUrl);
    }

    getContactById(id) {
        return this.http.get<Contact>(`${this.resourceUrl}/${id}`);
    }

    public addContact(contact: Contact) {
        return this.http.post(this.resourceUrl, contact).pipe(
            mergeMap( (res: Contact) => this.updateContactImage(res, contact.pictureFile) )
        );
    }

    public updateContact(contact: Contact) {
        return this.http.patch(`${this.resourceUrl}/${contact.id}`, contact).pipe(
            mergeMap( (res: Contact) => this.updateContactImage(res, contact.pictureFile) ));
    }

    private updateContactImage(contact: Contact, file: File) {
        if (!file) {
            return of(contact);
        }
        const formData = new FormData();
        formData.append('picture', file, file.name);
        return this.http.patch(`${this.resourceUrl}/${contact.id}`, formData);
    }

    public removeContact(contact: Contact) {
        return this.http.delete(`${this.resourceUrl}/${contact.id}`);
    }

}
