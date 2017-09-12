# Van11y dist files

Here are the files produced after Gulp tasks (from ```src``` folder to this one).

- ```van11y-accessible-modal-window-aria.es6.js``` is a copy of the ES6/ES2015 file in ```src``` folder.
- ```van11y-accessible-modal-window-aria.js``` is a transpiled version of the ES6/ES2015 file in ```src``` folder. Basically, the ES6/ES2015 version has been transformed to an ES5 compatible JS file, which is IE9+ compatible.
- ```van11y-accessible-modal-window-aria.min.js``` is a minified version of ```van11y-accessible-modal-window-aria.js``` (nothing changed in it, except minification of course).

## What should I use?

If you know Gulp, ES2015, NPM, etc. modify the file in ```src``` folder and run the build.

Else, go to ```dist``` folder: 

- in a near future, you will be able to use the ES6/ES2015 version. For the moment, do not use it, except if you know what you are doing.
- for the moment, you may use the transpiled version, minified or not, it will have the best compatibility (it is what I used in the demo and in production: https://van11y.net/downloads/modal/demo/index.html or demo in french  https://van11y.net/downloads/modal/demo/index-fr.html ).

Enjoy ;)

<img src="https://van11y.net/layout/images/logo-van11y.svg" alt="Van11y" width="300" />

