# Myin Tools

![npm (scoped)](https://img.shields.io/npm/v/@myin/aws-cdk?style=flat-square)

## Install

`npm install --save-dev @myin/aws-cdk`

## Schematics

-   [x] Application: contains multiple stacks
    -   `nx g @myin/aws-cdk:application <project-name>`
-   [x] Lambda
    -   `nx g @myin/aws-cdk:lambda <project-name>`

## Builders

-   [x] Deploy/Destroy:
    -   `nx deploy <project-name>` or `nx destroy <project-name>`
    -   Deploy/Destroy specific stack: `nx deploy <project-name> --args="--stack=<stack-name>"`
    -   WARNING: It will not ask for any confirmations. Use at your own risk.
    -   Only works on linux
-   [x] Package: packages lambda application, ready for upload
    -   `nx package <project-name>`
    -   Compiles Typescript into `dist/` folder and installs node dependencies
