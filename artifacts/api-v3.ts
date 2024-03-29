/* tslint:disable */
/* eslint-disable */
/**
 * This is generated by openapi-ts-client-gen - do not edit directly!
 */
import request from 'superagent';

export interface IRequestParams {
  method: string;
  url: string;
  queryParameters?: { [key: string]: string | boolean | number | Date | undefined };
  body?: Object;
}

export abstract class ApiService {
  protected executeRequest<T>(params: IRequestParams, requestModFn?: (req: request.SuperAgentRequest) => void) {
    return new Promise<T>((resolve, reject) => {
      let req = request(params.method, params.url)
        .set('Content-Type', 'application/json');

      if (requestModFn) {
        requestModFn(req);
      }

      const queryParameters = params.queryParameters;
      if (queryParameters) {
        Object.keys(queryParameters).forEach(key => {
          const value = queryParameters[key];
          if (Object.prototype.toString.call(value) === '[object Date]') {
            queryParameters[key] = (value as Date).toISOString();
          }
        });

        req = req.query(queryParameters);
      }
      if (params.body) { req.send(params.body); }

      req.end((error: any, response: any) => {
        if (error || !response.ok) {
          if (response && response.body) {
            const customError: any = new Error(response.body.message);
            customError.status = response.body.status;
            customError.type = response.body.type;
            reject(customError);
            return;
          }

          reject(error);
        } else {
          resolve(response.body);
        }
      });
    });
  }
}

export namespace TestClient {
  let baseApiUrl: string;
  let requestModFn: ((req: request.SuperAgentRequest) => void) | undefined;

  export const Initialize = (params: { host: string; protocol?: string; }) => {
    baseApiUrl = `${params.protocol || 'https'}://${params.host}`;
  };

  export const SetRequestModifier = (fn: (req: request.SuperAgentRequest) => void) => {
    requestModFn = fn;
  };



    export type MyStringEnum = 'one' | 'two';


    export type MyNumberEnum = 3 | 4;


    export interface INumberDictionary {
      [key: string]: number;
    }


    export interface IStringArrayDictionary {
      [key: string]: string[];
    }


    export interface IForm {
      'title': string;
      'description': string;
      'owner_id': number;
      'published': boolean;
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'stringEnum'?: MyStringEnum;
      'numberEnum'?: MyNumberEnum;
      'numDict'?: INumberDictionary;
      'strArrayDict'?: IStringArrayDictionary;
    }


    export interface IShortTextContainsRule {
      'error_message'?: string;
      'type': "text-contains";
      'value': string;
    }


    export interface IShortTextNotContainsRule {
      'error_message'?: string;
      'type': "text-not-contains";
      'value': string;
    }


    export interface IShortTextEmailRule {
      'error_message'?: string;
      'type': "is-email";
    }


    export interface IShortTextUrlRule {
      'error_message'?: string;
      'type': "is-url";
    }


    export interface IShortTextMinLengthRule {
      'error_message'?: string;
      'type': "min-length";
      'value': number;
    }


    export interface IShortTextMaxLengthRule {
      'error_message'?: string;
      'type': "max-length";
      'value': number;
    }


    export interface IShortTextRegexMatchRule {
      'error_message'?: string;
      'type': "regex-match";
      'value': string;
    }


    export type ShortTextValidationRule = IShortTextContainsRule | IShortTextNotContainsRule | IShortTextEmailRule | IShortTextUrlRule | IShortTextMinLengthRule | IShortTextMaxLengthRule | IShortTextRegexMatchRule;


    export interface IShortTextField {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'name': string;
      'description': string;
      'index': number;
      'form_id': number;
      'required': boolean;
      'validation'?: ShortTextValidationRule;
    }


    export interface ILongTextField {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'name': string;
      'description': string;
      'index': number;
      'form_id': number;
      'required': boolean;
    }


    export interface ITextEnumFieldOption {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'label': string;
      'index': number;
      'field_id': number;
    }


    export interface ITextEnumFieldGetResult {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'name': string;
      'description': string;
      'index': number;
      'form_id': number;
      'required': boolean;
      'options': ITextEnumFieldOption[];
    }


    export interface IDateField {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'name': string;
      'description': string;
      'index': number;
      'form_id': number;
      'required': boolean;
    }


    export interface IFormGetResult {
      'title': string;
      'description': string;
      'owner_id': number;
      'published': boolean;
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'shortTextFields': IShortTextField[];
      'longTextFields': ILongTextField[];
      'textEnumFields': ITextEnumFieldGetResult[];
      'dateFields': IDateField[];
    }


    export interface ICreateShortTextFieldRequest {
      'name': string;
      'description': string;
      'index': number;
      'required': boolean;
      'validation'?: ShortTextValidationRule;
    }


    export interface ICreateLongTextFieldRequest {
      'name': string;
      'description': string;
      'index': number;
      'required': boolean;
    }


    export interface ICreateTextEnumFieldOptionRequest {
      'label': string;
      'index': number;
    }


    export interface ICreateTextEnumFieldRequest {
      'name': string;
      'description': string;
      'index': number;
      'required': boolean;
      'options': ICreateTextEnumFieldOptionRequest[];
    }


    export interface ICreateDateFieldRequest {
      'name': string;
      'description': string;
      'index': number;
      'required': boolean;
    }


    export interface ICreateFormRequest {
      'title': string;
      'description': string;
      'published': boolean;
      'shortTextFields': ICreateShortTextFieldRequest[];
      'longTextFields': ICreateLongTextFieldRequest[];
      'textEnumFields': ICreateTextEnumFieldRequest[];
      'dateFields': ICreateDateFieldRequest[];
    }


    export interface IUpdateShortTextFieldRequest {
      'id': number;
      'name': string;
      'description': string;
      'index': number;
      'required': boolean;
      'validation'?: ShortTextValidationRule;
    }


    export interface IDeleteFieldRequest {
      'id': number;
    }


    export interface IShortTextFieldOperations {
      'create': ICreateShortTextFieldRequest[];
      'update': IUpdateShortTextFieldRequest[];
      'delete': IDeleteFieldRequest[];
    }


    export interface IUpdateLongTextFieldRequest {
      'id': number;
      'name': string;
      'description': string;
      'index': number;
      'required': boolean;
    }


    export interface ILongTextFieldOperations {
      'create': ICreateLongTextFieldRequest[];
      'update': IUpdateLongTextFieldRequest[];
      'delete': IDeleteFieldRequest[];
    }


    export interface IUpdateTextEnumFieldOptionRequest {
      'id': number;
      'label': string;
      'index': number;
    }


    export interface ITextEnumFieldOptionOperations {
      'create': ICreateTextEnumFieldOptionRequest[];
      'update': IUpdateTextEnumFieldOptionRequest[];
      'delete': IDeleteFieldRequest[];
    }


    export interface IUpdateTextEnumFieldRequest {
      'id': number;
      'name': string;
      'description': string;
      'index': number;
      'options': ITextEnumFieldOptionOperations;
      'required': boolean;
    }


    export interface ITextEnumFieldOperations {
      'create': ICreateTextEnumFieldRequest[];
      'update': IUpdateTextEnumFieldRequest[];
      'delete': IDeleteFieldRequest[];
    }


    export interface IUpdateDateFieldRequest {
      'id': number;
      'name': string;
      'description': string;
      'index': number;
      'required': boolean;
    }


    export interface IDateFieldOperations {
      'create': ICreateDateFieldRequest[];
      'update': IUpdateDateFieldRequest[];
      'delete': IDeleteFieldRequest[];
    }


    export interface IUpdateFormRequest {
      'id': number;
      'title': string;
      'description': string;
      'published': boolean;
      'shortTextFields': IShortTextFieldOperations;
      'longTextFields': ILongTextFieldOperations;
      'textEnumFields': ITextEnumFieldOperations;
      'dateFields': IDateFieldOperations;
    }


    export interface Form {
      /**
       * Unique Identifier
       */
      'id': number;
      /**
       * Date of creation
       */
      'date_created': Date;
      /**
       * Date of updated
       */
      'date_updated': Date;
      'title': string;
      'description': string;
      'owner_id': number;
      'published': boolean;
      'shortTextFields'?: ShortTextField[];
      'longTextFields'?: LongTextField[];
      'textEnumFields'?: TextEnumField[];
      'dateFields'?: DateField[];
      'permissions'?: FormPermission[];
      'submissions'?: Submission[];
      'owner'?: User;
    }


    export interface ShortTextFieldValue {
      /**
       * Unique Identifier
       */
      'id': number;
      /**
       * Date of creation
       */
      'date_created': Date;
      /**
       * Date of updated
       */
      'date_updated': Date;
      'submission'?: Submission;
      'submission_id': number;
      'field'?: ShortTextField;
      'field_id': number;
      'value': string;
    }


    export interface Submission {
      /**
       * Unique Identifier
       */
      'id': number;
      /**
       * Date of creation
       */
      'date_created': Date;
      /**
       * Date of updated
       */
      'date_updated': Date;
      'form'?: Form;
      'form_id': number;
      'shortTextFieldValues': ShortTextFieldValue[];
      'longTextFieldValues': LongTextFieldValue[];
      'textEnumFieldValues': TextEnumFieldValue[];
      'dateFieldValues': DateFieldValue[];
    }


    export interface LongTextFieldValue {
      /**
       * Unique Identifier
       */
      'id': number;
      /**
       * Date of creation
       */
      'date_created': Date;
      /**
       * Date of updated
       */
      'date_updated': Date;
      'submission'?: Submission;
      'submission_id': number;
      'field'?: LongTextField;
      'field_id': number;
      'value': string;
    }


    export interface LongTextField {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'name': string;
      'description': string;
      'index': number;
      'form_id': number;
      'form'?: Form;
      'required': boolean;
      'values'?: LongTextFieldValue[];
    }


    export interface TextEnumField {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'name': string;
      'description': string;
      'index': number;
      'form_id': number;
      'form'?: Form;
      'required': boolean;
      'options'?: TextEnumFieldOption[];
      'values'?: TextEnumFieldValue[];
    }


    export interface TextEnumFieldOption {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'label': string;
      'index': number;
      'field_id': number;
      'field'?: TextEnumField;
    }


    export interface TextEnumFieldValue {
      /**
       * Unique Identifier
       */
      'id': number;
      /**
       * Date of creation
       */
      'date_created': Date;
      /**
       * Date of updated
       */
      'date_updated': Date;
      'submission'?: Submission;
      'submission_id': number;
      'field'?: TextEnumField;
      'field_id': number;
      'value': string;
    }


    export interface DateFieldValue {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'submission_id': number;
      'field_id': number;
      'value': string;
      'submission'?: Submission;
      'field'?: DateField;
    }


    export interface DateField {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'name': string;
      'description': string;
      'index': number;
      'form_id': number;
      'form'?: Form;
      'required': boolean;
      'values'?: DateFieldValue[];
    }


    export interface ShortTextField {
      'id': number;
      'date_created': Date;
      'date_updated': Date;
      'name': string;
      'description': string;
      'index': number;
      'form_id': number;
      'form'?: Form;
      'required': boolean;
      'validation'?: ShortTextValidationRule;
      'values'?: ShortTextFieldValue[];
    }


    export type FormPermissionType = 'owner';


    export interface User {
      /**
       * Unique Identifier
       */
      'id': number;
      /**
       * Date of creation
       */
      'date_created': Date;
      /**
       * Date of updated
       */
      'date_updated': Date;
      'email': string;
      'first_name': string;
      'last_name': string;
      'forms'?: Form[];
    }


    export interface FormPermission {
      /**
       * Unique Identifier
       */
      'id': number;
      /**
       * Date of creation
       */
      'date_created': Date;
      /**
       * Date of updated
       */
      'date_updated': Date;
      'form_id': number;
      'user_id': number;
      'type': FormPermissionType;
      'form'?: Form;
      'user'?: User;
    }


    export interface IAccessToken {
      'value': string;
      'expires': Date;
      'user': User;
    }


    export interface IRegisterUserParams {
      'email': string;
      'password': string;
      'firstName': string;
      'lastName': string;
    }


    export interface ILoginRequest {
      'email': string;
      'password': string;
    }


    export interface IUser {
      'email': string;
      'first_name': string;
      'last_name': string;
      'id': number;
      'date_created': Date;
      'date_updated': Date;
    }


    export interface IUpdateUserParams {
      'firstName': string;
      'lastName': string;
    }


    export interface IChangePasswordParams {
      'oldPassword': string;
      'newPassword': string;
    }


    export interface IConsumeResetPasswordParams {
      'token': string;
      'password': string;
    }


    export interface IFormsGetParams {
      id: any;
    }

    export interface IFormsDeleteParams {
      id: any;
    }

    export interface IUsersResetPasswordParams {
      email: any;
    }
    export class FormsService extends ApiService {

      public async getList() {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/forms`
        };
        return this.executeRequest<IForm[]>(requestParams, requestModFn);
      }

      public async create(_params: ICreateFormRequest) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/forms`
        };

        requestParams.body = _params;
        return this.executeRequest<IFormGetResult>(requestParams, requestModFn);
      }

      public async update(_params: IUpdateFormRequest) {
        const requestParams: IRequestParams = {
          method: 'PUT',
          url: `${baseApiUrl}/forms`
        };

        requestParams.body = _params;
        return this.executeRequest<IFormGetResult>(requestParams, requestModFn);
      }

      public async get(_params: IFormsGetParams) {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/forms/${_params.id}`
        };
        return this.executeRequest<IFormGetResult>(requestParams, requestModFn);
      }

      public async delete(_params: IFormsDeleteParams) {
        const requestParams: IRequestParams = {
          method: 'DELETE',
          url: `${baseApiUrl}/forms/${_params.id}`
        };
        return this.executeRequest<void>(requestParams, requestModFn);
      }
    }
    export class UsersService extends ApiService {

      public async register(_params: IRegisterUserParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/users/register`
        };

        requestParams.body = _params;
        return this.executeRequest<IAccessToken>(requestParams, requestModFn);
      }

      public async login(_params: ILoginRequest) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/users/login`
        };

        requestParams.body = _params;
        return this.executeRequest<IAccessToken>(requestParams, requestModFn);
      }

      public async current() {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/users`
        };
        return this.executeRequest<IUser>(requestParams, requestModFn);
      }

      public async update(_params: IUpdateUserParams) {
        const requestParams: IRequestParams = {
          method: 'PUT',
          url: `${baseApiUrl}/users`
        };

        requestParams.body = _params;
        return this.executeRequest<User>(requestParams, requestModFn);
      }

      public async changePassword(_params: IChangePasswordParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/users/change_password`
        };

        requestParams.body = _params;
        return this.executeRequest<void>(requestParams, requestModFn);
      }

      public async resetPassword(_params: IUsersResetPasswordParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/users/reset_password`
        };

        requestParams.queryParameters = {
          email: _params.email,
        };
        return this.executeRequest<void>(requestParams, requestModFn);
      }

      public async consumeResetPassword(_params: IConsumeResetPasswordParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/users/consume_reset_password`
        };

        requestParams.body = _params;
        return this.executeRequest<IAccessToken>(requestParams, requestModFn);
      }
    }
}
