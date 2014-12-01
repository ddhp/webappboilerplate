'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var config = {
    app: require('./bower.json').appPath || 'app',
    dist: 'public'
  };

  grunt.initConfig({
    appConfig: config,

    compass: {
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'css',
          importPath: './bower_components',
          environment: 'production'
        }
      },
      dev: {
        options: {
          importPath: './bower_components',
          sassDir: '<%= appConfig.app %>/sass',
          cssDir: '<%= appConfig.app %>/css'
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      // bower: {
      //   files: ['bower.json'],
      //   tasks: ['wiredep']
      // },
      // js: {
      //   files: ['<%= appConfig.app %>/js/{,*/}*.js'],
      //   tasks: ['newer:jshint:all'],
      //   options: {
      //     livereload: '<%= connect.options.livereload %>'
      //   }
      // },
      // jsTest: {
      //   files: ['test/spec/{,*/}*.js'],
      //   tasks: ['newer:jshint:test', 'karma']
      // },
      compass: {
        files: ['<%= appConfig.app %>/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass:dev']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= appConfig.app %>/{,*/}*.html',
          'css/{,*/}*.css',
          '<%= appConfig.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              // connect.static('.tmp'),
            connect().use(
                '/bower_components',
                connect.static('./bower_components')
                ),
            connect.static(config.app)
              ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= appConfig.dist %>'
        }
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      options: {
        // cwd: '<%= appConfig.app %>',
        exclude: ['bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/']
      },
      app: {
        src: ['<%= appConfig.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'images/**',
            'fonts/*',
            'css/**'
          ]}, {
            expand: true,
            cwd: '.',
            src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
            dest: '<%= appConfig.dist %>'
          }, {
            expand: true,
            cwd: 'bower_components/fontawesome/fonts/',
            src: '**',
            dest: '<%= appConfig.dist %>/fonts'
          },
          {
            expand: true,
            cwd: '<%= appConfig.app %>',
            dest: '<%= appConfig.dist %>',
            src: ['server.js', 'lyric.json', 'audio/*']
          }]
      }
    },

    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= appConfig.app %>/index.html',
      options: {
        dest: '<%= appConfig.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // performs rewrites based on filerev and the useminprepare configuration
    usemin: {
      html: ['<%= appConfig.dist %>/{,*/}*.html'],
      css: ['<%= appConfig.dist %>/css/{,*/}*.css'],
      options: {
        assetsdirs: ['<%= appConfig.dist %>','<%= appConfig.dist %>/images']
      }
    }

  }) // end of initConfig

  grunt.registerTask('default', ['wiredep', 'compass', 'connect:livereload', 'watch']);
  grunt.registerTask('build', [
      'wiredep', 
      'compass', 
      'useminPrepare', 
      'copy',
      'concat:generated',
      'cssmin:generated',
      'uglify:generated', 
      'usemin'
      ]);
}
