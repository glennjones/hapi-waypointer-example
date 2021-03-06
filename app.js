const Fs = require("fs");
const Path = require("path");
const Wreck = require("@hapi/wreck");
const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
const Blipp = require("blipp");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const HapiWaypointer = require("hapi-waypointer");
const AuthBearer = require('hapi-auth-bearer-token');

const Routes = require("./lib/routes-new.js");
const Pack = require("./package");

const goodOptions = {
  reporters: [
    {
      reporter: require("@hapi/good-console"),
      events: { log: "*", response: "*" }
    }
  ]
};

let swaggerOptions = {
  basePath: "/v1",
  pathPrefixSize: 2,
  info: {
    title: "Test Documentation",
    description: "This is a sample example of `API` documentation.",
    version: Pack.version,
    termsOfService: "https://github.com/glennjones/waypointer/",
    contact: {
      email: "glennjonesnet@gmail.com"
    },
    license: {
      name: "MIT",
      url:
        "https://raw.githubusercontent.com/glennjones/waypointer/master/license.txt"
    }
  },
  tags: [
    {
      name: "Sum",
      description:
        "An API for working with maths. Provides add, divide, mulitple and subtract endpoints which calulate your sums.",
      externalDocs: {
        description: "Find out more",
        url: "http://example.org"
      }
    },
    {
      name: "Store",
      description:
        "An API for storing sum data. You can list, add, delete, get and update the sums in the store. It has 3 ways of adding a new sum.",
      externalDocs: {
        description: "Find out more",
        url: "http://example.org"
      }
    }
  ]
};

// defaults settings
// 'swagger': JSON.parse(Fs.readFileSync(Path.join(__dirname, '../bin/petstore.json'))),
let waypointerOptions = {
  themes: [
    {
      theme: require("waypointer-plain"),
      options: { path: "/plain" }
    },
    {
      theme: require("waypointer-hub"),
      options: { path: "/hub" }
    },
    {
      theme: require("waypointer-form"),
      options: { path: "/form" }
    }
  ],
  text: [
    {
      group: "Sum",
      place: "before",
      text: [
        {
          name: "Introduction",
          markdown: "Introduction",
          class: "group-section"
        }
      ]
    },
    {
      group: "Sum",
      place: "after",
      text: [
        {
          name: "Maths",
          markdown: " __Text to explain maths__",
          class: "group-footer"
        }
      ]
    },
    {
      path: "/sum/add/{a}/{b}",
      method: "put",
      place: "after",
      text: [
        {
          markdown: "__Notes:__ Some notes about this endpoint",
          class: "alert tip"
        }
      ]
    },
    {
      place: "before",
      text: [
        {
          name: "Introduction",
          markdown: Fs.readFileSync(
            Path.join(__dirname, "/markdown/intro.md"),
            "utf8"
          ),
          class: "introduction"
        },
        {
          name: "API key",
          markdown: Fs.readFileSync(
            Path.join(__dirname, "/markdown/keys.md"),
            "utf8"
          ),
          class: "api-key"
        }
      ]
    },
    {
      place: "after",
      text: [
        {
          name: "Usage policy",
          markdown: "Usage policy defines the uses you can put the data to.",
          class: "data-usage"
        }
      ]
    }
  ],
  snippets: {
    lanugages: [
      {
        lanugage: "javascript"
      },
      {
        lanugage: "node"
      },
      {
        lanugage: "shell",
        methodology: "curl"
      }
    ]
  }
};

const ser = async () => {
  const server = Hapi.Server({
    host: "localhost",
    port: 3015
  });

  await server.register(AuthBearer)

    server.auth.strategy('bearer', 'bearer-access-token', {
        allowQueryToken: true,              // optional, false by default
        validate: async (request, token, h) => {

            // here is where you validate your token
            // comparing with token from your database for example
            const isValid = token === '1234';

            const credentials = { token };
            const artifacts = { test: 'info' };

            return { isValid, credentials, artifacts };
        }
    });



  await server.register([
    Inert,
    Vision,
    Blipp,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    },
    {
      plugin: HapiWaypointer,
      options: waypointerOptions
    }
  ]);
  server.views({
    path: "public",
    engines: { html: require("handlebars") },
    isCached: false
  });

  server.route(Routes);

  await server.start();
  return server;
};

ser()
  .then(server => {
    console.log(`Server listening on ${server.info.uri}`);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

/*
const Fs = require("fs");
const Path = require("path");
const Wreck = require('@hapi/wreck');
const Blipp = require('blipp');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiWaypointer = require('hapi-waypointer');

const Routes = require('./lib/routes.js');
const Pack = require('./package');


let server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3015
});


const goodOptions = {
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
    }]
};


let swaggerOptions = {
    enableDocumentation: true,
    basePath: '/v1',
    pathPrefixSize: 2,
    info: {
        'title': 'Test Documentation',
        'description': 'This is a sample example of `API` documentation.',
        'version': Pack.version,
        'termsOfService': 'https://github.com/glennjones/waypointer/',
        'contact': {
            'email': 'glennjonesnet@gmail.com'
        },
        'license': {
            'name': 'MIT',
            'url': 'https://raw.githubusercontent.com/glennjones/waypointer/master/license.txt'
        }
    },
    tags: [{
        'name': 'Sum',
        'description': 'An API for working with maths. Provides add, divide, mulitple and subtract endpoints which calulate your sums.',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }, {
        'name': 'Store',
        'description': 'An API for storing sum data. You can list, add, delete, get and update the sums in the store. It has 3 ways of adding a new sum.',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }],
    jsonEditor: true
};


// defaults settings
// 'swagger': JSON.parse(Fs.readFileSync(Path.join(__dirname, '../bin/petstore.json'))),
let waypointerOptions = {
    'themes': [{
        theme: require('waypointer-plain'),
        options: {'path': '/plain'}
    },{
        theme: require('waypointer-hub'),
        options: {'path': '/hub'}
    },{
        theme: require('waypointer-form'),
        options: {'path': '/form'}
    }],
    'text': [{
        group: 'Sum',
        place: 'before',
        text: [{
            name: 'Introduction',
            markdown: 'Introduction',
            class: 'group-section'
        }]
    },{
        group: 'Sum',
        place: 'after',
        text: [{
            name: 'Maths',
            markdown: ' __Text to explain maths__',
            class: 'group-footer'
        }]
    },{
        path: '/sum/add/{a}/{b}',
        method: 'put',
        place: 'after',
        text: [{
            markdown: '__Notes:__ Some notes about this endpoint',
            class: 'alert tip'
        }]
    },{
        place: 'before',
        text: [{
            name: 'Introduction',
            markdown: Fs.readFileSync(Path.join(__dirname, '/markdown/intro.md'), 'utf8'),
            class: 'introduction'
        },{
            name: 'API key',
            markdown: Fs.readFileSync(Path.join(__dirname, '/markdown/keys.md'), 'utf8'),
            class: 'api-key'
        }]
    },{
        place: 'after',
        text: [{
            name: 'Usage policy',
            markdown: 'Usage policy defines the uses you can put the data to.',
            class: 'data-usage'
        }]
    }],
    'snippets': {
        lanugages: [{
            'lanugage': 'javascript',
        },{
            'lanugage': 'node',
        }, {
            'lanugage': 'shell',
            'methodology': 'curl'
        }]
    }
};




server.register([
    Inert,
    Vision,
    Blipp,
    {
        register: require('good'),
        options: goodOptions
    },{
        register: HapiSwagger,
        options: swaggerOptions
    },{
        register: HapiWaypointer,
        options: waypointerOptions
    }], (err) => {

        server.route(Routes);

        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    });


// add templates only for testing custom.html
server.views({
    path: 'public',
    engines: { html: require('handlebars') },
    isCached: false
});
*/
