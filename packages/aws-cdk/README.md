# aws-cdk

Working with AWS CDK in Nx workspaces

Use version `>= 0.0.11` for nx workspace v13 or higher

## Install

`npm install --save-dev @myin/aws-cdk`

## Schematics

-   Application: contains multiple stacks
    -   `nx g @myin/aws-cdk:application <project-name>`
-   Lambda
    -   `nx g @myin/aws-cdk:lambda <project-name>`

## Builders

-   Deploy/Destroy:
    -   `nx deploy <project-name>` or `nx destroy <project-name>`
    -   Deploy/Destroy specific stack: `nx deploy <project-name> --args="--stack=<stack-name>"`
    -   WARNING: It will not ask for any confirmations. Use at your own risk.
    -   Only works on linux
-   Package: packages lambda application, ready for upload
    -   `nx package <project-name>`
    -   Compiles Typescript into `dist/` folder and installs node dependencies
