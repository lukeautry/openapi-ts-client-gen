export interface Info {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: IContact;
    license?: ILicense;
  }
  
  export interface IContact {
    name?: string;
    email?: string;
    url?: string;
  }
  
  export interface ILicense {
    name: string;
    url?: string;
  }
  
  export interface IExternalDocs {
    url: string;
    description?: string;
  }
  
  export interface ITag {
    name: string;
    description?: string;
    externalDocs?: IExternalDocs;
  }
  
  export interface IExample { }
  
  export interface IHeader extends IBaseSchema {
    type: string;
  }
  
  export interface IBaseParameter {
    name: string;
    in: string;
    required?: boolean;
    description?: string;
  }
  
  export interface IBodyParameter extends IBaseParameter {
    schema?: ISchema;
  }
  
  export interface IQueryParameter extends IBaseParameter, IBaseSchema {
    type: string;
    allowEmptyValue?: boolean;
  }
  
  export interface IPathParameter extends IBaseParameter {
    type: string;
    required: boolean;
  }
  
  export interface IHeaderParameter extends IBaseParameter {
    type: string;
  }
  
  export interface IFormDataParameter extends IBaseParameter, IBaseSchema {
    type: string;
    collectionFormat?: string;
  }
  
  export type Parameter =
    IBodyParameter |
    IFormDataParameter |
    IQueryParameter |
    IPathParameter |
    IHeaderParameter;
  
  export interface IPath {
    $ref?: string;
    get?: IOperation;
    put?: IOperation;
    post?: IOperation;
    delete?: IOperation;
    options?: IOperation;
    head?: IOperation;
    patch?: IOperation;
    parameters?: [Parameter];
  }
  
  export interface IOperation {
    responses: { [responseName: string]: IResponse };
    summary?: string;
    description?: string;
    externalDocs?: IExternalDocs;
    operationId?: string;
    produces?: [string];
    consumes?: [string];
    parameters?: [Parameter];
    schemes?: [string];
    deprecated?: boolean;
    security?: [Secuirty];
    tags?: [string];
  }
  
  export interface IResponse {
    description: string;
    schema?: ISchema;
    headers?: { [headerName: string]: IHeader };
    examples?: { [exampleName: string]: IExample };
  }
  
  export interface IBaseSchema {
    format?: string;
    title?: string;
    description?: string;
    default?: string | boolean | number | Object;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    enum?: [string | boolean | number | Object];
    type?: string;
    items?: ISchema | [ISchema];
  }
  
  export interface ISchema extends IBaseSchema {
    $ref?: string;
    allOf?: [ISchema];
    additionalProperties?: boolean | ISchema;
    properties?: { [propertyName: string]: ISchema };
    discriminator?: string;
    readOnly?: boolean;
    xml?: IXML;
    externalDocs?: IExternalDocs;
    example?: { [exampleName: string]: IExample };
    required?: string[];
  }
  
  export interface IXML {
    type?: string;
    namespace?: string;
    prefix?: string;
    attribute?: string;
    wrapped?: boolean;
  }
  
  export interface IBaseSecurity {
    type: string;
    description?: string;
  }
  
  export interface IBasicAuthenticationSecurity extends IBaseSecurity { }
  
  export interface IApiKeySecurity extends IBaseSecurity {
    name: string;
    in: string;
  }
  
  export interface IBaseOAuthSecuirty extends IBaseSecurity {
    flow: string;
  }
  
  export interface IOAuth2ImplicitSecurity extends IBaseOAuthSecuirty {
    authorizationUrl: string;
  }
  
  export interface IOAuth2PasswordSecurity extends IBaseOAuthSecuirty {
    tokenUrl: string;
    scopes?: [IOAuthScope];
  }
  
  export interface IOAuth2ApplicationSecurity extends IBaseOAuthSecuirty {
    tokenUrl: string;
    scopes?: [IOAuthScope];
  }
  
  export interface IOAuth2AccessCodeSecurity extends IBaseOAuthSecuirty {
    tokenUrl: string;
    authorizationUrl: string;
    scopes?: [IOAuthScope];
  }
  
  export interface IOAuthScope {
    [scopeName: string]: string;
  }
  
  export type Secuirty =
    IBasicAuthenticationSecurity |
    IOAuth2AccessCodeSecurity |
    IOAuth2ApplicationSecurity |
    IOAuth2ImplicitSecurity |
    IOAuth2PasswordSecurity |
    IApiKeySecurity;
  
  export interface ISpec {
    swagger: string;
    info: Info;
    externalDocs?: IExternalDocs;
    host?: string;
    basePath?: string;
    schemes?: [string];
    consumes?: [string];
    produces?: [string];
    paths: { [pathName: string]: IPath };
    definitions?: { [definitionsName: string]: ISchema };
    parameters?: { [parameterName: string]: IBodyParameter | IQueryParameter };
    responses?: { [responseName: string]: IResponse };
    security?: [Secuirty];
    securityDefinitions?: { [securityDefinitionName: string]: Secuirty };
    tags?: [ITag];
  }