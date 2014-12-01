# webappboilerplate

Boilerplate for web application

## Structure
```
app/ //src files
├ sass 
├ scripts
├ views
├ images
├ index.html // dev index
└
 
public/ //production files
├ styles
  ├ fonts
├ scripts
├ views
├ images
├ index.html // generated production index page

package.json
bower.json
Gruntfile.js
.gitignore
```
Default Deps
* jquery
* bootstrap
* fontawesome

## Setup App
* modify package.json and bower project name and version
* npm install --save-dev to get 3rd party dep
* bower install --save to get 3rd party frtend dep

## Tasks
* serve(dev) task:
Generated files will be put to `.tmp` folder
 1. clean:serve - clean .tmp folder
 2. wiredep - inject bower dep into index.html
 3. compass:serve - compile sass to .tmp/styles/, some parts need to be take care
    a) font path: remember to modify font-path variable: 
                  - $fa-font-path
                  - $icon-font-path
    
 4. connect:livereload - run a http web server, has 3 sub tasks
    a) livereload: enable livereload, also runs middleware to get dep from `app` folder
    b) test: runs a server for test cases
    c) dist: a server serves production files
    | * middleware is a array of functions, which will be iterately go through before every request
 5. copy:serve - copy all font files(bootstrap, fontawesome) to .tmp/styles/fonts
 6. watch - watch file change and do correspondant behavior

run `grunt serve --dist` to have a server serving app built in `public` folder

* build:
Remember to put optional search folder (.tmp) into <!-- build:js(.tmp) scripts/app.js --> <!-- build:css(.tmp) styles/main.css --> blocks
 1. clean:dist - clean production files
 2. wiredep
 3. compass:dist
 4. useminPrepare
 5. concat
 6. copy:dist
 7. uglify
 8. usemin
