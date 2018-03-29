import { Injectable } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';
import { TOKEN_NAME } from './auth.service';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

@Injectable()
export class AuthRequestOptions extends BaseRequestOptions {
  
  constructor() {
    super();
    console.log("authRequestoptions : checkTokenValid");
    const token = localStorage.getItem(TOKEN_NAME);
    if(token) {
      this.headers.append(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${token}`);
    }
  }


}
