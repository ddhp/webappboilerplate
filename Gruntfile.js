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
          sassDir: '<%= appConfig.app %>/sass',
          cssDir: '<%= appConfig.dist %>/styles',
          importPath: './bower_components',
          environment: 'production'
        }
      },
      serve: {
        options: {
          importPath: './bower_components',
          sassDir: '<%= appConfig.app %>/sass',
          cssDir: '.tmp/styles'
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
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
        tasks: ['compass:serve']
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
          '.tmp/styles/{,*/}*.css',
          '<%= appConfig.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 7000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: false,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
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
          open: false,
          base: '<%= appConfig.dist %>',
          keepalive: true,
          livereload: false
        }
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      options: {
        // cwd: '<%= appConfig.app %>',
        // exclude: ['bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/']
      },
      app: {
        src: ['<%= appConfig.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    copy: {
      dist: {
        files: [
          {
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
            ]
          }, 
          {
            expand: true,
            flatten: true,
            cwd: '.',
            src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
            dest: '<%= appConfig.dist %>/styles/fonts/'
          }, 
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/fontawesome/fonts/',
            src: '**',
            dest: '<%= appConfig.dist %>/styles/fonts/'
          }
        ]
      },
      // copy font files to .tmp/styles/fonts/
      serve: {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
            dest: '.tmp/styles/fonts'
          }, 
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/fontawesome/fonts/',
            src: '**',
            dest: '.tmp/styles/fonts'
          }
        ]
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
      css: ['<%= appConfig.dist %>/styles/{,*/}*.css'],
      options: {
        assetsdirs: ['<%= appConfig.dist %>','<%= appConfig.dist %>/images']
      }
    },

    clean: {
      dist: {
        files: [{
        dot: true,
          src: [
          '.tmp',
          '<%= appConfig.dist %>/{,*/}*',
          '!<%= appConfig.dist %>/.git*'
          ]
        }]
      },
      serve: '.tmp'
    }

  }) // end of initConfig

  grunt.registerTask('serve', 'Start serve', function () {
    var isDist = grunt.option('dist');
    if (isDist) {
      return grunt.task.run(['build', 'connect:dist']);
    }
    grunt.task.run([
      'clean:serve',
      'wiredep', 
      'compass:serve', 
      'connect:livereload', 
      'copy:serve',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep', 
    'compass:dist', 
    'useminPrepare', 
    'copy:dist',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated', 
    'usemin'
  ]);
}
