module.exports = function(config) {
  config.set({

    frameworks: ['mocha', 'chai'],

    files: [
      'app/main.js',
      'tests/*.js'
    ],

    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],


    preprocessors: {
      'app/main.js': ['coverage']
    },

    coverageReporter: {
      reporters: [{
        type : 'html',
        dir : 'coverage/',
        subdir: 'html'
      }]
    },

    autoWatch: true,

    singleRun: true,

    port: 5050,

    reporters: ['progress', 'coverage'],

    browsers: ['PhantomJS'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO
  });
};
