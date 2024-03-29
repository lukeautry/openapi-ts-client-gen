/* tslint:disable:no-console */
import * as handlebars from "handlebars";
import * as request from "superagent";
import * as Swagger from "./swagger";
import { fsReadFile, fsWriteFile } from "./fs";

interface ITemplateView {
  services: ITemplateService[];
  models: ITemplateModel[];
  baseUrl: string;
  apiPath: string;
}

interface ITemplateService {
  name: string;
  operations: ITemplateOperation[];
}

interface ITemplateModel {
  name: string;
  description?: string;
  unionOf: string;
  properties: Array<{
    propertyName: string;
    propertyType: string;
    description?: string;
  }>;
}

interface ITemplateOperation {
  id: string;
  method: string;
  signature: string;
  urlTemplate: string;
  returnType: string;
  paramsInterfaceName?: string;
  parameters?: ITemplateOperationParameters[];
  queryParameters?: string[];
  bodyParameter?: string;
  hasParameters: boolean;
  hasBodyParameter: boolean;
  description?: string;
}

interface ITemplateOperationParameters {
  parameterName: string;
  parameterType: string;
  description?: string;
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0 as any;

const template = (namespace: string) =>
  handlebars.compile(`/* tslint:disable */
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

export namespace ${namespace} {
  let baseApiUrl: string;
  let requestModFn: ((req: request.SuperAgentRequest) => void) | undefined;

  export const Initialize = (params: { host: string; protocol?: string; }) => {
    baseApiUrl = \`\${params.protocol || 'https'}://\${params.host}\`;
  };

  export const SetRequestModifier = (fn: (req: request.SuperAgentRequest) => void) => {
    requestModFn = fn;
  };

  {{#models}}

    {{#if description}}
    /**
     * {{description}}
     */
    {{/if}}

    {{#if unionOf}}
    export type {{name}} = {{{unionOf}}};
    {{else}}
    export interface {{name}} {
      {{#if indexSignature}}
      [key: string]: {{indexSignature}};
      {{/if}}
      {{#properties}}
      {{#if description}}
      /**
       * {{description}}
       */
      {{/if}}
      '{{propertyName}}'{{isRequiredChar}}: {{{propertyType}}};
      {{/properties}}
    }
    {{/if}}
    {{/models}}

    {{#services}}
    {{#operations}}
    {{#if hasParameters}}

    export interface {{paramsInterfaceName}} {
      {{#parameters}}
      {{#if description}}
      /**
       * {{description}}
       */
      {{/if}}
      {{parameterName}}: {{{parameterType}}};
      {{/parameters}}
    }
    {{/if}}
    {{/operations}}
    {{/services}}
    {{#services}}
    export class {{name}} extends ApiService {
      {{#operations}}

      {{#if description}}
      /**
       * {{description}}
       */
      {{/if}}
      public async {{id}}({{signature}}) {
        const requestParams: IRequestParams = {
          method: '{{method}}',
          url: \`\${baseApiUrl}{{../../apiPath}}{{urlTemplate}}\`
        };
        {{#if queryParameters}}

        requestParams.queryParameters = {
        {{#queryParameters}}
          {{this}}: _params.{{this}},
        {{/queryParameters}}
        };
        {{/if}}
        {{#if hasBodyParameter}}

        requestParams.body = _params{{bodyParameter}};
        {{/if}}
        return this.executeRequest<{{returnType}}>(requestParams, requestModFn);
      }
      {{/operations}}
    }
    {{/services}}
}
`);

const stringifyNumberEnum = (enumValue: Array<any>) =>
  enumValue.map((s) => `${s}`).join(" | ");
const getTypeFromRef = ($ref: string) => {
  return `${$ref
    .replace("#/definitions/", "")
    .replace("#/components/schemas/", "")}`;
};

const getPropertyTypeFromSwaggerProperty = (
  property: Swagger.ISchema
): string => {
  if (!property) {
    return "void";
  }

  if (property.type) {
    if (property.type === "integer" || property.format === "double") {
      if (property.format === "int64") {
        return "string";
      }
      if (property.enum) {
        return stringifyNumberEnum(property.enum);
      }

      return "number";
    }
    if (property.type === "boolean") {
      return "boolean";
    }
    if (property.type === "string") {
      if (property.enum) {
        return property.enum.map(v => `"${v}"`).join(' | ');
      }

      return property.format === "date-time" ? "Date" : "string";
    }

    if (property.type === "array") {
      const items = property.items as Swagger.ISchema;
      if (!items) {
        throw new Error();
      }

      if (items.type) {
        return `${getTypeFromRef(items.type)}[]`;
      }

      return `${getTypeFromRef(items.$ref as string)}[]`;
    }
  }

  if (property.$ref) {
    return getTypeFromRef(property.$ref);
  }

  return "any";
};

const getTypeScriptTypeFromSwaggerType = (schema: Swagger.ISchema) => {
  if (schema.type === "integer" || schema.type === "number") {
    if (schema.enum) {
      return stringifyNumberEnum(schema.enum);
    }

    return "number";
  }

  if (schema.type === "boolean") {
    return "boolean";
  }
  if (schema.type === "string") {
    return schema.format === "date-time" ? "Date" : "string";
  }

  return undefined;
};

const getPropertyTypeFromSwaggerParameter = (
  parameter: Swagger.IBaseParameter
): string => {
  const queryParameter = parameter as Swagger.IQueryParameter;
  if (queryParameter.type) {
    const tsType = getTypeScriptTypeFromSwaggerType(queryParameter as any);
    if (tsType) {
      return tsType;
    }
  }

  const bodyParameter = parameter as Swagger.IBodyParameter;
  const schema = bodyParameter.schema;
  if (schema) {
    if (schema.$ref) {
      return getTypeFromRef(schema.$ref);
    }

    if (schema.type === "array") {
      const items = schema.items as Swagger.ISchema;
      if (items.$ref) {
        return `${getTypeFromRef(items.$ref as string)}[]`;
      }
      if (items.type) {
        const tsType = getTypeScriptTypeFromSwaggerType(items);
        if (tsType) {
          return `${tsType}[]`;
        }
      }
    }
  }

  return "any";
};

const getNormalizedDefinitionKey = (key: string) => {
  if (key.includes("[]")) {
    return key;
  }

  return key.replace("[", "").replace("]", "");
};

const getTemplateView = (
  swagger: Swagger.ISpec,
  baseUrl: string
): ITemplateView => {
  const definitions = swagger.definitions || swagger.components?.schemas;
  if (!definitions) {
    throw new Error("No definitions.");
  }

  const paths = swagger.paths;
  if (!paths) {
    throw new Error("No paths.");
  }

  const serviceMap: { [serviceName: string]: ITemplateService } = {};
  Object.keys(paths).forEach((pathKey) => {
    const methods = [
      "get",
      "post",
      "delete",
      "patch",
      "put",
      "options",
      "head",
    ];
    const path = paths[pathKey];

    Object.keys(path)
      .filter((operationKey) => methods.find((m) => m === operationKey))
      .forEach((operationKey) => {
        const operation = (path as any)[operationKey] as Swagger.IOperation;
        if (!operation.operationId || !operation.tags) {
          throw new Error("no tags for " + JSON.stringify(path));
        }

        const tag = operation.tags[0];
        const service = (serviceMap[tag] = serviceMap[tag] || {
          name: `${tag}Service`,
          operations: [],
        });

        let operationId = operation.operationId.replace("_", "");
        if (tag && tag.toLowerCase() !== operationId.toLowerCase()) {
          operationId = operationId.replace(tag, "");
        }

        const parameters = operation.parameters;
        const operationParameters = new Array<ITemplateOperationParameters>();

        // /api/{someParam}/{anotherParam} => /api/${someParam}/${anotherParam}
        let urlTemplate = `${pathKey}`.replace(/\{/g, "${");
        let signature = "";
        let paramsInterfaceName = "";
        let queryParameters: string[] | undefined = undefined;
        let bodyParameter: string | undefined;
        let hasBodyParameter = false;

        if (parameters && parameters.length) {
          paramsInterfaceName = `I${tag}${
            operationId.charAt(0).toUpperCase() + operationId.slice(1)
          }Params`;
          signature = `_params: ${paramsInterfaceName}`;
          parameters.forEach((parameter) => {
            const parameterName = parameter.name;

            operationParameters.push({
              parameterName: `${parameterName}${
                parameter.required === false ? "?" : ""
              }`,
              parameterType: getPropertyTypeFromSwaggerParameter(parameter),
              description: parameter.description,
            });

            if (parameter.in === "path") {
              urlTemplate = urlTemplate.replace(
                parameter.name,
                `_params.${parameterName}`
              );
              return;
            }

            if (parameter.in === "query") {
              queryParameters = queryParameters || new Array<string>();
              queryParameters.push(parameterName);
              return;
            }

            if (parameter.in === "body") {
              hasBodyParameter = true;
              bodyParameter = `.${parameterName}`;
            }
          });
        }

        if ((operation as any).requestBody) {
          paramsInterfaceName = getTypeFromRef((operation as any).requestBody.content['application/json'].schema.$ref);
          signature = `_params: ${paramsInterfaceName}`;
          hasBodyParameter = true;
          bodyParameter = '';
        }

        let returnType = "void";
        if (operation.responses["200"]) {
          returnType = getNormalizedDefinitionKey(
            getPropertyTypeFromSwaggerProperty(
              (operation.responses["200"].schema || (operation.responses["200"] as any).content['application/json'].schema) as Swagger.ISchema
            )
          );
        }

        service.operations.push({
          id: operationId.charAt(0).toLowerCase() + operationId.slice(1),
          method: operationKey.toUpperCase(),
          signature,
          urlTemplate,
          parameters: operationParameters,
          hasParameters: !!operationParameters.length,
          bodyParameter,
          queryParameters,
          returnType,
          paramsInterfaceName,
          hasBodyParameter,
          description: operation.description,
        } as ITemplateOperation);
      });
  });

  return {
    baseUrl,
    apiPath: swagger.basePath as string,
    services: Object.keys(serviceMap).map((key) => serviceMap[key]),
    models: Object.keys(definitions).map((definitionKey) => {
      const definition = definitions[definitionKey];
      if (!definition) {
        throw new Error("No definition found.");
      }

      const properties = definition.properties || {};
      if (!properties) {
        throw new Error("No definition properties found.");
      }

      const unionOf = new Array<string>();
      if ((definition as any).anyOf) {
        (definition as any).anyOf.forEach((v: any) => {
          if ('$ref' in v) {
            unionOf.push(getTypeFromRef(v.$ref));
          }
        });
      }

      if (definition.enum) {
        unionOf.push(...definition.enum.map(v => definition.type === 'string' ? `'${v}'` : v.toString()));
      }

      let indexSignature: string | undefined;
      if (typeof definition.additionalProperties === 'object' && definition.type === 'object') {
        indexSignature = getPropertyTypeFromSwaggerProperty(definition.additionalProperties as any)
      }

      return {
        name: `${getNormalizedDefinitionKey(definitionKey)}`,
        description: definition.description,
        unionOf: unionOf.join(' | '),
        indexSignature,
        properties: Object.keys(properties).map((propertyKey) => {
          const property = properties[propertyKey];
          const isRequired =
            definition.required &&
            definition.required.find(
              (propertyName) => propertyName === propertyKey
            );

          return {
            isRequiredChar: isRequired ? "" : "?",
            propertyName: propertyKey,
            propertyType: getPropertyTypeFromSwaggerProperty(property),
            description: property.description,
          };
        }),
      };
    }),
  };
};

const specFetch = {
  url: async (url: string) => {
    return new Promise<Swagger.ISpec>((resolve, reject) => {
      request
        .get(url)
        .set("Accept", "application/json")
        .end((err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res.body);
        });
    });
  },
  file: async (path: string) => {
    const raw = await fsReadFile(path);
    return JSON.parse(raw.toString("utf8")) as Swagger.ISpec;
  },
};

export interface IGenerateParams {
  type: "url" | "file";
  srcPath: string;
  destPath: string;
  namespace: string;
  baseUrl?: string;
  spec?: Swagger.ISpec;
}

export const generate = async ({
  type,
  srcPath,
  destPath,
  baseUrl,
  namespace,
  spec,
}: IGenerateParams) => {
  if (!spec) {
    const fetcher = specFetch[type];
    if (!fetcher) {
      throw new Error(`unknown source type: ${type}`);
    }

    spec = await fetcher(srcPath);
  }

  try {
    let url = baseUrl || spec.host;
    if ((spec as any).servers && (spec as any).servers[0]) {
      if ((spec as any).servers[0].url) {
        url = (spec as any).servers[0].url;
      }
    }

    const compiled = template(namespace)(
      getTemplateView(spec, url || "")
    );
    await fsWriteFile(destPath, compiled);
  } catch (err) {
    console.log(err);
  }
};
