# NxPlug

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Install

`npm install --save-dev @ng-plug/aws-cdk`

## Schematics

-   [x] Application: contains multiple stacks
    -   `nx g @ng-plug/aws-cdk:application <project-name>`
-   [x] Lambda
    -   `nx g @ng-plug/aws-cdk:lambda <project-name>`
-   [ ] Stack: a cloudformation stack
    -   `nx g @ng-plug/aws-cdk:stack <stack-name>`

## Builders

-   [x] Deploy/Destroy:
    -   `nx deploy <project-name>` or `nx destroy <project-name>`
    -   Deploy/Destroy specific stack: `nx deploy <project-name> --args="--stack=<stack-name>"`
    -   WARNING: It will not ask for any confirmations. Use at your own risk.
    -   Only works on linux
-   [x] Package: packages lambda application, ready for upload
    -   `nx package <project-name>`
    -   Compiles Typescript into `dist/` folder and installs node dependencies
