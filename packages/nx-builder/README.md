# nx-builder

Builders for Nx workspaces

## Install

`npm install --save-dev @myin/nx-builder`

## Builders

-   `@myin/nx-builder:npmPublish`: published npm package if version has changed
    -   Example (in workpsace.json)
    ```
    "builder": "@myin/nx-builder:npmPublish",
    "options": {
    	"target": "aws-cdk:build",
    	"directory": "dist/packages/aws-cdk"
    }
    ```
