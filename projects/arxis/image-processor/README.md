# ImageProcessor

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

## Code scaffolding

Run `ng generate component component-name --project image-processor` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project image-processor`.
> Note: Don't forget to add `--project image-processor` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build image-processor` to build the project. The build artifacts will be stored in the `dist/` directory.


## Example

`async processBackgroundImage(event) {
    const imageFile = await this.imageProcessor.readWebFile(event);
    this.updateBackgroundCard(imageFile.data, imageFile.extension, imageFile.type).catch(async e => {
     // do 
    });
  }`

## Publishing

After building your library with `ng build image-processor`, go to the dist folder `cd dist/image-processor` and run `npm publish`.

## Running unit tests

Run `ng test image-processor` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
