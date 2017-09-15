# Deployment Build Properties

Below is a list of the properties that can be used as part of the build process. These properties can be defined in gulp_builder/config.json or in the Jenkins Ant properties section:

## Build Settings

> **buildVersion** - the code version to use during deployment. Uses the Jenkins build date by default.

> **cartridgeSuffix** - the suffix to use on the cartridges when deploying for testing. This is mainly used on servers where this is no staging/development counterpart like lyons1 - lyons6.

> **overwriteRelease** - Deletes and re-uploads the release that is being built. Only applies if the buildVersion is set. ( **Required** )

> **cartridges** - Array of Arrays of cartridge names to be grouped into archives for upload (e.g. [["app_lyonscg","app_storefront_core"],["app_storefront_controllers"]]). Useful if the zipped codebase is nearing the 100mb WebDav upload limit.

## Two Factor Authentication Settings

> **twoFactor** - whether or not two factor authentication should be used. Possible options are: 'true' or 'false' (without quotes). ( **Required** )

> **twoFactorp12** - path to the file that contains the key used for authentication.

> **twoFactorPassword** - password to use with the key file.

## Demandware Settings

> **instanceRoot** - root portion of the URL for the Demandware instance (e.g. .evaluation.dw.demandware.net). ( **Required** )

> **instances** - comma separated list of instances to upload the code to (e.g. lyons5,lyons6). ( **Required** )

> **activationInstances** - comma separated list of instances to activate the code on (e.g. lyons5,lyon6). ( **Required** )

> **user** - username used to log into the Demandware instances. ( **Required** )

> **password** - password used to log into the Demandware instances. ( **Required** )
