# sails-hook-easy-graphql
An installable sails hook, meant to offer a graphql route, that manage all queries and mutation based on your model definitions
### Installation
Within the root dir of your sails project run
```sh
npm install sails-hook-easy-graphql
```
### Configuration
By default, configuration lives in `sails.config.graphql`.  The configuration key (`graphql`) can be changed by setting `sails.config.hooks['sails-hook-graphql'].configKey`.
### Usage
Run your sails app, and hit the configured `graphql route`, if not set it will defaults to `/graphql`.
