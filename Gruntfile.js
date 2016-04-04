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
        dest: 'dist/rownd-es6.js'
      }
    },

    browserify: {
      dist: {
        src: 'dist/rownd-es6.js',
        dest: 'dist/rownd.js'
      },
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
        tasks: ['concat:app', 'jshint', 'browserify', 'uglify']
      }
    }

  });

  // Load all of Grunt's dependencies
  require('matchdep')
    .filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks);

  // For dev on local machine
  grunt.registerTask('dev', [
    'concat',
    'jshint',
    'browserify',
    'uglify',
    'watch']
  );

  // For server
  grunt.registerTask('default', [
    'concat',
    'jshint',
    'browserify',
    'uglify']
  );

};
