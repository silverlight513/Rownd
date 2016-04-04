/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*\n' +
      ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.author ? " * By " + pkg.author + " " : " " %>' +
      '- Copyright (c) <%= grunt.template.today("yyyy") %> Jack Rimell;\n*/\n',

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      app: {
        src: [
          'node_modules/ractive/ractive.js',
          'app/main.js'
        ],
        dest: 'temp/rownd.js'
      }
    },

    exec: {
      cleanDist: {
        command: 'rm -r dist'
      },
      createDist: {
        command: 'mkdir dist'
      },
      browserify: {
        command: 'browserify -r es6-promise -s temp/rownd.js:Rownd > dist/rownd.js'
      },
      removeTemp: {
        command: 'rm -r temp'
      }
    },

    jshint: {
      options : {
        jshintrc : '.jshintrc'
      },
      beforeconcat: [
        'app/**/*.js'
      ]
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      app: {
        files: {
          'dist/rownd.min.js' : 'dist/rownd.js'
        }
      }
    },

    watch: {
      app: {
        files: ['app/**/*.js'],
        tasks: ['jshint', 'concat:app', 'exec', 'uglify']
      }
    }

  });

  // Load all of Grunt's dependencies
  require('matchdep')
    .filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks);

  // For dev on local machine
  grunt.registerTask('dev', [
    'jshint',
    'concat',
    'exec',
    'uglify',
    'watch']
  );

  // For server
  grunt.registerTask('default', [
    'jshint',
    'concat',
    'exec',
    'uglify']
  );

};
