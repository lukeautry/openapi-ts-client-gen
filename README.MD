# Overview

Generate a TypeScript client from a swagger.json file

# Install

`[yarn add | npm install] openapi-ts-client-gen`

# Usage

## CLI

```
openapi-ts-client-gen

generate client

Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --namespace, -n  Module namespace                                   [required]
  --url, -u        URL of swagger.json file
  --file, -f       Path of swagger.json file
  --out, -o        Output path (e.g. ./out/swagger.json)              [required]
  --baseUrl, -b    Base URL of API
```

## Programmatic

```
import { generate } from "openapi-ts-client-gen";

generate({
    destPath: "./api.ts",
    namespace: "Api",
    srcPath: "./swagger.json",
    type: "file",
}).then(() => console.log("success!"))
```
